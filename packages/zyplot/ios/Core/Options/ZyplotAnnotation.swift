import Foundation

struct ZyplotAnnotation: Codable, Identifiable {
  var axis: String?
  var badge: String?
  var color: String?
  var dash: [Double]?
  var end: ZyplotCoordinate?
  var glow: ZyplotGlow?
  var halo: ZyplotHalo?
  /// Measured and reported like any other, but drawn by the app rather than the chart.
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
