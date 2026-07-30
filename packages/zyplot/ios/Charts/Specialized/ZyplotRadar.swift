import SwiftUI

struct ZyplotRadar: View {
  let configuration: ZyplotConfiguration

  var body: some View {
    Canvas { context, size in
      let axes = configuration.axes ?? []
      guard axes.count >= 3 else { return }
      let center = CGPoint(x: size.width / 2, y: size.height / 2)
      let radius = min(size.width, size.height) * 0.36

      for ring in 1...4 {
        let ringRadius = radius * Double(ring) / 4
        context.stroke(
          polygon(center: center, radius: ringRadius, count: axes.count),
          with: .color(Color.secondary.opacity(0.14)),
          lineWidth: 1
        )
      }

      for index in axes.indices {
        context.stroke(
          Path {
            $0.move(to: center)
            $0.addLine(to: point(center, radius, index, axes.count))
          },
          with: .color(Color.secondary.opacity(0.14)),
          lineWidth: 1
        )
      }

      for (seriesIndex, series) in configuration.resolvedSeries.enumerated() {
        var shape = Path()
        for index in axes.indices {
          let maximum = max(axes[index].max, 1)
          let value = series.values?[safe: index] ?? nil
          let ratio = min(1, max(0, (value ?? 0) / maximum))
          let next = point(center, radius * ratio, index, axes.count)
          index == axes.startIndex ? shape.move(to: next) : shape.addLine(to: next)
        }
        shape.closeSubpath()
        let color = series.color.map(Color.init(hex:))
          ?? configuration.palette[seriesIndex % configuration.palette.count]
        context.fill(shape, with: .color(color.opacity(0.14)))
        context.stroke(shape, with: .color(color), lineWidth: 2)
      }
    }
    .accessibilityLabel(configuration.accessibilityLabel ?? "Radar chart")
  }

  private func polygon(center: CGPoint, radius: Double, count: Int) -> Path {
    Path {
      for index in 0..<count {
        let next = point(center, radius, index, count)
        index == 0 ? $0.move(to: next) : $0.addLine(to: next)
      }
      $0.closeSubpath()
    }
  }

  private func point(
    _ center: CGPoint,
    _ radius: Double,
    _ index: Int,
    _ count: Int
  ) -> CGPoint {
    let angle = -Double.pi / 2 + Double(index) / Double(count) * Double.pi * 2
    return CGPoint(
      x: center.x + cos(angle) * radius,
      y: center.y + sin(angle) * radius
    )
  }
}
