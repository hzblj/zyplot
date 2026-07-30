package com.hzblj.zyplot.core

import com.hzblj.zyplot.core.presentation.AxisOptions
import com.hzblj.zyplot.core.presentation.ChartAnnotation

internal class MorphFrame(
  val annotations: List<ChartAnnotation>,
  val series: List<ChartSeries>,
  val yAxis: AxisOptions,
)
