import SwiftUI

struct ZyplotTooltipCard<Content: View>: View {
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
