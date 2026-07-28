import SwiftUI

struct ZyplotLoadingChart: View {
  var body: some View {
    RoundedRectangle(cornerRadius: 12)
      .fill(Color.secondary.opacity(0.08))
      .overlay {
        ProgressView()
      }
      .accessibilityLabel("Loading chart")
  }
}
