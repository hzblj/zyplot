import SwiftUI

struct ZyplotSkeletonCurve: Shape {
  func path(in rect: CGRect) -> Path {
    let samples = 48
    var path = Path()
    for sample in 0...samples {
      let progress = Double(sample) / Double(samples)
      let wave = sin(progress * .pi * 2.2) * 0.3 + sin(progress * .pi * 4.6) * 0.12
      let point = CGPoint(
        x: rect.minX + rect.width * progress,
        y: rect.midY - rect.height * 0.5 * wave
      )
      if sample == 0 {
        path.move(to: point)
      } else {
        path.addLine(to: point)
      }
    }
    return path
  }
}
