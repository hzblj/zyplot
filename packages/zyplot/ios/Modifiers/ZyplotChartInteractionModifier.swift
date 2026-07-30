import Charts
import SwiftUI

struct ZyplotChartInteractionModifier: ViewModifier {
  let configuration: ZyplotConfiguration
  @Binding var selectedCategory: String?
  let onInteraction: ([String: Any?]) -> Void

  @State private var isScrubbing = false
  @State private var haptics = ZyplotHaptics()

  func body(content: Content) -> some View {
    content
      .chartOverlay { proxy in
        GeometryReader { geometry in
          let frame = proxy.plotFrame.map { geometry[$0] }
          ZStack(alignment: .topLeading) {
            if let category = selectedCategory,
               let x = proxy.position(forX: category),
               let frame
            {
              if configuration.interaction?.drawsVerticalCrosshair == true {
                ZyplotCrosshair(
                  style: configuration.interaction?.crosshairStyle,
                  height: frame.height,
                  label: configuration.interaction?.crosshairStyle?
                    .label(at: configuration.resolvedCategories.firstIndex(of: category)),
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

            Rectangle()
              .fill(.clear)
              .contentShape(Rectangle())
              .gesture(
                DragGesture(minimumDistance: 0)
                  .onChanged { gesture in
                    updateSelection(
                      at: gesture.location,
                      proxy: proxy,
                      plotFrame: frame
                    )
                  }
                  .onEnded { _ in endSelection() }
              )
          }
          .preference(
            key: ZyplotGeometryKey.self,
            value: snapshot(proxy: proxy, plotFrame: frame)
          )
        }
      }
      .onPreferenceChange(ZyplotGeometryKey.self) { snapshot in
        guard let snapshot else { return }
        onInteraction(snapshot.payload)
      }
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
    let hasMoved = selectedCategory != category
    selectedCategory = category
    if hasMoved, configuration.interaction?.haptics == true {
      haptics.tick()
    }

    onInteraction([
      "category": category,
      "index": index,
      "nativeX": location.x,
      "nativeY": location.y,
      "phase": isScrubbing ? "changed" : "began",
      "seriesId": configuration.resolvedSeries.first?.id,
      "value": reportedValue(at: index, category: category),
    ])
    isScrubbing = true
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
