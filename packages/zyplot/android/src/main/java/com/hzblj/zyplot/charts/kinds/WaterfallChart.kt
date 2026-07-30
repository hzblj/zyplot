package com.hzblj.zyplot.charts.kinds

import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.text.TextMeasurer
import com.hzblj.zyplot.charts.drawAxisText
import com.hzblj.zyplot.charts.normalizedY
import com.hzblj.zyplot.charts.plotRect
import com.hzblj.zyplot.charts.valuesExtent
import com.hzblj.zyplot.core.ChartConfiguration
import com.hzblj.zyplot.core.ChartDatum
import kotlin.math.abs
import kotlin.math.max

internal fun DrawScope.drawWaterfall(
  config: ChartConfiguration,
  measurer: TextMeasurer? = null,
) {
  val plot = plotRect(config)
  val running = mutableListOf(0.0)
  config.data.forEach { running += running.last() + it.value }
  val extent = valuesExtent(running)
  measurer?.let {
    drawAxisText(
      config,
      it,
      extent.first,
      extent.second,
      xLabels = config.data.map(ChartDatum::label),
    )
  }
  val width = plot.width / max(1, config.data.size)
  config.data.forEachIndexed { index, item ->
    val start = normalizedY(running[index], extent.first, extent.second, plot)
    val end = normalizedY(running[index + 1], extent.first, extent.second, plot)
    drawRect(
      if (item.value >= 0) config.positiveColor else config.negativeColor,
      topLeft = Offset(plot.left + width * index + width * 0.15f, minOf(start, end)),
      size = Size(width * 0.7f, max(2f, abs(start - end))),
    )
  }
}
