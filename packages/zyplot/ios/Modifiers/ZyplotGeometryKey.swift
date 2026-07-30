import SwiftUI

struct ZyplotAnnotationPoint: Equatable {
  let id: String
  let x: CGFloat
  let y: CGFloat
}

struct ZyplotGeometrySnapshot: Equatable {
  let annotations: [ZyplotAnnotationPoint]
  let plot: CGRect

  var payload: [String: Any?] {
    [
      "geometry": [
        "annotations": annotations.map { ["id": $0.id, "x": $0.x, "y": $0.y] },
        "plot": [
          "height": plot.height,
          "width": plot.width,
          "x": plot.minX,
          "y": plot.minY,
        ],
      ],
      "phase": "layout",
    ]
  }
}

struct ZyplotGeometryKey: PreferenceKey {
  static let defaultValue: ZyplotGeometrySnapshot? = nil

  static func reduce(
    value: inout ZyplotGeometrySnapshot?,
    nextValue: () -> ZyplotGeometrySnapshot?
  ) {
    value = nextValue() ?? value
  }
}
