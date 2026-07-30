import Charts
import SwiftUI

struct ZyplotHighlightCanvas: View {
  let context: ZyplotMarkContext
  let proxy: ChartProxy

  var body: some View {
    GeometryReader { geometry in
      Canvas { graphics, _ in
        guard let marker = context.configuration.interaction?.marker,
              marker.isSegment,
              let category = context.selection,
              let series = context.configuration.resolvedSeries.first,
              let centre = context.configuration.resolvedCategories.firstIndex(of: category),
              let frame = proxy.plotFrame.map({ geometry[$0] })
        else {
          return
        }
        let reach = max(1, marker.resolvedSpan - 1)
        let curve = ZyplotChartCurve(
          series: series,
          context: context,
          proxy: proxy,
          frame: frame,
          indices: (centre - reach)...(centre + reach)
        )
        guard let path = curve.window(around: centre, reach: reach) else { return }
        graphics.stroke(
          path,
          with: .color(marker.color.map(Color.init(hex:)) ?? .white),
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
