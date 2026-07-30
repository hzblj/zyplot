package com.hzblj.zyplot.charts.kinds

import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.TextMeasurer
import com.hzblj.zyplot.charts.appendLine
import com.hzblj.zyplot.charts.drawAxisText
import com.hzblj.zyplot.charts.drawGrid
import com.hzblj.zyplot.charts.linePath
import com.hzblj.zyplot.charts.normalizedY
import com.hzblj.zyplot.charts.plotRect
import com.hzblj.zyplot.charts.reveal.ChartReveal
import com.hzblj.zyplot.charts.reveal.drawGlowingPath
import com.hzblj.zyplot.charts.reveal.flashed
import com.hzblj.zyplot.charts.reveal.trimmed
import com.hzblj.zyplot.core.ChartConfiguration
import com.hzblj.zyplot.core.parseColor
import kotlin.math.max

private const val DEFAULT_HIGHLIGHT_COLOR = "#ffffff"

internal fun DrawScope.drawLineOrArea(
  config: ChartConfiguration,
  progress: Float,
  reveal: ChartReveal,
  measurer: TextMeasurer? = null,
  selection: Int? = null,
) {
  val plot = plotRect(config)
  val (minimum, maximum) = config.seriesExtent
  drawGrid(config)
  measurer?.let {
    drawAxisText(config, it, minimum, maximum, xLabels = config.categories)
  }

  val entrance = config.animation.reveal
  val marker = config.interaction.marker
  val dim = if (selection != null) config.interaction.dimOpacity else 1f

  config.series.forEachIndexed { seriesIndex, series ->
    val denominator = max(1, series.values.lastIndex)
    val points = series.values.mapIndexedNotNull { index, value ->
      value?.let {
        Offset(
          x = plot.left + plot.width * index / denominator,
          y = plot.bottom + (normalizedY(it, minimum, maximum, plot) - plot.bottom) * progress,
        )
      }
    }
    if (points.isEmpty()) return@forEachIndexed
    val whole = linePath(points, config.isSmooth)
    val style = config.seriesStyles[series.id]
    val base = config.seriesColor(seriesIndex, series)
    val opacity = (style?.opacity ?: 1f) * reveal.strokeOpacity * dim
    val color = reveal
      .flashed(base, entrance?.flashColor)
      .copy(alpha = base.alpha * opacity)
    // Authored in dp, drawn in pixels.
    val strokeWidth = (style?.strokeWidth ?: 3f) * density
    val dash = style?.dashPattern?.let { PathEffect.dashPathEffect(it.toFloatArray()) }

    if (config.type == "area") {
      val area = Path().apply {
        moveTo(points.first().x, plot.bottom)
        lineTo(points.first().x, points.first().y)
        appendLine(points, config.isSmooth)
        lineTo(points.last().x, plot.bottom)
        close()
      }
      drawPath(area, base.copy(alpha = base.alpha * (style?.fillOpacity ?: 0.16f)))
    }

    if (reveal.isTracing && entrance?.trackColor != null) {
      drawGlowingPath(
        whole,
        parseColor(entrance.trackColor).copy(alpha = entrance.trackOpacity),
        strokeWidth,
        pathEffect = dash,
      )
    }

    drawGlowingPath(
      if (reveal.isTracing) whole.trimmed(reveal.fraction) else whole,
      color,
      strokeWidth,
      pathEffect = dash,
      glow = style?.glow,
      bloom = reveal.bloom,
      flashColor = entrance?.flashColor,
      flashGlow = entrance?.flashGlow ?: 4f,
      flashOpacity = entrance?.flashOpacity,
    )

    if (selection != null && marker != null && marker.isSegment && seriesIndex == 0) {
      drawSegmentHighlight(config, points, selection, marker.span, marker.color, strokeWidth)
    }

    if (style?.symbol != null && style.symbol != "none") {
      points.forEach { drawCircle(color, style.symbolSize, it) }
    }
  }
}

private fun DrawScope.drawSegmentHighlight(
  config: ChartConfiguration,
  points: List<Offset>,
  selection: Int,
  span: Int,
  color: String?,
  strokeWidth: Float,
) {
  drawHighlightWindow(
    config,
    points,
    selection,
    max(1, span - 1),
    parseColor(color ?: DEFAULT_HIGHLIGHT_COLOR),
    1f,
    strokeWidth,
  )
}

private fun DrawScope.drawHighlightWindow(
  config: ChartConfiguration,
  points: List<Offset>,
  selection: Int,
  reach: Int,
  color: Color,
  alpha: Float,
  width: Float,
) {
  val from = (selection - reach).coerceIn(0, points.size)
  val to = (selection + reach + 1).coerceIn(from, points.size)
  if (to - from < 2) return
  drawPath(
    linePath(points.subList(from, to), config.isSmooth),
    color.copy(alpha = alpha),
    style = Stroke(width = width, cap = StrokeCap.Round, join = StrokeJoin.Round),
  )
}
