package com.hzblj.zyplot.charts.kinds

import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Rect
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.drawscope.clipPath
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
import com.hzblj.zyplot.core.presentation.SeriesFill
import com.hzblj.zyplot.core.presentation.SeriesStyle
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
    val strokeWidth = (style?.strokeWidth ?: 3f) * density
    val dash = style?.dashPattern?.let { PathEffect.dashPathEffect(it.toFloatArray()) }

    if (config.type == "area" || style?.fill != null) {
      drawSeriesFill(config, points, style, base, minimum, maximum, plot)
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

    if (selection != null && marker != null && marker.lightsStroke && seriesIndex == 0) {
      val reach = max(1, marker.span - 1)
      drawHighlightWindow(
        config,
        points,
        from = if (marker.isTrail) 0 else selection - reach,
        to = if (marker.isTrail) selection + 1 else selection + reach + 1,
        color = parseColor(marker.color ?: DEFAULT_HIGHLIGHT_COLOR),
        width = strokeWidth,
      )
    }

    if (style?.symbol != null && style.symbol != "none") {
      points.forEach { drawCircle(color, style.symbolSize, it) }
    }
  }
}

private fun DrawScope.drawHighlightWindow(
  config: ChartConfiguration,
  points: List<Offset>,
  from: Int,
  to: Int,
  color: Color,
  width: Float,
) {
  val start = from.coerceIn(0, points.size)
  val end = to.coerceIn(start, points.size)
  if (end - start < 2) return
  drawPath(
    linePath(points.subList(start, end), config.isSmooth),
    color,
    style = Stroke(width = width, cap = StrokeCap.Round, join = StrokeJoin.Round),
  )
}

private fun DrawScope.drawSeriesFill(
  config: ChartConfiguration,
  points: List<Offset>,
  style: SeriesStyle?,
  base: Color,
  minimum: Double,
  maximum: Double,
  plot: Rect,
) {
  val fill = style?.fill
  val floor = fill?.baseline
    ?.let { normalizedY(it.toDouble(), minimum, maximum, plot) }
    ?: plot.bottom
  val area = Path().apply {
    moveTo(points.first().x, floor)
    lineTo(points.first().x, points.first().y)
    appendLine(points, config.isSmooth)
    lineTo(points.last().x, floor)
    close()
  }
  val paint = base.copy(alpha = base.alpha * (style?.fillOpacity ?: 0.16f))

  if (fill == null || !fill.isDotted) {
    drawPath(area, paint)
    return
  }

  clipPath(area) {
    drawDotGrid(plot, fill, paint)
  }
}

private fun DrawScope.drawDotGrid(plot: Rect, fill: SeriesFill, paint: Color) {
  val spacing = fill.spacing * density
  val dotSize = fill.dotSize * density
  if (spacing <= 0f || plot.width <= 0f || plot.height <= 0f) return

  var y = plot.top
  while (y <= plot.bottom) {
    val row = Path()
    var x = plot.left
    while (x <= plot.right) {
      row.addOval(Rect(Offset(x, y) - Offset(dotSize / 2f, dotSize / 2f), Size(dotSize, dotSize)))
      x += spacing
    }
    val depth = ((y - plot.top) / plot.height).coerceIn(0f, 1f)
    drawPath(row, paint.copy(alpha = paint.alpha * (1f + (fill.fadeTo - 1f) * depth)))
    y += spacing
  }
}
