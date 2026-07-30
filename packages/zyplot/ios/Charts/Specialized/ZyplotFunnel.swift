import SwiftUI

struct ZyplotFunnel: View {
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
