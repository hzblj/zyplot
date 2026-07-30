import Charts
import SwiftUI

struct ZyplotBarMarks: ZyplotMarkSet {
  let context: ZyplotMarkContext

  @ChartContentBuilder
  var body: some ChartContent {
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
}
