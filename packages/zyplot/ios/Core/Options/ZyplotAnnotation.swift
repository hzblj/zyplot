import Foundation

struct ZyplotAnnotation: Codable, Identifiable {
  /// Where in a category's band a rule sits: `center`, `start` or `end`.
  var align: String?
  var axis: String?
  var badge: String?
  var color: String?
  var dash: [Double]?
  var end: ZyplotCoordinate?
  var glow: ZyplotGlow?
  var halo: ZyplotHalo?
  var hidden: Bool?
  var id: String
  var label: String?
  var labelBackground: String?
  var labelPosition: String?
  var opacity: Double?
  var pulse: ZyplotPulse?
  var scrubOpacity: Double?
  var size: Double?
  var start: ZyplotCoordinate?
  var text: String?
  var type: String
  var value: ZyplotCoordinate?
  var x: ZyplotCoordinate?
  var width: Double?
  var y: Double?
}
