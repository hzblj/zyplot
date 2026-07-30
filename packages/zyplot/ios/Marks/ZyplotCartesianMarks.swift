import Charts
import SwiftUI

struct ZyplotCartesianMarks: ZyplotMarkSet {
  let context: ZyplotMarkContext

  @ChartContentBuilder
  var body: some ChartContent {
    ForEach(configuration.resolvedSeries) { series in
      ForEach(Array(configuration.resolvedCategories.enumerated()), id: \.offset) {
        categoryIndex,
        category in
        if let value = value(in: series, at: categoryIndex) {
          LineMark(
            x: .value("Category", category),
            y: .value(series.label, value),
            series: .value("Series", series.id)
          )
          .opacity(0)
        }
      }
    }
  }
}
