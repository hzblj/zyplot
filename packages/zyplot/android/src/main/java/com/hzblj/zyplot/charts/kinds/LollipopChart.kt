package com.hzblj.zyplot.charts.kinds

import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.text.TextMeasurer
import com.hzblj.zyplot.charts.drawAxisText
import com.hzblj.zyplot.charts.normalizedY
import com.hzblj.zyplot.charts.plotRect
import com.hzblj.zyplot.core.ChartConfiguration
import com.hzblj.zyplot.core.ChartDatum
import kotlin.math.max

internal fun DrawScope.drawLollipop(
  config: ChartConfiguration,
  measurer: TextMeasurer? = null,
) {
  val plot = plotRect(config)
  val maximum = max(config.data.maxOfOrNull { it.value } ?: 1.0, 1.0)
  measurer?.let {
    drawAxisText(config, it, 0.0, maximum, xLabels = config.data.map(ChartDatum::label))
  }
  val width = plot.width / max(1, config.data.size)
  config.data.forEachIndexed { index, item ->
    val x = plot.left + width * (index + 0.5f)
    val y = normalizedY(item.value, 0.0, maximum, plot)
    val color = config.colorFor(index, item.color, item.slot)
    drawLine(color.copy(alpha = 0.55f), Offset(x, plot.bottom), Offset(x, y), strokeWidth = 3f)
    drawCircle(color, 8f, Offset(x, y))
  }
}
