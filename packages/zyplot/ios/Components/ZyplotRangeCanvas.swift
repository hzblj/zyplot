import Charts
import SwiftUI

/**
 The stretch of trace between two fingers, drawn whole over a plot that has stepped back around it.
 One trace lies over the other rather than the outside being cut out of it, which is the only way a
 curve can be painted in two colours and still be one line.

 The stretch takes the span's own direction rather than the period's, so a fortnight down inside a
 year up reads as the fortnight.
 */
struct ZyplotRangeCanvas: View {
  let context: ZyplotMarkContext
  let proxy: ChartProxy

  var body: some View {
    GeometryReader { geometry in
      Canvas { graphics, _ in
        guard let range = context.range,
              context.configuration.interaction?.rangeStyle != nil,
              let series = context.configuration.resolvedSeries.first,
              let frame = proxy.plotFrame.map({ geometry[$0] })
        else {
          return
        }
        let curve = ZyplotChartCurve(
          series: series,
          context: context,
          proxy: proxy,
          frame: frame,
          indices: range
        )
        guard let path = curve.path else { return }
        let seriesStyle = context.configuration.seriesStyle(for: series.id)
        let tint = tint(series, over: range)

        if context.configuration.type == "area" || seriesStyle?.fill != nil {
          ZyplotCurveFill.paint(
            curve,
            style: seriesStyle,
            base: tint,
            strength: seriesStyle?.fillOpacity ?? 0.16,
            to: ZyplotCurveFill.floor(seriesStyle, proxy: proxy, in: frame),
            in: frame,
            with: graphics
          )
        }

        graphics.stroke(
          path,
          with: .color(tint),
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

  private func tint(_ series: ZyplotSeries, over range: ClosedRange<Int>) -> Color {
    guard let hex = context.configuration.rangeTint(from: range.lowerBound, to: range.upperBound) else {
      return context.seriesColor(series, index: 0)
    }
    return Color(hex: hex)
  }
}
