import Charts
import SwiftUI

struct ZyplotAxisTitleModifier: ViewModifier {
  let configuration: ZyplotConfiguration

  @ViewBuilder
  func body(content: Content) -> some View {
    let x = configuration.resolvedXAxisLabel
    let y = configuration.resolvedYAxisLabel
    if !x.isEmpty, !y.isEmpty {
      content.chartXAxisLabel(x).chartYAxisLabel(y)
    } else if !x.isEmpty {
      content.chartXAxisLabel(x)
    } else if !y.isEmpty {
      content.chartYAxisLabel(y)
    } else {
      content
    }
  }
}
