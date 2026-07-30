package com.hzblj.zyplot.charts.kinds

import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.DrawScope
import com.hzblj.zyplot.core.ChartConfiguration
import kotlin.math.max

internal fun DrawScope.drawFunnel(config: ChartConfiguration) {
  val data = config.data
  val maximum = max(data.maxOfOrNull { it.value } ?: 1.0, 1.0)
  val rowHeight = size.height / max(1, data.size)
  data.forEachIndexed { index, item ->
    val topWidth = size.width * (item.value / maximum).toFloat().coerceAtLeast(0.12f)
    val bottomWidth = size.width * (
      (data.getOrNull(index + 1)?.value ?: 0.0) / maximum
      ).toFloat().coerceAtLeast(0.12f)
    val y = rowHeight * index
    val path = Path().apply {
      moveTo((size.width - topWidth) / 2, y + 2)
      lineTo((size.width + topWidth) / 2, y + 2)
      lineTo((size.width + bottomWidth) / 2, y + rowHeight - 2)
      lineTo((size.width - bottomWidth) / 2, y + rowHeight - 2)
      close()
    }
    drawPath(path, config.colorFor(index, item.color, item.slot))
  }
}
