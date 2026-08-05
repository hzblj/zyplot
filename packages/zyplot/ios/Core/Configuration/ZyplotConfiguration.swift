import Foundation

struct ZyplotConfiguration: Codable {
  var accessibilityLabel: String?
  var animation: ZyplotAnimationOptions?
  var annotations: [ZyplotAnnotation]?
  var axes: [ZyplotRadarAxis]?
  var axis: ZyplotAxes?
  var binCount: Int?
  var categories: [String]?
  var candlesticks: [ZyplotCandlestickDatum]?
  var cells: [ZyplotHeatmapCell]?
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
  var isTracing: Bool?
  var label: String?
  var labels: ZyplotLabels?
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
  var revealTrack: [ZyplotSeries]?
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
  var tooltipAnchor: ZyplotTooltipAnchor?
  /// Where the app's own view for an annotation sits on its mark, keyed by the annotation's id.
  var annotationViewAlign: [String: String]?
  var style: ZyplotCandlestickStyle?
  static let empty = ZyplotConfiguration(type: "line")

  init(type: String) {
    self.type = type
  }
}
