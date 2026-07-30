import SwiftUI

extension ZyplotConfiguration {
  var palette: [Color] {
    let values = theme?.colors?.categorical ?? [
      "#6d28d9", "#0284c7", "#ea580c", "#16a34a",
      "#db2777", "#ca8a04", "#7c3aed",
    ]
    return values.map(Color.init(hex:))
  }

  var badgeBackground: Color {
    Color(hex: plot?.backgroundColor ?? theme?.colors?.background ?? "#00000000")
  }

  var tooltipFill: Color? {
    theme?.colors?.surface.map(Color.init(hex:))
  }

  var preferredColorScheme: ColorScheme? {
    switch colorMode {
    case "dark": return .dark
    case "light": return .light
    default: return nil
    }
  }
}
