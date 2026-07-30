package com.hzblj.zyplot.charts.kinds

import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.DrawScope
import com.hzblj.zyplot.core.ChartConfiguration
import kotlin.math.max

internal fun DrawScope.drawSankey(config: ChartConfiguration) {
  val nodes = config.array("nodes")
  val links = config.array("links")
  if (nodes.isEmpty() || links.isEmpty()) return

  val ids = nodes.map { it.optString("id") }
  fun value(link: org.json.JSONObject) = max(0.0, link.optDouble("value"))

  val depth = ids.associateWith { 0 }.toMutableMap()
  repeat(ids.size) {
    links.forEach { link ->
      val from = depth[link.optString("source")] ?: return@forEach
      val to = link.optString("target")
      if (depth.containsKey(to) && from + 1 > depth.getValue(to)) depth[to] = from + 1
    }
  }

  val columns = nodes.groupBy { depth[it.optString("id")] ?: 0 }.toSortedMap()
  if (columns.size < 2) return

  fun weight(id: String): Double {
    val outgoing = links.filter { it.optString("source") == id }.sumOf(::value)
    val incoming = links.filter { it.optString("target") == id }.sumOf(::value)
    return max(outgoing, incoming)
  }

  val nodeWidth = 14f
  val gap = 12f
  val inset = 10f
  val busiest = columns.values.maxOf { column ->
    column.sumOf { weight(it.optString("id")) }
  }
  val grand = max(busiest, 1.0)
  val tallest = columns.values.maxOf { it.size }
  val available = (size.height - inset * 2 - gap * max(0, tallest - 1)).coerceAtLeast(1f)
  val span = size.width - inset * 2 - nodeWidth
  val step = if (columns.size > 1) span / (columns.size - 1) else 0f

  val bands = mutableMapOf<String, Triple<Float, Float, Float>>()
  columns.entries.forEachIndexed { columnIndex, entry ->
    var cursor = inset
    entry.value.forEach { node ->
      val id = node.optString("id")
      val height = (weight(id) / grand * available).toFloat()
      bands[id] = Triple(inset + step * columnIndex, cursor, height)
      cursor += height + gap
    }
  }

  val outgoing = mutableMapOf<String, Float>()
  val incoming = mutableMapOf<String, Float>()

  links.forEachIndexed { index, link ->
    val source = link.optString("source")
    val target = link.optString("target")
    val from = bands[source] ?: return@forEachIndexed
    val to = bands[target] ?: return@forEachIndexed
    val thickness = (value(link) / grand * available).toFloat()

    val startTop = from.second + outgoing.getOrDefault(source, 0f)
    val endTop = to.second + incoming.getOrDefault(target, 0f)
    outgoing[source] = outgoing.getOrDefault(source, 0f) + thickness
    incoming[target] = incoming.getOrDefault(target, 0f) + thickness

    val startX = from.first + nodeWidth
    val endX = to.first
    val controlA = startX + (endX - startX) * 0.42f
    val controlB = startX + (endX - startX) * 0.58f

    val band = Path().apply {
      moveTo(startX, startTop)
      cubicTo(controlA, startTop, controlB, endTop, endX, endTop)
      lineTo(endX, endTop + thickness)
      cubicTo(
        controlB,
        endTop + thickness,
        controlA,
        startTop + thickness,
        startX,
        startTop + thickness,
      )
      close()
    }
    drawPath(band, config.colorFor(index).copy(alpha = 0.28f))
  }

  ids.forEachIndexed { index, id ->
    val band = bands[id] ?: return@forEachIndexed
    drawRect(
      config.colorFor(index),
      Offset(band.first, band.second),
      Size(nodeWidth, band.third),
    )
  }
}
