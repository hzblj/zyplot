package com.hzblj.zyplot.charts.kinds

import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Rect
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.text.TextMeasurer
import com.hzblj.zyplot.charts.drawAxisText
import com.hzblj.zyplot.charts.normalizedY
import com.hzblj.zyplot.charts.plotRect
import com.hzblj.zyplot.core.ChartConfiguration
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.lerp
import com.hzblj.zyplot.charts.reveal.ChartReveal
import com.hzblj.zyplot.core.parseColor
import kotlin.math.abs
import kotlin.math.ceil
import kotlin.math.max

internal fun DrawScope.drawCandlestick(
  config: ChartConfiguration,
  progress: Float,
  measurer: TextMeasurer? = null,
  selectedCategory: String? = null,
  reveal: ChartReveal = ChartReveal.Settled,
) {
  val items = config.array("candlesticks")
  val extent = config.candlestickExtent
  val fullPlot = plotRect(config)
  measurer?.let {
    drawAxisText(config, it, extent.first, extent.second, xLabels = config.categories)
  }
  val volumeRatio = config.candlestickStyle.volumeHeightRatio.coerceIn(0.12f, 0.35f)
  val volumeHeight = if (config.showVolume) fullPlot.height * volumeRatio else 0f
  val plot = Rect(
    left = fullPlot.left,
    top = fullPlot.top,
    right = fullPlot.right,
    bottom = fullPlot.bottom - volumeHeight - if (config.showVolume) 6f else 0f,
  )
  val width = plot.width / max(1, items.size)
  val maximumVolume = items.maxOfOrNull { it.optDouble("volume") }
    ?.coerceAtLeast(1.0) ?: 1.0
  // A traced entrance arrives candle by candle, the way iOS trims the data it draws — the
  // slot width stays keyed to the full count so nothing re-spaces as they land.
  val landed = if (reveal.isTracing) {
    ceil(items.size * reveal.fraction).toInt().coerceIn(1, items.size)
  } else {
    items.size
  }
  items.take(landed).forEachIndexed { index, item ->
    val center = plot.left + width * (index + 0.5f)
    val openValue = item.optDouble("open")
    val animatedHigh = openValue + (item.optDouble("high") - openValue) * progress
    val animatedLow = openValue + (item.optDouble("low") - openValue) * progress
    val animatedClose = openValue + (item.optDouble("close") - openValue) * progress
    val high = normalizedY(animatedHigh, extent.first, extent.second, plot)
    val low = normalizedY(animatedLow, extent.first, extent.second, plot)
    val open = normalizedY(item.optDouble("open"), extent.first, extent.second, plot)
    val close = normalizedY(animatedClose, extent.first, extent.second, plot)
    val base = if (item.optDouble("close") >= item.optDouble("open")) {
      config.candlestickStyle.upColor?.let(::parseColor)
        ?: config.positiveColor
    } else {
      config.candlestickStyle.downColor?.let(::parseColor)
        ?: config.negativeColor
    }
    // The candle being read is lit with `highlightColor`; the rest fade to `dimOpacity`.
    val isSelected = selectedCategory != null && config.categories.getOrNull(index) == selectedCategory
    val highlight = config.interaction.highlightColor?.let(::parseColor)
    val color = when {
      // Blended rather than replaced, so the candle's own red or green reads through the lift.
      isSelected && highlight != null -> lerp(base, highlight, config.interaction.highlightBlend)
      selectedCategory != null && !isSelected -> base.copy(alpha = config.interaction.dimOpacity)
      else -> base
    }
    val radius = config.candlestickStyle.candleRadius * density
    drawLine(
      color,
      Offset(center, high),
      Offset(center, low),
      strokeWidth = config.candlestickStyle.wickWidth * density,
      // Rounded bodies want rounded wick caps too, or the wick reads as a cut-off stub.
      cap = if (radius > 0f) StrokeCap.Round else StrokeCap.Butt,
    )
    drawRoundRect(
      if (config.candlestickStyle.hollowUp && item.optDouble("close") >= openValue) {
        color.copy(alpha = 0.14f)
      } else {
        color
      },
      cornerRadius = CornerRadius(radius, radius),
      topLeft = Offset(
        center - width * config.candlestickStyle.candleWidth / 2,
        minOf(open, close),
      ),
      size = Size(
        width * config.candlestickStyle.candleWidth,
        max(2f, abs(open - close)),
      ),
    )
    if (config.showVolume && item.has("volume")) {
      val volume = item.optDouble("volume")
      val barHeight = volumeHeight * (volume / maximumVolume).toFloat()
      val volumeColor = if (item.optDouble("close") >= openValue) {
        config.candlestickStyle.volumeUpColor?.let(::parseColor) ?: color
      } else {
        config.candlestickStyle.volumeDownColor?.let(::parseColor) ?: color
      }
      drawRect(
        volumeColor.copy(alpha = 0.48f),
        topLeft = Offset(
          center - width * config.candlestickStyle.candleWidth / 2,
          fullPlot.bottom - barHeight,
        ),
        size = Size(width * config.candlestickStyle.candleWidth, barHeight),
      )
    }
  }
}
