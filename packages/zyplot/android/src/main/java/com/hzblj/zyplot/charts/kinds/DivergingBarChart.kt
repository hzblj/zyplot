package com.hzblj.zyplot.charts.kinds

import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.text.TextMeasurer
import com.hzblj.zyplot.charts.drawAxisText
import com.hzblj.zyplot.charts.plotRect
import com.hzblj.zyplot.core.ChartConfiguration
import kotlin.math.max

internal fun DrawScope.drawDivergingBars(
  config: ChartConfiguration,
  measurer: TextMeasurer? = null,
) {
  val plot = plotRect(config)
  val maximum = max(config.data.maxOfOrNull { kotlin.math.abs(it.value) } ?: 1.0, 1.0)
  measurer?.let {
    drawAxisText(
      config,
      it,
      yLabels = config.data.map(com.hzblj.zyplot.core.ChartDatum::label),
      xMinimum = -maximum,
      xMaximum = maximum,
    )
  }
  val center = plot.left + plot.width / 2
  val rowHeight = plot.height / max(1, config.data.size)
  drawLine(
    color = config.gridColor,
    start = Offset(center, plot.top),
    end = Offset(center, plot.bottom),
  )
  config.data.forEachIndexed { index, item ->
    val width = (kotlin.math.abs(item.value) / maximum * plot.width / 2).toFloat()
    drawRect(
      color = if (item.value >= 0) config.positiveColor else config.negativeColor,
      topLeft = Offset(
        if (item.value >= 0) center else center - width,
        plot.top + rowHeight * index + 3f,
      ),
      size = Size(width, max(2f, rowHeight - 6f)),
    )
  }
}
