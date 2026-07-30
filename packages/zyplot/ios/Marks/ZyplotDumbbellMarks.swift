import Charts
import SwiftUI

struct ZyplotDumbbellMarks: ZyplotMarkSet {
  let context: ZyplotMarkContext

  @ChartContentBuilder
  var body: some ChartContent {
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
}
