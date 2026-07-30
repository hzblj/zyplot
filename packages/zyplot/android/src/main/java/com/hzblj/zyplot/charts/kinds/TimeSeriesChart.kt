package com.hzblj.zyplot.charts.kinds

import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import com.hzblj.zyplot.charts.drawGrid
import com.hzblj.zyplot.charts.normalizedY
import com.hzblj.zyplot.charts.plotRect
import com.hzblj.zyplot.charts.valuesExtent
import com.hzblj.zyplot.core.ChartConfiguration
import kotlin.math.max

internal fun DrawScope.drawTimeSeries(config: ChartConfiguration) {
  val points = config.objectValue("points") ?: return
  val timestamps = points.optJSONArray("timestamps") ?: return
  val values = points.optJSONArray("values") ?: return
  val plot = plotRect(config)
  val all = buildList {
    for (seriesIndex in 0 until values.length()) {
      val row = values.optJSONArray(seriesIndex) ?: continue
      for (index in 0 until row.length()) if (!row.isNull(index)) add(row.optDouble(index))
    }
  }
  val extent = valuesExtent(all)
  drawGrid(config)
  for (seriesIndex in 0 until values.length()) {
    val row = values.optJSONArray(seriesIndex) ?: continue
    val path = Path()
    var started = false
    for (index in 0 until minOf(row.length(), timestamps.length())) {
      if (row.isNull(index)) {
        started = false
        continue
      }
      val x = plot.left + plot.width * index / max(1, timestamps.length() - 1)
      val y = normalizedY(row.optDouble(index), extent.first, extent.second, plot)
      if (started) path.lineTo(x, y) else path.moveTo(x, y)
      started = true
    }
    drawPath(path, config.colorFor(seriesIndex), style = Stroke(width = 3f))
  }
}
