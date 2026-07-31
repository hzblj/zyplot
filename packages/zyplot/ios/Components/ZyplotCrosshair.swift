import SwiftUI
import UIKit

struct ZyplotCrosshair: View {
  let style: ZyplotCrosshairStyle?
  let height: Double
  var label: String?
  var x: Double = 0
  var viewWidth: Double = 0
  private var width: Double { style?.width ?? 1 }
  private var labelSize: Double { style?.labelSize ?? 13 }
  private var lift: Double { style?.labelLift ?? 8 }
  private var across: Double { style?.labelAcross ?? 0 }
  private var down: Double { style?.labelDown ?? 0 }
  private var lineCentre: Double { x + width / 2 }

  /// What the label occupies above the plot: the text alone, or the chip drawn around it.
  private var labelHeight: Double {
    style?.padsLabel == true ? font.lineHeight + down * 2 : labelSize
  }

  private var font: UIFont {
    UIFont.monospacedDigitSystemFont(ofSize: labelSize, weight: .medium)
  }

  var body: some View {
    rule
      .overlay(alignment: .top) {
        if let label {
          chip(label)
            .offset(x: labelShift(of: label), y: -labelHeight - lift)
        }
      }
  }

  @ViewBuilder
  private func chip(_ label: String) -> some View {
    let text = Text(label)
      .font(.system(size: labelSize, weight: .medium))
      .monospacedDigit()
      .foregroundStyle(style?.labelColor.map(Color.init(hex:)) ?? Color.secondary)
      .lineLimit(1)
      .fixedSize()

    if let background = style?.labelBackground {
      text
        .padding(.horizontal, across)
        .padding(.vertical, down)
        .background(
          RoundedRectangle(cornerRadius: style?.labelRadius ?? labelHeight / 2)
            .fill(Color(hex: background))
        )
    } else {
      text
    }
  }

  private func labelShift(of label: String) -> Double {
    guard viewWidth > 0 else { return 0 }
    let measured = measuredWidth(of: label) + across * 2
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
