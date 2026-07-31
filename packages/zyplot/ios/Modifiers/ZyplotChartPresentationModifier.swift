import Charts
import SwiftUI

struct ZyplotChartPresentationModifier: ViewModifier {
  /**
   The air the chart keeps above and below the marks, held around the chart rather than inside the
   plot — Swift Charts lays the axes out against the plot's own edges, so an inset there takes the
   room from the label rows instead of from the marks. The canvases that stroke the trace are sized
   to the chart and so stop short of a plot given a negative inset; they take this back as overdraw.
   */
  static let reserve: CGFloat = 8

  let configuration: ZyplotConfiguration
  var reveal: ZyplotRevealState = .settled

  func body(content: Content) -> some View {
    content
      .chartPlotStyle { plot in
        plot
          .padding(plotInsets)
          .background(
            Color(hex: configuration.plot?.backgroundColor
              ?? configuration.theme?.colors?.background
              ?? "#00000000")
          )
          .clipShape(clipShape)
          .overlay {
            RoundedRectangle(cornerRadius: configuration.plot?.borderRadius ?? 0)
              .stroke(
                Color(hex: configuration.plot?.borderColor ?? "#00000000"),
                lineWidth: configuration.plot?.borderWidth ?? 0
              )
          }
      }
      .modifier(ZyplotChartDomainModifier(configuration: configuration))
      .modifier(ZyplotCategoryDomainModifier(configuration: configuration))
      .animation(animation, value: animationValue)
  }

  private var animation: Animation? {
    guard !reveal.isTracing else { return nil }
    guard configuration.animation?.enabled != false,
          configuration.animation?.updates != false
    else {
      return nil
    }
    let duration = (configuration.animation?.duration ?? 320) / 1_000
    switch configuration.animation?.easing {
    case "linear":
      return .linear(duration: duration)
    case "ease-in":
      return .easeIn(duration: duration)
    case "ease-in-out":
      return .easeInOut(duration: duration)
    case "spring":
      return .spring(duration: duration, bounce: 0.18)
    default:
      return .easeOut(duration: duration)
    }
  }

  private var animationValue: Double {
    let seriesValue = configuration.resolvedSeries
      .flatMap { $0.values ?? [] }
      .compactMap { $0 }
      .reduce(0, +)
    let candleValue = (configuration.candlesticks ?? [])
      .reduce(0) { $0 + $1.close }
    return seriesValue + candleValue + (configuration.value ?? 0)
  }

  private var clipShape: some Shape {
    RoundedRectangle(cornerRadius: configuration.plot?.borderRadius ?? 0)
      .inset(by: configuration.plot?.clip == false ? -24 : 0)
  }

  private var plotInsets: EdgeInsets {
    configuration.plot?.padding?.insets ?? EdgeInsets()
  }
}
