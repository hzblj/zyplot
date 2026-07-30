import Charts
import SwiftUI

struct ZyplotSparklineMarks: ZyplotMarkSet {
  let context: ZyplotMarkContext

  @ChartContentBuilder
  var body: some ChartContent {
    ForEach(Array((configuration.values ?? []).enumerated()), id: \.offset) {
      index,
      value in
      LineMark(x: .value("Index", index), y: .value("Value", value))
        .foregroundStyle(Color(hex: configuration.color ?? "#6d28d9"))
        .lineStyle(StrokeStyle(lineWidth: 2.25, lineCap: .round, lineJoin: .round))
    }
  }
}
