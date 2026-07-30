package com.hzblj.zyplot.charts.kinds

import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Rect
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.TextMeasurer
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.drawText
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp
import com.hzblj.zyplot.core.ChartConfiguration

internal fun DrawScope.drawGauge(
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

  if (measurer == null) return
  val value = measurer.measure(
    config.format.format(config.value),
    config.textStyle(fontSize = 28.sp, color = config.contentColor, fontWeight = FontWeight.SemiBold),
  )
  val label = config.label?.let {
    measurer.measure(it, config.textStyle(fontSize = 13.sp))
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
