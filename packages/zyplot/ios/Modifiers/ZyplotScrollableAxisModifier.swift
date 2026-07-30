import Charts
import SwiftUI

struct ZyplotChartScrollableAxisModifier: ViewModifier {
  let configuration: ZyplotConfiguration

  @ViewBuilder
  func body(content: Content) -> some View {
    if let length = configuration.xAxis?.visibleDomain {
      content
        .chartScrollableAxes(.horizontal)
        .chartXVisibleDomain(length: length)
    } else {
      content
    }
  }
}
