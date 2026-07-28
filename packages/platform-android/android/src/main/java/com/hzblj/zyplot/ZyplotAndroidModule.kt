package com.hzblj.zyplot

import android.content.Context
import androidx.compose.foundation.Canvas
import androidx.compose.runtime.MutableState
import androidx.compose.runtime.mutableStateOf
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.views.ComposeProps
import expo.modules.kotlin.views.ExpoComposeView

class ZyplotPoint : Record {
  @Field val x: Double = 0.0
  @Field val y: Double = 0.0
}

class ZyplotSeries : Record {
  @Field val id: String = ""
  @Field val label: String = ""
  @Field val color: String? = null
  @Field val data: List<ZyplotPoint> = emptyList()
}

data class ZyplotLineChartProps(
  val series: MutableState<List<ZyplotSeries>> = mutableStateOf(emptyList()),
) : ComposeProps

class ZyplotLineChartView(context: Context, appContext: AppContext) :
  ExpoComposeView<ZyplotLineChartProps>(context, appContext) {
  override val props = ZyplotLineChartProps()

  init {
    setContent {
      val lines = props.series.value
      Canvas(modifier = Modifier) {
        lines.forEach { line ->
          val points = line.data
          val maxX = points.maxOfOrNull { it.x } ?: 1.0
          val maxY = points.maxOfOrNull { it.y } ?: 1.0
          points.zipWithNext().forEach { (start, end) ->
            drawLine(
              color = Color(0xFF6366F1),
              start = Offset((start.x / maxX * size.width).toFloat(), size.height - (start.y / maxY * size.height).toFloat()),
              end = Offset((end.x / maxX * size.width).toFloat(), size.height - (end.y / maxY * size.height).toFloat()),
              strokeWidth = 4f,
            )
          }
        }
      }
    }
  }
}

class ZyplotAndroidModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ZyplotAndroid")
    View(ZyplotLineChartView::class) {
      Prop("series") { view: ZyplotLineChartView, series: List<ZyplotSeries> ->
        view.props.series.value = series
      }
    }
  }
}
