import SwiftUI

private struct ZyplotPulseFrame {
  var opacity: Double
  var scale: Double
}

struct ZyplotAnnotationDot: View {
  let color: Color
  let glow: ZyplotGlow?
  let halo: ZyplotHalo?
  let pulse: ZyplotPulse?
  let size: Double

  private var glowColor: Color {
    glow?.color(inheriting: color) ?? .clear
  }

  private func ringColor(_ pulse: ZyplotPulse) -> Color {
    (pulse.color ?? glow?.color).map(Color.init(hex:)) ?? color
  }

  private var outerSize: Double {
    max(size, halo?.resolvedSize ?? 0)
  }

  private var pulses: ZyplotPulse? {
    pulse?.isEnabled == true ? pulse : nil
  }

  var body: some View {
    ZStack {
      if let pulses {
        KeyframeAnimator(
          initialValue: ZyplotPulseFrame(opacity: pulses.resolvedOpacity, scale: 1),
          repeating: true
        ) { frame in
          Circle()
            .fill(ringColor(pulses))
            .frame(width: outerSize, height: outerSize)
            .scaleEffect(frame.scale)
            .opacity(frame.opacity)
        } keyframes: { _ in
          KeyframeTrack(\.scale) {
            CubicKeyframe(pulses.resolvedScale, duration: pulses.bloomSeconds)
            MoveKeyframe(1)
            LinearKeyframe(1, duration: pulses.restSeconds)
          }
          KeyframeTrack(\.opacity) {
            LinearKeyframe(pulses.resolvedOpacity, duration: pulses.bloomSeconds * 0.55)
            LinearKeyframe(0, duration: pulses.bloomSeconds * 0.45)
            LinearKeyframe(0, duration: pulses.restSeconds)
          }
        }
      }
      if let halo {
        Circle()
          .fill(halo.color(inheriting: color))
          .frame(width: halo.resolvedSize, height: halo.resolvedSize)
          .shadow(color: glowColor, radius: glow?.resolvedRadius ?? 0)
          .shadow(color: glowColor, radius: (glow?.resolvedRadius ?? 0) * 0.45)
      }
      Circle()
        .fill(color)
        .frame(width: size, height: size)
        .shadow(
          color: halo == nil ? glowColor : .clear,
          radius: glow?.resolvedRadius ?? 0
        )
        .shadow(
          color: halo == nil ? glowColor : .clear,
          radius: (glow?.resolvedRadius ?? 0) * 0.45
        )
    }
    .frame(width: outerSize, height: outerSize)
  }
}
