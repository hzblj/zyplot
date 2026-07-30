package com.hzblj.zyplot.charts.kinds

import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Path
import kotlin.math.PI
import kotlin.math.cos
import kotlin.math.sin

internal fun polygon(center: Offset, radius: Float, count: Int): Path =
  Path().apply {
    repeat(count) { index ->
      val point = radarPoint(center, radius, index, count)
      if (index == 0) moveTo(point.x, point.y) else lineTo(point.x, point.y)
    }
    close()
  }

internal fun radarPoint(center: Offset, radius: Float, index: Int, count: Int): Offset {
  val angle = -PI / 2 + index.toDouble() / count * PI * 2
  return Offset(
    center.x + cos(angle).toFloat() * radius,
    center.y + sin(angle).toFloat() * radius,
  )
}
