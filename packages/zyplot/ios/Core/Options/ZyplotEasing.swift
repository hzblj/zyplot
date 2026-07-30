import Foundation

enum ZyplotEasing: String {
  case easeIn = "ease-in"
  case easeInOut = "ease-in-out"
  case easeOut = "ease-out"
  case linear

  static func named(_ name: String?, or fallback: ZyplotEasing) -> ZyplotEasing {
    name.flatMap(ZyplotEasing.init(rawValue:)) ?? fallback
  }

  func progress(_ value: Double) -> Double {
    let time = min(max(value, 0), 1)
    switch self {
    case .easeIn:
      return pow(time, 3)
    case .easeInOut:
      return time < 0.5 ? 4 * pow(time, 3) : 1 - pow(-2 * time + 2, 3) / 2
    case .easeOut:
      return 1 - pow(1 - time, 3)
    case .linear:
      return time
    }
  }
}
