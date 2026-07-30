package com.hzblj.zyplot.core

data class ChartSeries(
  val color: String?,
  val id: String,
  val label: String,
  val slot: Int?,
  val values: List<Double?>,
) {
  val knownValues: List<Double> = values.filterNotNull()
}
