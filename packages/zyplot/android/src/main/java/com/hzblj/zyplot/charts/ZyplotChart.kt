package com.hzblj.zyplot.charts

import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.keyframes
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.platform.LocalHapticFeedback
import androidx.compose.ui.text.rememberTextMeasurer
import com.hzblj.zyplot.charts.interaction.ChartTooltip
import com.hzblj.zyplot.charts.interaction.geometryPayload
import com.hzblj.zyplot.charts.interaction.interactionPayload
import com.hzblj.zyplot.charts.interaction.rememberChartScrub
import com.hzblj.zyplot.charts.loading.ChartLoadingPlaceholder
import com.hzblj.zyplot.charts.reveal.ChartReveal
import com.hzblj.zyplot.charts.reveal.rememberChartReveal
import com.hzblj.zyplot.core.ChartConfiguration
import kotlinx.coroutines.delay

@Composable
fun ZyplotChart(
  configuration: String,
  onInteraction: (Map<String, Any>) -> Unit = {},
) {
  val isSystemDark = isSystemInDarkTheme()
  val context = LocalContext.current
  val config = remember(configuration, isSystemDark) {
    ChartConfiguration(configuration, isSystemDark).also {
      it.fontFamily = resolveFontFamily(it.fontFamilyName, context)
    }
  }
  val textMeasurer = rememberTextMeasurer()
  val scrub = rememberChartScrub(configuration)
  val reveal = rememberChartReveal(config)
  val crossfade = rememberChartCrossfade(config)
  val haptic = LocalHapticFeedback.current
  val density = LocalDensity.current.density

  var animationStarted by remember(configuration) {
    mutableStateOf(!config.animation.enabled || !config.animation.initial)
  }
  LaunchedEffect(configuration) {
    if (config.animation.enabled && config.animation.initial) {
      if (config.animation.delayMillis > 0) delay(config.animation.delayMillis.toLong())
      animationStarted = true
    }
  }
  // One clock for every pulsing annotation: bloom, then rest, then again.
  val bloom = config.annotations.firstNotNullOfOrNull { it.pulse }
  val pulseTransition = rememberInfiniteTransition(label = "zyplot-pulse")
  val bloomProgress by pulseTransition.animateFloat(
    initialValue = 0f,
    targetValue = 0f,
    animationSpec = infiniteRepeatable(
      animation = keyframes {
        durationMillis = bloom?.cycleMillis ?: 2_000
        0f at 0
        1f at (bloom?.bloomMillis ?: 450)
        0f at minOf((bloom?.bloomMillis ?: 450) + 1, bloom?.cycleMillis ?: 2_000)
      },
    ),
    label = "zyplot-pulse-progress",
  )
  val pulse = if (bloom == null) 0f else bloomProgress

  val progress by animateFloatAsState(
    targetValue = if (animationStarted) 1f else 0f,
    animationSpec = chartAnimationSpec(config.animation),
    label = "zyplot-chart-reveal",
  )

  fun select(position: Offset, width: Float) {
    if (!config.interaction.isEnabled) return
    val move = scrub.moveTo(config, position, width, density)
    onInteraction(
      interactionPayload(
        move.selection,
        move.position,
        if (scrub.isScrubbing) "changed" else "began",
        density,
      ),
    )
    scrub.begin()
    if (config.interaction.haptics && move.previousIndex != move.selection.index) {
      haptic.performHapticFeedback(HapticFeedbackType.TextHandleMove)
    }
  }

  fun endSelection(width: Float) {
    if (!scrub.isScrubbing) return
    val selection = scrub.selection(config, width, density)
    scrub.end(keepsSelection = config.interaction.selection != "none")
    selection?.let { onInteraction(interactionPayload(it, null, "ended", density)) }
  }

  if (config.isLoading) {
    Box(modifier = chartSurfaceModifier(config)) {
      ChartLoadingPlaceholder(config)
    }
    return
  }

  BoxWithConstraints(modifier = chartSurfaceModifier(config)) {
    val width = constraints.maxWidth.toFloat()
    val height = constraints.maxHeight.toFloat()
    config.measuredYGutter = measureYGutter(config, textMeasurer, width)

    LaunchedEffect(configuration, width, height) {
      onInteraction(geometryPayload(config, width, height, density))
    }

    crossfade.outgoing?.let { stale ->
      Canvas(modifier = Modifier.fillMaxSize().alpha(1f - crossfade.progress)) {
        drawChart(stale, 1f, ChartReveal.Settled, textMeasurer, null, null)
      }
    }

    Canvas(
      modifier = Modifier
        .fillMaxSize()
        .alpha(reveal.opacity * crossfade.progress)
        .pointerInput(configuration) {
          detectTapGestures { position ->
            select(position, size.width.toFloat())
            endSelection(size.width.toFloat())
          }
        }
        .pointerInput(configuration) {
          detectDragGestures(
            onDragStart = { position -> select(position, size.width.toFloat()) },
            onDragEnd = { endSelection(size.width.toFloat()) },
            onDragCancel = { endSelection(size.width.toFloat()) },
          ) { change, _ ->
            select(change.position, size.width.toFloat())
          }
        },
    ) {
      val pointer = scrub.pointer.value
      val growth = if (config.animation.reveal?.isDrawn == true) 1f else progress
      drawChart(
        config,
        growth,
        reveal,
        textMeasurer,
        pointer,
        scrub.selection(config, size.width, density),
        pulse,
      )
    }

    ChartTooltip(config, scrub, width)
  }
}
