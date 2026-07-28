package com.hzblj.zyplot.charts.cartesian

import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.TextMeasurer
import com.hzblj.zyplot.charts.drawAxisText
import com.hzblj.zyplot.charts.drawGrid
import com.hzblj.zyplot.charts.normalizedY
import com.hzblj.zyplot.charts.plotRect
import com.hzblj.zyplot.charts.paddedExtent
import com.hzblj.zyplot.charts.valuesExtent
import com.hzblj.zyplot.core.ChartConfiguration
import com.hzblj.zyplot.core.parseColor
import kotlin.math.max

internal fun DrawScope.drawCartesianChart(
  config: ChartConfiguration,
  progress: Float = 1f,
  measurer: TextMeasurer? = null,
) {
  when (config.type) {
    "line", "area" -> drawLineOrArea(config, progress, measurer)
    "bar", "stacked-bar" -> drawBars(config, progress, measurer)
    "diverging-bar" -> drawDivergingBars(config, measurer)
    "histogram" -> drawHistogram(config)
    "scatter" -> drawScatter(config, measurer)
    "time-series" -> drawTimeSeries(config)
    // A sparkline is a glyph, not a chart you read values off — no axis text.
    "sparkline" -> drawSparkline(config)
  }
}

private fun DrawScope.drawLineOrArea(
  config: ChartConfiguration,
  progress: Float,
  measurer: TextMeasurer? = null,
) {
  val plot = plotRect(config)
  val allValues = config.series.flatMap { it.values.filterNotNull() }
  val (minimum, maximum) = config.valueExtent(allValues)
  drawGrid(config)
  measurer?.let {
    drawAxisText(config, it, minimum, maximum, xLabels = config.categories)
  }

  config.series.forEachIndexed { seriesIndex, series ->
    val points = series.values.mapIndexedNotNull { index, value ->
      value?.let {
        val denominator = max(1, series.values.lastIndex)
        Offset(
          x = plot.left + plot.width * index / denominator,
          y = plot.bottom + (
            normalizedY(it, minimum, maximum, plot) - plot.bottom
            ) * progress,
        )
      }
    }
    if (points.isEmpty()) return@forEachIndexed
    val path = linePath(points, config.isSmooth)
    val style = config.seriesStyles[series.id]
    val base = config.seriesColor(seriesIndex, series)
    // `seriesColor` already carries the emphasis dim, so the series' own opacity
    // scales it rather than replacing it.
    val color = base.copy(alpha = base.alpha * (style?.opacity ?: 1f))
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
    drawPath(
      path,
      color,
      style = Stroke(
        width = style?.strokeWidth ?: 3f,
        pathEffect = style?.strokeDash
          ?.takeIf { it.size >= 2 }
          ?.let { PathEffect.dashPathEffect(it.toFloatArray()) },
      ),
    )
    if (style?.symbol != null && style.symbol != "none") {
      points.forEach { drawCircle(color, style.symbolSize, it) }
    }
  }
}

private fun DrawScope.drawBars(
  config: ChartConfiguration,
  progress: Float,
  measurer: TextMeasurer? = null,
) {
  val plot = plotRect(config)
  val values = config.series.flatMap { it.values.filterNotNull() }
  val maximum = max(values.maxOrNull() ?: 1.0, 1.0)
  drawGrid(config)
  measurer?.let {
    // Bars are anchored at zero, so the tick scale has to start there too.
    if (config.isHorizontal) {
      drawAxisText(config, it, 0.0, maximum, xMinimum = 0.0, xMaximum = maximum)
    } else {
      drawAxisText(config, it, 0.0, maximum, xLabels = config.categories)
    }
  }
  val categoryCount = max(1, config.categories.size)
  // Categories are laid out along whichever axis is *not* carrying the value, so
  // the band runs down the plot height once the bars point sideways.
  val categoryWidth =
    if (config.isHorizontal) plot.height / categoryCount else plot.width / categoryCount

  config.categories.indices.forEach { categoryIndex ->
    if (config.type == "stacked-bar") {
      var accumulated = 0.0
      config.series.forEachIndexed { seriesIndex, series ->
        val value = series.values.getOrNull(categoryIndex) ?: return@forEachIndexed
        val next = accumulated + value
        val color = config.seriesColor(seriesIndex, series)
        val band = plot.top + categoryWidth * categoryIndex + categoryWidth * 0.18f
        val thickness = categoryWidth * 0.64f
        if (config.isHorizontal) {
          val start = plot.left + (accumulated / maximum * plot.width).toFloat()
          val target = plot.left + (next / maximum * plot.width).toFloat()
          val end = start + (target - start) * progress
          drawRect(
            color = color,
            topLeft = Offset(start, band),
            size = Size(max(0f, end - start), thickness),
          )
        } else {
          val bottom = normalizedY(accumulated, 0.0, maximum, plot)
          val targetTop = normalizedY(next, 0.0, maximum, plot)
          val top = bottom + (targetTop - bottom) * progress
          drawRect(
            color = color,
            topLeft = Offset(
              plot.left + categoryWidth * categoryIndex + categoryWidth * 0.18f,
              top,
            ),
            size = Size(thickness, bottom - top),
          )
        }
        accumulated = next
      }
    } else {
      val barWidth = categoryWidth * 0.72f / max(1, config.series.size)
      config.series.forEachIndexed { seriesIndex, series ->
        val value = series.values.getOrNull(categoryIndex) ?: return@forEachIndexed
        val color = config.seriesColor(seriesIndex, series)
        if (config.isHorizontal) {
          val length = (value / maximum * plot.width).toFloat() * progress
          drawRect(
            color = color,
            topLeft = Offset(
              plot.left,
              plot.top + categoryWidth * categoryIndex + categoryWidth * 0.14f +
                barWidth * seriesIndex,
            ),
            size = Size(max(0f, length), max(2f, barWidth - 2f)),
          )
        } else {
          val targetTop = normalizedY(value, 0.0, maximum, plot)
          val top = plot.bottom + (targetTop - plot.bottom) * progress
          drawRect(
            color = color,
            topLeft = Offset(
              plot.left + categoryWidth * categoryIndex + categoryWidth * 0.14f +
                barWidth * seriesIndex,
              top,
            ),
            size = Size(max(2f, barWidth - 2f), plot.bottom - top),
          )
        }
      }
    }
  }
}

private fun DrawScope.drawDivergingBars(
  config: ChartConfiguration,
  measurer: TextMeasurer? = null,
) {
  val plot = plotRect(config)
  val maximum = max(config.data.maxOfOrNull { kotlin.math.abs(it.value) } ?: 1.0, 1.0)
  // The bars diverge from a centre line, so the value axis runs -max..max.
  measurer?.let {
    drawAxisText(
      config,
      it,
      yLabels = config.data.map(com.hzblj.zyplot.core.ChartDatum::label),
      xMinimum = -maximum,
      xMaximum = maximum,
    )
  }
  val center = plot.left + plot.width / 2
  val rowHeight = plot.height / max(1, config.data.size)
  drawLine(
    color = config.gridColor,
    start = Offset(center, plot.top),
    end = Offset(center, plot.bottom),
  )
  config.data.forEachIndexed { index, item ->
    val width = (kotlin.math.abs(item.value) / maximum * plot.width / 2).toFloat()
    drawRect(
      color = if (item.value >= 0) config.positiveColor else config.negativeColor,
      topLeft = Offset(
        if (item.value >= 0) center else center - width,
        plot.top + rowHeight * index + 3f,
      ),
      size = Size(width, max(2f, rowHeight - 6f)),
    )
  }
}

private fun DrawScope.drawHistogram(config: ChartConfiguration) {
  val values = config.values
  if (values.isEmpty()) return
  val plot = plotRect(config)
  val minimum = values.min()
  val maximum = values.max()
  val count = config.binCount.coerceAtLeast(1)
  val width = (maximum - minimum).takeIf { it > 0 }?.div(count) ?: 1.0
  val bins = IntArray(count)
  values.forEach {
    bins[((it - minimum) / width).toInt().coerceIn(0, count - 1)] += 1
  }
  val maximumCount = bins.maxOrNull()?.coerceAtLeast(1) ?: 1
  drawGrid(config)
  bins.forEachIndexed { index, value ->
    val barWidth = plot.width / count
    val height = plot.height * value / maximumCount
    drawRect(
      color = config.palette[0],
      topLeft = Offset(plot.left + barWidth * index + 1f, plot.bottom - height),
      size = Size(barWidth - 2f, height),
    )
  }
}

private fun DrawScope.drawScatter(
  config: ChartConfiguration,
  measurer: TextMeasurer? = null,
) {
  val plot = plotRect(config)
  val points = config.scatterSeries.flatMap { it.points }
  // Points, not bars: inset the domain so a marker at the extreme is not
  // bisected by the axis it sits on.
  val xExtent = paddedExtent(points.map { it.x })
  val yExtent = paddedExtent(points.map { it.y })
  drawGrid(config)
  measurer?.let {
    drawAxisText(
      config,
      it,
      yExtent.first,
      yExtent.second,
      xMinimum = xExtent.first,
      xMaximum = xExtent.second,
    )
  }
  config.scatterSeries.forEachIndexed { index, series ->
    val color = config.colorFor(index, series.color, series.slot)
      .copy(alpha = config.dimming(series.id))
    series.points.forEach { point ->
      val x = plot.left + ((point.x - xExtent.first) / (xExtent.second - xExtent.first) * plot.width).toFloat()
      val y = normalizedY(point.y, yExtent.first, yExtent.second, plot)
      drawCircle(color, radius = (point.size ?: 30.0).toFloat().coerceIn(4f, 16f), center = Offset(x, y))
    }
  }
}

private fun DrawScope.drawTimeSeries(config: ChartConfiguration) {
  val points = config.objectValue("points") ?: return
  val timestamps = points.optJSONArray("timestamps") ?: return
  val values = points.optJSONArray("values") ?: return
  val plot = plotRect(config)
  val all = buildList {
    for (seriesIndex in 0 until values.length()) {
      val row = values.optJSONArray(seriesIndex) ?: continue
      for (index in 0 until row.length()) if (!row.isNull(index)) add(row.optDouble(index))
    }
  }
  val extent = valuesExtent(all)
  drawGrid(config)
  for (seriesIndex in 0 until values.length()) {
    val row = values.optJSONArray(seriesIndex) ?: continue
    val path = Path()
    var started = false
    for (index in 0 until minOf(row.length(), timestamps.length())) {
      if (row.isNull(index)) {
        started = false
        continue
      }
      val x = plot.left + plot.width * index / max(1, timestamps.length() - 1)
      val y = normalizedY(row.optDouble(index), extent.first, extent.second, plot)
      if (started) path.lineTo(x, y) else path.moveTo(x, y)
      started = true
    }
    drawPath(path, config.colorFor(seriesIndex), style = Stroke(width = 3f))
  }
}

private fun DrawScope.drawSparkline(config: ChartConfiguration) {
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

/**
 * Builds the stroke through [points], optionally smoothed.
 *
 * Smoothing uses a Catmull-Rom spline converted to cubic beziers, which is what
 * both the web renderer and Swift Charts draw for `isSmooth`. A plain
 * `quadraticTo` midpoint curve would undershoot every peak and make the three
 * platforms disagree about where the maximum sits.
 */
internal fun linePath(points: List<Offset>, isSmooth: Boolean): Path {
  val path = Path()
  if (points.isEmpty()) return path
  path.moveTo(points.first().x, points.first().y)
  path.appendLine(points, isSmooth)
  return path
}

/**
 * Appends the segments through [points] to an already-positioned path.
 *
 * Kept separate from [linePath] so the area fill can start at the baseline and
 * still trace the identical curve — appending a second `Path` instead would open
 * a new contour and leave the fill unclosed.
 */
internal fun Path.appendLine(points: List<Offset>, isSmooth: Boolean) {
  if (!isSmooth || points.size < 3) {
    points.drop(1).forEach { lineTo(it.x, it.y) }
    return
  }
  for (index in 0 until points.lastIndex) {
    val previous = points[max(0, index - 1)]
    val current = points[index]
    val next = points[index + 1]
    val following = points[minOf(points.lastIndex, index + 2)]
    cubicTo(
      current.x + (next.x - previous.x) / 6f,
      current.y + (next.y - previous.y) / 6f,
      next.x - (following.x - current.x) / 6f,
      next.y - (following.y - current.y) / 6f,
      next.x,
      next.y,
    )
  }
}
