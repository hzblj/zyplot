import Charts
import SwiftUI

struct ZyplotHeatmapMarks: ZyplotMarkSet {
  let context: ZyplotMarkContext

  @ChartContentBuilder
  var body: some ChartContent {
    ForEach(configuration.cells ?? []) { cell in
      if let value = cell.value,
         let column = configuration.columns?[safe: cell.columnIndex],
         let row = configuration.rowLabels?[safe: cell.rowIndex]
      {
        RectangleMark(
          x: .value("Column", column),
          y: .value("Row", row)
        )
        .foregroundStyle(palette[0].opacity(max(0.12, min(1, value / 100))))
      }
    }
  }
}
