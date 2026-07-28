import SwiftUI

struct ZyplotNativeChart: View {
  let configuration: ZyplotConfiguration
  var onInteraction: ([String: Any?]) -> Void = { _ in }

  var body: some View {
    chart
      .zyplotSurface(configuration.surface)
      // `system` leaves the environment untouched so the chart keeps following
      // the device; only an explicit light/dark pin overrides it.
      .environment(\.colorScheme, configuration.preferredColorScheme ?? colorScheme)
  }

  @Environment(\.colorScheme) private var colorScheme

  @ViewBuilder
  private var chart: some View {
    if configuration.isLoading == true {
      ZyplotLoadingChart()
    } else if configuration.type == "candlestick" {
      ZyplotCandlestickChart(
        configuration: configuration,
        onInteraction: onInteraction
      )
    } else {
      switch configuration.type {
      case "gauge", "meter", "radar", "funnel", "sankey", "sunburst", "treemap":
        ZyplotSpecializedChart(configuration: configuration)
      default:
        ZyplotMarksChart(
          configuration: configuration,
          onInteraction: onInteraction
        )
      }
    }
  }
}
