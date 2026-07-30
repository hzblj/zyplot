import Foundation

extension ZyplotConfiguration {
  var resolvedXAxisVisible: Bool {
    xAxis?.visible ?? axis?.x ?? true
  }

  var resolvedYAxisVisible: Bool {
    yAxis?.visible ?? axis?.y ?? true
  }

  var overlaysYAxis: Bool { yAxis?.position == "overlay" }

  var overlayLabelValues: [Double] {
    guard overlaysYAxis, resolvedYAxisVisible else { return [] }
    if let values = yAxis?.numericTickValues {
      return values
    }
    guard let domain = valueDomain else { return [] }
    return [domain.lowerBound, domain.upperBound]
  }

  var overlayAxisGutter: Double {
    let format = resolvedYAxisFormat ?? ZyplotNumberFormat()
    let widest = overlayLabelValues
      .map { format.string(from: $0).count }
      .max() ?? 0
    return widest == 0 ? 0 : Double(widest) * 6.4 + 10
  }

  var resolvedXAxisLabel: String { xAxis?.label ?? xLabel ?? "" }
  var resolvedYAxisLabel: String { yAxis?.label ?? yLabel ?? "" }
  var resolvedXAxisFormat: ZyplotNumberFormat? { xAxis?.format ?? xFormat }
  var resolvedYAxisFormat: ZyplotNumberFormat? { yAxis?.format ?? yFormat }
}
