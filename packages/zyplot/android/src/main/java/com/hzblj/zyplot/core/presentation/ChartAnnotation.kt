package com.hzblj.zyplot.core.presentation

import com.hzblj.zyplot.core.json.dashOrNull
import com.hzblj.zyplot.core.json.floats
import com.hzblj.zyplot.core.json.nullableDouble
import com.hzblj.zyplot.core.json.nullableString
import org.json.JSONObject

data class ChartAnnotation(
  val axis: String?,
  val badge: String?,
  val color: String?,
  val dash: List<Float>,
  val end: Any?,
  val glow: Glow?,
  val halo: Halo?,
  /** Measured and reported like any other, but drawn by the app rather than the chart. */
  val hidden: Boolean,
  val id: String,
  val label: String?,
  val labelBackground: String?,
  val labelPosition: String?,
  val opacity: Float,
  val pulse: Pulse?,
  val scrubOpacity: Float,
  val size: Float?,
  val start: Any?,
  val text: String?,
  val type: String,
  val value: Any?,
  val x: Any?,
  val width: Float?,
  val y: Double?,
) {
  val dashPattern: List<Float>? = dash.dashOrNull()

  companion object {
    fun from(json: JSONObject): ChartAnnotation = ChartAnnotation(
      axis = json.nullableString("axis"),
      badge = json.nullableString("badge"),
      color = json.nullableString("color"),
      glow = Glow.from(json.optJSONObject("glow")),
      halo = Halo.from(json.optJSONObject("halo")),
      labelBackground = json.nullableString("labelBackground"),
      labelPosition = json.nullableString("labelPosition"),
      pulse = Pulse.from(json.opt("pulse")),
      scrubOpacity = json.optDouble("scrubOpacity", 1.0).toFloat(),
      size = json.nullableDouble("size")?.toFloat(),
      dash = json.optJSONArray("dash").floats(),
      end = json.opt("end").takeUnless { it == JSONObject.NULL },
      hidden = json.optBoolean("hidden", false),
      id = json.optString("id"),
      label = json.nullableString("label"),
      opacity = json.optDouble("opacity", 0.12).toFloat(),
      start = json.opt("start").takeUnless { it == JSONObject.NULL },
      text = json.nullableString("text"),
      type = json.optString("type"),
      value = json.opt("value").takeUnless { it == JSONObject.NULL },
      x = json.opt("x").takeUnless { it == JSONObject.NULL },
      width = json.nullableDouble("width")?.toFloat(),
      y = json.nullableDouble("y"),
    )
  }
}
