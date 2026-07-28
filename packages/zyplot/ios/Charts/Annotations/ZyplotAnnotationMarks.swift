import Charts
import SwiftUI

struct ZyplotAnnotationMarks: ChartContent {
  let annotations: [ZyplotAnnotation]

  var body: some ChartContent {
    ForEach(annotations) { annotation in
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

  @ChartContentBuilder
  private func line(_ annotation: ZyplotAnnotation) -> some ChartContent {
    let color = Color(hex: annotation.color ?? "#71717a")
    if annotation.axis == "x" {
      switch annotation.value {
      case .number(let value):
        RuleMark(x: .value(annotation.label ?? "Annotation", value))
          .foregroundStyle(color)
          .lineStyle(stroke(for: annotation))
          .annotation(position: .top) { label(annotation) }
      case .text(let value):
        RuleMark(x: .value(annotation.label ?? "Annotation", value))
          .foregroundStyle(color)
          .lineStyle(stroke(for: annotation))
          .annotation(position: .top) { label(annotation) }
      case nil:
        EmptyChartContent()
      }
    } else {
      if case .number(let value) = annotation.value {
        RuleMark(y: .value(annotation.label ?? "Annotation", value))
          .foregroundStyle(color)
          .lineStyle(stroke(for: annotation))
          .annotation(position: .top, alignment: .leading) { label(annotation) }
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
    .foregroundStyle(Color(hex: annotation.color ?? "#71717a"))
    .symbolSize(42)
    .annotation(position: .top) { label(annotation) }
  }

  private func label(_ annotation: ZyplotAnnotation) -> some View {
    Text(annotation.text ?? annotation.label ?? "")
      .font(.caption2)
      .foregroundStyle(Color(hex: annotation.color ?? "#71717a"))
  }

  private func stroke(for annotation: ZyplotAnnotation) -> StrokeStyle {
    StrokeStyle(
      lineWidth: 1,
      dash: annotation.dash?.map { CGFloat($0) } ?? []
    )
  }
}
