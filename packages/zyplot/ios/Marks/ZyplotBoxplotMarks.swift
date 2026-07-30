import Charts
import SwiftUI

struct ZyplotBoxplotMarks: ZyplotMarkSet {
  let context: ZyplotMarkContext

  @ChartContentBuilder
  var body: some ChartContent {
    ForEach(configuration.groups ?? []) { group in
      RectangleMark(
        x: .value("Group", group.label),
        yStart: .value("Q1", group.q1),
        yEnd: .value("Q3", group.q3),
        width: .ratio(0.5)
      )
      .foregroundStyle(palette[0].opacity(0.18))
      RuleMark(
        x: .value("Group", group.label),
        yStart: .value("Min", group.min),
        yEnd: .value("Max", group.max)
      )
      .foregroundStyle(palette[0])
      RuleMark(
        xStart: .value("Start", group.label),
        xEnd: .value("End", group.label),
        y: .value("Median", group.median)
      )
      .foregroundStyle(palette[0])
      ForEach(group.outliers ?? [], id: \.self) { outlier in
        PointMark(
          x: .value("Group", group.label),
          y: .value("Outlier", outlier)
        )
        .foregroundStyle(palette[0])
      }
    }
  }
}
