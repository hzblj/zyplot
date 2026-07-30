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
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import com.hzblj.zyplot.core.ChartConfiguration
import kotlin.math.PI
import kotlin.math.min
import kotlin.math.sin

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
    when (config.type) {
      "pie", "gauge", "meter", "radar", "sunburst" -> {
        val diameter = min(size.width, size.height) * 0.72f
        drawCircle(
          color = track,
          radius = diameter / 2f,
          style = Stroke(width = diameter * 0.22f),
        )
      }
      "bar", "stacked-bar", "histogram", "diverging-bar", "waterfall",
      "candlestick", "boxplot",
      -> drawColumns(track)
      else -> drawPath(
        skeletonCurve(),
        track,
        style = Stroke(width = 6f, cap = StrokeCap.Round, join = StrokeJoin.Round),
      )
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

private fun DrawScope.drawColumns(color: Color) {
  val ratios = listOf(0.45f, 0.7f, 0.55f, 0.85f, 0.6f, 0.95f, 0.5f, 0.75f)
  val gap = size.width * 0.02f
  val width = (size.width - gap * (ratios.size - 1)) / ratios.size
  ratios.forEachIndexed { index, ratio ->
    val height = size.height * 0.7f * ratio
    drawRoundRect(
      color = color,
      topLeft = Offset((width + gap) * index, size.height - height),
      size = Size(width, height),
      cornerRadius = androidx.compose.ui.geometry.CornerRadius(3f),
    )
  }
}

private fun DrawScope.skeletonCurve(): Path {
  val samples = 48
  val path = Path()
  for (sample in 0..samples) {
    val progress = sample.toFloat() / samples
    val wave = (sin(progress * PI * 2.2) * 0.3 + sin(progress * PI * 4.6) * 0.12).toFloat()
    val x = size.width * progress
    val y = size.height / 2f - size.height * 0.28f * wave
    if (sample == 0) path.moveTo(x, y) else path.lineTo(x, y)
  }
  return path
}
