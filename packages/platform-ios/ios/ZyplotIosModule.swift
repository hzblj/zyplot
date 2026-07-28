import Charts
import ExpoModulesCore
import SwiftUI

struct ZyplotPoint: Record, Identifiable {
  @Field var x: Double = 0
  @Field var y: Double = 0

  var id: String { "\(x):\(y)" }
}

struct ZyplotSeries: Record {
  @Field var id: String = ""
  @Field var label: String = ""
  @Field var color: String?
  @Field var data: [ZyplotPoint] = []
}

struct ZyplotLineChart: View {
  let series: [ZyplotSeries]

  var body: some View {
    Chart {
      ForEach(series, id: \.id) { item in
        ForEach(item.data) { point in
          LineMark(
            x: .value("X", point.x),
            y: .value(item.label, point.y)
          )
          .foregroundStyle(by: .value("Series", item.label))
        }
      }
    }
    .chartLegend(.visible)
  }
}

final class ZyplotIosLineChartView: ExpoView {
  private var hostingController: UIHostingController<ZyplotLineChart>?
  var series: [ZyplotSeries] = [] {
    didSet { render() }
  }

  required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    render()
  }

  private func render() {
    hostingController?.view.removeFromSuperview()
    let controller = UIHostingController(rootView: ZyplotLineChart(series: series))
    controller.view.backgroundColor = .clear
    addSubview(controller.view)
    controller.view.translatesAutoresizingMaskIntoConstraints = false
    NSLayoutConstraint.activate([
      controller.view.leadingAnchor.constraint(equalTo: leadingAnchor),
      controller.view.trailingAnchor.constraint(equalTo: trailingAnchor),
      controller.view.topAnchor.constraint(equalTo: topAnchor),
      controller.view.bottomAnchor.constraint(equalTo: bottomAnchor),
    ])
    hostingController = controller
  }
}

public final class ZyplotIosModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ZyplotIos")

    View(ZyplotIosLineChartView.self) {
      Prop("series") { (view: ZyplotIosLineChartView, series: [ZyplotSeries]) in
        view.series = series
      }
    }
  }
}

