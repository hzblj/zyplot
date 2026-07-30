import Foundation

struct ZyplotSeriesStyle: Codable {
  var color: String?
  var fill: ZyplotSeriesFill?
  var fillOpacity: Double?
  var glow: ZyplotGlow?
  var opacity: Double?
  var strokeDash: [Double]?
  var strokeWidth: Double?
  var symbol: String?
  var symbolSize: Double?
}
