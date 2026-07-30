import Charts
import SwiftUI

struct ZyplotPieMarks: ZyplotMarkSet {
  let context: ZyplotMarkContext

  @ChartContentBuilder
  var body: some ChartContent {
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
}
