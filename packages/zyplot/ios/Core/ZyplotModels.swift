import SwiftUI

struct ZyplotAxes: Codable {
  var x: Bool?
  var y: Bool?
}

struct ZyplotNumberFormat: Codable {
  var decimals: Int?
  var locale: String?
  var prefix: String?
  var suffix: String?
}

struct ZyplotThemeColors: Codable {
  var axis: String?
  var background: String?
  var categorical: [String]?
  var grid: String?
  var label: String?
  var negative: String?
  var positive: String?
  var surface: String?
  var track: String?
}

struct ZyplotTheme: Codable {
  var colors: ZyplotThemeColors?
}

struct ZyplotSurfaceBorder: Codable {
  var color: String?
  var width: Double?
}

/// The container the chart is drawn in. JS resolves the provider and the
/// chart's own value into one object before it crosses the bridge, so this
/// never has to merge anything.
struct ZyplotSurface: Codable {
  var background: String?
  var border: ZyplotSurfaceBorder?
  var cornerRadius: Double?
  var padding: ZyplotSurfacePadding?
}

/// `padding` is either a number for all four sides or an object naming them.
/// Decoding both into the same shape keeps the call site free of the choice.
struct ZyplotSurfacePadding: Codable {
  var bottom: Double = 0
  var left: Double = 0
  var right: Double = 0
  var top: Double = 0

  private enum CodingKeys: String, CodingKey {
    case bottom, horizontal, left, right, top, vertical
  }

  init(from decoder: Decoder) throws {
    if let all = try? decoder.singleValueContainer().decode(Double.self) {
      bottom = all
      left = all
      right = all
      top = all
      return
    }
    let container = try decoder.container(keyedBy: CodingKeys.self)
    let horizontal = try container.decodeIfPresent(Double.self, forKey: .horizontal)
    let vertical = try container.decodeIfPresent(Double.self, forKey: .vertical)
    bottom = try container.decodeIfPresent(Double.self, forKey: .bottom) ?? vertical ?? 0
    left = try container.decodeIfPresent(Double.self, forKey: .left) ?? horizontal ?? 0
    right = try container.decodeIfPresent(Double.self, forKey: .right) ?? horizontal ?? 0
    top = try container.decodeIfPresent(Double.self, forKey: .top) ?? vertical ?? 0
  }

  func encode(to encoder: Encoder) throws {
    var container = encoder.container(keyedBy: CodingKeys.self)
    try container.encode(bottom, forKey: .bottom)
    try container.encode(left, forKey: .left)
    try container.encode(right, forKey: .right)
    try container.encode(top, forKey: .top)
  }
}

struct ZyplotSeries: Codable, Identifiable {
  var color: String?
  var id: String
  var label: String
  var slot: Int?
  var values: [Double?]?
}

struct ZyplotDatum: Codable, Identifiable {
  var color: String?
  var id: String
  var label: String
  var slot: Int?
  var value: Double
}

struct ZyplotScatterPoint: Codable, Identifiable {
  var label: String?
  var size: Double?
  var x: Double
  var y: Double

  var id: String { "\(x):\(y):\(label ?? "")" }
}

struct ZyplotScatterSeries: Codable, Identifiable {
  var color: String?
  var id: String
  var label: String
  var points: [ZyplotScatterPoint]
  var slot: Int?
}

struct ZyplotHeatmapCell: Codable, Identifiable {
  var columnIndex: Int
  var rowIndex: Int
  var value: Double?

  var id: String { "\(columnIndex):\(rowIndex)" }
}

struct ZyplotDumbbellRow: Codable, Identifiable {
  var after: Double
  var before: Double
  var id: String
  var label: String
}

/// Caller-supplied terminology for the five-number summary — translated by the
/// app, never by this module.
struct ZyplotBoxplotLabels: Codable {
  var max: String
  var median: String
  var min: String
  var q1: String
  var q3: String
}

struct ZyplotBoxplotGroup: Codable, Identifiable {
  var id: String
  var label: String
  var max: Double
  var median: Double
  var min: Double
  var outliers: [Double]?
  var q1: Double
  var q3: Double
}

struct ZyplotHierarchyNode: Codable, Identifiable {
  var children: [ZyplotHierarchyNode]?
  var color: String?
  var id: String
  var label: String
  var slot: Int?
  var value: Double?

  var total: Double {
    value ?? children?.reduce(0) { $0 + $1.total } ?? 0
  }
}

struct ZyplotFlowNode: Codable, Identifiable {
  var color: String?
  var id: String
  var label: String
  var slot: Int?
}

struct ZyplotFlowLink: Codable, Identifiable {
  var source: String
  var target: String
  var value: Double

  var id: String { "\(source):\(target)" }
}

struct ZyplotRadarAxis: Codable, Identifiable {
  var label: String
  var max: Double

  var id: String { label }
}

struct ZyplotTimePoints: Codable {
  var timestamps: [Double]
  var values: [[Double?]]
}

struct ZyplotRuleDatum: Codable, Identifiable {
  var end: Double?
  var id: String
  var label: String
  var start: Double?
  var value: Double
}

struct ZyplotRangeDatum: Codable, Identifiable {
  var category: String
  var color: String?
  var high: Double
  var id: String
  var low: Double
}

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

struct ZyplotConfiguration: Codable {
  var accessibilityLabel: String?
  var after: Double?
  var animation: ZyplotAnimationOptions?
  var annotations: [ZyplotAnnotation]?
  var axes: [ZyplotRadarAxis]?
  var axis: ZyplotAxes?
  var before: Double?
  var binCount: Int?
  var categories: [String]?
  var candlesticks: [ZyplotCandlestickDatum]?
  var cells: [ZyplotHeatmapCell]?
  var change: Double?
  var color: String?
  var colorMode: String?
  var columns: [String]?
  var data: [ZyplotDatum]?
  var emphasisId: String?
  var format: ZyplotNumberFormat?
  var groups: [ZyplotBoxplotGroup]?
  var height: Double?
  var hierarchy: [ZyplotHierarchyNode]?
  var innerRadius: Double?
  var isLoading: Bool?
  var isSmooth: Bool?
  var isStacked: Bool?
  var label: String?
  var labels: ZyplotBoxplotLabels?
  var links: [ZyplotFlowLink]?
  var max: Double?
  var min: Double?
  var nodes: [ZyplotFlowNode]?
  var orientation: String?
  var points: ZyplotTimePoints?
  var plot: ZyplotPlotStyle?
  var rows: [ZyplotDumbbellRow]?
  var rowLabels: [String]?
  var ranges: [ZyplotRangeDatum]?
  var rules: [ZyplotRuleDatum]?
  var series: [ZyplotSeries]?
  var seriesStyles: [String: ZyplotSeriesStyle]?
  var surface: ZyplotSurface?
  var showVolume: Bool?
  var scatterSeries: [ZyplotScatterSeries]?
  var theme: ZyplotTheme?
  var type: String
  var value: Double?
  var values: [Double]?
  var xAxis: ZyplotAxisOptions?
  var yAxis: ZyplotAxisOptions?
  var xFormat: ZyplotNumberFormat?
  var yFormat: ZyplotNumberFormat?
  var xLabel: String?
  var yLabel: String?
  var interaction: ZyplotInteractionOptions?
  var style: ZyplotCandlestickStyle?

  static let empty = ZyplotConfiguration(type: "line")

  init(type: String) {
    self.type = type
  }

  var palette: [Color] {
    let values = theme?.colors?.categorical ?? [
      "#6d28d9", "#0284c7", "#ea580c", "#16a34a",
      "#db2777", "#ca8a04", "#7c3aed",
    ]
    return values.map(Color.init(hex:))
  }

  /// Bins are computed here rather than asked for, because a caller passing
  /// pre-binned data has already made the decision that matters. Both the marks
  /// and the x-axis domain read this, so the bars and the axis cannot disagree.
  var histogramBins: [ZyplotHistogramBin] {
    let observations = values ?? []
    guard let minimum = observations.min(), let maximum = observations.max() else {
      return []
    }
    // One observation, or many of the same value, still has a distribution to
    // show — a single bar rather than the empty plot a zero-wide span draws.
    guard maximum > minimum else {
      return [
        ZyplotHistogramBin(lower: minimum, upper: minimum + 1, count: observations.count),
      ]
    }
    // Qualified: `min` and `max` are also gauge bounds on this type, and the
    // members shadow the global functions inside it.
    let count = Swift.max(1, binCount ?? 8)
    let width = (maximum - minimum) / Double(count)
    var counts = Array(repeating: 0, count: count)
    for value in observations {
      counts[Swift.min(count - 1, Int((value - minimum) / width))] += 1
    }
    return counts.enumerated().map { offset, binned in
      let lower = minimum + Double(offset) * width
      return ZyplotHistogramBin(lower: lower, upper: lower + width, count: binned)
    }
  }

  var resolvedSeries: [ZyplotSeries] { series ?? [] }
  var resolvedCategories: [String] {
    categories ?? candlesticks?.map(\.category) ?? []
  }
  var resolvedData: [ZyplotDatum] { data ?? [] }

  var resolvedXAxisVisible: Bool {
    xAxis?.visible ?? axis?.x ?? true
  }

  var resolvedYAxisVisible: Bool {
    yAxis?.visible ?? axis?.y ?? true
  }

  /// Scatter names its axes with `xLabel`/`xFormat` rather than a full
  /// `ChartAxisOptions`, so the detailed form wins and these fill in behind it.
  var resolvedXAxisLabel: String { xAxis?.label ?? xLabel ?? "" }
  var resolvedYAxisLabel: String { yAxis?.label ?? yLabel ?? "" }
  var resolvedXAxisFormat: ZyplotNumberFormat? { xAxis?.format ?? xFormat }
  var resolvedYAxisFormat: ZyplotNumberFormat? { yAxis?.format ?? yFormat }

  /// `nil` unless some *other* series is emphasized — the emphasized one keeps
  /// full opacity, so only its peers get dimmed.
  func dimming(for id: String) -> Double {
    guard let emphasisId, !emphasisId.isEmpty, emphasisId != id else { return 1 }
    return interaction?.dimOpacity ?? 0.25
  }

  var preferredColorScheme: ColorScheme? {
    switch colorMode {
    case "dark": return .dark
    case "light": return .light
    default: return nil
    }
  }

  func seriesStyle(for id: String) -> ZyplotSeriesStyle? {
    seriesStyles?[id]
  }
}

/// One histogram bin: the half-open span it covers, and how many observations
/// landed in it. `lower` identifies it — bins never share a left edge.
struct ZyplotHistogramBin: Identifiable {
  let lower: Double
  let upper: Double
  let count: Int

  var id: Double { lower }
}

extension Color {
  init(hex: String) {
    let cleaned = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
    var value: UInt64 = 0
    Scanner(string: cleaned).scanHexInt64(&value)

    let red: Double
    let green: Double
    let blue: Double
    let alpha: Double

    switch cleaned.count {
    case 8:
      red = Double((value >> 24) & 0xff) / 255
      green = Double((value >> 16) & 0xff) / 255
      blue = Double((value >> 8) & 0xff) / 255
      alpha = Double(value & 0xff) / 255
    default:
      red = Double((value >> 16) & 0xff) / 255
      green = Double((value >> 8) & 0xff) / 255
      blue = Double(value & 0xff) / 255
      alpha = 1
    }

    self.init(.sRGB, red: red, green: green, blue: blue, opacity: alpha)
  }
}
