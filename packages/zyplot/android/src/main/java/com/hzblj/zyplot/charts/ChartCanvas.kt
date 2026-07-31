package com.hzblj.zyplot.charts

import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.text.TextMeasurer
import com.hzblj.zyplot.charts.interaction.ChartRange
import com.hzblj.zyplot.charts.interaction.ChartSelection
import com.hzblj.zyplot.charts.kinds.drawCartesianChart
import com.hzblj.zyplot.charts.kinds.drawRadialChart
import com.hzblj.zyplot.charts.kinds.drawSpecializedChart
import com.hzblj.zyplot.charts.presentation.drawAnnotations
import com.hzblj.zyplot.charts.presentation.drawCrosshair
import com.hzblj.zyplot.charts.presentation.drawPlotDecoration
import com.hzblj.zyplot.charts.presentation.drawRangeRules
import com.hzblj.zyplot.charts.presentation.drawSelectionMarker
import com.hzblj.zyplot.charts.reveal.ChartReveal
import com.hzblj.zyplot.core.ChartConfiguration

internal fun DrawScope.drawChart(
  config: ChartConfiguration,
  growth: Float,
  reveal: ChartReveal,
  measurer: TextMeasurer,
  pointer: Offset?,
  selection: ChartSelection?,
  pulse: Float = 0f,
  range: ChartRange? = null,
) {
  drawPlotDecoration(config)
  if (pointer != null && selection != null) {
    drawSelectionMarker(config, pointer, selection.value)
  }
  when (config.type) {
    "line", "area", "bar", "stacked-bar", "diverging-bar",
    "histogram", "scatter", "time-series", "sparkline",
    -> drawCartesianChart(config, growth, reveal, measurer, selection?.index)
    "pie", "gauge", "meter", "radar", "sunburst" -> drawRadialChart(config, measurer)
    else -> drawSpecializedChart(config, growth, measurer, selection?.category, reveal)
  }
  drawAnnotations(
    config,
    measurer,
    pulse = pulse,
    isScrubbing = selection != null || range != null,
    strength = reveal.strokeOpacity,
  )
  if (range == null) {
    drawCrosshair(config, pointer, measurer, selection?.index)
  } else {
    drawRangeRules(config, range)
  }
}
