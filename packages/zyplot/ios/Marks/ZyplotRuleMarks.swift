import Charts
import SwiftUI

struct ZyplotRuleMarks: ZyplotMarkSet {
  let context: ZyplotMarkContext

  @ChartContentBuilder
  var body: some ChartContent {
    ForEach(configuration.rules ?? []) { item in
      if configuration.orientation == "horizontal" {
        RuleMark(
          x: .value("Value", item.value),
          yStart: .value("Start", item.start ?? 0),
          yEnd: .value("End", item.end ?? 1)
        )
        .foregroundStyle(palette[0])
        .annotation(position: .top) {
          Text(item.label).font(configuration.font(.caption2, size: 11))
        }
      } else {
        RuleMark(
          xStart: .value("Start", item.start ?? 0),
          xEnd: .value("End", item.end ?? 1),
          y: .value("Value", item.value)
        )
        .foregroundStyle(palette[0])
        .annotation(position: .top) {
          Text(item.label).font(configuration.font(.caption2, size: 11))
        }
      }
    }
  }
}
