package com.hzblj.zyplot.charts

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.keyframes
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.gestures.awaitEachGesture
import androidx.compose.foundation.gestures.awaitFirstDown
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.runtime.setValue
import androidx.compose.runtime.snapshotFlow
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
import com.hzblj.zyplot.charts.interaction.rangePayload
import com.hzblj.zyplot.charts.interaction.rememberChartScrub
import com.hzblj.zyplot.charts.loading.ChartLoadingPlaceholder
import com.hzblj.zyplot.charts.reveal.ChartReveal
import com.hzblj.zyplot.charts.reveal.rememberChartReveal
import com.hzblj.zyplot.core.ChartConfiguration
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.collectLatest

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
  val scrub = rememberChartScrub(config.datasetKey)
  val reveal = rememberChartReveal(config)
  val crossfade = rememberChartCrossfade(config)
  val morph = rememberChartMorph(config)
  val haptic = LocalHapticFeedback.current
  val density = LocalDensity.current.density

  var animationStarted by remember(config.datasetKey, config.isLoading) {
    mutableStateOf(!config.animation.enabled || !config.animation.initial)
  }
  LaunchedEffect(config.datasetKey, config.isLoading) {
    if (config.animation.enabled && config.animation.initial) {
      if (config.animation.delayMillis > 0) delay(config.animation.delayMillis.toLong())
      animationStarted = true
    }
  }
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

  /**
   * The marks step back over `dimDuration` rather than at the touch, so a finger landing reads as the
   * lights coming down. Zero keeps the cut every other chart has always had. The reading is watched
   * through a snapshot flow and the value is only ever read inside the draw, so neither the finger
   * moving nor the ramp running costs a recomposition. Each reading cancels the ramp before it —
   * `collect` would hold the finger lifting until the fade down had finished, and a tap either side of
   * that would land on a reading the flow had already stopped seeing as new.
   */
  val dimming = remember { Animatable(1f) }
  LaunchedEffect(
    scrub,
    config.interaction.scrubDimOpacity,
    config.interaction.rangeStyle?.dimOpacity,
    config.interaction.dimDurationMillis,
  ) {
    // A span steps the marks back by however much its own style asks for, so one finger can read a
    // whole trace and two can still spotlight a stretch of it.
    snapshotFlow { (scrub.range.value != null) to (scrub.pointer.value != null) }
      .collectLatest { (isSpan, isReading) ->
        dimming.animateTo(
          targetValue = when {
            isSpan -> config.interaction.rangeStyle?.dimOpacity ?: 1f
            isReading -> config.interaction.scrubDimOpacity ?: 1f
            else -> 1f
          },
          animationSpec = tween(durationMillis = config.interaction.dimDurationMillis),
        )
      }
  }

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

  fun selectRange(first: Offset, second: Offset, width: Float) {
    if (!config.interaction.isEnabled) return
    val previous = scrub.range.value
    val next = scrub.moveRange(config, first, second, width, density) ?: return
    onInteraction(
      rangePayload(
        config,
        next,
        if (scrub.isScrubbing) "changed" else "began",
        width,
        density,
      ),
    )
    scrub.begin()
    if (config.interaction.haptics && previous != next) {
      haptic.performHapticFeedback(HapticFeedbackType.TextHandleMove)
    }
  }

  fun endSelection(width: Float) {
    if (!scrub.isScrubbing) return
    val selection = scrub.selection(config, width, density)
    val hadRange = scrub.range.value != null
    scrub.end(keepsSelection = config.interaction.selection != "none")
    if (hadRange) {
      onInteraction(mapOf("phase" to "ended"))
      return
    }
    selection?.let { onInteraction(interactionPayload(it, null, "ended", density)) }
  }

  val onScrub by rememberUpdatedState({ position: Offset, width: Float -> select(position, width) })
  val onScrubEnd by rememberUpdatedState({ width: Float -> endSelection(width) })
  val onRange by rememberUpdatedState(
    { first: Offset, second: Offset, width: Float -> selectRange(first, second, width) },
  )

  if (config.isLoading) {
    // The same gutter the chart will take, so the plot does not resize under the labels that land.
    BoxWithConstraints(modifier = chartSurfaceModifier(config)) {
      config.measuredYGutter =
        measureYGutter(config, textMeasurer, constraints.maxWidth.toFloat(), density)
      ChartLoadingPlaceholder(config)
    }
    return
  }

  BoxWithConstraints(modifier = chartSurfaceModifier(config)) {
    val width = constraints.maxWidth.toFloat()
    val height = constraints.maxHeight.toFloat()
    config.measuredYGutter = measureYGutter(config, textMeasurer, width, density)

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
        .then(
          if (config.interaction.readsRange) {
            Modifier.pointerInput(Unit) {
              awaitEachGesture {
                val plotWidth = size.width.toFloat()
                val down = awaitFirstDown(requireUnconsumed = false)
                down.consume()
                onScrub(down.position, plotWidth)
                while (true) {
                  val event = awaitPointerEvent()
                  val live = event.changes.filter { it.pressed }
                  if (live.isEmpty()) break
                  live.forEach { it.consume() }
                  if (live.size > 1) {
                    onRange(live[0].position, live[1].position, plotWidth)
                  } else {
                    onScrub(live[0].position, plotWidth)
                  }
                }
                onScrubEnd(plotWidth)
              }
            }
          } else {
            // A finger that lands and stays put is still reading: waiting for a drag to pass the
            // touch slop would leave a press showing nothing until it moved.
            Modifier.pointerInput(Unit) {
              awaitEachGesture {
                val plotWidth = size.width.toFloat()
                val down = awaitFirstDown(requireUnconsumed = false)
                down.consume()
                onScrub(down.position, plotWidth)
                while (true) {
                  val event = awaitPointerEvent()
                  val live = event.changes.filter { it.pressed }
                  if (live.isEmpty()) break
                  live.forEach { it.consume() }
                  onScrub(live[0].position, plotWidth)
                }
                onScrubEnd(plotWidth)
              }
            }
          },
        ),
    ) {
      val pointer = scrub.pointer.value
      val growth = if (config.animation.reveal?.isDrawn == true) 1f else progress
      val span = scrub.range.value
      config.scrubDimming = dimming.value
      config.scrubRange = span?.let { it.startIndex..it.endIndex }
        ?: scrub.lastRange.takeIf { dimming.value < 1f }
      config.scrubLit = scrub.lastIndex.takeIf { dimming.value < 1f && config.scrubRange == null }
      drawChart(
        morph.frame(config),
        growth,
        reveal,
        textMeasurer,
        pointer,
        scrub.selection(config, size.width, density),
        pulse,
        span,
      )
    }

    ChartTooltip(config, scrub, width)
  }
}
