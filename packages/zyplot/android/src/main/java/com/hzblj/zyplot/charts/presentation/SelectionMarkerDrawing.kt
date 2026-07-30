package com.hzblj.zyplot.charts.presentation

import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.drawscope.DrawScope
import com.hzblj.zyplot.charts.normalizedY
import com.hzblj.zyplot.core.ChartConfiguration
import com.hzblj.zyplot.core.parseColor

internal fun DrawScope.drawSelectionMarker(
  config: ChartConfiguration,
  pointer: Offset?,
  value: Double?,
) {
  val marker = config.interaction.marker ?: return
  if (pointer == null || value == null) return
  val plot = presentationPlotRect(config)
  val at = pointerOnPlot(pointer, plot) ?: return
  val extent = config.markExtent
  val y = normalizedY(value, extent.first, extent.second, plot)
  val radius = marker.size / 2f * density
  val color = marker.color?.let(::parseColor)
    ?: config.series.firstOrNull()?.color?.let(::parseColor)
    ?: config.palette[0]
  val centre = Offset(at.x, y)

  if (marker.lightsStroke) {
    val glow = marker.glow ?: return
    val glowColor = (glow.color?.let(::parseColor) ?: color).copy(alpha = glow.opacity)
    val spread = glow.radius * density
    drawCircle(
      brush = Brush.radialGradient(
        colors = listOf(glowColor, glowColor.copy(alpha = 0f)),
        center = centre,
        radius = spread,
      ),
      radius = spread,
      center = centre,
    )
    return
  }

  marker.glow?.let { glow ->
    val glowColor = (glow.color?.let(::parseColor) ?: color).copy(alpha = glow.opacity)
    for (pass in GLOW_PASSES downTo 1) {
      drawCircle(
        glowColor.copy(alpha = glowColor.alpha * 0.32f / pass),
        radius = radius + glow.radius * pass / GLOW_PASSES,
        center = centre,
      )
    }
  }
  drawCircle(color, radius = radius, center = centre)
}
