import SwiftUI

struct ZyplotCandlestickDatum: Codable, Identifiable {
  var category: String
  var close: Double
  var high: Double
  var id: String
  var low: Double
  var open: Double
  var timestamp: Double?
  var volume: Double?
}

struct ZyplotCandlestickRow: Identifiable {
  let id: String
  let label: String
  let value: String
  let trend: Double?
}

struct ZyplotCandlestickStyle: Codable {
  var candleRadius: Double?
  var candleWidth: Double?
  var downColor: String?
  var hollowUp: Bool?
  var neutralColor: String?
  var upColor: String?
  var volumeDownColor: String?
  var volumeHeightRatio: Double?
  var volumeUpColor: String?
  var wickWidth: Double?

  var resolvedCandleRadius: Double { candleRadius ?? 0 }
  /// Rounded bodies want rounded wick caps too, or the wick reads as a cut-off stub.
  var wickCap: CGLineCap { resolvedCandleRadius > 0 ? .round : .butt }
}
