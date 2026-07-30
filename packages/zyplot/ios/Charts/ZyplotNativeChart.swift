import SwiftUI

struct ZyplotNativeChart: View {
  let configuration: ZyplotConfiguration
  var onInteraction: ([String: Any?]) -> Void = { _ in }

  var body: some View {
    content
      .zyplotSurface(configuration.surface)
      .environment(\.colorScheme, configuration.preferredColorScheme ?? colorScheme)
  }

  @Environment(\.colorScheme) private var colorScheme

  @ViewBuilder
  private var content: some View {
    if configuration.isLoading == true {
      ZyplotLoadingChart(configuration: configuration)
    } else {
      ZyplotChartCrossfade(configuration: configuration) { faded in
        ZyplotChartMorph(configuration: faded) { current in
          ZyplotChartReveal(configuration: current) { revealed, reveal in
            chart(revealed, reveal: reveal)
          }
        }
      }
    }
  }

  @ViewBuilder
  private func chart(
    _ configuration: ZyplotConfiguration,
    reveal: ZyplotRevealState
  ) -> some View {
    if configuration.type == "candlestick" {
      ZyplotCandlestickChart(
        configuration: configuration,
        reveal: reveal,
        onInteraction: onInteraction
      )
    } else {
      switch configuration.type {
      case "gauge", "meter", "radar", "funnel", "sankey", "sunburst", "treemap":
        ZyplotSpecializedChart(configuration: configuration)
      default:
        ZyplotMarksChart(
          configuration: configuration,
          reveal: reveal,
          onInteraction: onInteraction
        )
      }
    }
  }
}
