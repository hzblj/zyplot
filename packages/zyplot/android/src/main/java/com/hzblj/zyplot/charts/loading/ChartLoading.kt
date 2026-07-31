package com.hzblj.zyplot.charts.loading

import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Rect
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import com.hzblj.zyplot.charts.drawGrid
import com.hzblj.zyplot.charts.normalizedY
import com.hzblj.zyplot.charts.overlayLabelInset
import com.hzblj.zyplot.charts.plotRect
import com.hzblj.zyplot.charts.xLabelGap
import com.hzblj.zyplot.charts.yLabelGap
import com.hzblj.zyplot.core.ChartConfiguration
import kotlin.math.PI
import kotlin.math.max
import kotlin.math.min
import kotlin.math.sin

private const val COLUMN_COUNT = 8

/** In dp: what a label is taken to be, measured the way `overlayGutter` measures it. */
private const val LABEL_CHAR = 6.4f
private const val LABEL_HEIGHT = 9f
private const val LABEL_RADIUS = 2f

private val RADIAL_KINDS = setOf("pie", "gauge", "meter", "radar", "sunburst")
private val COLUMN_KINDS = setOf(
  "bar", "stacked-bar", "histogram", "diverging-bar", "waterfall", "candlestick", "boxplot",
)

/**
 * The chart before its data: the same marks in the track colour, in the same plot the chart itself
 * will draw in, with a pill wherever a label is about to be written, so nothing moves when the
 * values land.
 */
@Composable
fun ChartLoadingPlaceholder(
  config: ChartConfiguration,
  modifier: Modifier = Modifier,
) {
  val transition = rememberInfiniteTransition(label = "zyplot-chart-loading")
  val sweep by transition.animateFloat(
    initialValue = -0.5f,
    targetValue = 1.5f,
    animationSpec = infiniteRepeatable(
      animation = tween(1_200, easing = LinearEasing),
      repeatMode = RepeatMode.Restart,
    ),
    label = "zyplot-chart-loading-sweep",
  )

  Canvas(modifier = modifier.fillMaxSize()) {
    val track = config.trackColor.copy(alpha = 0.16f)
    if (config.type in RADIAL_KINDS) {
      val diameter = min(size.width, size.height) * 0.72f
      drawCircle(color = track, radius = diameter / 2f, style = Stroke(width = diameter * 0.22f))
    } else {
      val plot = plotRect(config)
      // The chart's own furniture, drawn by the same helper the charts use, so it lands where it will.
      drawGrid(config)
      if (config.type in COLUMN_KINDS) {
        drawColumns(track, plot, config.categories.size)
      } else {
        drawPath(
          skeletonCurve(plot),
          track,
          style = Stroke(width = 6f, cap = StrokeCap.Round, join = StrokeJoin.Round),
        )
      }
      drawLabels(track, config, plot)
    }
    drawRect(
      brush = Brush.horizontalGradient(
        colors = listOf(Color.Transparent, config.contentColor.copy(alpha = 0.08f), Color.Transparent),
        startX = size.width * sweep,
        endX = size.width * (sweep + 0.5f),
      ),
      topLeft = Offset.Zero,
      size = size,
    )
  }
}

/**
 * One band per category, held to the plot the way `drawBars` holds its own. The heights stay well
 * under the top of it: an axis rounds its domain up past the tallest bar, so a column that fills the
 * plot is taller than the data that lands.
 */
private fun DrawScope.drawColumns(color: Color, plot: Rect, categories: Int) {
  val ratios = listOf(0.28f, 0.44f, 0.34f, 0.53f, 0.37f, 0.59f, 0.31f, 0.47f)
  val count = if (categories > 0) categories else COLUMN_COUNT
  val band = plot.width / count
  repeat(count) { index ->
    val height = plot.height * ratios[index % ratios.size]
    drawRoundRect(
      color = color,
      topLeft = Offset(plot.left + band * index + band * 0.14f, plot.bottom - height),
      size = Size(max(2f, band * 0.72f - 2f), height),
      cornerRadius = CornerRadius(3f),
    )
  }
}

/**
 * A pill for every label the axes are about to write, on the lines `drawAxisText` writes them on:
 * the value axis' own readings, and the categories the x axis names.
 */
private fun DrawScope.drawLabels(color: Color, config: ChartConfiguration, plot: Rect) {
  val height = LABEL_HEIGHT * density
  val gap = yLabelGap(config, density)

  if (config.yAxisVisible) {
    val minimum = config.yAxis.domain.minimum ?: 0.0
    val maximum = config.yAxis.domain.maximum
      ?: max(config.seriesValues.maxOrNull() ?: 1.0, 1.0)
    val values = config.yAxis.tickValues.ifEmpty {
      (0..config.yAxis.tickCount).map { minimum + (maximum - minimum) * it / config.yAxis.tickCount }
    }
    values.forEach { value ->
      val width = config.yAxisFormat.format(value).length * LABEL_CHAR * density
      val top = (normalizedY(value, minimum, maximum, plot) - height / 2f)
        .coerceIn(plot.top, (plot.bottom - height).coerceAtLeast(plot.top))
      val left = when {
        config.overlaysYAxis -> size.width - overlayLabelInset(config, density) - width
        config.yAxisAtEnd -> plot.right + gap
        else -> plot.left - gap - width
      }
      drawLabel(color, left.coerceAtLeast(0f), top, width, height)
    }
  }

  if (!config.xAxisVisible || config.categories.isEmpty()) {
    return
  }

  val named = config.xAxis.tickCategories.ifEmpty { config.categories }
  val band = plot.width / config.categories.size
  config.categories.forEachIndexed { index, category ->
    if (category !in named) {
      return@forEachIndexed
    }
    val width = category.length * LABEL_CHAR * density
    val centre = plot.left + band * (index + 0.5f)
    drawLabel(color, centre - width / 2f, plot.bottom + xLabelGap(config, density), width, height)
  }
}

private fun DrawScope.drawLabel(color: Color, left: Float, top: Float, width: Float, height: Float) {
  drawRoundRect(
    color = color,
    topLeft = Offset(left, top),
    size = Size(width, height),
    cornerRadius = CornerRadius(LABEL_RADIUS * density),
  )
}

private fun skeletonCurve(plot: Rect): Path {
  val samples = 48
  val path = Path()
  for (sample in 0..samples) {
    val progress = sample.toFloat() / samples
    val wave = (sin(progress * PI * 2.2) * 0.3 + sin(progress * PI * 4.6) * 0.12).toFloat()
    val x = plot.left + plot.width * progress
    val y = plot.center.y - plot.height * 0.28f * wave
    if (sample == 0) path.moveTo(x, y) else path.lineTo(x, y)
  }
  return path
}
