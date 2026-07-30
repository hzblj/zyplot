package com.hzblj.zyplot.charts.kinds

import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.text.TextMeasurer
import com.hzblj.zyplot.charts.drawAxisText
import com.hzblj.zyplot.charts.normalizedY
import com.hzblj.zyplot.charts.plotRect
import com.hzblj.zyplot.charts.valuesExtent
import com.hzblj.zyplot.core.ChartConfiguration
import kotlin.math.max

internal fun DrawScope.drawBoxplot(
  config: ChartConfiguration,
  measurer: TextMeasurer? = null,
) {
  val groups = config.array("groups")
  val values = groups.flatMap {
    listOf(it.optDouble("min"), it.optDouble("max"))
  }
  val extent = valuesExtent(values)
  val plot = plotRect(config)
  measurer?.let {
    drawAxisText(
      config,
      it,
      extent.first,
      extent.second,
      xLabels = groups.map { group -> group.optString("label") },
    )
  }
  val width = plot.width / max(1, groups.size)
  groups.forEachIndexed { index, group ->
    val center = plot.left + width * (index + 0.5f)
    val minimum = normalizedY(group.optDouble("min"), extent.first, extent.second, plot)
    val maximum = normalizedY(group.optDouble("max"), extent.first, extent.second, plot)
    val q1 = normalizedY(group.optDouble("q1"), extent.first, extent.second, plot)
    val q3 = normalizedY(group.optDouble("q3"), extent.first, extent.second, plot)
    val median = normalizedY(group.optDouble("median"), extent.first, extent.second, plot)
    val color = config.colorFor(index)
    drawLine(color, Offset(center, minimum), Offset(center, maximum), strokeWidth = 2f)
    drawRect(
      color.copy(alpha = 0.18f),
      topLeft = Offset(center - width * 0.24f, q3),
      size = Size(width * 0.48f, q1 - q3),
    )
    drawLine(
      color,
      Offset(center - width * 0.24f, median),
      Offset(center + width * 0.24f, median),
      strokeWidth = 2f,
    )
  }
}
