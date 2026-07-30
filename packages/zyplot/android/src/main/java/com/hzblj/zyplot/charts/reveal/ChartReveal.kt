package com.hzblj.zyplot.charts.reveal

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.LinearOutSlowInEasing
import androidx.compose.animation.core.tween
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.graphics.PathMeasure
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.lerp
import com.hzblj.zyplot.charts.chartEasing
import com.hzblj.zyplot.core.ChartConfiguration
import com.hzblj.zyplot.core.parseColor
import com.hzblj.zyplot.core.presentation.Glow
import kotlin.math.sqrt
import kotlinx.coroutines.delay

data class ChartReveal(
  val fraction: Float = 1f,
  val flash: Float = 0f,
  val isTracing: Boolean = false,
  val opacity: Float = 1f,
  val startOpacity: Float = 0.5f,
) {
  val bloom: Float get() = if (isTracing) sqrt(fraction) else flash

  val strokeOpacity: Float
    get() = if (isTracing) startOpacity + (1f - startOpacity) * fraction else 1f

  companion object {
    val Settled = ChartReveal()
  }
}

@Composable
internal fun rememberChartReveal(config: ChartConfiguration): ChartReveal {
  val reveal = config.animation.reveal
  if (reveal == null || !config.animation.enabled || !config.animation.initial) {
    return ChartReveal.Settled
  }
  val trace = remember { Animatable(0f) }
  val flash = remember { Animatable(1f) }
  LaunchedEffect(Unit) {
    if (config.animation.delayMillis > 0) {
      delay(config.animation.delayMillis.toLong())
    }
    if (reveal.isDrawn) {
      trace.animateTo(
        1f,
        tween(reveal.durationMillis, easing = chartEasing(reveal.easing, LinearEasing)),
      )
      if (reveal.flashHoldMillis > 0) delay(reveal.flashHoldMillis.toLong())
      flash.animateTo(
        0f,
        tween(
          reveal.flashDurationMillis,
          easing = chartEasing(reveal.flashEasing, LinearOutSlowInEasing),
        ),
      )
    } else {
      flash.snapTo(0f)
      trace.animateTo(
        1f,
        tween(reveal.durationMillis, easing = chartEasing(reveal.easing, LinearOutSlowInEasing)),
      )
    }
  }
  if (reveal.isFaded) {
    return ChartReveal(opacity = trace.value)
  }
  return ChartReveal(
    fraction = trace.value,
    flash = flash.value,
    isTracing = trace.value < 1f,
    startOpacity = reveal.startOpacity,
  )
}

internal fun ChartReveal.flashed(base: Color, flashColor: String?): Color {
  if (flash <= 0f || flashColor == null) return base
  return lerp(base, parseColor(flashColor), flash.coerceIn(0f, 1f))
}

internal fun DrawScope.drawGlowingPath(
  path: Path,
  color: Color,
  strokeWidth: Float,
  pathEffect: PathEffect? = null,
  glow: Glow? = null,
  bloom: Float = 0f,
  flashColor: String? = null,
  flashGlow: Float = 4f,
  flashOpacity: Float? = null,
) {
  val resting = glow?.opacity ?: 0.8f
  val peak = flashOpacity ?: minOf(0.85f, resting * flashGlow)
  val spread = 1f + (flashGlow - 1f) * bloom
  val radius = when {
    glow != null -> glow.radius * spread
    bloom > 0f && flashColor != null -> 4f * spread
    else -> 0f
  }
  if (radius > 0f) {
    val opacity = resting + (peak - resting) * bloom
    val base = glow?.color?.let(::parseColor) ?: color
    val scale = minOf(0.99f, opacity) / PASS_WEIGHT_SUM
    for (pass in PASSES downTo 1) {
      drawPath(
        path,
        base.copy(alpha = scale * PASS_WEIGHTS[pass - 1]),
        style = Stroke(
          width = strokeWidth + radius * 2f * pass / PASSES,
          cap = StrokeCap.Round,
          join = StrokeJoin.Round,
          pathEffect = pathEffect,
        ),
      )
    }
  }
  drawPath(
    path,
    color,
    style = Stroke(
      width = strokeWidth,
      cap = StrokeCap.Round,
      join = StrokeJoin.Round,
      pathEffect = pathEffect,
    ),
  )
}

internal fun Path.trimmed(fraction: Float): Path {
  val clamped = fraction.coerceIn(0f, 1f)
  if (clamped >= 1f) return this
  val measure = PathMeasure().apply { setPath(this@trimmed, false) }
  val trimmed = Path()
  measure.getSegment(0f, measure.length * clamped, trimmed, true)
  return trimmed
}

private const val PASSES = 16

private val PASS_WEIGHTS = FloatArray(PASSES) { 1f / (it + 1) }

private val PASS_WEIGHT_SUM = PASS_WEIGHTS.sum()
