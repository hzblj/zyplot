package com.hzblj.zyplot.charts

import androidx.compose.ui.geometry.Rect

internal fun normalizedY(value: Double, minimum: Double, maximum: Double, plot: Rect): Float {
  if (maximum <= minimum) return plot.bottom
  return plot.bottom - ((value - minimum) / (maximum - minimum) * plot.height).toFloat()
}

internal fun paddedExtent(
  values: List<Double>,
  fraction: Double = 0.06,
): Pair<Double, Double> {
  val (minimum, maximum) = valuesExtent(values)
  val inset = (maximum - minimum) * fraction
  return (minimum - inset) to (maximum + inset)
}

internal fun valuesExtent(values: List<Double>): Pair<Double, Double> {
  val minimum = values.minOrNull() ?: 0.0
  val maximum = values.maxOrNull() ?: 1.0
  return if (minimum == maximum) minimum to (maximum + 1) else minimum to maximum
}
