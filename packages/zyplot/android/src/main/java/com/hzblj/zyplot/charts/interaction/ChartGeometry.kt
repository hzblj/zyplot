package com.hzblj.zyplot.charts.interaction

import com.hzblj.zyplot.charts.normalizedY
import com.hzblj.zyplot.charts.plotRect
import com.hzblj.zyplot.charts.presentation.xPosition
import com.hzblj.zyplot.core.ChartConfiguration

internal fun geometryPayload(
  config: ChartConfiguration,
  width: Float,
  height: Float,
  density: Float,
): Map<String, Any> {
  val plot = plotRect(config, width, height, density)
  val extent = config.annotatedExtent
  val annotations = config.annotations.mapNotNull { annotation ->
    val point = if (annotation.axis == "y") {
      val value = (annotation.value as? Number)?.toDouble() ?: return@mapNotNull null
      plot.left to normalizedY(value, extent.first, extent.second, plot)
    } else {
      val x = xPosition(annotation.value ?: annotation.x, config, plot.left, plot.width)
        ?: return@mapNotNull null
      val y = annotation.y?.let { normalizedY(it, extent.first, extent.second, plot) } ?: plot.top
      x to y
    }
    mapOf("id" to annotation.id, "x" to point.first / density, "y" to point.second / density)
  }
  return mapOf(
    "geometry" to mapOf(
      "annotations" to annotations,
      "plot" to mapOf(
        "height" to plot.height / density,
        "width" to plot.width / density,
        "x" to plot.left / density,
        "y" to plot.top / density,
      ),
    ),
    "phase" to "layout",
  )
}
