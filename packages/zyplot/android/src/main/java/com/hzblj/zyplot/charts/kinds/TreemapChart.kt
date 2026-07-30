package com.hzblj.zyplot.charts.kinds

import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.drawscope.DrawScope
import com.hzblj.zyplot.core.ChartConfiguration
import kotlin.math.max

internal fun DrawScope.drawTreemap(config: ChartConfiguration) {
  val nodes = config.array("hierarchy")
  fun total(node: org.json.JSONObject): Double {
    if (node.has("value")) return node.optDouble("value")
    val children = node.optJSONArray("children") ?: return 0.0
    return (0 until children.length()).sumOf {
      children.optJSONObject(it)?.let(::total) ?: 0.0
    }
  }
  val total = max(nodes.sumOf(::total), 1.0)
  var x = 0f
  nodes.forEachIndexed { index, node ->
    val width = size.width * (total(node) / total).toFloat()
    drawRect(
      config.colorFor(index),
      topLeft = Offset(x + 1, 1f),
      size = Size(max(0f, width - 2), size.height - 2),
    )
    x += width
  }
}
