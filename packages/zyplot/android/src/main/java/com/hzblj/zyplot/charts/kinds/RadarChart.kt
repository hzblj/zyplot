package com.hzblj.zyplot.charts.kinds

import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import com.hzblj.zyplot.core.ChartConfiguration
import kotlin.math.max

internal fun DrawScope.drawRadar(config: ChartConfiguration) {
  val axes = config.array("axes")
  if (axes.size < 3) return
  val center = Offset(size.width / 2, size.height / 2)
  val radius = minOf(size.width, size.height) * 0.36f

  repeat(4) { ring ->
    drawPath(
      polygon(center, radius * (ring + 1) / 4, axes.size),
      config.gridColor,
      style = Stroke(width = 1f),
    )
  }
  axes.indices.forEach { index ->
    drawLine(
      config.gridColor,
      start = center,
      end = radarPoint(center, radius, index, axes.size),
    )
  }
  config.series.forEachIndexed { seriesIndex, series ->
    val path = Path()
    axes.indices.forEach { index ->
      val maxValue = axes[index].optDouble("max", 1.0).coerceAtLeast(1.0)
      val value = series.values.getOrNull(index) ?: 0.0
      val point = radarPoint(center, radius * (value / maxValue).toFloat(), index, axes.size)
      if (index == 0) path.moveTo(point.x, point.y) else path.lineTo(point.x, point.y)
    }
    path.close()
    val color = config.colorFor(seriesIndex, series.color, series.slot)
    drawPath(path, color.copy(alpha = 0.14f))
    drawPath(path, color, style = Stroke(width = 3f))
  }
}
