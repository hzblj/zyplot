import ExpoModulesCore
import SwiftUI

final class ZyplotChartView: ExpoView {
  let onInteraction = EventDispatcher()
  private var hostingController: UIHostingController<ZyplotNativeChart>?

  var configuration = "" {
    didSet {
      guard configuration != oldValue else { return }
      render()
    }
  }

  required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    render()
  }

  private func render() {
    let decoded = configuration.data(using: .utf8).flatMap {
      try? JSONDecoder().decode(ZyplotConfiguration.self, from: $0)
    } ?? .empty

    let rootView = ZyplotNativeChart(
      configuration: decoded,
      onInteraction: { [weak self] payload in
        self?.onInteraction(payload.compactMapValues { $0 })
      }
    )

    if let hostingController {
      hostingController.rootView = rootView
      return
    }

    let controller = UIHostingController(rootView: rootView)
    controller.view.backgroundColor = .clear
    controller.view.translatesAutoresizingMaskIntoConstraints = false
    addSubview(controller.view)
    NSLayoutConstraint.activate([
      controller.view.leadingAnchor.constraint(equalTo: leadingAnchor),
      controller.view.trailingAnchor.constraint(equalTo: trailingAnchor),
      controller.view.topAnchor.constraint(equalTo: topAnchor),
      controller.view.bottomAnchor.constraint(equalTo: bottomAnchor),
    ])
    hostingController = controller
  }
}

public final class ZyplotModule: Module {
  public func definition() -> ModuleDefinition {
    Name("Zyplot")

    View(ZyplotChartView.self) {
      Events("onInteraction")

      Prop("configuration") {
        (view: ZyplotChartView, configuration: String) in
        view.configuration = configuration
      }
    }
  }
}
