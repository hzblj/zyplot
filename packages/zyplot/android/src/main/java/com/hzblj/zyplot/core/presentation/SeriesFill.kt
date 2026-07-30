package com.hzblj.zyplot.core.presentation

import com.hzblj.zyplot.core.json.nullableDouble
import org.json.JSONObject

data class SeriesFill(
  val baseline: Float?,
  val dotSize: Float,
  val fadeTo: Float,
  val pattern: String,
  val spacing: Float,
) {
  val isDotted: Boolean get() = pattern == "dots"

  companion object {
    fun from(json: JSONObject?): SeriesFill? = json?.let {
      SeriesFill(
        baseline = it.nullableDouble("baseline")?.toFloat(),
        dotSize = it.optDouble("dotSize", 1.0).toFloat().coerceAtLeast(0.5f),
        fadeTo = it.optDouble("fadeTo", 1.0).toFloat().coerceIn(0f, 1f),
        pattern = it.optString("pattern", "solid"),
        spacing = it.optDouble("spacing", 4.0).toFloat().coerceAtLeast(1f),
      )
    }
  }
}
