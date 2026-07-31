import Charts
import SwiftUI

struct ZyplotLineCanvas: View {
  let context: ZyplotMarkContext
  let proxy: ChartProxy

  var body: some View {
    GeometryReader { geometry in
      Canvas { graphics, _ in
        guard let frame = proxy.plotFrame.map({ geometry[$0] }) else { return }
        for (index, series) in context.configuration.resolvedSeries.enumerated() {
          draw(series, at: index, in: frame, with: graphics)
        }
      }
    }
    .allowsHitTesting(false)
  }

  private func draw(
    _ series: ZyplotSeries,
    at index: Int,
    in frame: CGRect,
    with graphics: GraphicsContext
  ) {
    let curve = ZyplotChartCurve(
      series: series,
      context: context,
      proxy: proxy,
      frame: frame
    )
    guard let path = curve.path else { return }
    let configuration = context.configuration
    let style = configuration.seriesStyle(for: series.id)
    let base = context.seriesColor(series, index: index)
    let emphasis = configuration.dimming(for: series.id)
    let dim = emphasis * context.scrubDimming
    let width = context.strokeWidth(series.id)
    let entrance = configuration.animation?.reveal

    if configuration.type == "area" || style?.fill != nil {
      ZyplotCurveFill.paint(
        curve,
        style: style,
        base: base,
        strength: (style?.fillOpacity ?? 0.16) * emphasis * context.rangeDimming,
        to: ZyplotCurveFill.floor(style, proxy: proxy, in: frame),
        in: frame,
        with: graphics
      )
    }

    if configuration.isTracing == true, let track = entrance?.trackColor {
      graphics.stroke(
        path,
        with: .color(Color(hex: track).opacity(entrance?.resolvedTrackOpacity ?? 0.35)),
        style: StrokeStyle(lineWidth: width, lineCap: .round, lineJoin: .round)
      )
    }

    for pass in context.glowPasses(for: series.id, base: base) {
      graphics.stroke(
        path,
        with: .color(pass.color.opacity(dim)),
        style: StrokeStyle(
          lineWidth: width + pass.spread * 2,
          lineCap: .round,
          lineJoin: .round
        )
      )
    }

    let opacity = (style?.opacity ?? 1) * dim * context.reveal.strokeOpacity
    graphics.stroke(
      path,
      with: .color(context.flashed(base).opacity(opacity)),
      style: StrokeStyle(
        lineWidth: width,
        lineCap: .round,
        lineJoin: .round,
        dash: style?.strokeDash?.map { CGFloat($0) } ?? []
      )
    )
  }

}
