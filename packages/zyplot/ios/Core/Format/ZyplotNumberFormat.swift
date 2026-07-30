import Foundation

struct ZyplotNumberFormat: Codable {
  var decimals: Int?
  var locale: String?
  var prefix: String?
  var suffix: String?

  func string(from value: Double) -> String {
    let formatter = Self.shared.formatter(locale: locale, decimals: decimals ?? 0)
    let number = formatter.string(from: NSNumber(value: value))
      ?? String(format: "%.\(decimals ?? 0)f", value)
    return "\(prefix ?? "")\(number)\(suffix ?? "")"
  }

  private static let shared = Cache()

  private final class Cache {
    private var formatters: [String: NumberFormatter] = [:]
    private let lock = NSLock()

    func formatter(locale: String?, decimals: Int) -> NumberFormatter {
      let key = "\(locale ?? "")|\(decimals)"
      lock.lock()
      defer { lock.unlock() }
      if let formatter = formatters[key] { return formatter }
      let formatter = NumberFormatter()
      formatter.numberStyle = .decimal
      formatter.locale = locale.map(Locale.init(identifier:)) ?? Locale.current
      formatter.minimumFractionDigits = decimals
      formatter.maximumFractionDigits = decimals
      formatters[key] = formatter
      return formatter
    }
  }
}
