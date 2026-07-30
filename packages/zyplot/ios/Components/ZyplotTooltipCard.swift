import SwiftUI

struct ZyplotTooltipCard<Content: View>: View {
  /// `theme.colors.surface` when the chart names one. Without it the card keeps the
  /// system material, which is the honest default: it stays legible over any plot.
  var fill: Color?
  @ViewBuilder let content: Content

  var body: some View {
    content
      .padding(.horizontal, 12)
      .padding(.vertical, 9)
      .background(background, in: RoundedRectangle(cornerRadius: 12))
  }

  private var background: AnyShapeStyle {
    fill.map { AnyShapeStyle($0) } ?? AnyShapeStyle(.regularMaterial)
  }
}
