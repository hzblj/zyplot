package com.hzblj.zyplot.charts.kinds

import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.text.TextMeasurer
import com.hzblj.zyplot.charts.drawAxisText
import com.hzblj.zyplot.charts.plotRect
import com.hzblj.zyplot.core.ChartConfiguration
import kotlin.math.max

internal fun DrawScope.drawHeatmap(
  config: ChartConfiguration,
  measurer: TextMeasurer? = null,
) {
  val cells = config.array("cells")
  val columns = max(1, config.columns.size)
  val rows = max(1, config.rowLabels.size)
  val plot = plotRect(config)
  measurer?.let {
    drawAxisText(config, it, xLabels = config.columns, yLabels = config.rowLabels)
  }
  val cellWidth = plot.width / columns
  val cellHeight = plot.height / rows
  val maximum = cells.maxOfOrNull { it.optDouble("value") }?.coerceAtLeast(1.0) ?: 1.0
  cells.forEach {
    if (it.isNull("value")) return@forEach
    val column = it.optInt("columnIndex")
    val row = it.optInt("rowIndex")
    drawRect(
      config.palette[0].copy(alpha = (it.optDouble("value") / maximum).toFloat().coerceIn(0.12f, 1f)),
      topLeft = Offset(
        plot.left + column * cellWidth + 1,
        plot.top + row * cellHeight + 1,
      ),
      size = Size(cellWidth - 2, cellHeight - 2),
    )
  }
}
