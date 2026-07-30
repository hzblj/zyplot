import Foundation

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

struct ZyplotTimePoints: Codable {
  var timestamps: [Double]
  var values: [[Double?]]
}
