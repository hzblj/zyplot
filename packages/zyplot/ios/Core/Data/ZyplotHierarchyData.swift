import Foundation

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
