import Charts
import SwiftUI

struct ZyplotDivergingBarMarks: ZyplotMarkSet {
  let context: ZyplotMarkContext

  @ChartContentBuilder
  var body: some ChartContent {
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
}
