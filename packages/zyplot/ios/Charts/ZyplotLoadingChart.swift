import SwiftUI

/**
 The chart before its data: the same marks in the track colour, laid out in the plot the chart itself
 will draw in, with a pill wherever a label is about to be written, so nothing moves when the values
 land.

 The gutters are the ones the axes take — a label row under a visible x axis and a label's width
 beside a y axis in a gutter — held to the same numbers Android keeps in `PlotBounds`, since the two
 have to agree. They are the one part of this that is not measured: Swift Charts lays its own axes
 out, and nothing here can ask it how much it took.
 */
struct ZyplotLoadingChart: View {
  var configuration: ZyplotConfiguration = .empty

  @State private var sweep: Double = -1

  /**
   How far up the plot a column reaches. Kept well under the top of it, the way the web placeholder
   is: an axis rounds its domain up past the tallest bar, so a column that fills the plot is taller
   than the data that lands.
   */
  private static let columnRatios: [Double] = [0.28, 0.44, 0.34, 0.53, 0.37, 0.59, 0.31, 0.47]
  private static let radialKinds: Set<String> = ["pie", "gauge", "meter", "radar", "sunburst"]
  private static let columnKinds: Set<String> = [
    "bar", "stacked-bar", "histogram", "diverging-bar", "waterfall", "candlestick", "boxplot",
  ]

  private enum Gutter {
    /**
     Measured off a real chart: what Swift Charts keeps above the plot on its own, beyond the
     reserve the chart is padded by. The reserve is what the y axis can name; this is not.
     */
    static let intrinsicTop: Double = 5
    /** What a label row is beyond its own line: the gap over it, and the ticks when they are drawn. */
    static let labelGap: Double = 5
    static let labelLine: Double = 1.2
    static let tick: Double = 4
    static let yLabels: Double = 44
    static let bareStart: Double = 20
    static let bareEnd: Double = 12
  }

  /** What a label is taken to be, measured the way `overlayAxisGutter` measures it. */
  private enum Label {
    static let character: Double = 6.4
    static let height: Double = 9
    static let radius: Double = 2
    static let gap: Double = 6
  }

  private var track: Color {
    Color(hex: configuration.theme?.colors?.track ?? "#71717a").opacity(0.16)
  }

  var body: some View {
    GeometryReader { geometry in
      Canvas { graphics, size in
        draw(in: graphics, size: size)
      }
      .frame(width: geometry.size.width, height: geometry.size.height)
      .overlay {
        LinearGradient(
          colors: [.clear, Color.primary.opacity(0.08), .clear],
          startPoint: .leading,
          endPoint: .trailing
        )
        .frame(width: geometry.size.width * 0.5)
        .offset(x: sweep * geometry.size.width)
      }
      .clipped()
    }
    .accessibilityLabel("Loading chart")
    .onAppear {
      withAnimation(.linear(duration: 1.2).repeatForever(autoreverses: false)) {
        sweep = 1.5
      }
    }
  }

  private func draw(in graphics: GraphicsContext, size: CGSize) {
    if Self.radialKinds.contains(configuration.type) {
      let diameter = min(size.width, size.height) * 0.72
      let ring = CGRect(
        x: (size.width - diameter) / 2,
        y: (size.height - diameter) / 2,
        width: diameter,
        height: diameter
      )
      graphics.stroke(
        Path(ellipseIn: ring.insetBy(dx: diameter * 0.11, dy: diameter * 0.11)),
        with: .color(track),
        lineWidth: diameter * 0.22
      )
      return
    }

    let frame = plotRect(in: size)
    guard frame.width > 0, frame.height > 0 else { return }
    let marks = marksRect(in: frame)

    rules(in: graphics, plot: frame)
    labels(in: graphics, frame: frame, marks: marks)

    if Self.columnKinds.contains(configuration.type) {
      columns(in: graphics, plot: marks)
      return
    }

    graphics.stroke(
      ZyplotSkeletonCurve().path(in: marks.insetBy(dx: 0, dy: marks.height * 0.225)),
      with: .color(track),
      style: StrokeStyle(lineWidth: 3, lineCap: .round, lineJoin: .round)
    )
  }

  /**
   A pill for every label the axes are about to write: the readings the value axis names, held inside
   the plot's trailing edge when it is overlaid the way `ZyplotOverlaidAxisModifier` holds them, and
   the categories the x axis names, each on the middle of its own band.
   */
  private func labels(in graphics: GraphicsContext, frame: CGRect, marks: CGRect) {
    if configuration.resolvedYAxisVisible {
      let format = configuration.resolvedYAxisFormat ?? ZyplotNumberFormat()
      let inset = configuration.yAxis?.labelInset ?? 2
      // The same clamp `ZyplotOverlaidAxisModifier` keeps: a label stays a label's own size off either edge.
      let size = configuration.yAxis?.labelSize ?? 11
      let highest = frame.minY + size
      let lowest = max(highest, frame.maxY - size)
      for value in labelledValues() {
        guard let offset = offset(of: value) else { continue }
        let width: Double = Double(format.string(from: value).count) * Label.character
        let centre: Double = min(max(frame.maxY - frame.height * offset, highest), lowest)
        let top: Double = centre - Label.height / 2
        let gap = configuration.yAxis?.labelInset ?? Label.gap
        var leading: Double = frame.minX - gap - width
        if configuration.overlaysYAxis {
          leading = frame.maxX - inset - width
        } else if configuration.yAxis?.position == "end" {
          leading = frame.maxX + gap
        }
        pill(in: graphics, at: CGRect(x: max(0, leading), y: top, width: width, height: Label.height))
      }
    }

    guard configuration.resolvedXAxisVisible else { return }
    let categories = configuration.resolvedCategories
    guard !categories.isEmpty else { return }
    let named = configuration.xAxis?.categoryTickValues ?? categories
    let band = marks.width / Double(categories.count)
    for (index, category) in categories.enumerated() where named.contains(category) {
      let width = Double(category.count) * Label.character
      let centre = marks.minX + band * (Double(index) + 0.5)
      let gap = configuration.xAxis?.labelInset ?? Label.gap
      pill(
        in: graphics,
        at: CGRect(x: centre - width / 2, y: frame.maxY + gap, width: width, height: Label.height)
      )
    }
  }

  private func pill(in graphics: GraphicsContext, at rect: CGRect) {
    graphics.fill(Path(roundedRect: rect, cornerRadius: Label.radius), with: .color(track))
  }

  /** The readings the axis will write: the ones it was pinned to, or the ones it picks itself. */
  private func labelledValues() -> [Double] {
    if let ticks = configuration.yAxis?.numericTickValues, !ticks.isEmpty {
      return ticks
    }
    guard let domain = configuration.resolvedValueDomain else { return [] }
    let count = max(1, configuration.yAxis?.tickCount ?? 4)
    let lower: Double = domain.lowerBound
    let step: Double = (domain.upperBound - lower) / Double(count)

    return (0...count).map { index -> Double in lower + step * Double(index) }
  }

  private func offset(of value: Double) -> Double? {
    guard let domain = configuration.resolvedValueDomain,
          domain.upperBound > domain.lowerBound
    else {
      return nil
    }

    return (value - domain.lowerBound) / (domain.upperBound - domain.lowerBound)
  }

  /**
   The rules the value axis lays across the plot, at the readings it was pinned to. The chart's own
   furniture rather than a mark that is still to come, so it is drawn in the grid colour and does not
   shimmer.
   */
  private func rules(in graphics: GraphicsContext, plot: CGRect) {
    // The same guard `yAxisContent` keeps: an overlaid axis puts down no marks here, so no rules either.
    guard configuration.orientation != "horizontal",
          configuration.resolvedYAxisVisible,
          !configuration.overlaysYAxis,
          configuration.yAxis?.grid != false
    else {
      return
    }
    let color = Color(hex: configuration.theme?.colors?.grid ?? "#8e8e93").opacity(0.7)
    for offset in ruleOffsets() {
      let y = plot.maxY - plot.height * offset
      var rule = Path()
      rule.move(to: CGPoint(x: plot.minX, y: y))
      rule.addLine(to: CGPoint(x: plot.maxX, y: y))
      graphics.stroke(rule, with: .color(color), lineWidth: 1)
    }
  }

  private func ruleOffsets() -> [Double] {
    labelledValues().compactMap(offset(of:))
  }

  /** One band per category, each holding what the category gap leaves it, the way a bar chart does. */
  private func columns(in graphics: GraphicsContext, plot: CGRect) {
    let categories = configuration.resolvedCategories.count
    let count = categories > 0 ? categories : Self.columnRatios.count
    let band = plot.width / Double(count)
    for index in 0..<count {
      let height = plot.height * Self.columnRatios[index % Self.columnRatios.count]
      let column = CGRect(
        x: plot.minX + band * Double(index) + band * 0.14,
        y: plot.maxY - height,
        width: max(2, band * 0.72 - 2),
        height: height
      )
      graphics.fill(Path(roundedRect: column, cornerRadius: 3), with: .color(track))
    }
  }

  /**
   The row the x axis labels are written in, which is all the plot gives up at the bottom: their own
   line, the gap over it, and the ticks when they are drawn.
   */
  private var labelRow: Double {
    guard configuration.resolvedXAxisVisible else { return 0 }
    let size = configuration.xAxis?.labelSize ?? 11
    let ticks = configuration.xAxis?.ticks == false ? 0 : Gutter.tick

    return size * Gutter.labelLine + Gutter.labelGap + ticks
  }

  /** The plot, which is the view minus what the axes take of it. */
  private func plotRect(in size: CGSize) -> CGRect {
    let padding = configuration.plot?.padding?.insets ?? EdgeInsets()
    let hasGutterYAxis = configuration.resolvedYAxisVisible && !configuration.overlaysYAxis
    let isYAtEnd = configuration.yAxis?.position == "end"
    let leading = padding.leading + (hasGutterYAxis && !isYAtEnd ? Gutter.yLabels : 0)
    let trailing = padding.trailing + (hasGutterYAxis && isYAtEnd ? Gutter.yLabels : 0)
    let reserve = Double(ZyplotChartPresentationModifier.reserve)
    let headroom = (configuration.yAxis?.plotDimensionEndPadding ?? reserve) + Gutter.intrinsicTop
    let bottom = (configuration.yAxis?.plotDimensionStartPadding ?? reserve) + padding.bottom + labelRow

    return CGRect(
      x: leading,
      y: headroom + padding.top,
      width: max(0, size.width - leading - trailing),
      height: max(0, size.height - headroom - padding.top - bottom)
    )
  }

  /**
   Where the marks go inside it. `plotDimension*Padding` is a padding on the scale rather than on the
   plot, so it moves the marks and leaves the axes where they are — and an overlaid axis is a gutter
   of that kind too, kept clear on the trailing edge for labels drawn inside the plot.
   */
  private func marksRect(in frame: CGRect) -> CGRect {
    let leading = configuration.xAxis?.plotDimensionStartPadding ?? Gutter.bareStart
    let trailing = (configuration.xAxis?.plotDimensionEndPadding ?? Gutter.bareEnd)
      + configuration.overlayAxisGutter

    return CGRect(
      x: frame.minX + leading,
      y: frame.minY,
      width: max(0, frame.width - leading - trailing),
      height: frame.height
    )
  }
}
