package com.hzblj.zyplot.core.presentation

import com.hzblj.zyplot.core.json.nullableString
import org.json.JSONObject

/**
 * Where the app's own node for the reading goes, and how far off. The defaults are the ones the two
 * placements were tuned against: the tooltip's gap, and the lift the rule's own chip takes.
 */
data class TooltipAnchor(
  /** Where a card set beside the reading sits down the plot. Null is against its top, by the gap. */
  val align: String?,
  val gap: Float,
  val lift: Float,
  val placement: String?,
) {
  val isAbove: Boolean get() = placement == "above"

  companion object {
    fun from(json: JSONObject?): TooltipAnchor = TooltipAnchor(
      align = json?.nullableString("align"),
      gap = json?.optDouble("gap", 12.0)?.toFloat() ?: 12f,
      lift = json?.optDouble("lift", 8.0)?.toFloat() ?: 8f,
      placement = json?.nullableString("placement"),
    )
  }
}
