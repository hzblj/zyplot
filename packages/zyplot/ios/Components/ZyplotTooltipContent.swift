import SwiftUI

struct ZyplotTooltipContent: View {
  let configuration: ZyplotConfiguration
  let category: String

  @ViewBuilder
  var body: some View {
    if let rows = configuration.candlestickRows(at: category) {
      ZyplotTooltipCard(fill: configuration.tooltipFill) {
        Grid(alignment: .leading, horizontalSpacing: 18, verticalSpacing: 5) {
          ForEach(rows) { row in
            GridRow {
              Text(row.label)
                .foregroundStyle(.secondary)
              Text(row.value)
                .foregroundStyle(configuration.trendColor(row.trend))
                .gridColumnAlignment(.trailing)
            }
          }
        }
        .font(configuration.font(.caption, size: 12).monospacedDigit())
      }
    } else if let text = configuration.reading(at: category) {
      ZyplotTooltipCard(fill: configuration.tooltipFill) {
        Text(text).font(configuration.font(.caption, size: 12).monospacedDigit())
      }
    }
  }
}
