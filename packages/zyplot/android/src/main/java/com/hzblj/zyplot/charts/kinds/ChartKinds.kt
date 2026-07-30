package com.hzblj.zyplot.charts.kinds

import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.text.TextMeasurer
import com.hzblj.zyplot.charts.reveal.ChartReveal
import com.hzblj.zyplot.core.ChartConfiguration

internal fun DrawScope.drawCartesianChart(
  config: ChartConfiguration,
  progress: Float = 1f,
  reveal: ChartReveal = ChartReveal.Settled,
  measurer: TextMeasurer? = null,
  selection: Int? = null,
) {
  when (config.type) {
    "line", "area" -> drawLineOrArea(config, progress, reveal, measurer, selection)
    "bar", "stacked-bar" -> drawBars(config, progress, measurer)
    "diverging-bar" -> drawDivergingBars(config, measurer)
    "histogram" -> drawHistogram(config)
    "scatter" -> drawScatter(config, measurer)
    "time-series" -> drawTimeSeries(config)
    "sparkline" -> drawSparkline(config)
  }
}

internal fun DrawScope.drawRadialChart(
  config: ChartConfiguration,
  measurer: TextMeasurer? = null,
) {
  when (config.type) {
    "pie" -> drawPie(config)
    "gauge", "meter" -> drawGauge(config, measurer)
    "radar" -> drawRadar(config)
    "sunburst" -> drawSunburst(config)
  }
}

internal fun DrawScope.drawSpecializedChart(
  config: ChartConfiguration,
  progress: Float = 1f,
  measurer: TextMeasurer? = null,
  selectedCategory: String? = null,
  reveal: ChartReveal = ChartReveal.Settled,
) {
  when (config.type) {
    "boxplot" -> drawBoxplot(config, measurer)
    "candlestick" -> drawCandlestick(config, progress, measurer, selectedCategory, reveal)
    "dumbbell" -> drawDumbbell(config, measurer)
    "funnel" -> drawFunnel(config)
    "heatmap" -> drawHeatmap(config, measurer)
    "lollipop" -> drawLollipop(config, measurer)
    "sankey" -> drawSankey(config)
    "treemap" -> drawTreemap(config)
    "waterfall" -> drawWaterfall(config, measurer)
  }
}
