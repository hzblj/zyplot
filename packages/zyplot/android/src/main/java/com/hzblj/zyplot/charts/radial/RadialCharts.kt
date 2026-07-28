package com.hzblj.zyplot.charts.radial

import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Rect
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.TextMeasurer
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.drawText
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp
import com.hzblj.zyplot.core.ChartConfiguration
import kotlin.math.PI
import kotlin.math.cos
import kotlin.math.max
import kotlin.math.sin

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

private fun DrawScope.drawPie(config: ChartConfiguration) {
  val total = max(config.data.sumOf { max(0.0, it.value) }, 1.0)
  val radius = minOf(size.width, size.height) * 0.38f
  val rect = Rect(
    center = Offset(size.width / 2, size.height / 2),
    radius = radius,
  )
  var start = -90f
  config.data.forEachIndexed { index, item ->
    val sweep = (max(0.0, item.value) / total * 360).toFloat()
    drawArc(
      color = config.colorFor(index, item.color, item.slot),
      startAngle = start,
      sweepAngle = sweep,
      useCenter = config.innerRadius <= 0,
      topLeft = rect.topLeft,
      size = rect.size,
      style = if (config.innerRadius > 0) {
        Stroke(width = radius * (1 - config.innerRadius.coerceIn(0.1, 0.85)).toFloat())
      } else {
        androidx.compose.ui.graphics.drawscope.Fill
      },
    )
    start += sweep
  }
}

private fun DrawScope.drawGauge(
  config: ChartConfiguration,
  measurer: TextMeasurer? = null,
) {
  val radius = minOf(size.width, size.height) * 0.34f
  val rect = Rect(
    center = Offset(size.width / 2, size.height * 0.58f),
    radius = radius,
  )
  val progress = ((config.value - config.minimum) / (config.maximum - config.minimum))
    .coerceIn(0.0, 1.0)
  drawArc(
    color = config.trackColor,
    startAngle = 150f,
    sweepAngle = 240f,
    useCenter = false,
    topLeft = rect.topLeft,
    size = rect.size,
    style = Stroke(width = 16f),
  )
  drawArc(
    color = config.palette[0],
    startAngle = 150f,
    sweepAngle = (240 * progress).toFloat(),
    useCenter = false,
    topLeft = rect.topLeft,
    size = rect.size,
    style = Stroke(width = 16f),
  )

  // The reading belongs inside the arc: an unlabelled gauge shows a proportion
  // but not the number it stands for, which is the one thing it exists to say.
  if (measurer == null) return
  val value = measurer.measure(
    config.format.format(config.value),
    TextStyle(color = config.contentColor, fontSize = 28.sp, fontWeight = FontWeight.SemiBold),
  )
  val label = config.label?.let {
    measurer.measure(it, TextStyle(color = config.labelColor, fontSize = 13.sp))
  }
  val block = value.size.height + (label?.let { it.size.height + 4 } ?: 0)
  val top = rect.center.y - block / 2f
  drawText(
    textLayoutResult = value,
    topLeft = Offset(rect.center.x - value.size.width / 2f, top),
  )
  if (label != null) {
    drawText(
      textLayoutResult = label,
      topLeft = Offset(
        x = rect.center.x - label.size.width / 2f,
        y = top + value.size.height + 4f,
      ),
    )
  }
}

private fun DrawScope.drawRadar(config: ChartConfiguration) {
  val axes = config.array("axes")
  if (axes.size < 3) return
  val center = Offset(size.width / 2, size.height / 2)
  val radius = minOf(size.width, size.height) * 0.36f

  repeat(4) { ring ->
    drawPath(
      polygon(center, radius * (ring + 1) / 4, axes.size),
      config.gridColor,
      style = Stroke(width = 1f),
    )
  }
  axes.indices.forEach { index ->
    drawLine(
      config.gridColor,
      start = center,
      end = radarPoint(center, radius, index, axes.size),
    )
  }
  config.series.forEachIndexed { seriesIndex, series ->
    val path = Path()
    axes.indices.forEach { index ->
      val maxValue = axes[index].optDouble("max", 1.0).coerceAtLeast(1.0)
      val value = series.values.getOrNull(index) ?: 0.0
      val point = radarPoint(center, radius * (value / maxValue).toFloat(), index, axes.size)
      if (index == 0) path.moveTo(point.x, point.y) else path.lineTo(point.x, point.y)
    }
    path.close()
    val color = config.colorFor(seriesIndex, series.color, series.slot)
    drawPath(path, color.copy(alpha = 0.14f))
    drawPath(path, color, style = Stroke(width = 3f))
  }
}

private fun DrawScope.drawSunburst(config: ChartConfiguration) {
  val nodes = config.array("hierarchy")
  val totals = nodes.map { nodeTotal(it) }
  val total = max(totals.sum(), 1.0)
  val radius = minOf(size.width, size.height) * 0.4f
  val rect = Rect(center = Offset(size.width / 2, size.height / 2), radius = radius)
  var start = -90f
  nodes.forEachIndexed { index, _ ->
    val sweep = (totals[index] / total * 360).toFloat()
    drawArc(
      color = config.colorFor(index),
      startAngle = start,
      sweepAngle = sweep,
      useCenter = false,
      topLeft = rect.topLeft,
      size = rect.size,
      style = Stroke(width = radius * 0.52f),
    )
    start += sweep
  }
}

private fun polygon(center: Offset, radius: Float, count: Int): Path =
  Path().apply {
    repeat(count) { index ->
      val point = radarPoint(center, radius, index, count)
      if (index == 0) moveTo(point.x, point.y) else lineTo(point.x, point.y)
    }
    close()
  }

private fun radarPoint(center: Offset, radius: Float, index: Int, count: Int): Offset {
  val angle = -PI / 2 + index.toDouble() / count * PI * 2
  return Offset(
    center.x + cos(angle).toFloat() * radius,
    center.y + sin(angle).toFloat() * radius,
  )
}

private fun nodeTotal(node: org.json.JSONObject): Double {
  if (node.has("value")) return node.optDouble("value")
  val children = node.optJSONArray("children") ?: return 0.0
  return (0 until children.length()).sumOf {
    children.optJSONObject(it)?.let(::nodeTotal) ?: 0.0
  }
}
