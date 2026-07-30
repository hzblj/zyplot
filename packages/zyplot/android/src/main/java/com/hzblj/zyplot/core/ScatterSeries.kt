package com.hzblj.zyplot.core

data class ScatterPoint(
  val label: String?,
  val size: Double?,
  val x: Double,
  val y: Double,
)

data class ScatterSeries(
  val color: String?,
  val id: String,
  val label: String,
  val points: List<ScatterPoint>,
  val slot: Int?,
)
