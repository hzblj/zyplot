import Charts
import SwiftUI

struct ZyplotCandlestickMarks: ZyplotMarkSet {
  let context: ZyplotMarkContext

  @ChartContentBuilder
  var body: some ChartContent {
    ForEach(configuration.candlesticks ?? []) { item in
      let isPositive = item.close >= item.open
      let color = isPositive
        ? Color(hex: configuration.style?.upColor
          ?? configuration.theme?.colors?.positive ?? "#16a34a")
        : Color(hex: configuration.style?.downColor
          ?? configuration.theme?.colors?.negative ?? "#dc2626")
      RuleMark(
        x: .value("Category", item.category),
        yStart: .value("Low", item.low),
        yEnd: .value("High", item.high)
      )
      .foregroundStyle(color)
      .lineStyle(
        StrokeStyle(
          lineWidth: configuration.style?.wickWidth ?? 1.5,
          lineCap: configuration.style?.wickCap ?? .butt
        )
      )
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
      .cornerRadius(configuration.style?.resolvedCandleRadius ?? 0)
    }
  }
}
