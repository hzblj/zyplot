import Charts
import SwiftUI

struct ZyplotCandlestickChart: View {
  let configuration: ZyplotConfiguration
  var onInteraction: ([String: Any?]) -> Void = { _ in }

  private var candles: [ZyplotCandlestickDatum] {
    configuration.candlesticks ?? []
  }

  var body: some View {
    GeometryReader { geometry in
      let volumeRatio = min(
        max(configuration.style?.volumeHeightRatio ?? 0.2, 0.12),
        0.35
      )
      let volumeHeight = configuration.showVolume == true
        ? geometry.size.height * volumeRatio
        : 0

      VStack(spacing: 6) {
        priceChart
          .frame(height: geometry.size.height - volumeHeight - 6)

        if configuration.showVolume == true {
          volumeChart
            .frame(height: volumeHeight)
        }
      }
    }
    .accessibilityLabel(configuration.accessibilityLabel ?? "Candlestick chart")
  }

  private var priceChart: some View {
    Charts.Chart {
      ForEach(candles) { item in
        let isPositive = item.close >= item.open
        let color = candleColor(item)
        RuleMark(
          x: .value("Category", item.category),
          yStart: .value("Low", item.low),
          yEnd: .value("High", item.high)
        )
        .foregroundStyle(color)
        .lineStyle(StrokeStyle(lineWidth: configuration.style?.wickWidth ?? 1.5))

        RectangleMark(
          x: .value("Category", item.category),
          yStart: .value("Open", item.open),
          yEnd: .value("Close", item.close),
          width: .ratio(configuration.style?.candleWidth ?? 0.52)
        )
        .foregroundStyle(
          isPositive && configuration.style?.hollowUp == true
            ? color.opacity(0.14)
            : color
        )
      }
      ZyplotAnnotationMarks(annotations: configuration.annotations ?? [])
    }
    .chartLegend(.hidden)
    .modifier(ZyplotChartAxisModifier(configuration: configuration))
    .modifier(ZyplotChartPresentationModifier(configuration: configuration))
    .modifier(
      ZyplotChartInteractionModifier(
        configuration: configuration,
        onInteraction: onInteraction
      )
    )
  }

  private var volumeChart: some View {
    Charts.Chart(candles) { item in
      if let volume = item.volume {
        BarMark(
          x: .value("Category", item.category),
          y: .value("Volume", volume),
          width: .ratio(configuration.style?.candleWidth ?? 0.52)
        )
        .foregroundStyle(volumeColor(item).opacity(0.48))
      }
    }
    .chartXAxis(.hidden)
    .chartYAxis(.hidden)
  }

  private func candleColor(_ item: ZyplotCandlestickDatum) -> Color {
    if item.close > item.open {
      return Color(hex: configuration.style?.upColor
        ?? configuration.theme?.colors?.positive ?? "#16a34a")
    }
    if item.close < item.open {
      return Color(hex: configuration.style?.downColor
        ?? configuration.theme?.colors?.negative ?? "#dc2626")
    }
    return Color(hex: configuration.style?.neutralColor ?? "#71717a")
  }

  private func volumeColor(_ item: ZyplotCandlestickDatum) -> Color {
    if item.close >= item.open {
      return Color(hex: configuration.style?.volumeUpColor
        ?? configuration.style?.upColor
        ?? configuration.theme?.colors?.positive
        ?? "#16a34a")
    }
    return Color(hex: configuration.style?.volumeDownColor
      ?? configuration.style?.downColor
      ?? configuration.theme?.colors?.negative
      ?? "#dc2626")
  }
}
