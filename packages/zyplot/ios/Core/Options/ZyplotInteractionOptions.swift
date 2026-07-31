import Foundation

enum ZyplotLabelPaddingValue: Codable {
  case edges(ZyplotLabelPadding)
  case value(Double)

  init(from decoder: Decoder) throws {
    let container = try decoder.singleValueContainer()
    if let number = try? container.decode(Double.self) {
      self = .value(number)
      return
    }
    self = .edges(try container.decode(ZyplotLabelPadding.self))
  }

  func encode(to encoder: Encoder) throws {
    var container = encoder.singleValueContainer()
    switch self {
    case .edges(let value): try container.encode(value)
    case .value(let value): try container.encode(value)
    }
  }

  var across: Double {
    switch self {
    case .edges(let edges): edges.x ?? ZyplotLabelPadding.acrossDefault
    case .value(let value): value
    }
  }

  var down: Double {
    switch self {
    case .edges(let edges): edges.y ?? ZyplotLabelPadding.downDefault
    case .value(let value): value
    }
  }
}

struct ZyplotLabelPadding: Codable {
  static let acrossDefault: Double = 10
  static let downDefault: Double = 5
  var x: Double?
  var y: Double?
}

struct ZyplotCrosshairStyle: Codable {
  var color: String?
  var dash: [Double]?
  var labelBackground: String?
  var labelColor: String?
  var labelLift: Double?
  var labelPadding: ZyplotLabelPaddingValue?
  var labelRadius: Double?
  var labelSize: Double?
  var labels: [String]?
  var width: Double?

  var padsLabel: Bool { labelBackground != nil }
  var labelAcross: Double { padsLabel ? (labelPadding?.across ?? ZyplotLabelPadding.acrossDefault) : 0 }
  var labelDown: Double { padsLabel ? (labelPadding?.down ?? ZyplotLabelPadding.downDefault) : 0 }

  func label(at index: Int?) -> String? {
    guard let index, let labels, index >= 0, index < labels.count else { return nil }
    return labels[index]
  }
}

struct ZyplotSelectionMarker: Codable {
  var color: String?
  var dot: Bool?
  var glow: ZyplotGlow?
  var size: Double?
  var span: Double?
  var style: String?
  var isSegment: Bool { style == "segment" }
  var isTrail: Bool { style == "trail" }
  var lightsStroke: Bool { isSegment || isTrail }
  /// Whether a dot is drawn on the reading: the whole of `'point'`, and asked for by the rest.
  var drawsDot: Bool { !lightsStroke || dot == true }
  var resolvedSpan: Int { Swift.max(1, Int((span ?? 2).rounded())) }
}

/**
 How the stretch under two fingers is drawn. Absent, a span reading is the rule at each end of it
 and nothing more.
 */
struct ZyplotRangeStyle: Codable {
  var color: String?
  var dimOpacity: Double?
  var dot: Bool?
  var downColor: String?

  var drawsDot: Bool { dot != false }

  /// The stretch's own colour, which is the span's direction rather than the period's.
  func tint(rose: Bool) -> String? {
    rose ? color : (downColor ?? color)
  }
}

struct ZyplotInteractionOptions: Codable {
  var crosshair: String?
  var crosshairStyle: ZyplotCrosshairStyle?
  /// How long the marks take to step back for a reading, in ms. Nil or zero is instant.
  var dimDuration: Double?
  var dimOpacity: Double?
  var haptics: Bool?
  var highlightBlend: Double?
  var highlightColor: String?
  var highlightScale: Double?
  var hover: String?
  var marker: ZyplotSelectionMarker?
  var pan: Bool?
  var range: Bool?
  var rangeStyle: ZyplotRangeStyle?
  var selection: String?
  var tooltip: Bool?
  var zoom: Bool?

  var isEnabled: Bool {
    hover != nil || crosshair != nil || selection != nil || marker != nil
      || tooltip == true || range == true
  }

  var readsRange: Bool { range == true }

  var dimSeconds: Double { Swift.max(0, (dimDuration ?? 0) / 1_000) }

  var drawsVerticalCrosshair: Bool {
    crosshair == "x" || crosshair == "both"
  }
}
