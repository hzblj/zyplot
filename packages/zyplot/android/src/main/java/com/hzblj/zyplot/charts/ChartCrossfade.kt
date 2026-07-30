package com.hzblj.zyplot.charts

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.tween
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.hzblj.zyplot.core.ChartConfiguration

internal data class ChartCrossfade(
  val outgoing: ChartConfiguration?,
  val progress: Float,
)

@Composable
internal fun rememberChartCrossfade(config: ChartConfiguration): ChartCrossfade {
  var shown by remember { mutableStateOf(config) }
  var outgoing by remember { mutableStateOf<ChartConfiguration?>(null) }
  val progress = remember { Animatable(1f) }

  LaunchedEffect(config.datasetKey) {
    if (config.animation.transition != "crossfade" ||
      !config.animation.enabled ||
      shown.datasetKey == config.datasetKey
    ) {
      shown = config
      return@LaunchedEffect
    }
    outgoing = shown
    shown = config
    progress.snapTo(0f)
    progress.animateTo(1f, tween(config.animation.durationMillis))
    outgoing = null
  }

  return ChartCrossfade(outgoing = outgoing, progress = progress.value)
}
