import Charts
import SwiftUI

struct ZyplotMarksChart: View {
  let configuration: ZyplotConfiguration
  var reveal: ZyplotRevealState = .settled
  var onInteraction: ([String: Any?]) -> Void = { _ in }

  @State private var selectedCategory: String?

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

  var body: some View {
    Charts.Chart {
      marks
      ZyplotAnnotationMarks(
        annotations: configuration.annotations ?? [],
        isScrubbing: selectedCategory != nil,
        categorySpan: configuration.categorySpan,
        plotBackground: configuration.badgeBackground,
        fontFamily: configuration.fontFamily,
        strength: reveal.strokeOpacity,
        valueDomain: configuration.valueDomain
      )
    }
    .chartLegend(configuration.type == "sparkline" ? .hidden : .visible)
    .chartBackground { proxy in
      ZyplotLineCanvas(context: context, proxy: proxy)
    }
    .modifier(ZyplotChartAxisModifier(configuration: configuration))
    .modifier(
      ZyplotChartPresentationModifier(
        configuration: configuration,
        reveal: reveal
      )
    )
    .modifier(
      ZyplotChartInteractionModifier(
        configuration: configuration,
        selectedCategory: $selectedCategory,
        onInteraction: onInteraction
      )
    )
    .chartOverlay { proxy in
      ZyplotHighlightCanvas(context: context, proxy: proxy)
    }
    .padding(.vertical, 8)
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
