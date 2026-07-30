import Charts
import SwiftUI

struct ZyplotTimeSeriesMarks: ZyplotMarkSet {
  let context: ZyplotMarkContext

  @ChartContentBuilder
  var body: some ChartContent {
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
}
