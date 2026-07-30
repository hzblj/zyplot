package com.hzblj.zyplot.charts.kinds

import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Rect
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import com.hzblj.zyplot.core.ChartConfiguration
import kotlin.math.max

internal fun DrawScope.drawPie(config: ChartConfiguration) {
  val total = max(config.data.sumOf { max(0.0, it.value) }, 1.0)
  val radius = minOf(size.width, size.height) * 0.38f
  val rect = Rect(
    center = Offset(size.width / 2, size.height / 2),
    radius = radius,
  )
  var start = -90f
  config.data.forEachIndexed { index, item ->
    val sweep = (max(0.0, item.value) / total * 360).toFloat()
    drawArc(
      color = config.colorFor(index, item.color, item.slot),
      startAngle = start,
      sweepAngle = sweep,
      useCenter = config.innerRadius <= 0,
      topLeft = rect.topLeft,
      size = rect.size,
      style = if (config.innerRadius > 0) {
        Stroke(width = radius * (1 - config.innerRadius.coerceIn(0.1, 0.85)).toFloat())
      } else {
        androidx.compose.ui.graphics.drawscope.Fill
      },
    )
    start += sweep
  }
}
