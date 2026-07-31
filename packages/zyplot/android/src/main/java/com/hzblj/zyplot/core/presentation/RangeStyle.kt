package com.hzblj.zyplot.core.presentation

import com.hzblj.zyplot.core.json.nullableString
import org.json.JSONObject

/**
 * How the stretch under two fingers is drawn, beside the rule the reading already puts at each end
 * of it. Absent, a span is those rules and nothing more.
 */
data class RangeStyle(
  val color: String?,
  /** How far the trace outside the span steps back. Null leaves it all up. */
  val dimOpacity: Float?,
  val dot: Boolean,
  val downColor: String?,
) {
  /** The stretch's own colour, which is the span's direction rather than the whole period's. */
  fun tint(rose: Boolean): String? = if (rose) color else (downColor ?: color)

  companion object {
    fun from(json: JSONObject?): RangeStyle? = json?.let {
      RangeStyle(
        color = it.nullableString("color"),
        dimOpacity = it
          .takeIf { style -> !style.isNull("dimOpacity") }
          ?.optDouble("dimOpacity")
          ?.toFloat(),
        dot = it.optBoolean("dot", true),
        downColor = it.nullableString("downColor"),
      )
    }
  }
}
