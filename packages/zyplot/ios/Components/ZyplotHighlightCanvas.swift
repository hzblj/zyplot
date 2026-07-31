import Charts
import SwiftUI

struct ZyplotHighlightCanvas: View {
  let context: ZyplotMarkContext
  let proxy: ChartProxy

  var body: some View {
    GeometryReader { geometry in
      Canvas { graphics, _ in
        guard let marker = context.configuration.interaction?.marker,
              marker.lightsStroke,
              let category = context.selection,
              let series = context.configuration.resolvedSeries.first,
              let centre = context.configuration.resolvedCategories.firstIndex(of: category),
              let frame = proxy.plotFrame.map({ geometry[$0] })
        else {
          return
        }
        let reach = max(1, marker.resolvedSpan - 1)
        let lit = marker.isTrail ? 0...centre : (centre - reach)...(centre + reach)
        let curve = ZyplotChartCurve(
          series: series,
          context: context,
          proxy: proxy,
          frame: frame,
          indices: lit
        )
        guard let path = curve.path else { return }
        let base = context.seriesColor(series, index: 0)
        let lighting = marker.color.map(Color.init(hex:)) ?? .white
        graphics.stroke(
          path,
          with: .color(base.blended(with: lighting, amount: context.litStrength)),
          style: StrokeStyle(
            lineWidth: context.strokeWidth(series.id),
            lineCap: .round,
            lineJoin: .round
          )
        )
      }
    }
    .allowsHitTesting(false)
  }
}
