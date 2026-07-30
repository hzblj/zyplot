import Charts
import SwiftUI

struct ZyplotMarkContext {
  let configuration: ZyplotConfiguration
  var reveal: ZyplotRevealState = .settled
  var selection: String?
}

extension ZyplotMarkContext {
  var scrubDimming: Double {
    guard selection != nil, let dim = configuration.interaction?.dimOpacity else {
      return 1
    }
    return dim
  }

  var interpolation: InterpolationMethod {
    configuration.isSmooth == true ? .catmullRom : .linear
  }

  func value(in series: ZyplotSeries, at index: Int) -> Double? {
    series.values?[safe: index] ?? nil
  }
}
