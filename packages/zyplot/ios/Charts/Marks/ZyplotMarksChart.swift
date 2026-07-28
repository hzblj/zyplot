import Charts
import SwiftUI

struct ZyplotMarksChart: View {
  let configuration: ZyplotConfiguration
  var onInteraction: ([String: Any?]) -> Void = { _ in }

  private var palette: [Color] { configuration.palette }

  /// `catmullRom` rather than `cardinal`, so a smoothed line lands on the same
  /// curve the web and Android renderers draw for `isSmooth`.
  private var interpolation: InterpolationMethod {
    configuration.isSmooth == true ? .catmullRom : .linear
  }

  var body: some View {
    Charts.Chart {
      switch configuration.type {
      case "line", "area":
        cartesianSeriesMarks
      case "bar", "stacked-bar":
        barMarks
      case "pie":
        pieMarks
      case "histogram":
        histogramMarks
      case "boxplot":
        boxplotMarks
      case "diverging-bar":
        divergingBarMarks
      case "dumbbell":
        dumbbellMarks
      case "heatmap":
        heatmapMarks
      case "scatter":
        scatterMarks
      case "time-series":
        timeSeriesMarks
      case "sparkline":
        sparklineMarks
      case "rule":
        ruleMarks
      case "range":
        rangeMarks
      case "candlestick":
        candlestickMarks
      default:
        EmptyChartContent()
      }
      ZyplotAnnotationMarks(annotations: configuration.annotations ?? [])
    }
    .chartLegend(configuration.type == "sparkline" ? .hidden : .visible)
    .modifier(ZyplotChartAxisModifier(configuration: configuration))
    .modifier(ZyplotChartPresentationModifier(configuration: configuration))
    .modifier(
      ZyplotChartInteractionModifier(
        configuration: configuration,
        onInteraction: onInteraction
      )
    )
    .padding(.vertical, 8)
    .accessibilityLabel(configuration.accessibilityLabel ?? "Chart")
  }

  @ChartContentBuilder
  private var cartesianSeriesMarks: some ChartContent {
    ForEach(Array(configuration.resolvedSeries.enumerated()), id: \.element.id) {
      seriesIndex,
      series in
      ForEach(Array(configuration.resolvedCategories.enumerated()), id: \.offset) {
        categoryIndex,
        category in
        if let value = value(in: series, at: categoryIndex) {
          // `series:` is what tells Swift Charts these marks belong to distinct
          // lines. Without it every point across every series joins into one
          // path, and a second series shows up as a stray segment spanning the
          // plot rather than a line of its own.
          if configuration.type == "area" {
            AreaMark(
              x: .value("Category", category),
              y: .value(series.label, value),
              series: .value("Series", series.id),
              stacking: configuration.isStacked == true ? .standard : .unstacked
            )
            .foregroundStyle(
              seriesColor(series, index: seriesIndex)
                .opacity(
                  (configuration.seriesStyle(for: series.id)?.fillOpacity ?? 0.16)
                    * configuration.dimming(for: series.id)
                )
            )
            .interpolationMethod(interpolation)
          }
          LineMark(
            x: .value("Category", category),
            y: .value(series.label, value),
            series: .value("Series", series.id)
          )
          .foregroundStyle(seriesColor(series, index: seriesIndex))
          .lineStyle(seriesStrokeStyle(series.id, defaultWidth: 2.25))
          .interpolationMethod(interpolation)
          .opacity(
            (configuration.seriesStyle(for: series.id)?.opacity ?? 1)
              * configuration.dimming(for: series.id)
          )
        }
      }
    }
  }

  @ChartContentBuilder
  private var barMarks: some ChartContent {
    ForEach(Array(configuration.resolvedSeries.enumerated()), id: \.element.id) {
      seriesIndex,
      series in
      ForEach(Array(configuration.resolvedCategories.enumerated()), id: \.offset) {
        categoryIndex,
        category in
        if let value = value(in: series, at: categoryIndex) {
          if configuration.orientation == "horizontal" {
            BarMark(
              x: .value(series.label, value),
              y: .value("Category", category),
              stacking: configuration.type == "stacked-bar" ? .standard : .unstacked
            )
            .foregroundStyle(
              seriesColor(series, index: seriesIndex)
                .opacity(configuration.dimming(for: series.id))
            )
            .position(
              by: .value(
                "Series",
                configuration.type == "stacked-bar" ? "Stack" : series.label
              )
            )
          } else {
            BarMark(
              x: .value("Category", category),
              y: .value(series.label, value),
              stacking: configuration.type == "stacked-bar" ? .standard : .unstacked
            )
            .foregroundStyle(
              seriesColor(series, index: seriesIndex)
                .opacity(configuration.dimming(for: series.id))
            )
            .position(
              by: .value(
                "Series",
                configuration.type == "stacked-bar" ? "Stack" : series.label
              )
            )
          }
        }
      }
    }
  }

  @ChartContentBuilder
  private var pieMarks: some ChartContent {
    ForEach(Array(configuration.resolvedData.enumerated()), id: \.element.id) {
      index,
      item in
      SectorMark(
        angle: .value("Value", max(0, item.value)),
        innerRadius: .ratio(min(max(configuration.innerRadius ?? 0, 0), 0.85)),
        angularInset: 1.5
      )
      .cornerRadius(4)
      .foregroundStyle(itemColor(item, index: index))
    }
  }

  /// Each bar spans its bin, as a rectangle between the two edges, rather than
  /// sitting on a single `x`. A `BarMark` positioned at one continuous value has
  /// no category step to take a `.ratio` width from, so Swift Charts draws it
  /// with no width at all — axes scaled to the bins over an empty plot.
  /// Spanning the bin also makes the bars touch, which is what a histogram's
  /// continuous axis claims, and matches `barCategoryGap: 0` on the web.
  @ChartContentBuilder
  private var histogramMarks: some ChartContent {
    ForEach(configuration.histogramBins) { bin in
      RectangleMark(
        xStart: .value("Bin start", bin.lower),
        xEnd: .value("Bin end", bin.upper),
        yStart: .value("Count", 0.0),
        yEnd: .value("Count", Double(bin.count))
      )
      .foregroundStyle(palette[0])
    }
  }

  @ChartContentBuilder
  private var boxplotMarks: some ChartContent {
    ForEach(configuration.groups ?? []) { group in
      RectangleMark(
        x: .value("Group", group.label),
        yStart: .value("Q1", group.q1),
        yEnd: .value("Q3", group.q3),
        width: .ratio(0.5)
      )
      .foregroundStyle(palette[0].opacity(0.18))
      RuleMark(
        x: .value("Group", group.label),
        yStart: .value("Min", group.min),
        yEnd: .value("Max", group.max)
      )
      .foregroundStyle(palette[0])
      RuleMark(
        xStart: .value("Start", group.label),
        xEnd: .value("End", group.label),
        y: .value("Median", group.median)
      )
      .foregroundStyle(palette[0])
      ForEach(group.outliers ?? [], id: \.self) { outlier in
        PointMark(
          x: .value("Group", group.label),
          y: .value("Outlier", outlier)
        )
        .foregroundStyle(palette[0])
      }
    }
  }

  @ChartContentBuilder
  private var divergingBarMarks: some ChartContent {
    ForEach(configuration.resolvedData) { item in
      BarMark(
        x: .value("Value", item.value),
        y: .value("Category", item.label)
      )
      .foregroundStyle(
        item.value >= 0
          ? Color(hex: configuration.theme?.colors?.positive ?? "#16a34a")
          : Color(hex: configuration.theme?.colors?.negative ?? "#dc2626")
      )
    }
  }

  @ChartContentBuilder
  private var dumbbellMarks: some ChartContent {
    ForEach(configuration.rows ?? []) { row in
      RuleMark(
        xStart: .value("Before", row.before),
        xEnd: .value("After", row.after),
        y: .value("Category", row.label)
      )
      .foregroundStyle(Color.secondary.opacity(0.35))
      PointMark(x: .value("Before", row.before), y: .value("Category", row.label))
        .foregroundStyle(palette[0])
      PointMark(x: .value("After", row.after), y: .value("Category", row.label))
        .foregroundStyle(palette[min(1, palette.count - 1)])
    }
  }

  @ChartContentBuilder
  private var heatmapMarks: some ChartContent {
    ForEach(configuration.cells ?? []) { cell in
      if let value = cell.value,
         let column = configuration.columns?[safe: cell.columnIndex],
         let row = configuration.rowLabels?[safe: cell.rowIndex]
      {
        RectangleMark(
          x: .value("Column", column),
          y: .value("Row", row)
        )
        .foregroundStyle(palette[0].opacity(max(0.12, min(1, value / 100))))
      }
    }
  }

  @ChartContentBuilder
  private var scatterMarks: some ChartContent {
    ForEach(Array((configuration.scatterSeries ?? []).enumerated()), id: \.element.id) {
      seriesIndex,
      series in
      ForEach(series.points) { point in
        PointMark(
          x: .value("X", point.x),
          y: .value("Y", point.y)
        )
        .symbolSize(point.size ?? 36)
        .foregroundStyle(
          seriesColor(series, index: seriesIndex)
            .opacity(configuration.dimming(for: series.id))
        )
      }
    }
  }

  @ChartContentBuilder
  private var timeSeriesMarks: some ChartContent {
    let timestamps = configuration.points?.timestamps ?? []
    ForEach(Array(configuration.resolvedSeries.enumerated()), id: \.element.id) {
      seriesIndex,
      series in
      ForEach(Array(timestamps.enumerated()), id: \.offset) { index, timestamp in
        if let value = configuration.points?.values[safe: seriesIndex]?[safe: index] ?? nil {
          LineMark(
            x: .value("Time", Date(timeIntervalSince1970: timestamp)),
            y: .value(series.label, value)
          )
          .foregroundStyle(seriesColor(series, index: seriesIndex))
          .lineStyle(seriesStrokeStyle(series.id, defaultWidth: 2))
        }
      }
    }
  }

  @ChartContentBuilder
  private var sparklineMarks: some ChartContent {
    ForEach(Array((configuration.values ?? []).enumerated()), id: \.offset) {
      index,
      value in
      LineMark(x: .value("Index", index), y: .value("Value", value))
        .foregroundStyle(Color(hex: configuration.color ?? "#6d28d9"))
        .lineStyle(StrokeStyle(lineWidth: 2.25, lineCap: .round, lineJoin: .round))
    }
  }

  @ChartContentBuilder
  private var ruleMarks: some ChartContent {
    ForEach(configuration.rules ?? []) { item in
      if configuration.orientation == "horizontal" {
        RuleMark(
          x: .value("Value", item.value),
          yStart: .value("Start", item.start ?? 0),
          yEnd: .value("End", item.end ?? 1)
        )
        .foregroundStyle(palette[0])
        .annotation(position: .top) {
          Text(item.label).font(.caption2)
        }
      } else {
        RuleMark(
          xStart: .value("Start", item.start ?? 0),
          xEnd: .value("End", item.end ?? 1),
          y: .value("Value", item.value)
        )
        .foregroundStyle(palette[0])
        .annotation(position: .top) {
          Text(item.label).font(.caption2)
        }
      }
    }
  }

  @ChartContentBuilder
  private var rangeMarks: some ChartContent {
    ForEach(Array((configuration.ranges ?? []).enumerated()), id: \.element.id) {
      index,
      item in
      AreaMark(
        x: .value("Category", item.category),
        yStart: .value("Low", item.low),
        yEnd: .value("High", item.high)
      )
      .foregroundStyle(
        item.color.map(Color.init(hex:))
          ?? palette[index % palette.count].opacity(0.28)
      )
    }
  }

  @ChartContentBuilder
  private var candlestickMarks: some ChartContent {
    ForEach(configuration.candlesticks ?? []) { item in
      let isPositive = item.close >= item.open
      let color = isPositive
        ? Color(hex: configuration.style?.upColor
          ?? configuration.theme?.colors?.positive ?? "#16a34a")
        : Color(hex: configuration.style?.downColor
          ?? configuration.theme?.colors?.negative ?? "#dc2626")
      RuleMark(
        x: .value("Category", item.category),
        yStart: .value("Low", item.low),
        yEnd: .value("High", item.high)
      )
      .foregroundStyle(color)
      .lineStyle(StrokeStyle(lineWidth: configuration.style?.wickWidth ?? 1.5))
      RectangleMark(
        x: .value("Category", item.category),
        yStart: .value("Open", item.open),
        yEnd: .value("Close", item.close),
        width: .ratio(configuration.style?.candleWidth ?? 0.52)
      )
      .foregroundStyle(
        isPositive && configuration.style?.hollowUp == true
          ? color.opacity(0.14)
          : color
      )
    }
  }

  private func value(in series: ZyplotSeries, at index: Int) -> Double? {
    series.values?[safe: index] ?? nil
  }

  private func seriesColor(_ series: ZyplotSeries, index: Int) -> Color {
    if let color = configuration.seriesStyle(for: series.id)?.color {
      return Color(hex: color)
    }
    if let color = series.color {
      return Color(hex: color)
    }
    let slot = max(0, (series.slot ?? index + 1) - 1)
    return palette[slot % palette.count]
  }

  private func seriesColor(_ series: ZyplotScatterSeries, index: Int) -> Color {
    if let color = configuration.seriesStyle(for: series.id)?.color {
      return Color(hex: color)
    }
    if let color = series.color {
      return Color(hex: color)
    }
    let slot = max(0, (series.slot ?? index + 1) - 1)
    return palette[slot % palette.count]
  }

  private func seriesStrokeStyle(_ id: String, defaultWidth: Double) -> StrokeStyle {
    let style = configuration.seriesStyle(for: id)
    return StrokeStyle(
      lineWidth: style?.strokeWidth ?? defaultWidth,
      lineCap: .round,
      lineJoin: .round,
      dash: style?.strokeDash?.map { CGFloat($0) } ?? []
    )
  }

  private func itemColor(_ item: ZyplotDatum, index: Int) -> Color {
    if let color = item.color {
      return Color(hex: color)
    }
    let slot = max(0, (item.slot ?? index + 1) - 1)
    return palette[slot % palette.count]
  }

}

private extension Collection {
  subscript(safe index: Index) -> Element? {
    indices.contains(index) ? self[index] : nil
  }
}
