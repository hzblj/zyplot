package com.hzblj.zyplot.core.presentation

import com.hzblj.zyplot.core.json.nullableString
import org.json.JSONObject

data class InteractionOptions(
  val crosshair: String,
  val crosshairStyle: CrosshairStyle,
  val dimOpacity: Float,
  val haptics: Boolean,
  val highlightBlend: Float,
  val highlightColor: String?,
  val highlightScale: Float,
  val hover: String,
  val marker: SelectionMarker?,
  val pan: Boolean,
  val selection: String,
  val tooltip: Boolean,
  val zoom: Boolean,
) {
  val isEnabled: Boolean
    get() = hover != "none" || crosshair != "none" || selection != "none" ||
      marker != null || tooltip

  val drawsVerticalCrosshair: Boolean get() = crosshair == "x" || crosshair == "both"
  val drawsHorizontalCrosshair: Boolean get() = crosshair == "y" || crosshair == "both"

  companion object {
    fun from(json: JSONObject?): InteractionOptions = InteractionOptions(
      crosshair = json?.optString("crosshair", "none") ?: "none",
      crosshairStyle = CrosshairStyle.from(json?.optJSONObject("crosshairStyle")),
      marker = SelectionMarker.from(json?.optJSONObject("marker")),
      dimOpacity = json?.optDouble("dimOpacity", 0.25)?.toFloat() ?: 0.25f,
      haptics = json?.optBoolean("haptics", false) ?: false,
      highlightBlend = json?.optDouble("highlightBlend", 1.0)?.toFloat() ?: 1f,
      highlightColor = json?.nullableString("highlightColor"),
      highlightScale = json?.optDouble("highlightScale", 1.0)?.toFloat() ?: 1f,
      hover = json?.optString("hover", "none") ?: "none",
      pan = json?.optBoolean("pan", false) ?: false,
      selection = json?.optString("selection", "none") ?: "none",
      tooltip = json?.optBoolean("tooltip", true) ?: true,
      zoom = json?.optBoolean("zoom", false) ?: false,
    )
  }
}
