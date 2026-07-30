import SwiftUI

struct ZyplotGlowPass {
  let color: Color
  let spread: Double
}

private let glowPassCount = 16
private let glowPassWeights = (1...glowPassCount).map { 1 / Double($0) }
private let glowPassWeightTotal = glowPassWeights.reduce(0, +)

extension ZyplotMarkContext {
  func glowPasses(for id: String, base: Color) -> [ZyplotGlowPass] {
    guard let glow = resolvedGlow(configuration.seriesStyle(for: id), base: base)
    else {
      return []
    }
    let scale = min(0.99, glow.opacity) / glowPassWeightTotal
    return (1...glowPassCount).reversed().map { pass in
      ZyplotGlowPass(
        color: glow.color.opacity(scale * glowPassWeights[pass - 1]),
        spread: glow.radius * Double(pass) / Double(glowPassCount)
      )
    }
  }

  func resolvedGlow(
    _ style: ZyplotSeriesStyle?,
    base: Color
  ) -> (color: Color, opacity: Double, radius: Double)? {
    let bloom = reveal.bloom
    let flashGlow = configuration.animation?.reveal?.resolvedFlashGlow ?? 4
    guard let glow = style?.glow else {
      guard bloom > 0, configuration.animation?.reveal?.flashColor != nil else {
        return nil
      }
      return (base, 0.8 * bloom, 4 * flashGlow * bloom)
    }
    let resting = glow.resolvedOpacity
    let peak = configuration.animation?.reveal?.flashOpacity(resting: resting) ?? resting
    return (
      glow.color.map(Color.init(hex:)) ?? base,
      resting + (peak - resting) * bloom,
      glow.resolvedRadius * (1 + (flashGlow - 1) * bloom)
    )
  }
}
