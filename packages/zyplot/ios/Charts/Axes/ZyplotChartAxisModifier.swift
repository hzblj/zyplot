import Charts
import SwiftUI

struct ZyplotChartAxisModifier: ViewModifier {
  let configuration: ZyplotConfiguration

  func body(content: Content) -> some View {
    content
      .chartXAxis {
        if configuration.resolvedXAxisVisible {
          AxisMarks(
            position: configuration.xAxis?.position == "end" ? .top : .bottom,
            values: .automatic(desiredCount: configuration.xAxis?.tickCount ?? 6)
          ) { value in
            if configuration.xAxis?.grid != false {
              AxisGridLine(stroke: gridStroke(configuration.xAxis))
            }
            AxisTick()
            AxisValueLabel {
              axisLabel(
                value,
                options: configuration.xAxis,
                format: configuration.resolvedXAxisFormat
              )
            }
          }
        }
      }
      .chartYAxis {
        if configuration.resolvedYAxisVisible {
          AxisMarks(
            position: configuration.yAxis?.position == "end" ? .trailing : .leading,
            values: .automatic(desiredCount: configuration.yAxis?.tickCount ?? 5)
          ) { value in
            if configuration.yAxis?.grid != false {
              AxisGridLine(stroke: gridStroke(configuration.yAxis))
            }
            AxisTick()
            AxisValueLabel {
              axisLabel(
                value,
                options: configuration.yAxis,
                format: configuration.resolvedYAxisFormat
              )
            }
          }
        }
      }
      .chartXAxisLabel(configuration.resolvedXAxisLabel)
      .chartYAxisLabel(configuration.resolvedYAxisLabel)
      .modifier(ZyplotChartScrollableAxisModifier(configuration: configuration))
  }

  private func axisLabel(
    _ value: AxisValue,
    options: ZyplotAxisOptions?,
    format axisFormat: ZyplotNumberFormat?
  ) -> some View {
    Group {
      if let number = value.as(Double.self) {
        Text(format(number, with: axisFormat))
      } else if let label = value.as(String.self) {
        Text(label)
      } else if let date = value.as(Date.self) {
        Text(date, format: .dateTime.month(.abbreviated).day())
      }
    }
    .rotationEffect(.degrees(options?.labelRotation ?? 0))
  }

  private func format(
    _ value: Double,
    with format: ZyplotNumberFormat?
  ) -> String {
    let decimals = format?.decimals ?? 0
    return "\(format?.prefix ?? "")\(String(format: "%.\(decimals)f", value))\(format?.suffix ?? "")"
  }

  private func gridStroke(_ options: ZyplotAxisOptions?) -> StrokeStyle {
    StrokeStyle(
      lineWidth: 1,
      dash: options?.gridDash?.map { CGFloat($0) } ?? []
    )
  }
}

private struct ZyplotChartScrollableAxisModifier: ViewModifier {
  let configuration: ZyplotConfiguration

  @ViewBuilder
  func body(content: Content) -> some View {
    if let length = configuration.xAxis?.visibleDomain {
      content
        .chartScrollableAxes(.horizontal)
        .chartXVisibleDomain(length: length)
    } else {
      content
    }
  }
}
