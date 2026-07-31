import Charts
import SwiftUI

/**
 The area under a curve: a wash that fades down the plot, or the grid of dots a patterned fill
 asks for. Held apart from the canvas that draws the trace because a stretch of a trace is filled
 the same way the whole of it is — the span under two fingers takes this as well.
 */
enum ZyplotCurveFill {
  static func paint(
    _ curve: ZyplotChartCurve,
    style: ZyplotSeriesStyle?,
    base: Color,
    strength: Double,
    to floor: CGFloat,
    in frame: CGRect,
    with graphics: GraphicsContext
  ) {
    guard let shape = curve.filled(to: floor) else { return }

    guard let fill = style?.fill, fill.isDotted else {
      graphics.fill(shape, with: wash(style?.fill, base: base, strength: strength, over: frame))
      return
    }

    graphics.drawLayer { layer in
      layer.clip(to: shape)
      paintDots(over: frame, fill: fill, base: base, strength: strength, into: layer)
    }
  }

  /// Where the area closes: the fill's own baseline when it names one, the plot's floor otherwise.
  static func floor(
    _ style: ZyplotSeriesStyle?,
    proxy: ChartProxy,
    in frame: CGRect
  ) -> CGFloat {
    style?.fill?.baseline
      .flatMap { proxy.position(forY: $0) }
      .map { frame.minY + $0 } ?? frame.maxY
  }

  private static func wash(
    _ fill: ZyplotSeriesFill?,
    base: Color,
    strength: Double,
    over rect: CGRect
  ) -> GraphicsContext.Shading {
    let fadeTo = fill?.resolvedFadeTo ?? 1
    guard fadeTo < 1, rect.height > 0, rect.minX.isFinite, rect.minY.isFinite, rect.maxY.isFinite else {
      return .color(base.opacity(strength))
    }

    return .linearGradient(
      Gradient(colors: [base.opacity(strength), base.opacity(strength * fadeTo)]),
      startPoint: CGPoint(x: rect.minX, y: rect.minY),
      endPoint: CGPoint(x: rect.minX, y: rect.maxY)
    )
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
