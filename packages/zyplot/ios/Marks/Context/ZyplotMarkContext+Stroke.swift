import SwiftUI

extension ZyplotMarkContext {
  func strokeWidth(_ id: String) -> Double {
    configuration.seriesStyle(for: id)?.strokeWidth ?? 2.25
  }

  func seriesStrokeStyle(_ id: String, defaultWidth: Double) -> StrokeStyle {
    let style = configuration.seriesStyle(for: id)
    return StrokeStyle(
      lineWidth: style?.strokeWidth ?? defaultWidth,
      lineCap: .round,
      lineJoin: .round,
      dash: style?.strokeDash?.map { CGFloat($0) } ?? []
    )
  }
}
