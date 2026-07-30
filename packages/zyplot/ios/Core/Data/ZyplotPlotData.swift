import Foundation

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
