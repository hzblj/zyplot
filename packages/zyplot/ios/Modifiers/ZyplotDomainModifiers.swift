import Charts
import SwiftUI

struct ZyplotCategoryDomainModifier: ViewModifier {
  let configuration: ZyplotConfiguration

  private var range: PlotDimensionScaleRange {
    let start = configuration.xAxis?.plotDimensionStartPadding ?? 0
    let end = (configuration.xAxis?.plotDimensionEndPadding ?? 0)
      + configuration.overlayAxisGutter
    return .plotDimension(startPadding: start, endPadding: end)
  }

  @ViewBuilder
  func body(content: Content) -> some View {
    if let domain = categoryDomain {
      content.chartXScale(domain: domain, range: range)
    } else if configuration.isTracing == true, let domain = timeDomain {
      content.chartXScale(domain: domain, range: range)
    } else {
      content.chartXScale(range: range)
    }
  }

  private var categoryDomain: [String]? {
    guard Self.categoricalKinds.contains(configuration.type) else { return nil }
    let categories = configuration.resolvedCategories
    guard !categories.isEmpty, Set(categories).count == categories.count else {
      return nil
    }
    return categories
  }

  private static let categoricalKinds: Set<String> = [
    "area", "bar", "candlestick", "line", "stacked-bar",
  ]

  private var timeDomain: ClosedRange<Date>? {
    guard let timestamps = configuration.points?.timestamps,
          let first = timestamps.first,
          let last = timestamps.last,
          last > first
    else {
      return nil
    }
    return Date(timeIntervalSince1970: first)...Date(timeIntervalSince1970: last)
  }
}

struct ZyplotChartDomainModifier: ViewModifier {
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
    guard configuration.type == "histogram",
          let first = configuration.histogramBins.first,
          let last = configuration.histogramBins.last
    else {
      return nil
    }
    return first.lower...last.upper
  }

  private var yDomain: ClosedRange<Double>? {
    guard let domain = configuration.yAxis?.domain else { return nil }
    if let minimum = domain.min, let maximum = domain.max, maximum > minimum {
      return minimum...maximum
    }
    guard domain.min != nil || domain.max != nil || (domain.padding ?? 0) > 0 else {
      return nil
    }
    return configuration.resolvedValueDomain
  }
}
