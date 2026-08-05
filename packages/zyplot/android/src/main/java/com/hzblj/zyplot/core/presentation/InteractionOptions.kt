package com.hzblj.zyplot.core.presentation

import com.hzblj.zyplot.core.json.nullableString
import org.json.JSONObject

data class InteractionOptions(
  val crosshair: String,
  val crosshairStyle: CrosshairStyle,
  /** How long the marks take to step back when a reading starts, in ms. 0 is instant. */
  val dimDurationMillis: Int,
  val dimOpacity: Float,
  /**
   * How far a reading steps the rest of the marks back, when the chart asked for it at all. Absent is
   * not the same as the default `dimOpacity` an emphasised series falls back to: a chart that only
   * asked for a crosshair dims nothing under a finger, the way it does on the web and on iOS.
   */
  val scrubDimOpacity: Float?,
  val haptics: Boolean,
  val highlightBlend: Float,
  val highlightColor: String?,
  val highlightScale: Float,
  /** Absent rather than `"none"`: a chart that named neither is not one that asked for no gesture. */
  val hover: String?,
  val marker: SelectionMarker?,
  val range: Boolean,
  val rangeStyle: RangeStyle?,
  val selection: String,
  val tooltip: Boolean,
  val zoom: Boolean,
) {
  /**
   * Whether the chart reads the finger at all. `"none"` is an answer rather than a setting: a chart
   * handed `hover = "none"` asked for no gesture, and nothing else it passes turns one back on.
   */
  val isEnabled: Boolean
    get() = hover != "none" &&
      (crosshair != "none" || selection != "none" || marker != null || tooltip || range)

  val readsRange: Boolean get() = range

  val drawsVerticalCrosshair: Boolean get() = crosshair == "x" || crosshair == "both"
  val drawsHorizontalCrosshair: Boolean get() = crosshair == "y" || crosshair == "both"

  companion object {
    fun from(json: JSONObject?): InteractionOptions = InteractionOptions(
      crosshair = json?.optString("crosshair", "none") ?: "none",
      crosshairStyle = CrosshairStyle.from(json?.optJSONObject("crosshairStyle")),
      marker = SelectionMarker.from(json?.optJSONObject("marker")),
      dimDurationMillis = json?.optInt("dimDuration", 0) ?: 0,
      dimOpacity = json?.optDouble("dimOpacity", 0.25)?.toFloat() ?: 0.25f,
      scrubDimOpacity = json
        ?.takeIf { !it.isNull("dimOpacity") }
        ?.optDouble("dimOpacity")
        ?.toFloat(),
      haptics = json?.optBoolean("haptics", false) ?: false,
      highlightBlend = json?.optDouble("highlightBlend", 1.0)?.toFloat() ?: 1f,
      highlightColor = json?.nullableString("highlightColor"),
      highlightScale = json?.optDouble("highlightScale", 1.0)?.toFloat() ?: 1f,
      hover = json?.nullableString("hover"),
      range = json?.optBoolean("range", false) ?: false,
      rangeStyle = RangeStyle.from(json?.optJSONObject("rangeStyle")),
      selection = json?.optString("selection", "none") ?: "none",
      tooltip = json?.optBoolean("tooltip", true) ?: true,
      zoom = json?.optBoolean("zoom", false) ?: false,
    )
  }
}
