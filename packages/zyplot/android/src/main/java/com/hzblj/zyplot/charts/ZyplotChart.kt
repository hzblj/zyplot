package com.hzblj.zyplot.charts

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.animation.core.FastOutLinearInEasing
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.LinearOutSlowInEasing
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.FiniteAnimationSpec
import androidx.compose.animation.core.spring
import androidx.compose.animation.core.tween
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalHapticFeedback
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.rememberTextMeasurer
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.hzblj.zyplot.charts.cartesian.drawCartesianChart
import com.hzblj.zyplot.charts.interaction.chartSelection
import com.hzblj.zyplot.charts.interaction.interactionPayload
import com.hzblj.zyplot.charts.presentation.drawAnnotations
import com.hzblj.zyplot.charts.presentation.drawCrosshair
import com.hzblj.zyplot.charts.presentation.drawPlotDecoration
import com.hzblj.zyplot.charts.radial.drawRadialChart
import com.hzblj.zyplot.charts.specialized.drawSpecializedChart
import com.hzblj.zyplot.core.ChartConfiguration
import kotlinx.coroutines.delay
import kotlin.math.abs
import kotlin.math.roundToInt

@Composable
fun ZyplotChart(
  configuration: String,
  onInteraction: (Map<String, Any>) -> Unit = {},
) {
  val isSystemDark = isSystemInDarkTheme()
  val config = remember(configuration, isSystemDark) {
    ChartConfiguration(configuration, isSystemDark)
  }
  val textMeasurer = rememberTextMeasurer()
  var pointer by remember(configuration) { mutableStateOf<Offset?>(null) }
  var animationStarted by remember(configuration) {
    mutableStateOf(!config.animation.enabled || !config.animation.initial)
  }
  val haptic = LocalHapticFeedback.current

  LaunchedEffect(configuration) {
    if (config.animation.enabled && config.animation.initial) {
      if (config.animation.delayMillis > 0) delay(config.animation.delayMillis.toLong())
      animationStarted = true
    }
  }

  val animationSpec: FiniteAnimationSpec<Float> = when (config.animation.easing) {
    "linear" -> tween<Float>(config.animation.durationMillis, easing = LinearEasing)
    "ease-in" -> tween<Float>(config.animation.durationMillis, easing = FastOutLinearInEasing)
    "ease-in-out" -> tween<Float>(config.animation.durationMillis, easing = FastOutSlowInEasing)
    "spring" -> spring<Float>()
    else -> tween<Float>(config.animation.durationMillis, easing = LinearOutSlowInEasing)
  }
  val progress by animateFloatAsState(
    targetValue = if (animationStarted) 1f else 0f,
    animationSpec = animationSpec,
    label = "zyplot-chart-reveal",
  )

  fun select(next: Offset, width: Float) {
    if (!config.interaction.isEnabled) return
    pointer = next
    val selection = chartSelection(config, next, width)
    onInteraction(interactionPayload(selection, next))
    if (config.interaction.haptics) {
      haptic.performHapticFeedback(HapticFeedbackType.TextHandleMove)
    }
  }

  // Applied before the plot so both branches below — the loading state and the
  // canvas — sit inside the same container.
  val surface = config.surface
  val baseModifier = Modifier
    .fillMaxSize()
    .then(
      if (surface == null) {
        Modifier
      } else {
        val shape = RoundedCornerShape(surface.cornerRadius.dp)
        Modifier
          .clip(shape)
          .then(surface.background?.let { Modifier.background(it, shape) } ?: Modifier)
          .then(
            if (surface.borderColor != null && surface.borderWidth > 0f) {
              Modifier.border(surface.borderWidth.dp, surface.borderColor, shape)
            } else {
              Modifier
            },
          )
          .padding(
            bottom = surface.padding.bottom.dp,
            end = surface.padding.end.dp,
            start = surface.padding.start.dp,
            top = surface.padding.top.dp,
          )
      },
    )
    .semantics { contentDescription = config.accessibilityLabel }

  if (config.isLoading) {
    Box(
      modifier = baseModifier.background(Color(0x0F71717A)),
      contentAlignment = Alignment.Center,
    ) {
      CircularProgressIndicator(color = config.palette[0])
    }
    return
  }

  BoxWithConstraints(modifier = baseModifier) {
    // Measured here, where both the text measurer and the final width are in
    // scope, so the plot bounds and hit-testing agree on one value.
    config.measuredYGutter =
      measureYGutter(config, textMeasurer, constraints.maxWidth.toFloat())

    Canvas(
      modifier = Modifier
        .fillMaxSize()
        .pointerInput(configuration) {
          detectTapGestures { position ->
            select(position, size.width.toFloat())
          }
        }
        .pointerInput(configuration) {
          detectDragGestures(
            onDragStart = { position -> select(position, size.width.toFloat()) },
            onDragEnd = {
              if (config.interaction.selection == "none") pointer = null
            },
            onDragCancel = {
              if (config.interaction.selection == "none") pointer = null
            },
          ) { change, _ ->
            select(change.position, size.width.toFloat())
          }
        },
    ) {
      drawPlotDecoration(config)
      when (config.type) {
        "line", "area", "bar", "stacked-bar", "diverging-bar",
        "histogram", "scatter", "time-series", "sparkline" -> {
          drawCartesianChart(config, progress, textMeasurer)
        }
        "pie", "gauge", "meter", "radar", "sunburst" -> {
          drawRadialChart(config, textMeasurer)
        }
        else -> drawSpecializedChart(config, progress, textMeasurer)
      }
      drawAnnotations(config)
      drawCrosshair(config, pointer)
    }

    val activePointer = pointer
    if (activePointer != null && config.interaction.tooltip) {
      val selection = chartSelection(config, activePointer, constraints.maxWidth.toFloat())
      if (selection.category != null || selection.value != null) {
        Text(
          text = if (selection.detail.isNotEmpty()) {
            (listOfNotNull(selection.category) + selection.detail)
              .joinToString("\n")
          } else {
            listOfNotNull(
              selection.category,
              selection.value?.let(config.format::format),
            ).joinToString("  ")
          },
          modifier = Modifier
            .offset {
              IntOffset(
                x = (activePointer.x - 42f).roundToInt().coerceAtLeast(8),
                y = 8,
              )
            }
            .background(Color(0xE6222222))
            .padding(horizontal = 9.dp, vertical = 6.dp),
          color = Color.White,
          fontSize = 12.sp,
        )
      }
    }
  }
}
