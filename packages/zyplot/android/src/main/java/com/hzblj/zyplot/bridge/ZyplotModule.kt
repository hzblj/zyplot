package com.hzblj.zyplot.bridge

import android.content.Context
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

class ZyplotChartView(context: Context, appContext: AppContext) :
  ExpoComposeView<ZyplotChartProps>(context, appContext, true) {
  val onInteraction by EventDispatcher()
  override val props = ZyplotChartProps()

  @Composable
  override fun ComposableScope.Content() {
    ZyplotChart(
      configuration = props.configuration.value,
      onInteraction = { payload -> onInteraction(payload) },
    )
  }
}

class ZyplotModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("Zyplot")

    View(ZyplotChartView::class) {
      Events("onInteraction")

      Prop("configuration") { view: ZyplotChartView, configuration: String ->
        view.props.configuration.value = configuration
      }
    }
  }
}
