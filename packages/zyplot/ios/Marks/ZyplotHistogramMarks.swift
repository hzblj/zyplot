import Charts
import SwiftUI

struct ZyplotHistogramMarks: ZyplotMarkSet {
  let context: ZyplotMarkContext

  @ChartContentBuilder
  var body: some ChartContent {
    ForEach(configuration.histogramBins) { bin in
      RectangleMark(
        xStart: .value("Bin start", bin.lower),
        xEnd: .value("Bin end", bin.upper),
        yStart: .value("Count", 0.0),
        yEnd: .value("Count", Double(bin.count))
      )
      .foregroundStyle(palette[0])
    }
  }
}
