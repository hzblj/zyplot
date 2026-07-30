import SwiftUI

struct ZyplotTreemap: View {
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
