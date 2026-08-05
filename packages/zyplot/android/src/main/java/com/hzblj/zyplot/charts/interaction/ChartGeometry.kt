package com.hzblj.zyplot.charts.interaction

import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Rect
import com.hzblj.zyplot.charts.normalizedY
import com.hzblj.zyplot.charts.plotRect
import com.hzblj.zyplot.charts.presentation.xPosition
import com.hzblj.zyplot.core.ChartConfiguration

/**
 * How a view for an annotation is laid on its spot. A rule is not a point: its spot is where it
 * starts, not where its middle is, so a view for one runs along it and is centred only across it.
 */
internal enum class SpotRun { ACROSS, DOWN, POINT }

internal data class AnnotationSpot(val id: String, val at: Offset, val run: SpotRun)

/**
 * Where each annotation lands, in pixels. Shared by the layout report that goes out to JavaScript
 * and by the slots the chart places itself, so the two can never drift apart.
 */
internal fun annotationSpots(config: ChartConfiguration, plot: Rect): List<AnnotationSpot> {
  val extent = config.annotatedExtent

  return config.annotations.mapNotNull { annotation ->
    val point = if (annotation.axis == "y") {
      val value = (annotation.value as? Number)?.toDouble() ?: return@mapNotNull null
      Offset(plot.left, normalizedY(value, extent.first, extent.second, plot))
    } else {
      val x = xPosition(annotation.value ?: annotation.x, config, plot.left, plot.width, annotation.align)
        ?: return@mapNotNull null
      val y = annotation.y?.let { normalizedY(it, extent.first, extent.second, plot) } ?: plot.top
      Offset(x, y)
    }
    val run = when {
      annotation.type != "line" -> SpotRun.POINT
      annotation.axis == "y" -> SpotRun.ACROSS
      else -> SpotRun.DOWN
    }
    AnnotationSpot(annotation.id, point, run)
  }
}

internal fun geometryPayload(
  config: ChartConfiguration,
  width: Float,
  height: Float,
  density: Float,
): Map<String, Any> {
  val plot = plotRect(config, width, height, density)
  val annotations = annotationSpots(config, plot).map { spot ->
    mapOf("id" to spot.id, "x" to spot.at.x / density, "y" to spot.at.y / density)
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
