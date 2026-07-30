package com.hzblj.zyplot.charts.kinds

import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import com.hzblj.zyplot.charts.normalizedY
import com.hzblj.zyplot.charts.plotRect
import com.hzblj.zyplot.charts.valuesExtent
import com.hzblj.zyplot.charts.linePath
import com.hzblj.zyplot.core.ChartConfiguration
import com.hzblj.zyplot.core.parseColor
import kotlin.math.max

internal fun DrawScope.drawSparkline(config: ChartConfiguration) {
  val plot = plotRect(config)
  val extent = valuesExtent(config.values)
  val points = config.values.mapIndexed { index, value ->
    Offset(
      x = plot.left + plot.width * index / max(1, config.values.lastIndex),
      y = normalizedY(value, extent.first, extent.second, plot),
    )
  }
  drawPath(
    linePath(points, config.isSmooth),
    config.color?.let(::parseColor) ?: config.palette[0],
    style = Stroke(width = 3f),
  )
}
