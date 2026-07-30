package com.hzblj.zyplot.core.presentation

import com.hzblj.zyplot.core.json.nullableString
import org.json.JSONObject

data class SelectionMarker(
  val color: String?,
  val glow: Glow?,
  val size: Float,
  val span: Int,
  val style: String,
) {
  val isSegment: Boolean get() = style == "segment"

  companion object {
    fun from(json: JSONObject?): SelectionMarker? = json?.let {
      SelectionMarker(
        color = it.nullableString("color"),
        glow = Glow.from(it.optJSONObject("glow")),
        size = it.optDouble("size", 9.0).toFloat(),
        span = it.optInt("span", 2).coerceAtLeast(1),
        style = it.optString("style", "point"),
      )
    }
  }
}
