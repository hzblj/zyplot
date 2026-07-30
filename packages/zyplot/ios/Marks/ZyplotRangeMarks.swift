import Charts
import SwiftUI

struct ZyplotRangeMarks: ZyplotMarkSet {
  let context: ZyplotMarkContext

  @ChartContentBuilder
  var body: some ChartContent {
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
}
