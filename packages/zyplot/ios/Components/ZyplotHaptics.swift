import SwiftUI

final class ZyplotHaptics {
  private let generator = UIImpactFeedbackGenerator(style: .light)

  func tick() {
    generator.impactOccurred(intensity: 0.55)
    generator.prepare()
  }
}
