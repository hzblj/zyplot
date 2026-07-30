import SwiftUI

struct ZyplotSunburst: View {
  let configuration: ZyplotConfiguration

  var body: some View {
    Canvas { context, size in
      let nodes = configuration.hierarchy ?? []
      let total = max(nodes.reduce(0) { $0 + $1.total }, 1)
      let center = CGPoint(x: size.width / 2, y: size.height / 2)
      let radius = min(size.width, size.height) * 0.42
      var angle = -Double.pi / 2

      for (index, node) in nodes.enumerated() {
        let sweep = node.total / total * Double.pi * 2
        let path = sector(center: center, radius: radius, start: angle, end: angle + sweep)
        context.fill(
          path,
          with: .color(
            node.color.map(Color.init(hex:))
              ?? configuration.palette[index % configuration.palette.count]
          )
        )
        angle += sweep
      }
      context.fill(
        Path(ellipseIn: CGRect(
          x: center.x - radius * 0.32,
          y: center.y - radius * 0.32,
          width: radius * 0.64,
          height: radius * 0.64
        )),
        with: .color(Color(uiColor: .systemBackground))
      )
    }
    .accessibilityLabel(configuration.accessibilityLabel ?? "Sunburst chart")
  }

  private func sector(
    center: CGPoint,
    radius: Double,
    start: Double,
    end: Double
  ) -> Path {
    Path {
      $0.move(to: center)
      $0.addArc(
        center: center,
        radius: radius,
        startAngle: .radians(start),
        endAngle: .radians(end),
        clockwise: false
      )
      $0.closeSubpath()
    }
  }
}
