import Foundation

struct ZyplotRevealState {
  var fraction: Double = 1
  var flash: Double = 0
  var isTracing: Bool = false
  var opacity: Double = 1

  static let settled = ZyplotRevealState()

  var bloom: Double { isTracing ? sqrt(fraction) : flash }

  var startOpacity: Double = 0.5

  var strokeOpacity: Double {
    isTracing ? startOpacity + (1 - startOpacity) * fraction : 1
  }
}
