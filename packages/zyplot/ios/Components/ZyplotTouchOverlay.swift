import SwiftUI
import UIKit

/**
 A transparent layer that reports every finger on it.

 SwiftUI's `DragGesture` reports one location however many fingers are down, and the
 multi-touch gesture that would report more (`SpatialEventGesture`) is iOS 18. Reading a
 span needs both fingers from the first frame, so this drops to UIKit's own touch
 delivery — where they have always all been available.
 */
struct ZyplotTouchOverlay: UIViewRepresentable {
  /// Every finger still down, in this layer's own coordinate space.
  let onTouches: ([CGPoint]) -> Void
  let onEnded: () -> Void

  func makeUIView(context: Context) -> ZyplotTouchView {
    let view = ZyplotTouchView()
    view.backgroundColor = .clear
    view.isMultipleTouchEnabled = true
    view.onTouches = onTouches
    view.onEnded = onEnded
    return view
  }

  func updateUIView(_ view: ZyplotTouchView, context: Context) {
    view.onTouches = onTouches
    view.onEnded = onEnded
  }
}

final class ZyplotTouchView: UIView {
  var onTouches: ([CGPoint]) -> Void = { _ in }
  var onEnded: () -> Void = {}

  override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent?) {
    report(touches, event)
  }

  override func touchesMoved(_ touches: Set<UITouch>, with event: UIEvent?) {
    report(touches, event)
  }

  override func touchesEnded(_ touches: Set<UITouch>, with event: UIEvent?) {
    report(touches, event)
  }

  override func touchesCancelled(_ touches: Set<UITouch>, with event: UIEvent?) {
    report(touches, event)
  }

  /**
   One report per event, from every finger the event knows about rather than only the ones
   that changed — lifting the second finger of two is a reading that carries on with one, not
   a reading that has ended.
   */
  private func report(_ touches: Set<UITouch>, _ event: UIEvent?) {
    let all = event?.allTouches ?? touches
    let live = all.filter { $0.phase != .ended && $0.phase != .cancelled }
    guard !live.isEmpty else {
      onEnded()
      return
    }
    onTouches(live.map { $0.location(in: self) }.sorted { $0.x < $1.x })
  }
}
