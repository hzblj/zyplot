package com.hzblj.zyplot.core.presentation

import com.hzblj.zyplot.core.json.nullableString
import org.json.JSONObject

data class SelectionMarker(
  val color: String?,
  val dot: Boolean,
  val glow: Glow?,
  val size: Float,
  val span: Int,
  val style: String,
) {
  val isSegment: Boolean get() = style == "segment"
  val isTrail: Boolean get() = style == "trail"

  val lightsStroke: Boolean get() = isSegment || isTrail

  /** Whether a dot is drawn on the reading: the whole of `point`, and asked for by the rest. */
  val drawsDot: Boolean get() = !lightsStroke || dot

  companion object {
    fun from(json: JSONObject?): SelectionMarker? = json?.let {
      SelectionMarker(
        color = it.nullableString("color"),
        dot = it.optBoolean("dot", false),
        glow = Glow.from(it.optJSONObject("glow")),
        size = it.optDouble("size", 9.0).toFloat(),
        span = it.optInt("span", 2).coerceAtLeast(1),
        style = it.optString("style", "point"),
      )
    }
  }
}
