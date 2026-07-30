package com.hzblj.zyplot.charts.kinds

import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Rect
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import com.hzblj.zyplot.core.ChartConfiguration
import kotlin.math.max

internal fun DrawScope.drawSunburst(config: ChartConfiguration) {
  val nodes = config.array("hierarchy")
  val totals = nodes.map { nodeTotal(it) }
  val total = max(totals.sum(), 1.0)
  val radius = minOf(size.width, size.height) * 0.4f
  val rect = Rect(center = Offset(size.width / 2, size.height / 2), radius = radius)
  var start = -90f
  nodes.forEachIndexed { index, _ ->
    val sweep = (totals[index] / total * 360).toFloat()
    drawArc(
      color = config.colorFor(index),
      startAngle = start,
      sweepAngle = sweep,
      useCenter = false,
      topLeft = rect.topLeft,
      size = rect.size,
      style = Stroke(width = radius * 0.52f),
    )
    start += sweep
  }
}
