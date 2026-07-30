import Charts
import SwiftUI

protocol ZyplotMarkSet: ChartContent {
  var context: ZyplotMarkContext { get }
}

extension ZyplotMarkSet {
  var configuration: ZyplotConfiguration { context.configuration }
  var reveal: ZyplotRevealState { context.reveal }
  var palette: [Color] { context.palette }
  var interpolation: InterpolationMethod { context.interpolation }
  var scrubDimming: Double { context.scrubDimming }

  func value(in series: ZyplotSeries, at index: Int) -> Double? {
    context.value(in: series, at: index)
  }

  func seriesColor(_ series: some ZyplotColorable, index: Int) -> Color {
    context.seriesColor(series, index: index)
  }

  func itemColor(_ item: ZyplotDatum, index: Int) -> Color {
    context.itemColor(item, index: index)
  }

  func strokeWidth(_ id: String) -> Double { context.strokeWidth(id) }

  func seriesStrokeStyle(_ id: String, defaultWidth: Double) -> StrokeStyle {
    context.seriesStrokeStyle(id, defaultWidth: defaultWidth)
  }

  func flashed(_ base: Color) -> Color { context.flashed(base) }
}
