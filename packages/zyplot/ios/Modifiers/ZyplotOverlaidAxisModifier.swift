import Charts
import SwiftUI

struct ZyplotOverlaidAxisModifier: ViewModifier {
  let configuration: ZyplotConfiguration

  @ViewBuilder
  func body(content: Content) -> some View {
    if configuration.overlaysYAxis, configuration.resolvedYAxisVisible {
      let gutter = configuration.overlayAxisGutter
      let inset = configuration.yAxis?.labelInset ?? 2
      let size = configuration.yAxis?.labelSize ?? 11
      content.chartOverlay { proxy in
        GeometryReader { geometry in
          if let frame = proxy.plotFrame.map({ geometry[$0] }) {
            ForEach(configuration.overlayLabelValues, id: \.self) { value in
              if let y = proxy.position(forY: value) {
                Text(
                  (configuration.resolvedYAxisFormat ?? ZyplotNumberFormat())
                    .string(from: value)
                )
                .font(configuration.font(size: size))
                .foregroundStyle(
                  Color(hex: configuration.theme?.colors?.label ?? "#8e8e93")
                )
                .fixedSize()
                .frame(width: gutter - 5, alignment: .trailing)
                .position(
                  x: frame.maxX - (gutter - 5) / 2 - inset,
                  y: min(
                    max(frame.minY + y, frame.minY + size),
                    frame.maxY - size
                  )
                )
              }
            }
          }
        }
        .allowsHitTesting(false)
      }
    } else {
      content
    }
  }
}
