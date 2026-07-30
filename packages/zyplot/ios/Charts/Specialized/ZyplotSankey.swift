import SwiftUI

struct ZyplotSankey: View {
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
