import Foundation

struct ZyplotCandlestickStyle: Codable {
  var candleWidth: Double?
  var downColor: String?
  var hollowUp: Bool?
  var neutralColor: String?
  var upColor: String?
  var volumeDownColor: String?
  var volumeHeightRatio: Double?
  var volumeUpColor: String?
  var wickWidth: Double?
}
