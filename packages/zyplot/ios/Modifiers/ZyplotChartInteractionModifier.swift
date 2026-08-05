import Charts
import SwiftUI

/// The span two fingers are on, in data order rather than in the order they landed.
struct ZyplotReadRange: Equatable {
  let endIndex: Int
  let startIndex: Int
}

struct ZyplotChartInteractionModifier: ViewModifier {
  let configuration: ZyplotConfiguration
  @Binding var selectedCategory: String?
  /// Held by the chart rather than here, because the step back and the lit stretch read it too.
  @Binding var readRange: ZyplotReadRange?
  let onInteraction: ([String: Any?]) -> Void

  @State private var isScrubbing = false
  @State private var haptics = ZyplotHaptics()

  func body(content: Content) -> some View {
    content
      .chartOverlay { proxy in
        GeometryReader { geometry in
          let frame = proxy.plotFrame.map { geometry[$0] }
          ZStack(alignment: .topLeading) {
            if let readRange, let frame {
              rangeReading(readRange, proxy: proxy, in: frame)
            } else if let category = selectedCategory,
                      let x = proxy.position(forX: category),
                      let frame
            {
              if configuration.interaction?.drawsVerticalCrosshair == true {
                ZyplotCrosshair(
                  style: configuration.interaction?.crosshairStyle,
                  height: frame.height,
                  label: configuration.interaction?.crosshairStyle?
                    .label(at: configuration.resolvedCategories.firstIndex(of: category)),
                  labelColor: configuration.theme?.colors?.label.map(Color.init(hex:)),
                  x: frame.minX + x,
                  viewWidth: geometry.size.width
                )
                .offset(x: frame.minX + x, y: frame.minY)
              }

              if let marker = configuration.interaction?.marker,
                 let value = configuration.value(at: category),
                 let y = proxy.position(forY: value)
              {
                ZyplotSelectionMarkerView(marker: marker, base: markerBase(marker))
                  .position(x: frame.minX + x, y: frame.minY + y)
              }

              if configuration.interaction?.tooltip != false {
                ZyplotTooltipContent(configuration: configuration, category: category)
                  .frame(
                    height: frame.height,
                    alignment: isTable(category) ? .center : .top
                  )
                  .offset(x: tooltipX(for: category, at: x, in: frame), y: frame.minY)
              }
            }

            touchLayer(proxy: proxy, plotFrame: frame)
          }
          .preference(
            key: ZyplotGeometryKey.self,
            value: snapshot(proxy: proxy, plotFrame: frame)
          )
          .preference(
            key: ZyplotSlotLayoutKey.self,
            value: slotLayout(proxy: proxy, plotFrame: frame)
          )
        }
      }
      .onPreferenceChange(ZyplotGeometryKey.self) { snapshot in
        guard let snapshot else { return }
        onInteraction(snapshot.payload)
      }
  }

  /**
   Where the app's own nodes belong. The reading is reported as the bare crosshair position
   rather than as a placed corner, because what it has to be clamped against is the size of a
   node this side never measures — the view that mounted it does.
   */
  private func slotLayout(proxy: ChartProxy, plotFrame: CGRect?) -> ZyplotSlotLayout? {
    guard let plotFrame, plotFrame.width > 0, plotFrame.height > 0 else { return nil }
    var annotations: [String: ZyplotSlotSpot] = [:]
    for annotation in configuration.annotations ?? [] {
      guard let position = position(of: annotation, proxy: proxy, in: plotFrame) else { continue }
      let run: ZyplotSlotSpot.Run = if annotation.type != "line" {
        .point
      } else if annotation.axis == "y" {
        .across
      } else {
        .down
      }
      annotations[ZyplotSlotLayout.annotationSlot(annotation.id)] = ZyplotSlotSpot(at: position, run: run)
    }

    let reading: CGPoint? = if readRange == nil,
                               let category = selectedCategory,
                               let x = proxy.position(forX: category) {
      CGPoint(x: plotFrame.minX + x, y: plotFrame.minY)
    } else {
      nil
    }

    let categories = configuration.resolvedCategories
    let span: ZyplotSlotSpan? = if let readRange,
                                   let start = position(of: readRange.startIndex, proxy: proxy, in: plotFrame, categories: categories),
                                   let end = position(of: readRange.endIndex, proxy: proxy, in: plotFrame, categories: categories) {
      ZyplotSlotSpan(end: end, start: start)
    } else {
      nil
    }

    return ZyplotSlotLayout(annotations: annotations, plot: plotFrame, reading: reading, span: span)
  }

  /**
   Where the fingers are read from. A chart that reads spans takes every touch UIKit
   delivers; the rest keep the one-finger drag, so opting into a range is the only thing
   that changes how a chart is held.
   */
  @ViewBuilder
  private func touchLayer(proxy: ChartProxy, plotFrame: CGRect?) -> some View {
    if configuration.interaction?.readsRange == true {
      ZyplotTouchOverlay(
        onTouches: { locations in
          updateReading(at: locations, proxy: proxy, plotFrame: plotFrame)
        },
        onEnded: { endSelection() }
      )
    } else {
      Rectangle()
        .fill(.clear)
        .contentShape(Rectangle())
        .gesture(
          DragGesture(minimumDistance: 0)
            .onChanged { gesture in
              updateSelection(
                at: gesture.location,
                proxy: proxy,
                plotFrame: plotFrame
              )
            }
            .onEnded { _ in endSelection() }
        )
    }
  }

  /**
   Everything the two fingers themselves say: a rule at each end of the span, and a dot where each
   end meets the trace. Drawn from the touch rather than from anything handed back to the chart, so
   the ends keep up with the fingers however much of the plot is behind them.
   */
  @ViewBuilder
  private func rangeReading(
    _ range: ZyplotReadRange,
    proxy: ChartProxy,
    in frame: CGRect
  ) -> some View {
    rangeRules(range, proxy: proxy, in: frame)

    if let dot = rangeDot {
      let tint = rangeTint(range)
      let categories = configuration.resolvedCategories
      ForEach(Array([range.startIndex, range.endIndex].enumerated()), id: \.offset) { _, index in
        if let x = position(of: index, proxy: proxy, in: frame, categories: categories),
           let value = configuration.value(atIndex: index),
           let y = proxy.position(forY: value)
        {
          ZyplotSelectionMarkerView(marker: dot, base: tint)
            .position(x: x, y: frame.minY + y)
        }
      }
    }
  }

  /// The reading marker's own dot, put on both ends of a span whatever the marker's style lights.
  private var rangeDot: ZyplotSelectionMarker? {
    guard configuration.interaction?.rangeStyle?.drawsDot == true else { return nil }
    var dot = configuration.interaction?.marker ?? ZyplotSelectionMarker()
    dot.dot = true
    dot.style = "point"
    return dot
  }

  /**
   The crosshair, painted in the stretch's colour where the chart named one: the rules at the ends of
   a span are the ends of the span, and a reading in three colours reads as three things.
   */
  private func rangeRuleStyle(_ range: ZyplotReadRange) -> ZyplotCrosshairStyle? {
    let style = configuration.interaction?.crosshairStyle
    guard let hex = configuration.rangeTint(from: range.startIndex, to: range.endIndex) else {
      return style
    }
    var tinted = style ?? ZyplotCrosshairStyle()
    tinted.color = hex
    return tinted
  }

  /// The stretch's own colour, which is the span's direction rather than the whole period's.
  private func rangeTint(_ range: ZyplotReadRange) -> Color {
    guard let hex = configuration.rangeTint(from: range.startIndex, to: range.endIndex) else {
      return configuration.resolvedSeries.first?.color.map(Color.init(hex:))
        ?? configuration.palette[0]
    }
    return Color(hex: hex)
  }

  /// A rule at each end of the span, drawn where the span ends rather than where its last
  /// mark sits, so the outermost bars read as inside it.
  @ViewBuilder
  private func rangeRules(
    _ range: ZyplotReadRange,
    proxy: ChartProxy,
    in frame: CGRect
  ) -> some View {
    let categories = configuration.resolvedCategories
    let step = categoryStep(proxy: proxy, in: frame, categories: categories)
    let edges = rangeEdges(range, proxy: proxy, in: frame, categories: categories, step: step)
    ForEach(Array(edges.enumerated()), id: \.offset) { _, edge in
      ZyplotCrosshair(
        style: rangeRuleStyle(range),
        height: frame.height,
        x: edge,
        viewWidth: frame.width
      )
      .offset(x: edge, y: frame.minY)
    }
  }

  private func rangeEdges(
    _ range: ZyplotReadRange,
    proxy: ChartProxy,
    in frame: CGRect,
    categories: [String],
    step: Double
  ) -> [Double] {
    guard let start = position(of: range.startIndex, proxy: proxy, in: frame, categories: categories),
          let end = position(of: range.endIndex, proxy: proxy, in: frame, categories: categories)
    else {
      return []
    }
    return [
      max(frame.minX, start - step / 2),
      min(frame.maxX, end + step / 2),
    ]
  }

  /// The distance between two neighbouring marks, which is what a category's own width is on
  /// a band scale. Measured rather than assumed, because the axis may hold padding of its own.
  private func categoryStep(proxy: ChartProxy, in frame: CGRect, categories: [String]) -> Double {
    if categories.count > 1,
       let first = proxy.position(forX: categories[0]),
       let second = proxy.position(forX: categories[1])
    {
      return abs(second - first)
    }
    return categories.isEmpty ? 0 : frame.width / Double(categories.count)
  }

  private func position(
    of index: Int,
    proxy: ChartProxy,
    in frame: CGRect,
    categories: [String]
  ) -> Double? {
    guard let category = categories[safe: index],
          let x = proxy.position(forX: category)
    else {
      return nil
    }
    return frame.minX + x
  }

  private func markerBase(_ marker: ZyplotSelectionMarker) -> Color {
    marker.color.map(Color.init(hex:))
      ?? configuration.resolvedSeries.first?.color.map(Color.init(hex:))
      ?? configuration.palette[0]
  }

  private func isTable(_ category: String) -> Bool {
    configuration.candlestickRows(at: category) != nil
  }

  private func tooltipX(
    for category: String,
    at x: Double,
    in frame: CGRect
  ) -> Double {
    let table = isTable(category)
    let width: Double = table ? 190 : 100
    let preferred = table ? frame.minX + x + 14 : frame.minX + x - 44
    return min(max(frame.minX, preferred), frame.maxX - width)
  }

  /// One finger reads a mark, two read the span between them, and the count can change
  /// without the touch ever lifting.
  private func updateReading(
    at locations: [CGPoint],
    proxy: ChartProxy,
    plotFrame: CGRect?
  ) {
    guard locations.count > 1 else {
      guard let single = locations.first else { return }
      if readRange != nil {
        readRange = nil
      }
      updateSelection(at: single, proxy: proxy, plotFrame: plotFrame)
      return
    }
    updateRange(at: locations, proxy: proxy, plotFrame: plotFrame)
  }

  private func updateSelection(
    at location: CGPoint,
    proxy: ChartProxy,
    plotFrame: CGRect?
  ) {
    guard configuration.interaction?.isEnabled == true,
          let plotFrame,
          plotFrame.contains(location)
    else {
      return
    }
    let plotX = location.x - plotFrame.minX
    guard let touched: String = proxy.value(atX: plotX) else { return }
    let categories = configuration.resolvedCategories
    guard let index = configuration.clampedIndex(of: touched, in: categories),
          let category = categories[safe: index]
    else {
      return
    }
    // Only when it changes: the reading is state the whole chart hangs off, and a finger reports
    // many times a mark. What the reading is worth saying every time is what goes out below.
    let hasMoved = selectedCategory != category
    if hasMoved {
      selectedCategory = category
    }
    if hasMoved, configuration.interaction?.haptics == true {
      haptics.tick()
    }

    // What is being read, never where. Where it is goes to the views the chart mounted for it,
    // through a channel that never leaves the process — see `ZyplotSlotLayoutKey`.
    onInteraction([
      "category": category,
      "index": index,
      "phase": isScrubbing ? "changed" : "began",
      "seriesId": configuration.resolvedSeries.first?.id,
      "value": reportedValue(at: index, category: category),
    ])
    isScrubbing = true
  }

  private func updateRange(
    at locations: [CGPoint],
    proxy: ChartProxy,
    plotFrame: CGRect?
  ) {
    guard configuration.interaction?.isEnabled == true, let plotFrame else { return }
    let categories = configuration.resolvedCategories
    let touched = locations.compactMap {
      index(at: $0, proxy: proxy, in: plotFrame, categories: categories)
    }
    guard let low = touched.min(), let high = touched.max() else { return }
    let next = ZyplotReadRange(endIndex: high, startIndex: low)
    let hasMoved = readRange != next
    if hasMoved {
      readRange = next
    }
    if selectedCategory != nil {
      selectedCategory = nil
    }
    if hasMoved, configuration.interaction?.haptics == true {
      haptics.tick()
    }

    onInteraction([
      "phase": isScrubbing ? "changed" : "began",
      "range": rangePayload(next, categories: categories),
      "seriesId": configuration.resolvedSeries.first?.id,
    ])
    isScrubbing = true
  }

  /// A finger dragged past the plot keeps reading its nearest end, the way a span held
  /// against the edge of the screen is still the span the reader means.
  private func index(
    at location: CGPoint,
    proxy: ChartProxy,
    in plotFrame: CGRect,
    categories: [String]
  ) -> Int? {
    let held = min(max(location.x, plotFrame.minX), plotFrame.maxX - 0.5)
    guard let touched: String = proxy.value(atX: held - plotFrame.minX) else { return nil }
    return configuration.clampedIndex(of: touched, in: categories)
  }

  /// What the span is, not where it reaches: a view centred over it is one the chart places itself.
  private func rangePayload(_ range: ZyplotReadRange, categories: [String]) -> [String: Any?] {
    [
      "endCategory": categories[safe: range.endIndex],
      "endIndex": range.endIndex,
      "startCategory": categories[safe: range.startIndex],
      "startIndex": range.startIndex,
    ]
  }

  private func snapshot(proxy: ChartProxy, plotFrame: CGRect?) -> ZyplotGeometrySnapshot? {
    guard let plotFrame, plotFrame.width > 0, plotFrame.height > 0 else { return nil }
    let annotations: [ZyplotAnnotationPoint] = (configuration.annotations ?? [])
      .compactMap { annotation in
        guard let position = position(of: annotation, proxy: proxy, in: plotFrame) else {
          return nil
        }
        return ZyplotAnnotationPoint(id: annotation.id, x: position.x, y: position.y)
      }
    return ZyplotGeometrySnapshot(annotations: annotations, plot: plotFrame)
  }

  private func position(
    of annotation: ZyplotAnnotation,
    proxy: ChartProxy,
    in plotFrame: CGRect
  ) -> CGPoint? {
    if annotation.axis == "y" {
      guard case .number(let value) = annotation.value,
            let y = proxy.position(forY: value)
      else {
        return nil
      }
      return CGPoint(x: plotFrame.minX, y: plotFrame.minY + y)
    }
    let x: CGFloat? = switch annotation.value ?? annotation.x {
    case .text(let category): proxy.position(forX: category)
    case .number(let value): proxy.position(forX: value)
    case nil: nil
    }
    guard let x else { return nil }
    let y = annotation.y.flatMap { proxy.position(forY: $0) }
    return CGPoint(x: plotFrame.minX + x, y: plotFrame.minY + (y ?? 0))
  }

  private func reportedValue(at index: Int, category: String) -> Double? {
    if let value = configuration.value(atIndex: index) { return value }
    guard configuration.type == "boxplot" else { return nil }
    return configuration.groups?.first { $0.label == category }?.median
  }

  private func endSelection() {
    guard isScrubbing else { return }
    isScrubbing = false
    readRange = nil
    let category = selectedCategory
    if configuration.interaction?.selection == nil
      || configuration.interaction?.selection == "none"
    {
      selectedCategory = nil
    }
    onInteraction([
      "category": category,
      "index": category.flatMap(configuration.resolvedCategories.firstIndex(of:)),
      "phase": "ended",
    ])
  }
}
