package com.hzblj.zyplot.bridge

import android.content.Context
import androidx.compose.foundation.layout.Box
import androidx.compose.runtime.MutableState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateOf
import com.hzblj.zyplot.charts.ZyplotChart
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.viewevent.EventDispatcher
import expo.modules.kotlin.views.ComposeProps
import expo.modules.kotlin.views.ComposableScope
import expo.modules.kotlin.views.ExpoComposeView

data class ZyplotChartProps(
  val configuration: MutableState<String> = mutableStateOf("""{"type":"line"}"""),
) : ComposeProps

data class ZyplotSlotProps(
  val slot: MutableState<String> = mutableStateOf(""),
) : ComposeProps

/**
 * A node the app supplied, mounted inside the chart.
 *
 * It carries only which slot it fills. Where it goes is the chart's to decide and the chart's to
 * apply, so a reading never has to cross into JavaScript to move it.
 */
class ZyplotSlotView(context: Context, appContext: AppContext) :
  ExpoComposeView<ZyplotSlotProps>(context, appContext) {
  override val props = ZyplotSlotProps()

  @Composable
  override fun ComposableScope.Content() {
    Children(this)
  }
}

class ZyplotChartView(context: Context, appContext: AppContext) :
  ExpoComposeView<ZyplotChartProps>(context, appContext, true) {
  val onInteraction by EventDispatcher()
  override val props = ZyplotChartProps()

  @Composable
  override fun ComposableScope.Content() {
    val scope = this

    ZyplotChart(
      configuration = props.configuration.value,
      onInteraction = { payload -> onInteraction(payload) },
      slot = { id, modifier ->
        Box(modifier) {
          Children(scope) { child -> child is ZyplotSlotView && child.props.slot.value == id }
        }
      },
    )
  }
}

class ZyplotModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("Zyplot")

    // First, so it stays the module's default view and `requireNativeView('Zyplot')` keeps
    // resolving to the chart itself.
    View(ZyplotChartView::class) {
      Events("onInteraction")

      Prop("configuration") { view: ZyplotChartView, configuration: String ->
        view.props.configuration.value = configuration
      }
    }

    View(ZyplotSlotView::class) {
      Name("ZyplotSlot")

      Prop("slot") { view: ZyplotSlotView, slot: String ->
        view.props.slot.value = slot
      }
    }
  }
}
