package com.hzblj.zyplot.charts.kinds

import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.text.TextMeasurer
import com.hzblj.zyplot.charts.drawAxisText
import com.hzblj.zyplot.charts.paddedExtent
import com.hzblj.zyplot.charts.plotRect
import com.hzblj.zyplot.core.ChartConfiguration
import kotlin.math.max

internal fun DrawScope.drawDumbbell(
  config: ChartConfiguration,
  measurer: TextMeasurer? = null,
) {
  val rows = config.array("rows")
  val values = rows.flatMap { listOf(it.optDouble("before"), it.optDouble("after")) }
  val extent = paddedExtent(values)
  val plot = plotRect(config)
  measurer?.let {
    drawAxisText(
      config,
      it,
      yLabels = rows.map { row -> row.optString("label") },
      xMinimum = extent.first,
      xMaximum = extent.second,
    )
  }
  val rowHeight = plot.height / max(1, rows.size)
  rows.forEachIndexed { index, item ->
    val y = plot.top + rowHeight * (index + 0.5f)
    val before = plot.left + ((item.optDouble("before") - extent.first) / (extent.second - extent.first) * plot.width).toFloat()
    val after = plot.left + ((item.optDouble("after") - extent.first) / (extent.second - extent.first) * plot.width).toFloat()
    drawLine(config.gridColor, Offset(before, y), Offset(after, y), strokeWidth = 3f)
    drawCircle(config.palette[0], 6f, Offset(before, y))
    drawCircle(config.palette[1 % config.palette.size], 6f, Offset(after, y))
  }
}
