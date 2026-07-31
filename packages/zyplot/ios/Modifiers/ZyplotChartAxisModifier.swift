import Charts
import SwiftUI

/// The dotted axis row: a dot at every category, and the longer mark that caps the named ones.
private enum AxisRow {
  static let dot: CGFloat = 2
  static let capLength: CGFloat = 6
  static let capWidth: CGFloat = 1.6
  /// The air between the plot's bottom edge and the row, so the marks sit under the chart.
  static let gap: CGFloat = 5
  static let labelGap: CGFloat = 4
}

struct ZyplotChartAxisModifier: ViewModifier {
  let configuration: ZyplotConfiguration
  /// One category's width, so the mark that closes the dotted row can be moved off the last of them.
  var bandWidth: CGFloat = 0

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
      let dotted = options?.ticks != false && options?.minorTicks == true
      if let labels = options?.categoryTickValues {
        if dotted {
          /**
           Every category in one collection, dots and caps together: two of them are laid out as
           two rows, one under the other, and the row is meant to read as a single line of marks.
           */
          AxisMarks(position: position, values: configuration.resolvedCategories) { value in
            rowMarks(value, options: options, named: labels)
          }
        } else {
          AxisMarks(position: position, values: labels) { value in
            marks(
              value,
              options: options,
              format: configuration.resolvedXAxisFormat,
              edgeAligned: options?.labelEdgeAlign == true
            )
          }
        }
      } else if let values = options?.numericTickValues {
        AxisMarks(position: position, values: values) { value in
          marks(
            value,
            options: options,
            format: configuration.resolvedXAxisFormat,
            edgeAligned: options?.labelEdgeAlign == true
          )
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
      if let labels = options?.categoryTickValues {
        AxisMarks(position: position, values: labels) { value in
          marks(value, options: options, format: configuration.resolvedYAxisFormat, down: true)
        }
      } else if let values = options?.numericTickValues {
        AxisMarks(position: position, values: values) { value in
          marks(value, options: options, format: configuration.resolvedYAxisFormat, down: true)
        }
      } else {
        AxisMarks(
          position: position,
          values: .automatic(desiredCount: options?.tickCount ?? 5)
        ) { value in
          marks(value, options: options, format: configuration.resolvedYAxisFormat, down: true)
        }
      }
    }
  }

  /**
   One category of the dotted row: the named ones take the long cap and the label, the rest a dot.
   Both marks are the same length, so the dot is a dash pattern that inks only the middle of it and
   the whole row shares one midline — a round cap on a dash of no length is a circle of its width.
   The row is offset off the plot's bottom edge rather than hung from it, and the last category
   carries a second cap half a band along, which is where the row stops.
   */
  @AxisMarkBuilder
  private func rowMarks(
    _ value: AxisValue,
    options: ZyplotAxisOptions?,
    named labels: [String]
  ) -> some AxisMark {
    let label = value.as(String.self)
    let isNamed = label.map(labels.contains) ?? false
    if isNamed, options?.grid != false {
      AxisGridLine(stroke: gridStroke(options))
        .foregroundStyle(gridColor ?? Color.secondary.opacity(0.25))
    }
    AxisTick(
      centered: true,
      length: .init(AxisRow.capLength),
      stroke: isNamed
        ? StrokeStyle(lineWidth: AxisRow.capWidth, lineCap: .round)
        : StrokeStyle(
            lineWidth: AxisRow.dot,
            lineCap: .round,
            dash: [0.01, AxisRow.capLength - 0.01],
            dashPhase: AxisRow.capLength / 2
          )
    )
    .offset(y: AxisRow.gap)
    .foregroundStyle(axisColor ?? Color.secondary.opacity(0.35))
    if value.index == value.count - 1, bandWidth > 0 {
      AxisTick(
        centered: true,
        length: .init(AxisRow.capLength),
        stroke: StrokeStyle(lineWidth: AxisRow.capWidth, lineCap: .round)
      )
      .offset(x: bandWidth / 2, y: AxisRow.gap)
      .foregroundStyle(axisColor ?? Color.secondary.opacity(0.35))
    }
    if isNamed {
      let anchor = options?.labelEdgeAlign == true ? edgeAnchor(label, options: options, named: labels) : nil
      AxisValueLabel(
        anchor: anchor,
        horizontalSpacing: anchor == nil ? nil : 0,
        verticalSpacing: labelInset(options) ?? AxisRow.gap + AxisRow.labelGap
      ) {
        axisLabel(value, options: options, format: configuration.resolvedXAxisFormat)
      }
    }
  }

  /**
   `down` is whether the axis runs down the side of the plot, which decides which way its
   `labelInset` is read: a ladder steps sideways off the plot's edge, a row of dates steps under it.
   An anchored label keeps the zero spacing the edge alignment wants — the two are the same number.
   */
  @AxisMarkBuilder
  private func marks(
    _ value: AxisValue,
    options: ZyplotAxisOptions?,
    format axisFormat: ZyplotNumberFormat?,
    edgeAligned: Bool = false,
    down: Bool = false
  ) -> some AxisMark {
    if options?.grid != false {
      AxisGridLine(stroke: gridStroke(options))
        .foregroundStyle(gridColor ?? Color.secondary.opacity(0.25))
    }
    if options?.ticks != false {
      AxisTick().foregroundStyle(axisColor ?? Color.secondary.opacity(0.35))
    }
    let inset = labelInset(options)
    let anchor = edgeAligned ? edgeAnchor(value, options: options) : nil
    let across: CGFloat? = anchor == nil ? (down ? inset : nil) : 0
    let below: CGFloat? = down ? nil : inset
    if let number = value.as(Double.self), options?.labelRotation == nil {
      AxisValueLabel(
        (axisFormat ?? ZyplotNumberFormat()).string(from: number),
        anchor: anchor,
        horizontalSpacing: across,
        verticalSpacing: below
      )
      .font(labelFont(options))
      .foregroundStyle(labelColor ?? Color.secondary)
    } else {
      AxisValueLabel(anchor: anchor, horizontalSpacing: across, verticalSpacing: below) {
        axisLabel(value, options: options, format: axisFormat)
      }
    }
  }

  /** How far the labels sit off the plot's edge, when the axis named a distance of its own. */
  private func labelInset(_ options: ZyplotAxisOptions?) -> CGFloat? {
    guard let inset = options?.labelInset else { return nil }
    return CGFloat(inset)
  }

  /**
   Which corner of the first and last labels hangs on their own mark. Everything between keeps the
   centred default, so only the two ends of the axis are squared up with the row they bracket. The
   spacing goes with it: an anchored label is inset by a few points unless it is told otherwise.
   */
  private func edgeAnchor(_ value: AxisValue, options: ZyplotAxisOptions?) -> UnitPoint? {
    guard value.count > 1 else { return nil }
    if value.index == 0 {
      return leadingAnchor(options)
    }
    if value.index == value.count - 1 {
      return trailingAnchor(options)
    }
    return nil
  }

  private func edgeAnchor(_ label: String?, options: ZyplotAxisOptions?, named labels: [String]) -> UnitPoint? {
    guard let label, labels.count > 1 else { return nil }
    if label == labels.first {
      return leadingAnchor(options)
    }
    if label == labels.last {
      return trailingAnchor(options)
    }
    return nil
  }

  private func leadingAnchor(_ options: ZyplotAxisOptions?) -> UnitPoint {
    options?.position == "end" ? .bottomLeading : .topLeading
  }

  private func trailingAnchor(_ options: ZyplotAxisOptions?) -> UnitPoint {
    options?.position == "end" ? .bottomTrailing : .topTrailing
  }

  private var labelColor: Color? {
    configuration.theme?.colors?.label.map(Color.init(hex:))
  }

  private var gridColor: Color? {
    configuration.theme?.colors?.grid.map(Color.init(hex:))
  }

  private var axisColor: Color? {
    configuration.theme?.colors?.axis.map(Color.init(hex:))
  }

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
