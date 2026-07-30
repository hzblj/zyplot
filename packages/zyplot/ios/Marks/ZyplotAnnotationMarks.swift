import Charts
import SwiftUI

struct ZyplotAnnotationMarks: ChartContent {
  let annotations: [ZyplotAnnotation]
  var isScrubbing = false
  var categorySpan: (first: String, last: String)?
  /// What a badge paints behind itself to mask the rule it caps. Transparent when the
  /// chart has no plot or theme background to borrow, in which case the badge stays
  /// translucent and the rule shows through it.
  var plotBackground: Color = .clear
  /// `theme.typography.fontFamily`, already resolved by the chart that draws these.
  var fontFamily: String?
  var strength: Double = 1
  /// The value range the plot covers, so `labelPosition: 'auto'` can tell a rule sitting
  /// low in the plot from one sitting high.
  var valueDomain: ClosedRange<Double>?

  /// The ones the chart still draws. A hidden annotation keeps its place in the geometry
  /// the app is given; it is only its pixels that the app has taken over.
  private var drawn: [ZyplotAnnotation] {
    annotations.filter { $0.hidden != true }
  }

  var body: some ChartContent {
    ForEach(drawn) { annotation in
      switch annotation.type {
      case "line":
        line(annotation)
      case "range":
        range(annotation)
      case "point", "text":
        point(annotation)
      default:
        EmptyChartContent()
      }
    }
  }

  private func fade(_ annotation: ZyplotAnnotation) -> Double {
    (isScrubbing ? (annotation.scrubOpacity ?? 1) : 1) * strength
  }

  @ChartContentBuilder
  private func line(_ annotation: ZyplotAnnotation) -> some ChartContent {
    let color = Color(hex: annotation.color ?? "#71717a")
      .opacity(fade(annotation))
    if annotation.axis == "x" {
      switch annotation.value {
      case .number(let value):
        RuleMark(x: .value(annotation.label ?? "Annotation", value))
          .foregroundStyle(color)
          .lineStyle(stroke(for: annotation))
          .annotation(
            position: position(annotation, default: .top),
            alignment: alignment(annotation),
            spacing: spacing(annotation)
          ) { label(annotation) }
      case .text(let value):
        RuleMark(x: .value(annotation.label ?? "Annotation", value))
          .foregroundStyle(color)
          .lineStyle(stroke(for: annotation))
          .annotation(
            position: position(annotation, default: .top),
            alignment: alignment(annotation),
            spacing: spacing(annotation)
          ) { label(annotation) }
      case nil:
        EmptyChartContent()
      }
    } else {
      if case .number(let value) = annotation.value {
        if let span = categorySpan {
          RuleMark(
            xStart: .value("Start", span.first),
            xEnd: .value("End", span.last),
            y: .value(annotation.label ?? "Annotation", value)
          )
          .foregroundStyle(color)
          .lineStyle(stroke(for: annotation))
          .annotation(
            position: position(annotation, default: .top),
            alignment: alignment(annotation),
            spacing: spacing(annotation)
          ) { label(annotation) }
        } else {
          RuleMark(y: .value(annotation.label ?? "Annotation", value))
            .foregroundStyle(color)
            .lineStyle(stroke(for: annotation))
            .annotation(
              position: position(annotation, default: .top),
              alignment: alignment(annotation),
              spacing: spacing(annotation)
            ) { label(annotation) }
        }
      } else {
        EmptyChartContent()
      }
    }
  }

  @ChartContentBuilder
  private func range(_ annotation: ZyplotAnnotation) -> some ChartContent {
    let color = Color(hex: annotation.color ?? "#71717a")
      .opacity(annotation.opacity ?? 0.12)
    if annotation.axis == "x" {
      switch (annotation.start, annotation.end) {
      case (.number(let start), .number(let end)):
        RectangleMark(
          xStart: .value("Start", start),
          xEnd: .value("End", end)
        )
        .foregroundStyle(color)
      case (.text(let start), .text(let end)):
        RectangleMark(
          xStart: .value("Start", start),
          xEnd: .value("End", end)
        )
        .foregroundStyle(color)
      default:
        EmptyChartContent()
      }
    } else if case .number(let start) = annotation.start,
              case .number(let end) = annotation.end
    {
      RectangleMark(
        yStart: .value("Start", start),
        yEnd: .value("End", end)
      )
      .foregroundStyle(color)
    } else {
      EmptyChartContent()
    }
  }

  @ChartContentBuilder
  private func point(_ annotation: ZyplotAnnotation) -> some ChartContent {
    if let y = annotation.y {
      switch annotation.x {
      case .number(let x):
        pointMark(annotation, x: x, y: y)
      case .text(let x):
        pointMark(annotation, x: x, y: y)
      case nil:
        EmptyChartContent()
      }
    } else {
      EmptyChartContent()
    }
  }

  private func pointMark<X: Plottable>(
    _ annotation: ZyplotAnnotation,
    x: X,
    y: Double
  ) -> some ChartContent {
    PointMark(
      x: .value("X", x),
      y: .value("Y", y)
    )
    .symbol {
      ZyplotAnnotationDot(
        color: Color(hex: annotation.color ?? "#71717a"),
        glow: annotation.glow,
        halo: annotation.halo,
        pulse: annotation.pulse,
        size: annotation.size ?? 7
      )
      .opacity(fade(annotation))
    }
    .annotation(
      position: position(annotation, default: .top),
      alignment: alignment(annotation),
      spacing: spacing(annotation)
    ) { label(annotation) }
  }

  @ViewBuilder
  private func label(_ annotation: ZyplotAnnotation) -> some View {
    let color = Color(hex: annotation.color ?? "#71717a")
      .opacity(fade(annotation))
    if let badge = annotation.badge {
      let diameter = annotation.size ?? 18
      Text(badge)
        .font(ZyplotFont.font(fontFamily, size: diameter * 0.6, weight: .semibold))
        .foregroundStyle(color)
        .frame(width: diameter, height: diameter)
        .background(Circle().fill(color.opacity(0.18)))
        .background(Circle().fill(plotBackground))
        .overlay(Circle().stroke(color.opacity(0.4), lineWidth: 1))
    } else if let background = annotation.labelBackground {
      Text(annotation.text ?? annotation.label ?? "")
        .font(ZyplotFont.font(fontFamily, style: .caption2, size: 11))
        .foregroundStyle(color)
        .padding(.horizontal, 4)
        .padding(.vertical, 1)
        .background(
          RoundedRectangle(cornerRadius: 4)
            .fill(Color(hex: background).opacity(fade(annotation)))
        )
    } else {
      Text(annotation.text ?? annotation.label ?? "")
        .font(ZyplotFont.font(fontFamily, style: .caption2, size: 11))
        .foregroundStyle(color)
    }
  }

  private func position(
    _ annotation: ZyplotAnnotation,
    default fallback: AnnotationPosition
  ) -> AnnotationPosition {
    if annotation.badge != nil {
      return .overlay
    }
    switch annotation.labelPosition {
    case "auto": return sitsLow(annotation) ? .top : .bottom
    case "bottom": return .bottom
    case "leading": return .leading
    case "top": return .top
    case "trailing": return .trailing
    default: return fallback
    }
  }

  /// Whether the rule runs through the lower half of the plot, in which case an `'auto'`
  /// label belongs above it — below would push the digits towards the plot's floor.
  private func sitsLow(_ annotation: ZyplotAnnotation) -> Bool {
    guard let domain = valueDomain,
          case .number(let value) = annotation.value,
          domain.upperBound > domain.lowerBound
    else {
      return false
    }
    return (value - domain.lowerBound) / (domain.upperBound - domain.lowerBound) < 0.5
  }

  /// A badge caps its rule, so it sits flush against the plot edge instead of the default
  /// annotation gap away from it — which left a stub of rule sticking out above the badge.
  private func spacing(_ annotation: ZyplotAnnotation) -> CGFloat? {
    annotation.badge != nil ? 0 : nil
  }

  private func alignment(_ annotation: ZyplotAnnotation) -> Alignment {
    if annotation.badge != nil {
      return annotation.labelPosition == "bottom" ? .bottom : .top
    }
    switch annotation.labelPosition {
    case "trailing": return .trailing
    default: return .leading
    }
  }

  private func stroke(for annotation: ZyplotAnnotation) -> StrokeStyle {
    StrokeStyle(
      lineWidth: annotation.width ?? 1,
      dash: annotation.dash?.map { CGFloat($0) } ?? []
    )
  }
}
