import SwiftUI

protocol ZyplotColorable {
  var color: String? { get }
  var id: String { get }
  var slot: Int? { get }
}

extension ZyplotSeries: ZyplotColorable {}
extension ZyplotScatterSeries: ZyplotColorable {}
extension ZyplotDatum: ZyplotColorable {}

extension ZyplotMarkContext {
  var palette: [Color] { configuration.palette }

  func seriesColor(_ series: some ZyplotColorable, index: Int) -> Color {
    if let color = configuration.seriesStyle(for: series.id)?.color {
      return Color(hex: color)
    }
    return ownColor(series, index: index)
  }

  func itemColor(_ item: ZyplotDatum, index: Int) -> Color {
    ownColor(item, index: index)
  }

  func flashed(_ base: Color) -> Color {
    guard reveal.flash > 0,
          let flashColor = configuration.animation?.reveal?.flashColor
    else {
      return base
    }
    return base.blended(with: Color(hex: flashColor), amount: reveal.flash)
  }

  private func ownColor(_ mark: some ZyplotColorable, index: Int) -> Color {
    if let color = mark.color {
      return Color(hex: color)
    }
    let slot = max(0, (mark.slot ?? index + 1) - 1)
    return palette[slot % palette.count]
  }
}
