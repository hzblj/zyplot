import SwiftUI

struct ZyplotSpecializedChart: View {
  let configuration: ZyplotConfiguration

  @ViewBuilder
  var body: some View {
    switch configuration.type {
    case "gauge", "meter":
      ZyplotGauge(configuration: configuration)
    case "radar":
      ZyplotRadar(configuration: configuration)
    case "funnel":
      ZyplotFunnel(configuration: configuration)
    case "sankey":
      ZyplotSankey(configuration: configuration)
    case "sunburst":
      ZyplotSunburst(configuration: configuration)
    case "treemap":
      ZyplotTreemap(configuration: configuration)
    default:
      EmptyView()
    }
  }
}
