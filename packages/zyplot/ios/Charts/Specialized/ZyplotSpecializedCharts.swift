import SwiftUI

struct ZyplotSpecializedChart: View {
  let configuration: ZyplotConfiguration

  @ViewBuilder
  var body: some View {
    switch configuration.type {
    case "gauge", "meter":
      ZyplotGauge(configuration: configuration)
    case "radar":
      ZyplotRadar(configuration: configuration)
    case "funnel":
      ZyplotFunnel(configuration: configuration)
    case "sankey":
      ZyplotSankey(configuration: configuration)
    case "sunburst":
      ZyplotSunburst(configuration: configuration)
    case "treemap":
      ZyplotTreemap(configuration: configuration)
    default:
      EmptyView()
    }
  }
}

private struct ZyplotGauge: View {
  let configuration: ZyplotConfiguration

  private var progress: Double {
    let minimum = configuration.min ?? 0
    let maximum = configuration.max ?? 100
    return min(1, max(0, ((configuration.value ?? 0) - minimum) / (maximum - minimum)))
  }

  var body: some View {
    ZStack {
      Canvas { context, size in
        let center = CGPoint(x: size.width / 2, y: size.height * 0.58)
        let radius = min(size.width, size.height) * 0.34
        let start = Angle.degrees(150)
        let sweep = 240.0
        var track = Path()
        track.addArc(
          center: center,
          radius: radius,
          startAngle: start,
          endAngle: .degrees(150 + sweep),
          clockwise: false
        )
        context.stroke(
          track,
          with: .color(Color.secondary.opacity(0.14)),
          style: StrokeStyle(lineWidth: 16, lineCap: .round)
        )
        var valuePath = Path()
        valuePath.addArc(
          center: center,
          radius: radius,
          startAngle: start,
          endAngle: .degrees(150 + sweep * progress),
          clockwise: false
        )
        context.stroke(
          valuePath,
          with: .color(configuration.palette[0]),
          style: StrokeStyle(lineWidth: 16, lineCap: .round)
        )
      }
      VStack(spacing: 4) {
        Text(format(configuration.value ?? 0))
          .font(.system(size: 30, weight: .semibold, design: .rounded))
          .monospacedDigit()
        if let label = configuration.label {
          Text(label)
            .font(.caption)
            .foregroundStyle(.secondary)
        }
      }
      .offset(y: 22)
    }
    .accessibilityLabel(configuration.accessibilityLabel ?? configuration.label ?? "Gauge")
    .accessibilityValue(format(configuration.value ?? 0))
  }

  private func format(_ value: Double) -> String {
    let decimals = configuration.format?.decimals ?? 0
    return "\(configuration.format?.prefix ?? "")\(String(format: "%.\(decimals)f", value))\(configuration.format?.suffix ?? "")"
  }
}

private struct ZyplotRadar: View {
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

private struct ZyplotFunnel: View {
  let configuration: ZyplotConfiguration

  var body: some View {
    Canvas { context, size in
      let data = configuration.resolvedData
      guard let maximum = data.map(\.value).max(), maximum > 0 else { return }
      let rowHeight = size.height / CGFloat(max(data.count, 1))
      for (index, item) in data.enumerated() {
        let current = CGFloat(item.value / maximum)
        let next = CGFloat(data[safe: index + 1]?.value ?? 0) / CGFloat(maximum)
        let topWidth = size.width * max(0.12, current)
        let bottomWidth = size.width * max(0.12, next)
        let y = CGFloat(index) * rowHeight
        let path = Path {
          $0.move(to: CGPoint(x: (size.width - topWidth) / 2, y: y + 2))
          $0.addLine(to: CGPoint(x: (size.width + topWidth) / 2, y: y + 2))
          $0.addLine(to: CGPoint(x: (size.width + bottomWidth) / 2, y: y + rowHeight - 2))
          $0.addLine(to: CGPoint(x: (size.width - bottomWidth) / 2, y: y + rowHeight - 2))
          $0.closeSubpath()
        }
        context.fill(
          path,
          with: .color(configuration.palette[index % configuration.palette.count])
        )
      }
    }
    .padding(.horizontal, 12)
    .accessibilityLabel(configuration.accessibilityLabel ?? "Funnel chart")
  }
}

private struct ZyplotTreemap: View {
  let configuration: ZyplotConfiguration

  var body: some View {
    Canvas { context, size in
      let nodes = (configuration.hierarchy ?? []).flatMap {
        $0.children?.isEmpty == false ? ($0.children ?? []) : [$0]
      }
      let total = max(nodes.reduce(0) { $0 + $1.total }, 1)
      var x: CGFloat = 0
      for (index, node) in nodes.enumerated() {
        let width = size.width * CGFloat(node.total / total)
        let rect = CGRect(x: x + 1, y: 1, width: max(0, width - 2), height: size.height - 2)
        context.fill(
          RoundedRectangle(cornerRadius: 5).path(in: rect),
          with: .color(
            node.color.map(Color.init(hex:))
              ?? configuration.palette[index % configuration.palette.count]
          )
        )
        x += width
      }
    }
    .accessibilityLabel(configuration.accessibilityLabel ?? "Treemap chart")
  }
}

private struct ZyplotSunburst: View {
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

private struct ZyplotSankey: View {
  let configuration: ZyplotConfiguration

  var body: some View {
    Canvas { context, size in
      let nodes = configuration.nodes ?? []
      let links = configuration.links ?? []
      let sourceIDs = Set(links.map(\.source))
      let left = nodes.filter { sourceIDs.contains($0.id) }
      let right = nodes.filter { !sourceIDs.contains($0.id) }
      let nodeHeight: CGFloat = 18

      func yPosition(_ id: String, in group: [ZyplotFlowNode]) -> CGFloat {
        let index = group.firstIndex { $0.id == id } ?? 0
        return (CGFloat(index) + 1) * size.height / CGFloat(group.count + 1)
      }

      for link in links {
        let start = CGPoint(x: 18, y: yPosition(link.source, in: left))
        let end = CGPoint(x: size.width - 18, y: yPosition(link.target, in: right))
        var path = Path()
        path.move(to: start)
        path.addCurve(
          to: end,
          control1: CGPoint(x: size.width * 0.42, y: start.y),
          control2: CGPoint(x: size.width * 0.58, y: end.y)
        )
        context.stroke(
          path,
          with: .color(configuration.palette[0].opacity(0.24)),
          lineWidth: max(2, link.value.squareRoot())
        )
      }

      for (index, node) in left.enumerated() {
        let y = yPosition(node.id, in: left)
        context.fill(
          Path(CGRect(x: 8, y: y - nodeHeight / 2, width: 12, height: nodeHeight)),
          with: .color(configuration.palette[index % configuration.palette.count])
        )
      }
      for (index, node) in right.enumerated() {
        let y = yPosition(node.id, in: right)
        context.fill(
          Path(CGRect(x: size.width - 20, y: y - nodeHeight / 2, width: 12, height: nodeHeight)),
          with: .color(configuration.palette[(index + left.count) % configuration.palette.count])
        )
      }
    }
    .accessibilityLabel(configuration.accessibilityLabel ?? "Sankey chart")
  }
}

private extension Collection {
  subscript(safe index: Index) -> Element? {
    indices.contains(index) ? self[index] : nil
  }
}
