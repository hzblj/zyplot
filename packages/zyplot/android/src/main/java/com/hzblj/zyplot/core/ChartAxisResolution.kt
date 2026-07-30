package com.hzblj.zyplot.core

import com.hzblj.zyplot.core.presentation.AxisOptions
import com.hzblj.zyplot.core.presentation.NumberFormat
import org.json.JSONObject

internal fun JSONObject.axisFormat(axis: String, flatKey: String): NumberFormat {
  val detailed = optJSONObject(axis)
  return if (detailed?.has("format") == true) {
    NumberFormat.from(detailed.optJSONObject("format"))
  } else {
    NumberFormat.from(optJSONObject(flatKey))
  }
}

internal fun JSONObject.axisVisibility(axis: AxisOptions, flatKey: String): Boolean =
  axis.visible ?: optJSONObject("axis")?.optBoolean(flatKey, true) ?: true

internal fun overlayGutter(
  isOverlaid: Boolean,
  isVisible: Boolean,
  tickValues: List<Double>,
  format: NumberFormat,
): Float {
  if (!isOverlaid || !isVisible) return 0f
  val widest = tickValues.maxOfOrNull { format.format(it).length } ?: 0
  return if (widest == 0) 0f else widest * 6.4f + 10f
}
