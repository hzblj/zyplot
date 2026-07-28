package com.hzblj.zyplot.charts.specialized

import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Rect
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.TextMeasurer
import com.hzblj.zyplot.charts.drawAxisText
import com.hzblj.zyplot.charts.normalizedY
import com.hzblj.zyplot.charts.plotRect
import com.hzblj.zyplot.charts.paddedExtent
import com.hzblj.zyplot.charts.valuesExtent
import com.hzblj.zyplot.core.ChartConfiguration
import com.hzblj.zyplot.core.ChartDatum
import com.hzblj.zyplot.core.parseColor
import kotlin.math.abs
import kotlin.math.max
import kotlin.math.sqrt

internal fun DrawScope.drawSpecializedChart(
  config: ChartConfiguration,
  progress: Float = 1f,
  measurer: TextMeasurer? = null,
) {
  when (config.type) {
    "boxplot" -> drawBoxplot(config, measurer)
    "candlestick" -> drawCandlestick(config, progress, measurer)
    "dumbbell" -> drawDumbbell(config, measurer)
    // Funnel, sankey and treemap have no value axis to label.
    "funnel" -> drawFunnel(config)
    "heatmap" -> drawHeatmap(config, measurer)
    "lollipop" -> drawLollipop(config, measurer)
    "sankey" -> drawSankey(config)
    "treemap" -> drawTreemap(config)
    "waterfall" -> drawWaterfall(config, measurer)
  }
}

private fun DrawScope.drawBoxplot(
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

private fun DrawScope.drawCandlestick(
  config: ChartConfiguration,
  progress: Float,
  measurer: TextMeasurer? = null,
) {
  val items = config.array("candlesticks")
  val values = items.flatMap { listOf(it.optDouble("low"), it.optDouble("high")) }
  val extent = config.valueExtent(values)
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
  items.forEachIndexed { index, item ->
    val center = plot.left + width * (index + 0.5f)
    val openValue = item.optDouble("open")
    val animatedHigh = openValue + (item.optDouble("high") - openValue) * progress
    val animatedLow = openValue + (item.optDouble("low") - openValue) * progress
    val animatedClose = openValue + (item.optDouble("close") - openValue) * progress
    val high = normalizedY(animatedHigh, extent.first, extent.second, plot)
    val low = normalizedY(animatedLow, extent.first, extent.second, plot)
    val open = normalizedY(item.optDouble("open"), extent.first, extent.second, plot)
    val close = normalizedY(animatedClose, extent.first, extent.second, plot)
    val color = if (item.optDouble("close") >= item.optDouble("open")) {
      config.candlestickStyle.upColor?.let(::parseColor)
        ?: config.positiveColor
    } else {
      config.candlestickStyle.downColor?.let(::parseColor)
        ?: config.negativeColor
    }
    drawLine(
      color,
      Offset(center, high),
      Offset(center, low),
      strokeWidth = config.candlestickStyle.wickWidth,
    )
    drawRect(
      if (config.candlestickStyle.hollowUp && item.optDouble("close") >= openValue) {
        color.copy(alpha = 0.14f)
      } else {
        color
      },
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

private fun DrawScope.drawDumbbell(
  config: ChartConfiguration,
  measurer: TextMeasurer? = null,
) {
  val rows = config.array("rows")
  val values = rows.flatMap { listOf(it.optDouble("before"), it.optDouble("after")) }
  val extent = paddedExtent(values)
  val plot = plotRect(config)
  // Rows run down the y axis here, so the value scale is the horizontal one.
  measurer?.let {
    drawAxisText(
      config,
      it,
      yLabels = rows.map { row -> row.optString("label") },
      xMinimum = extent.first,
      xMaximum = extent.second,
    )
  }
  val rowHeight = plot.height / max(1, rows.size)
  rows.forEachIndexed { index, item ->
    val y = plot.top + rowHeight * (index + 0.5f)
    val before = plot.left + ((item.optDouble("before") - extent.first) / (extent.second - extent.first) * plot.width).toFloat()
    val after = plot.left + ((item.optDouble("after") - extent.first) / (extent.second - extent.first) * plot.width).toFloat()
    drawLine(config.gridColor, Offset(before, y), Offset(after, y), strokeWidth = 3f)
    drawCircle(config.palette[0], 6f, Offset(before, y))
    drawCircle(config.palette[1 % config.palette.size], 6f, Offset(after, y))
  }
}

private fun DrawScope.drawFunnel(config: ChartConfiguration) {
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

private fun DrawScope.drawHeatmap(
  config: ChartConfiguration,
  measurer: TextMeasurer? = null,
) {
  val cells = config.array("cells")
  val columns = max(1, config.columns.size)
  val rows = max(1, config.rowLabels.size)
  // Laid out inside the plot rect rather than the raw canvas so the row and
  // column labels line up with the cells they name.
  val plot = plotRect(config)
  measurer?.let {
    drawAxisText(config, it, xLabels = config.columns, yLabels = config.rowLabels)
  }
  val cellWidth = plot.width / columns
  val cellHeight = plot.height / rows
  val maximum = cells.maxOfOrNull { it.optDouble("value") }?.coerceAtLeast(1.0) ?: 1.0
  cells.forEach {
    if (it.isNull("value")) return@forEach
    val column = it.optInt("columnIndex")
    val row = it.optInt("rowIndex")
    drawRect(
      config.palette[0].copy(alpha = (it.optDouble("value") / maximum).toFloat().coerceIn(0.12f, 1f)),
      topLeft = Offset(
        plot.left + column * cellWidth + 1,
        plot.top + row * cellHeight + 1,
      ),
      size = Size(cellWidth - 2, cellHeight - 2),
    )
  }
}

private fun DrawScope.drawLollipop(
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

private fun DrawScope.drawWaterfall(
  config: ChartConfiguration,
  measurer: TextMeasurer? = null,
) {
  val plot = plotRect(config)
  val running = mutableListOf(0.0)
  config.data.forEach { running += running.last() + it.value }
  val extent = valuesExtent(running)
  measurer?.let {
    drawAxisText(
      config,
      it,
      extent.first,
      extent.second,
      xLabels = config.data.map(ChartDatum::label),
    )
  }
  val width = plot.width / max(1, config.data.size)
  config.data.forEachIndexed { index, item ->
    val start = normalizedY(running[index], extent.first, extent.second, plot)
    val end = normalizedY(running[index + 1], extent.first, extent.second, plot)
    drawRect(
      if (item.value >= 0) config.positiveColor else config.negativeColor,
      topLeft = Offset(plot.left + width * index + width * 0.15f, minOf(start, end)),
      size = Size(width * 0.7f, max(2f, abs(start - end))),
    )
  }
}

private fun DrawScope.drawTreemap(config: ChartConfiguration) {
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

/**
 * A flow diagram where thickness *is* the value.
 *
 * Columns come from graph depth, not from "is this node ever a source". A node
 * that both receives and sends — the middle of a funnel — belongs between the
 * two, and splitting on source-ness would drop every link arriving at it.
 *
 * Node heights and band thicknesses are shares of the same total, and bands
 * stack at both ends, so reading the picture and reading the numbers give the
 * same answer. Bands are filled shapes rather than strokes: a stroked curve
 * cannot widen and narrow between its ends.
 */
private fun DrawScope.drawSankey(config: ChartConfiguration) {
  val nodes = config.array("nodes")
  val links = config.array("links")
  if (nodes.isEmpty() || links.isEmpty()) return

  val ids = nodes.map { it.optString("id") }
  fun value(link: org.json.JSONObject) = max(0.0, link.optDouble("value"))

  // Longest path from a root. Relaxing every edge once per node is enough to
  // settle it, and it terminates on a cycle instead of looping forever.
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

  // A node is as tall as the larger of what flows in and what flows out; the
  // two differ wherever a funnel loses volume.
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

  // Vertical band and horizontal position of every node, by id.
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
