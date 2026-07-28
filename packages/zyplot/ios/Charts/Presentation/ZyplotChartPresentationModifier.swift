import Charts
import SwiftUI

struct ZyplotChartPresentationModifier: ViewModifier {
  let configuration: ZyplotConfiguration

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
          .clipShape(
            RoundedRectangle(cornerRadius: configuration.plot?.borderRadius ?? 0)
          )
          .overlay {
            RoundedRectangle(cornerRadius: configuration.plot?.borderRadius ?? 0)
              .stroke(
                Color(hex: configuration.plot?.borderColor ?? "#00000000"),
                lineWidth: configuration.plot?.borderWidth ?? 0
              )
          }
      }
      .modifier(ZyplotChartDomainModifier(configuration: configuration))
      .animation(animation, value: animationValue)
  }

  private var animation: Animation? {
    guard configuration.animation?.enabled != false else { return nil }
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

  private var plotInsets: EdgeInsets {
    switch configuration.plot?.padding {
    case .value(let value):
      return EdgeInsets(top: value, leading: value, bottom: value, trailing: value)
    case .edges(let value):
      return EdgeInsets(
        top: value.top ?? 0,
        leading: value.left ?? 0,
        bottom: value.bottom ?? 0,
        trailing: value.right ?? 0
      )
    case nil:
      return EdgeInsets()
    }
  }
}

private struct ZyplotChartDomainModifier: ViewModifier {
  let configuration: ZyplotConfiguration

  @ViewBuilder
  func body(content: Content) -> some View {
    if let xDomain, let yDomain {
      content
        .chartXScale(domain: xDomain)
        .chartYScale(domain: yDomain)
    } else if let xDomain {
      content.chartXScale(domain: xDomain)
    } else if let yDomain {
      content.chartYScale(domain: yDomain)
    } else {
      content
    }
  }

  private var xDomain: ClosedRange<Double>? {
    if let minimum = configuration.xAxis?.domain?.min,
       let maximum = configuration.xAxis?.domain?.max
    {
      return minimum...maximum
    }
    // Swift Charts pads a continuous axis out to zero, which crowds a histogram
    // into whatever fraction of the plot its values happen to reach. The bins
    // are the axis — they span it, the way they do on the web and on Android.
    guard configuration.type == "histogram",
          let first = configuration.histogramBins.first,
          let last = configuration.histogramBins.last
    else {
      return nil
    }
    return first.lower...last.upper
  }

  private var yDomain: ClosedRange<Double>? {
    guard let minimum = configuration.yAxis?.domain?.min,
          let maximum = configuration.yAxis?.domain?.max
    else {
      return nil
    }
    return minimum...maximum
  }
}
