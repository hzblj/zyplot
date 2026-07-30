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

/// Carries the measured plot and annotation positions out of the chart's overlay.
///
/// A preference rather than a `task` or an `onAppear`: the plot has no frame on the first
/// layout pass, and the reveal swaps the whole chart between a `TimelineView` and a settled
/// branch, so anything keyed to a view's lifetime either measures too early or misses the
/// pass that finally has something to measure. A preference is recomputed on every layout
/// and only reported when the value actually changes.
struct ZyplotGeometryKey: PreferenceKey {
  static let defaultValue: ZyplotGeometrySnapshot? = nil

  static func reduce(
    value: inout ZyplotGeometrySnapshot?,
    nextValue: () -> ZyplotGeometrySnapshot?
  ) {
    value = nextValue() ?? value
  }
}
