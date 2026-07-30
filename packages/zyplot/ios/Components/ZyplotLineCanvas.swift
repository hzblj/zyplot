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
      fill(curve, style: style, base: base, dim: emphasis, in: frame, with: graphics)
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

  private func fill(
    _ curve: ZyplotChartCurve,
    style: ZyplotSeriesStyle?,
    base: Color,
    dim: Double,
    in frame: CGRect,
    with graphics: GraphicsContext
  ) {
    let floor = style?.fill?.baseline
      .flatMap { proxy.position(forY: $0) }
      .map { frame.minY + $0 } ?? frame.maxY
    guard let shape = curve.filled(to: floor) else { return }
    let strength = (style?.fillOpacity ?? 0.16) * dim

    guard let fill = style?.fill, fill.isDotted else {
      graphics.fill(shape, with: .color(base.opacity(strength)))
      return
    }

    graphics.drawLayer { layer in
      layer.clip(to: shape)
      Self.paintDots(over: frame, fill: fill, base: base, strength: strength, into: layer)
    }
  }

  private static func paintDots(
    over rect: CGRect,
    fill: ZyplotSeriesFill,
    base: Color,
    strength: Double,
    into graphics: GraphicsContext
  ) {
    guard rect.width > 0, rect.height > 0,
          rect.minX.isFinite, rect.minY.isFinite, rect.maxX.isFinite, rect.maxY.isFinite
    else {
      return
    }
    let step = fill.resolvedSpacing
    let size = fill.resolvedDotSize
    let fadeTo = fill.resolvedFadeTo
    var y = (rect.minY / step).rounded(.down) * step

    while y <= rect.maxY {
      var row = Path()
      var x = (rect.minX / step).rounded(.down) * step
      while x <= rect.maxX {
        row.addEllipse(in: CGRect(x: x - size / 2, y: y - size / 2, width: size, height: size))
        x += step
      }
      let depth = ((y - rect.minY) / rect.height).clamped()
      graphics.fill(row, with: .color(base.opacity(strength * (1 + (fadeTo - 1) * depth))))
      y += step
    }
  }
}
