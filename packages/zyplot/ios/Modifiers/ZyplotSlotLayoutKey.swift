import SwiftUI

/**
 Where the nodes the app supplied belong, in the chart's own coordinates.

 Deliberately not the same channel as `ZyplotGeometryKey`: that one is a layout report and goes
 out to JavaScript, and a reading moves many times a mark. This one never leaves the process.
 */
/// Where the app's own node for the reading goes, and how far off. `nil` fields take the defaults
/// the two placements were tuned against: the tooltip's gap, and the rule's own chip lift.
struct ZyplotTooltipAnchor: Codable {
  var align: String?
  var gap: Double?
  var lift: Double?
  var placement: String?

  var isAbove: Bool { placement == "above" }
  var resolvedGap: CGFloat { CGFloat(gap ?? 12) }
  var resolvedLift: CGFloat { CGFloat(lift ?? 8) }
}

/**
 Where one annotation's own view belongs.

 A rule is not a point: its spot is where it starts, not where its middle is, so a view for one is
 laid along its run and centred only across it. Centring a rule's view on its spot would hang half
 of it outside the plot, which is what a point's view wants and a rule's never does.
 */
struct ZyplotSlotSpot: Equatable {
  enum Run: Equatable {
    case across
    case down
    case point
  }

  let at: CGPoint
  let run: Run
}

/// Where the span under two fingers reaches, in the chart's own coordinates.
struct ZyplotSlotSpan: Equatable {
  let end: CGFloat
  let start: CGFloat

  var centre: CGFloat { (start + end) / 2 }
}

struct ZyplotSlotLayout: Equatable {
  static let annotationPrefix = "annotation:"
  static let rangeSlot = "range"
  static let tooltipSlot = "tooltip"

  /// Keyed as the app's slots are, so the view that places them needs no translation.
  let annotations: [String: ZyplotSlotSpot]
  let plot: CGRect
  /// The crosshair's x and the top of the plot, or `nil` when nothing is being read.
  let reading: CGPoint?
  /// Set only while two fingers are down, and never together with `reading`.
  let span: ZyplotSlotSpan?

  static func annotationSlot(_ id: String) -> String {
    "\(annotationPrefix)\(id)"
  }

  /// The annotation a slot belongs to, or `nil` for the reading's own slots.
  static func annotationId(of slot: String) -> String? {
    slot.hasPrefix(annotationPrefix) ? String(slot.dropFirst(annotationPrefix.count)) : nil
  }
}

struct ZyplotSlotLayoutKey: PreferenceKey {
  static let defaultValue: ZyplotSlotLayout? = nil

  static func reduce(
    value: inout ZyplotSlotLayout?,
    nextValue: () -> ZyplotSlotLayout?
  ) {
    value = nextValue() ?? value
  }
}
