package com.hzblj.zyplot.charts

import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Path
import kotlin.math.max

internal fun linePath(points: List<Offset>, isSmooth: Boolean): Path {
  val path = Path()
  if (points.isEmpty()) return path
  path.moveTo(points.first().x, points.first().y)
  path.appendLine(points, isSmooth)
  return path
}

internal fun Path.appendLine(points: List<Offset>, isSmooth: Boolean) {
  if (!isSmooth || points.size < 3) {
    points.drop(1).forEach { lineTo(it.x, it.y) }
    return
  }
  for (index in 0 until points.lastIndex) {
    val previous = points[max(0, index - 1)]
    val current = points[index]
    val next = points[index + 1]
    val following = points[minOf(points.lastIndex, index + 2)]
    cubicTo(
      current.x + (next.x - previous.x) / 6f,
      current.y + (next.y - previous.y) / 6f,
      next.x - (following.x - current.x) / 6f,
      next.y - (following.y - current.y) / 6f,
      next.x,
      next.y,
    )
  }
}
