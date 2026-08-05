import ExpoModulesCore
import SwiftUI

/**
 A node the app supplied, mounted inside the chart.

 It carries only which slot it fills. Where it goes is the chart's to decide and the chart's to
 apply, so a reading never has to cross into JavaScript to move it.
 */
final class ZyplotSlotView: ExpoView {
  var slot = "" {
    didSet {
      guard slot != oldValue else { return }
      chart?.placeSlots()
    }
  }

  /// A node that changed size is a node to place again: both a spot and a reading are anchored
  /// off its own width and height.
  override func layoutSubviews() {
    super.layoutSubviews()
    chart?.placeSlots()
  }

  private var chart: ZyplotChartView? {
    var next = superview
    while let current = next {
      if let chart = current as? ZyplotChartView {
        return chart
      }
      next = current.superview
    }
    return nil
  }
}

final class ZyplotChartView: ExpoView {
  let onInteraction = EventDispatcher()

  private var hostingController: UIHostingController<ZyplotNativeChart>?
  /**
   One per mounted slot. React Native owns the frame of the slot itself, so the chart translates
   a container around it rather than writing to a frame Fabric will write again.
   */
  private var containers: [UIView] = []
  private var layout: ZyplotSlotLayout?
  /**
   Kept past the touch so a node that fades out fades where it was read rather than at the corner.
   Whether there is anything to show once the finger has gone is the app's to answer — it renders
   the node or it does not — so the chart only ever answers where.
   */
  private var lastReading: CGPoint?

  /// What the app asked for with the `tooltipAnchor` factory, kept off the decoded configuration.
  private var anchor: ZyplotTooltipAnchor?

  /// Where the app's own view for an annotation sits on its mark, for the ids that asked.
  private var alignments: [String: String] = [:]

  var configuration = "" {
    didSet {
      guard configuration != oldValue else { return }
      render()
    }
  }

  required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    clipsToBounds = false
    render()
  }

  // MARK: - Slots

  override func mountChildComponentView(_ childComponentView: UIView, index: Int) {
    let container = UIView()
    container.isUserInteractionEnabled = false
    container.isHidden = true
    container.addSubview(childComponentView)
    containers.insert(container, at: min(index, containers.count))
    addSubview(container)
    layoutContainers()
    placeSlots()
  }

  override func unmountChildComponentView(_ childComponentView: UIView, index: Int) {
    let container = containers.first { $0.subviews.contains(childComponentView) }
    // React Native asserts that a view it is taking back has none of our superviews left on it.
    childComponentView.removeFromSuperview()
    guard let container else { return }
    container.removeFromSuperview()
    containers.removeAll { $0 === container }
  }

  override func layoutSubviews() {
    super.layoutSubviews()
    layoutContainers()
    placeSlots()
  }

  /**
   Puts every node the app supplied where the chart says it belongs.

   Called from the chart's own layout rather than from an event that went out and came back, so a
   node lands in the same pass that draws the reading it belongs to.
   */
  func placeSlots() {
    for container in containers {
      guard let slot = container.subviews.first as? ZyplotSlotView,
            let layout,
            let origin = origin(for: slot.slot, in: layout, size: slot.bounds.size)
      else {
        container.isHidden = true
        continue
      }
      container.transform = CGAffineTransform(translationX: origin.x, y: origin.y)
      container.isHidden = false
    }
  }

  /**
   Bounds and centre rather than a frame: a container carries a translation, and a frame set
   through a transform is not the rectangle it was asked for.
   */
  private func layoutContainers() {
    for container in containers {
      container.bounds = CGRect(origin: .zero, size: bounds.size)
      container.center = CGPoint(x: bounds.midX, y: bounds.midY)
    }
  }

  private func origin(for slot: String, in layout: ZyplotSlotLayout, size: CGSize) -> CGPoint? {
    guard size.width > 0, size.height > 0 else { return nil }

    if slot == ZyplotSlotLayout.rangeSlot {
      return layout.span.map { chipOrigin(at: CGPoint(x: $0.centre, y: 0), size: size, in: layout.plot) }
    }

    if slot == ZyplotSlotLayout.tooltipSlot {
      return (layout.reading ?? lastReading).map {
        anchor?.isAbove == true
          ? chipOrigin(at: $0, size: size, in: layout.plot)
          : readingOrigin(at: $0, size: size, in: layout.plot)
      }
    }

    return layout.annotations[slot].map { spot in
      let align = ZyplotSlotLayout.annotationId(of: slot).flatMap { alignments[$0] }

      switch spot.run {
      case .across:
        return CGPoint(x: layout.plot.minX, y: alignedY(on: spot.at.y, size: size, align: align))
      case .down:
        return CGPoint(x: spot.at.x - size.width / 2, y: alignedY(along: layout.plot, size: size, align: align))
      case .point:
        return CGPoint(x: spot.at.x - size.width / 2, y: alignedY(on: spot.at.y, size: size, align: align))
      }
    }
  }

  /**
   Where a view sits against a mark that has no height of its own — a point, or a rule that runs
   across the plot. Centred on it unless asked otherwise: `top` puts its foot on the mark so it sits
   above, `bottom` puts its head there so it hangs below.
   */
  private func alignedY(on y: CGFloat, size: CGSize, align: String?) -> CGFloat {
    switch align {
    case "top": y - size.height
    case "bottom": y
    default: y - size.height / 2
    }
  }

  /**
   Where a view sits against a rule that runs down the plot. That rule is a mark with a height of its
   own, so the three are its head, its middle and its foot — and its head is where the chart's own
   badge goes, which is what a view for one gets unless it asks for another.
   */
  private func alignedY(along plot: CGRect, size: CGSize, align: String?) -> CGFloat {
    switch align {
    case "center": plot.midY - size.height / 2
    case "bottom": plot.maxY - size.height
    default: plot.minY
    }
  }

  /**
   Beside the reading where there is room for it, and on its other side where there is not.

   Down the plot it sits where the anchor says: against the top by the gap, which is where a card
   read as belonging to the reading goes, or halfway down the plot, or against its floor.
   */
  private func readingOrigin(at point: CGPoint, size: CGSize, in plot: CGRect) -> CGPoint {
    let gap = anchor?.resolvedGap ?? 12
    let trailing = point.x + gap
    let x = trailing + size.width <= plot.maxX ? trailing : point.x - gap - size.width
    let y = switch anchor?.align {
    case "center": plot.midY - size.height / 2
    case "bottom": plot.maxY - size.height - gap
    default: point.y + gap
    }

    return CGPoint(
      x: min(max(plot.minX, x), max(plot.minX, plot.maxX - size.width)),
      y: y
    )
  }

  /**
   Centred on the reading and lifted clear of the plot, where the rule draws its own chip. Pinned to
   the view rather than to the plot: the headroom the chip sits in is outside the plot's own box, and
   a chip read at either end still belongs over the chart.
   */
  private func chipOrigin(at point: CGPoint, size: CGSize, in plot: CGRect) -> CGPoint {
    let centred = point.x - size.width / 2

    return CGPoint(
      x: min(max(0, centred), max(0, bounds.width - size.width)),
      y: plot.minY - size.height - (anchor?.resolvedLift ?? 8)
    )
  }

  // MARK: - Chart

  private func render() {
    let decoded = configuration.data(using: .utf8).flatMap {
      try? JSONDecoder().decode(ZyplotConfiguration.self, from: $0)
    } ?? .empty
    anchor = decoded.tooltipAnchor
    alignments = decoded.annotationViewAlign ?? [:]

    let rootView = ZyplotNativeChart(
      configuration: decoded,
      onInteraction: { [weak self] payload in
        self?.onInteraction(payload.compactMapValues { $0 })
      },
      onSlotLayout: { [weak self] layout in
        guard let self else { return }
        self.layout = layout
        if let reading = layout?.reading {
          self.lastReading = reading
        }
        self.placeSlots()
      }
    )

    if let hostingController {
      hostingController.rootView = rootView
      return
    }

    let controller = UIHostingController(rootView: rootView)
    controller.view.backgroundColor = .clear
    controller.view.translatesAutoresizingMaskIntoConstraints = false
    // Below the slots, so a node the app supplied is never drawn behind the plot.
    insertSubview(controller.view, at: 0)
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

    // First, so it stays the module's default view and `requireNativeView('Zyplot')` keeps
    // resolving to the chart itself.
    View(ZyplotChartView.self) {
      Events("onInteraction")

      Prop("configuration") {
        (view: ZyplotChartView, configuration: String) in
        view.configuration = configuration
      }
    }

    View(ZyplotSlotView.self) {
      ViewName("ZyplotSlot")

      Prop("slot") {
        (view: ZyplotSlotView, slot: String) in
        view.slot = slot
      }
    }
  }
}
