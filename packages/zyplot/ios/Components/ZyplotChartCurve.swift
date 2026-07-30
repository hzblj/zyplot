import Charts
import SwiftUI

struct ZyplotChartCurve {
  struct Reading {
    let index: Int
    let position: CGPoint
  }

  let readings: [Reading]
  let isSmooth: Bool

  init(
    series: ZyplotSeries,
    context: ZyplotMarkContext,
    proxy: ChartProxy,
    frame: CGRect,
    indices: ClosedRange<Int>? = nil
  ) {
    let categories = context.configuration.resolvedCategories
    var readings: [Reading] = []
    readings.reserveCapacity(indices.map { $0.count } ?? categories.count)
    for (index, category) in categories.enumerated() {
      guard indices?.contains(index) ?? true,
            let value = context.value(in: series, at: index),
            let x = proxy.position(forX: category),
            let y = proxy.position(forY: value)
      else {
        continue
      }
      readings.append(
        Reading(index: index, position: CGPoint(x: frame.minX + x, y: frame.minY + y))
      )
    }
    self.readings = readings
    isSmooth = context.configuration.isSmooth == true
  }

  var path: Path? { Self.path(through: readings.map(\.position), isSmooth: isSmooth) }

  func filled(to baseline: CGFloat) -> Path? {
    guard var path, let first = readings.first, let last = readings.last else { return nil }
    path.addLine(to: CGPoint(x: last.position.x, y: baseline))
    path.addLine(to: CGPoint(x: first.position.x, y: baseline))
    path.closeSubpath()
    return path
  }

  private static func path(through positions: [CGPoint], isSmooth: Bool) -> Path? {
    guard positions.count > 1, let first = positions.first else { return nil }
    var path = Path()
    path.move(to: first)
    guard isSmooth, positions.count >= 3 else {
      for position in positions.dropFirst() {
        path.addLine(to: position)
      }
      return path
    }
    for index in 0..<(positions.count - 1) {
      let previous = positions[max(0, index - 1)]
      let current = positions[index]
      let next = positions[index + 1]
      let following = positions[min(positions.count - 1, index + 2)]
      path.addCurve(
        to: next,
        control1: CGPoint(
          x: current.x + (next.x - previous.x) / 6,
          y: current.y + (next.y - previous.y) / 6
        ),
        control2: CGPoint(
          x: next.x - (following.x - current.x) / 6,
          y: next.y - (following.y - current.y) / 6
        )
      )
    }
    return path
  }
}
