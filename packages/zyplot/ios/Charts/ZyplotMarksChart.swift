import Charts
import SwiftUI

struct ZyplotMarksChart: View {
  let configuration: ZyplotConfiguration
  var reveal: ZyplotRevealState = .settled
  var onInteraction: ([String: Any?]) -> Void = { _ in }

  @State private var selectedCategory: String?
  /// The span under two fingers, which is a reading of its own: never set beside a category.
  @State private var readRange: ZyplotReadRange?
  /// Measured off the laid-out plot, because a mark cannot ask how wide its own band is.
  @State private var bandWidth: CGFloat = 0
  /// The reading the lighting belongs to, kept after the touch has gone: it leaves with the step back.
  @State private var litCategory: String?
  @State private var litRange: ZyplotReadRange?

  /// What the trace is stepping back towards, so the ramp has something to interpolate between.
  private var dimTarget: Double {
    if readRange != nil {
      return configuration.interaction?.rangeStyle?.dimOpacity ?? 1
    }
    guard selectedCategory != nil, let dim = configuration.interaction?.dimOpacity else { return 1 }
    return dim
  }

  private var dimSeconds: Double { configuration.interaction?.dimSeconds ?? 0 }

  private var context: ZyplotMarkContext {
    ZyplotMarkContext(
      configuration: configuration,
      reveal: reveal,
      selection: selectedCategory
    )
  }

  private var markContext: ZyplotMarkContext {
    ZyplotMarkContext(configuration: configuration, reveal: reveal, selection: nil)
  }

  /**
   Whether this form has a trace at all. The canvases stroke a path through the readings, which
   is the chart itself for a line and a stray line across the tops for anything drawn as bars or
   as points.
   */
  private var drawsCurve: Bool {
    ["area", "line", "sparkline", "time-series"].contains(configuration.type)
  }

  /**
   The air above the highest reading and below the lowest, held around the chart so Swift Charts
   still lays the axes out against the plot's own edges. The y axis names them the way the x axis
   names the room at the sides, and what it names replaces the reserve rather than adding to it.
   */
  private var headroom: CGFloat {
    guard let padding = configuration.yAxis?.plotDimensionEndPadding else {
      return ZyplotChartPresentationModifier.reserve
    }
    return CGFloat(padding)
  }

  private var floor: CGFloat {
    guard let padding = configuration.yAxis?.plotDimensionStartPadding else {
      return ZyplotChartPresentationModifier.reserve
    }
    return CGFloat(padding)
  }

  private func measuredBand(_ proxy: ChartProxy, _ geometry: GeometryProxy) -> CGFloat {
    let count = configuration.resolvedCategories.count
    guard count > 0, let frame = proxy.plotFrame.map({ geometry[$0] }) else { return 0 }
    return frame.width / CGFloat(count)
  }

  /**
   The ramp wraps the whole chart, the way the reveal and the morph wrap theirs, rather than sitting
   in the `chartBackground` beside the canvas it feeds: a ramp is driven by state that has to outlive
   every layout of the plot.
   */
  var body: some View {
    ZyplotDimRamp(target: dimTarget, seconds: dimSeconds) { dimming in
      chart(dimmedBy: dimming)
    }
    // One of the two at a time, the way the readings themselves are: a second finger landing hands
    // the plot to the span, so nothing of the reading it displaced is left lit under it.
    .onChange(of: selectedCategory) { _, category in
      if category != nil {
        litCategory = category
        litRange = nil
      }
    }
    .onChange(of: readRange) { _, range in
      if range != nil {
        litRange = range
        litCategory = nil
      }
    }
  }

  /**
   The span the spotlight belongs to, which outlives the fingers by however long the step back takes
   to come back up — dropped with the touch instead, the stretch that was never dimmed would go out
   before the rest of the trace came up and the plot would flash.
   */
  private func heldRange(_ dimming: Double) -> ClosedRange<Int>? {
    guard let held = readRange ?? (dimming < 1 ? litRange : nil),
          held.startIndex <= held.endIndex
    else {
      return nil
    }
    return held.startIndex...held.endIndex
  }

  /// The context the trace is drawn from: the step back it is under, and the span it is under it for.
  private func readingContext(_ dimming: Double) -> ZyplotMarkContext {
    var reading = context.dimmed(dimming)
    reading.range = heldRange(dimming)
    return reading
  }

  /**
   What the lit stroke is drawn from: the live reading while a finger is down, and the one it left
   behind while the step back is coming back up. Dropped with the touch instead, the length of trace
   that was never dimmed would come up with the rest of it and the whole chart would flash.
   */
  private func litContext(_ dimming: Double) -> ZyplotMarkContext {
    var lit = context.dimmed(dimming)
    lit.selection = selectedCategory ?? (dimming < 1 ? litCategory : nil)
    return lit
  }

  private func chart(dimmedBy dimming: Double) -> some View {
    Charts.Chart {
      marks
      ZyplotAnnotationMarks(
        annotations: configuration.annotations ?? [],
        isScrubbing: selectedCategory != nil,
        categorySpan: configuration.categorySpan,
        plotBackground: configuration.badgeBackground,
        fontFamily: configuration.fontFamily,
        strength: reveal.strokeOpacity,
        valueDomain: configuration.valueDomain,
        bandWidth: bandWidth
      )
    }
    .chartLegend(configuration.type == "sparkline" ? .hidden : .visible)
    .chartBackground { proxy in
      if drawsCurve {
        // A canvas clips to its own bounds, and a plot given a negative inset runs past them.
        ZyplotLineCanvas(context: readingContext(dimming), proxy: proxy)
          .padding(-ZyplotChartPresentationModifier.reserve)
      }
    }
    .modifier(ZyplotChartAxisModifier(configuration: configuration, bandWidth: bandWidth))
    .modifier(
      ZyplotChartPresentationModifier(
        configuration: configuration,
        reveal: reveal
      )
    )
    // Before the interaction layer, so the dots on the ends of a span sit over the stretch the
    // way the dot under one finger sits over the trace.
    .chartOverlay { proxy in
      if drawsCurve {
        ZyplotRangeCanvas(context: readingContext(dimming), proxy: proxy)
          .padding(-ZyplotChartPresentationModifier.reserve)
      }
    }
    .modifier(
      ZyplotChartInteractionModifier(
        configuration: configuration,
        selectedCategory: $selectedCategory,
        readRange: $readRange,
        onInteraction: onInteraction
      )
    )
    .chartOverlay { proxy in
      if drawsCurve {
        ZyplotHighlightCanvas(context: litContext(dimming), proxy: proxy)
          .padding(-ZyplotChartPresentationModifier.reserve)
      }
    }
    .chartOverlay { proxy in
      GeometryReader { geometry in
        Color.clear.onChange(of: measuredBand(proxy, geometry), initial: true) { _, width in
          bandWidth = width
        }
      }
    }
    .padding(.top, headroom)
    .padding(.bottom, floor)
    .accessibilityLabel(configuration.accessibilityLabel ?? "Chart")
  }

  @ChartContentBuilder
  private var marks: some ChartContent {
    switch configuration.type {
    case "line", "area":
      ZyplotCartesianMarks(context: markContext)
    case "bar", "stacked-bar":
      ZyplotBarMarks(context: context)
    case "pie":
      ZyplotPieMarks(context: context)
    case "histogram":
      ZyplotHistogramMarks(context: context)
    case "boxplot":
      ZyplotBoxplotMarks(context: context)
    case "diverging-bar":
      ZyplotDivergingBarMarks(context: context)
    case "dumbbell":
      ZyplotDumbbellMarks(context: context)
    case "heatmap":
      ZyplotHeatmapMarks(context: context)
    case "scatter":
      ZyplotScatterMarks(context: context)
    case "time-series":
      ZyplotTimeSeriesMarks(context: context)
    case "sparkline":
      ZyplotSparklineMarks(context: context)
    case "rule":
      ZyplotRuleMarks(context: context)
    case "range":
      ZyplotRangeMarks(context: context)
    case "candlestick":
      ZyplotCandlestickMarks(context: context)
    default:
      EmptyChartContent()
    }
  }
}
