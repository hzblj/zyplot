import Foundation

struct ZyplotCrosshairStyle: Codable {
  var color: String?
  var dash: [Double]?
  var width: Double?
}

struct ZyplotSelectionMarker: Codable {
  var color: String?
  var glow: ZyplotGlow?
  var size: Double?
  var span: Double?
  var style: String?

  var isSegment: Bool { style == "segment" }
  var resolvedSpan: Int { Swift.max(1, Int((span ?? 2).rounded())) }
}

struct ZyplotInteractionOptions: Codable {
  var crosshair: String?
  var crosshairStyle: ZyplotCrosshairStyle?
  var dimOpacity: Double?
  var haptics: Bool?
  var highlightBlend: Double?
  var highlightColor: String?
  var highlightScale: Double?
  var hover: String?
  var marker: ZyplotSelectionMarker?
  var pan: Bool?
  var selection: String?
  var tooltip: Bool?
  var zoom: Bool?

  var isEnabled: Bool {
    hover != nil || crosshair != nil || selection != nil || marker != nil
      || tooltip == true
  }

  var drawsVerticalCrosshair: Bool {
    crosshair == "x" || crosshair == "both"
  }
}
