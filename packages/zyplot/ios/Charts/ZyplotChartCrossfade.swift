import SwiftUI

struct ZyplotChartCrossfade<Content: View>: View {
  let configuration: ZyplotConfiguration
  @ViewBuilder let content: (ZyplotConfiguration) -> Content

  @State private var previous: ZyplotConfiguration?
  @State private var outgoing: ZyplotConfiguration?
  @State private var progress: Double = 1

  private var duration: Double {
    (configuration.animation?.duration ?? 320) / 1_000
  }

  var body: some View {
    if configuration.animation?.transition == "crossfade",
       configuration.animation?.enabled != false
    {
      ZStack {
        if let outgoing {
          content(outgoing.ghosted)
            .opacity(1 - progress)
            .allowsHitTesting(false)
        }
        content(configuration).opacity(progress)
      }
      .onChange(of: configuration.datasetKey) { _, _ in crossfade() }
      .onAppear { previous = configuration }
    } else {
      content(configuration)
    }
  }

  private func crossfade() {
    outgoing = previous
    previous = configuration
    progress = 0
    withAnimation(.easeInOut(duration: duration)) { progress = 1 }
    Task {
      try? await Task.sleep(nanoseconds: UInt64(duration * 1_000_000_000))
      outgoing = nil
    }
  }
}

extension ZyplotConfiguration {
  var ghosted: ZyplotConfiguration {
    var copy = self
    copy.axis = ZyplotAxes(x: false, y: false)
    copy.xAxis?.visible = false
    copy.yAxis?.visible = false
    copy.annotations = nil
    copy.interaction = nil
    return copy
  }

  var datasetKey: String {
    let categories = resolvedCategories
    return [
      type,
      String(categories.count),
      categories.first ?? "",
      categories.last ?? "",
      resolvedSeries.map(\.id).joined(separator: ","),
      String(format: "%.4f", valueDomain?.lowerBound ?? 0),
      String(format: "%.4f", valueDomain?.upperBound ?? 0),
    ].joined(separator: "|")
  }
}
