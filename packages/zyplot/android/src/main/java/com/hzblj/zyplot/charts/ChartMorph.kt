package com.hzblj.zyplot.charts

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.tween
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.hzblj.zyplot.core.ChartConfiguration
import com.hzblj.zyplot.core.ChartSeries
import com.hzblj.zyplot.core.MorphFrame
import com.hzblj.zyplot.core.presentation.AxisOptions
import com.hzblj.zyplot.core.presentation.ChartAnnotation

internal class ChartMorph(
  private val from: ChartConfiguration?,
  private val morphs: Boolean,
  private val progress: Animatable<Float, *>,
  private val shown: ChartConfiguration,
) {
  fun frame(config: ChartConfiguration): ChartConfiguration {
    if (morphs && shown.datasetKey != config.datasetKey) return shown
    val start = from ?: return config
    return start.blended(towards = config, progress = progress.value) ?: config
  }
}

@Composable
internal fun rememberChartMorph(config: ChartConfiguration): ChartMorph {
  var shown by remember { mutableStateOf(config) }
  var from by remember { mutableStateOf<ChartConfiguration?>(null) }
  val progress = remember { Animatable(1f) }
  val morphs = config.animation.transition == "morph" && config.animation.enabled

  LaunchedEffect(config.datasetKey) {
    if (!morphs || shown.datasetKey == config.datasetKey) {
      shown = config
      return@LaunchedEffect
    }
    val start = from?.blended(towards = shown, progress = progress.value) ?: shown
    shown = config
    progress.snapTo(0f)
    from = start
    progress.animateTo(
      1f,
      tween(
        config.animation.durationMillis,
        easing = chartEasing(config.animation.easing, FastOutSlowInEasing),
      ),
    )
    from = null
  }

  return ChartMorph(from = from, morphs = morphs, progress = progress, shown = shown)
}

internal fun ChartConfiguration.blended(
  towards: ChartConfiguration,
  progress: Float,
): ChartConfiguration? {
  if (series.isEmpty() || series.size != towards.series.size) return null
  val moved = ArrayList<ChartSeries>(series.size)
  for (index in towards.series.indices) {
    val start = series[index]
    val end = towards.series[index]
    if (start.values.size != end.values.size) return null
    moved += end.copy(
      values = end.values.mapIndexed { at, value ->
        val first = start.values[at]
        if (first == null || value == null) value else blend(first, value, progress)
      },
    )
  }
  return towards.framed(
    MorphFrame(
      annotations = blendedAnnotations(annotations, towards.annotations, progress),
      series = moved,
      yAxis = blendedAxis(yAxis, towards.yAxis, progress),
    ),
  )
}

private fun blendedAnnotations(
  from: List<ChartAnnotation>,
  to: List<ChartAnnotation>,
  progress: Float,
): List<ChartAnnotation> {
  if (from.isEmpty() || to.isEmpty()) return to
  val starting = from.associateBy(ChartAnnotation::id)
  return to.map { annotation ->
    val start = starting[annotation.id] ?: return@map annotation
    annotation.copy(
      value = blendedValue(start.value, annotation.value, progress),
      y = if (start.y != null && annotation.y != null) {
        blend(start.y, annotation.y, progress)
      } else {
        annotation.y
      },
    )
  }
}

private fun blendedValue(from: Any?, to: Any?, progress: Float): Any? {
  val start = (from as? Number)?.toDouble() ?: return to
  val end = (to as? Number)?.toDouble() ?: return to
  return blend(start, end, progress)
}

private fun blendedAxis(from: AxisOptions, to: AxisOptions, progress: Float): AxisOptions {
  val start = from.domain
  val end = to.domain
  return to.copy(
    domain = end.copy(
      minimum = if (start.minimum != null && end.minimum != null) {
        blend(start.minimum, end.minimum, progress)
      } else {
        end.minimum
      },
      maximum = if (start.maximum != null && end.maximum != null) {
        blend(start.maximum, end.maximum, progress)
      } else {
        end.maximum
      },
    ),
  )
}

private fun blend(from: Double, to: Double, progress: Float): Double =
  from + (to - from) * progress
