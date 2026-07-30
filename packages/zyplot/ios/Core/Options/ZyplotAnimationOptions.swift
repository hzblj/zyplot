import Foundation

struct ZyplotRevealAnimation: Codable {
  var duration: Double?
  var easing: String?
  var flashColor: String?
  var flashDuration: Double?
  var flashEasing: String?
  var flashGlow: Double?
  var flashHold: Double?
  var flashOpacity: Double?
  var startOpacity: Double?
  var style: String?
  var trackColor: String?
  var trackOpacity: Double?
  var isDrawn: Bool { style == "draw" }
  var isFaded: Bool { style == "fade" }
  var isEnabled: Bool { isDrawn || isFaded }
  var seconds: Double { (duration ?? 700) / 1_000 }
  var flashSeconds: Double { (flashDuration ?? 900) / 1_000 }
  var holdSeconds: Double { (flashHold ?? 0) / 1_000 }
  var resolvedFlashGlow: Double { flashGlow ?? 4 }
  func flashOpacity(resting: Double) -> Double {
    flashOpacity ?? min(0.85, resting * resolvedFlashGlow)
  }
  var resolvedStartOpacity: Double { startOpacity ?? 0.5 }
  var resolvedTrackOpacity: Double { trackOpacity ?? 0.35 }
  var resolvedEasing: ZyplotEasing {
    ZyplotEasing.named(easing, or: isDrawn ? .linear : .easeOut)
  }
  var resolvedFlashEasing: ZyplotEasing {
    ZyplotEasing.named(flashEasing, or: .easeOut)
  }
}

struct ZyplotAnimationOptions: Codable {
  var delay: Double?
  var duration: Double?
  var easing: String?
  var enabled: Bool?
  var initial: Bool?
  var reveal: ZyplotRevealAnimation?
  var transition: String?
  var updates: Bool?
  var transitionSeconds: Double { Swift.max(0.001, (duration ?? 320) / 1_000) }

  var transitionEasing: ZyplotEasing {
    ZyplotEasing.named(easing, or: .easeInOut)
  }
}
