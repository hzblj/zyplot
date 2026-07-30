import Charts
import SwiftUI

struct ZyplotChartAxisModifier: ViewModifier {
  let configuration: ZyplotConfiguration

  func body(content: Content) -> some View {
    content
      .chartXAxis { xAxisContent }
      .chartYAxis { yAxisContent }
      .modifier(ZyplotAxisTitleModifier(configuration: configuration))
      .modifier(ZyplotOverlaidAxisModifier(configuration: configuration))
      .modifier(ZyplotChartScrollableAxisModifier(configuration: configuration))
  }

  @AxisContentBuilder
  private var xAxisContent: some AxisContent {
    if configuration.resolvedXAxisVisible {
      let options = configuration.xAxis
      let position: AxisMarkPosition = options?.position == "end" ? .top : .bottom
      if let values = options?.numericTickValues {
        AxisMarks(position: position, values: values) { value in
          marks(value, options: options, format: configuration.resolvedXAxisFormat)
        }
      } else {
        AxisMarks(
          position: position,
          values: .automatic(desiredCount: options?.tickCount ?? 6)
        ) { value in
          marks(value, options: options, format: configuration.resolvedXAxisFormat)
        }
      }
    }
  }

  @AxisContentBuilder
  private var yAxisContent: some AxisContent {
    if configuration.resolvedYAxisVisible, !configuration.overlaysYAxis {
      let options = configuration.yAxis
      let position: AxisMarkPosition = options?.position == "end"
        ? .trailing
        : .leading
      if let values = options?.numericTickValues {
        AxisMarks(position: position, values: values) { value in
          marks(value, options: options, format: configuration.resolvedYAxisFormat)
        }
      } else {
        AxisMarks(
          position: position,
          values: .automatic(desiredCount: options?.tickCount ?? 5)
        ) { value in
          marks(value, options: options, format: configuration.resolvedYAxisFormat)
        }
      }
    }
  }

  @AxisMarkBuilder
  private func marks(
    _ value: AxisValue,
    options: ZyplotAxisOptions?,
    format axisFormat: ZyplotNumberFormat?
  ) -> some AxisMark {
    if options?.grid != false {
      AxisGridLine(stroke: gridStroke(options))
        .foregroundStyle(gridColor ?? Color.secondary.opacity(0.25))
    }
    if options?.ticks != false {
      AxisTick().foregroundStyle(axisColor ?? Color.secondary.opacity(0.35))
    }
    if let number = value.as(Double.self), options?.labelRotation == nil {
      AxisValueLabel((axisFormat ?? ZyplotNumberFormat()).string(from: number))
        .font(labelFont(options))
        .foregroundStyle(labelColor ?? Color.secondary)
    } else {
      AxisValueLabel {
        axisLabel(value, options: options, format: axisFormat)
      }
    }
  }

  private var labelColor: Color? {
    configuration.theme?.colors?.label.map(Color.init(hex:))
  }

  private var gridColor: Color? {
    configuration.theme?.colors?.grid.map(Color.init(hex:))
  }

  /// The tick marks beside the labels. Swift Charts draws no domain line of its own,
  /// so the ticks are what `theme.colors.axis` has to colour.
  private var axisColor: Color? {
    configuration.theme?.colors?.axis.map(Color.init(hex:))
  }

  /// `nil` leaves the label at whatever Swift Charts resolves, which is what an axis
  /// that names neither a size nor a family should keep.
  private func labelFont(_ options: ZyplotAxisOptions?) -> Font? {
    if let size = options?.labelSize {
      return configuration.font(size: size)
    }
    return configuration.fontFamily == nil ? nil : configuration.font(.caption2, size: 11)
  }

  private func axisLabel(
    _ value: AxisValue,
    options: ZyplotAxisOptions?,
    format axisFormat: ZyplotNumberFormat?
  ) -> some View {
    Group {
      if let number = value.as(Double.self) {
        Text((axisFormat ?? ZyplotNumberFormat()).string(from: number))
      } else if let label = value.as(String.self) {
        Text(label)
      } else if let date = value.as(Date.self) {
        Text(date, format: .dateTime.month(.abbreviated).day())
      }
    }
    .fixedSize()
    .font(labelFont(options))
    .foregroundStyle(labelColor ?? Color.secondary)
    .rotationEffect(.degrees(options?.labelRotation ?? 0))
  }

  private func gridStroke(_ options: ZyplotAxisOptions?) -> StrokeStyle {
    StrokeStyle(
      lineWidth: 1,
      dash: options?.gridDash?.map { CGFloat($0) } ?? []
    )
  }
}
