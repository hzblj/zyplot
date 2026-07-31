import Charts
import SwiftUI

struct ZyplotMarkContext {
  let configuration: ZyplotConfiguration
  var reveal: ZyplotRevealState = .settled
  var selection: String?
  /// The marks under two fingers, while a span is being read. Never set together with `selection`.
  var range: ClosedRange<Int>?
  /// Set while the step back is being ramped, so the canvas draws the interpolated value.
  var dimming: Double?
}

extension ZyplotMarkContext {
  /// The same context with the step back ramped to a given strength.
  func dimmed(_ strength: Double) -> ZyplotMarkContext {
    var copy = self
    copy.dimming = strength
    return copy
  }

  var scrubDimming: Double {
    if let dimming { return dimming }
    if range != nil, let dim = configuration.interaction?.rangeStyle?.dimOpacity {
      return dim
    }
    guard selection != nil, let dim = configuration.interaction?.dimOpacity else {
      return 1
    }
    return dim
  }

  /**
   How far the areas step back, which only a span asks for. A single reading dims the strokes and
   leaves the fills where they are; a span is a spotlight, so what is outside it goes down whole.
   */
  var rangeDimming: Double {
    range == nil ? 1 : scrubDimming
  }

  /**
   How far the lighting has come up, which is how far the marks have stepped back. The lit stroke is
   drawn that far from the trace's own colour towards the marker's, so the reading it belongs to can be
   let go of at the end of the ramp without anything showing.
   */
  var litStrength: Double {
    guard let dim = configuration.interaction?.dimOpacity, dim < 1 else { return 1 }
    return ((1 - scrubDimming) / (1 - dim)).clamped()
  }

  var interpolation: InterpolationMethod {
    configuration.isSmooth == true ? .catmullRom : .linear
  }

  func value(in series: ZyplotSeries, at index: Int) -> Double? {
    series.values?[safe: index] ?? nil
  }
}
