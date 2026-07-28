import Charts
import SwiftUI

struct ZyplotChartInteractionModifier: ViewModifier {
  let configuration: ZyplotConfiguration
  let onInteraction: ([String: Any?]) -> Void

  @State private var selectedCategory: String?

  func body(content: Content) -> some View {
    content.chartOverlay { proxy in
      GeometryReader { geometry in
        let frame = proxy.plotFrame.map { geometry[$0] }
        ZStack(alignment: .topLeading) {
          if let category = selectedCategory,
             let x = proxy.position(forX: category),
             let frame
          {
            if configuration.interaction?.crosshair == "x"
              || configuration.interaction?.crosshair == "both"
            {
              Rectangle()
                .fill(Color.secondary.opacity(0.32))
                .frame(width: 1, height: frame.height)
                .offset(x: frame.minX + x, y: frame.minY)
            }

            if configuration.interaction?.tooltip != false,
               let tooltip = tooltipText(for: category)
            {
              Text(tooltip)
                .font(.caption.monospacedDigit())
                .padding(.horizontal, 9)
                .padding(.vertical, 6)
                .background(.regularMaterial, in: RoundedRectangle(cornerRadius: 8))
                .offset(
                  x: min(max(frame.minX, frame.minX + x - 44), frame.maxX - 100),
                  y: frame.minY + 6
                )
            }
          }

          Rectangle()
            .fill(.clear)
            .contentShape(Rectangle())
            .gesture(
              DragGesture(minimumDistance: 0)
                .onChanged { gesture in
                  updateSelection(
                    at: gesture.location,
                    proxy: proxy,
                    plotFrame: frame
                  )
                }
                .onEnded { _ in
                  if configuration.interaction?.selection == nil
                    || configuration.interaction?.selection == "none"
                  {
                    selectedCategory = nil
                  }
                }
            )
        }
      }
    }
  }

  private func updateSelection(
    at location: CGPoint,
    proxy: ChartProxy,
    plotFrame: CGRect?
  ) {
    guard configuration.interaction?.isEnabled == true,
          let plotFrame,
          plotFrame.contains(location)
    else {
      return
    }
    let plotX = location.x - plotFrame.minX
    guard let category: String = proxy.value(atX: plotX) else { return }
    selectedCategory = category

    let index = configuration.resolvedCategories.firstIndex(of: category)
    let series = configuration.resolvedSeries.first
    var selectedValue: Double?
    if let index {
      selectedValue = chartValue(in: series, at: index)
    }
    if selectedValue == nil, let index,
       let candles = configuration.candlesticks,
       candles.indices.contains(index)
    {
      selectedValue = candles[index].close
    }
    if selectedValue == nil, configuration.type == "boxplot" {
      // The median is the one number that stands for a box.
      selectedValue = configuration.groups?
        .first { $0.label == category }?
        .median
    }
    onInteraction([
      "category": category,
      "nativeX": location.x,
      "nativeY": location.y,
      "seriesId": series?.id,
      "value": selectedValue,
    ])
  }

  /// A boxplot has no single value to show, so it reports its whole five-number
  /// summary using the caller's own `labels`.
  private func tooltipText(for category: String) -> String? {
    if configuration.type == "boxplot" {
      guard let group = configuration.groups?.first(where: { $0.label == category })
      else {
        return nil
      }
      let labels = configuration.labels
      return """
      \(category)
      \(labels?.max ?? "Max") \(format(group.max))
      \(labels?.q3 ?? "Q3") \(format(group.q3))
      \(labels?.median ?? "Median") \(format(group.median))
      \(labels?.q1 ?? "Q1") \(format(group.q1))
      \(labels?.min ?? "Min") \(format(group.min))
      """
    }

    guard let value = selectedValue(for: category) else { return nil }
    return "\(category)  \(format(value))"
  }

  private func selectedValue(for category: String) -> Double? {
    guard let index = configuration.resolvedCategories.firstIndex(of: category)
    else {
      return nil
    }
    return chartValue(in: configuration.resolvedSeries.first, at: index)
      ?? candleValue(at: index)
  }

  private func chartValue(in series: ZyplotSeries?, at index: Int) -> Double? {
    guard let values = series?.values, values.indices.contains(index) else {
      return nil
    }
    return values[index]
  }

  private func candleValue(at index: Int) -> Double? {
    guard let candles = configuration.candlesticks,
          candles.indices.contains(index)
    else {
      return nil
    }
    return candles[index].close
  }

  private func format(_ value: Double) -> String {
    let decimals = configuration.format?.decimals ?? 0
    return "\(configuration.format?.prefix ?? "")\(String(format: "%.\(decimals)f", value))\(configuration.format?.suffix ?? "")"
  }
}
