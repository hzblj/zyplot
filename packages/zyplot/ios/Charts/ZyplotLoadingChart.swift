import SwiftUI

struct ZyplotLoadingChart: View {
  var configuration: ZyplotConfiguration = .empty

  @State private var sweep: Double = -1

  private var track: Color {
    Color(hex: configuration.theme?.colors?.track ?? "#71717a").opacity(0.16)
  }

  var body: some View {
    GeometryReader { geometry in
      ZStack {
        shape(in: geometry.size)
          .foregroundStyle(track)
      }
      .frame(width: geometry.size.width, height: geometry.size.height)
      .overlay {
        LinearGradient(
          colors: [.clear, Color.primary.opacity(0.08), .clear],
          startPoint: .leading,
          endPoint: .trailing
        )
        .frame(width: geometry.size.width * 0.5)
        .offset(x: sweep * geometry.size.width)
      }
      .clipped()
    }
    .accessibilityLabel("Loading chart")
    .onAppear {
      withAnimation(.linear(duration: 1.2).repeatForever(autoreverses: false)) {
        sweep = 1.5
      }
    }
  }

  @ViewBuilder
  private func shape(in size: CGSize) -> some View {
    switch configuration.type {
    case "pie", "gauge", "meter", "radar", "sunburst":
      Circle()
        .strokeBorder(lineWidth: min(size.width, size.height) * 0.22)
        .frame(
          width: min(size.width, size.height) * 0.72,
          height: min(size.width, size.height) * 0.72
        )
    case "bar", "stacked-bar", "histogram", "diverging-bar", "waterfall",
         "candlestick", "boxplot":
      columns(in: size)
    default:
      ZyplotSkeletonCurve()
        .stroke(style: StrokeStyle(lineWidth: 3, lineCap: .round, lineJoin: .round))
        .frame(height: size.height * 0.55)
    }
  }

  private func columns(in size: CGSize) -> some View {
    let ratios: [Double] = [0.45, 0.7, 0.55, 0.85, 0.6, 0.95, 0.5, 0.75]
    return HStack(alignment: .bottom, spacing: size.width * 0.02) {
      ForEach(Array(ratios.enumerated()), id: \.offset) { _, ratio in
        RoundedRectangle(cornerRadius: 3)
          .frame(height: size.height * 0.7 * ratio)
      }
    }
  }
}
