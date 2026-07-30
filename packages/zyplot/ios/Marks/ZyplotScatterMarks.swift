import Charts
import SwiftUI

struct ZyplotScatterMarks: ZyplotMarkSet {
  let context: ZyplotMarkContext

  @ChartContentBuilder
  var body: some ChartContent {
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
}
