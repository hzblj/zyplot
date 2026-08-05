import SwiftUI
import UIKit

struct ZyplotCrosshair: View {
  let style: ZyplotCrosshairStyle?
  let height: Double
  var label: String?
  /// The theme's own label colour. The chart's label is not styled field by field: a label that
  /// has to be anything else is a view the app hands over as `tooltipView`.
  var labelColor: Color?
  var x: Double = 0
  var viewWidth: Double = 0
  private var width: Double { style?.width ?? 1 }
  private var lineCentre: Double { x + width / 2 }

  private static let labelSize: Double = 13
  private static let lift: Double = 8

  private var font: UIFont {
    UIFont.monospacedDigitSystemFont(ofSize: Self.labelSize, weight: .medium)
  }

  var body: some View {
    rule
      .overlay(alignment: .top) {
        if let label {
          Text(label)
            .font(.system(size: Self.labelSize, weight: .medium))
            .monospacedDigit()
            .foregroundStyle(labelColor ?? Color.secondary)
            .lineLimit(1)
            .fixedSize()
            .offset(x: labelShift(of: label), y: -Self.labelSize - Self.lift)
        }
      }
  }

  private func labelShift(of label: String) -> Double {
    guard viewWidth > 0 else { return 0 }
    let measured = measuredWidth(of: label)
    let centred = lineCentre - measured / 2
    let pinned = min(max(0, centred), max(0, viewWidth - measured))
    return pinned - centred
  }

  private func measuredWidth(of label: String) -> Double {
    (label as NSString).size(withAttributes: [.font: font]).width
  }

  private var rule: some View {
    Rectangle()
      .fill(style?.color.map(Color.init(hex:)) ?? Color.secondary.opacity(0.32))
      .frame(width: width, height: height)
      .mask {
        if let dash = style?.dash, !dash.isEmpty {
          ZyplotDashedRule()
            .stroke(
              style: StrokeStyle(lineWidth: width, dash: dash.map { CGFloat($0) })
            )
        } else {
          Rectangle()
        }
      }
  }
}
