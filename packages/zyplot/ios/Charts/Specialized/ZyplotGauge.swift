import SwiftUI

struct ZyplotGauge: View {
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
          .font(configuration.font(size: 30, weight: .semibold, design: .rounded))
          .monospacedDigit()
        if let label = configuration.label {
          Text(label)
            .font(configuration.font(.caption, size: 12))
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
