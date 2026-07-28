package com.hzblj.zyplot.core.presentation

import java.util.Locale
import org.json.JSONObject

data class AxisDomain(
  val minimum: Double?,
  val maximum: Double?,
)

/**
 * Mirrors `ChartNumberFormat`. Chart props are serialized across the bridge, so a
 * caller cannot hand us a formatter function — it describes one instead.
 *
 * The fallback locale is the constant `en-US` rather than the device default, so a
 * chart formats identically to its web counterpart unless the caller names a
 * locale explicitly.
 */
data class NumberFormat(
  val decimals: Int,
  val locale: String?,
  val prefix: String,
  val suffix: String,
) {
  fun format(value: Double): String {
    val resolved = locale?.takeIf { it.isNotEmpty() }
      ?.let(Locale::forLanguageTag)
      ?: Locale.US
    return prefix + String.format(resolved, "%,.${decimals}f", value) + suffix
  }

  companion object {
    fun from(json: JSONObject?): NumberFormat = NumberFormat(
      decimals = (json?.nullableDouble("decimals")?.toInt() ?: 0).coerceIn(0, 20),
      locale = json?.nullableString("locale"),
      prefix = json?.nullableString("prefix") ?: "",
      suffix = json?.nullableString("suffix") ?: "",
    )
  }
}

data class AxisOptions(
  val domain: AxisDomain,
  val format: JSONObject?,
  val grid: Boolean,
  val gridDash: List<Float>,
  val label: String?,
  val labelOverflow: String,
  val labelRotation: Float,
  val position: String,
  val reversed: Boolean,
  val scale: String,
  val tickCount: Int,
  val visible: Boolean?,
) {
  companion object {
    fun from(json: JSONObject?): AxisOptions {
      val domain = json?.optJSONObject("domain")
      return AxisOptions(
        domain = AxisDomain(
          minimum = domain?.nullableDouble("min"),
          maximum = domain?.nullableDouble("max"),
        ),
        format = json?.optJSONObject("format"),
        grid = json?.optBoolean("grid", true) ?: true,
        gridDash = json?.optJSONArray("gridDash")?.let { array ->
          (0 until array.length()).map { array.optDouble(it).toFloat() }
        } ?: emptyList(),
        label = json?.nullableString("label"),
        labelOverflow = json?.nullableString("labelOverflow") ?: "ellipsis",
        labelRotation = json?.optDouble("labelRotation", 0.0)?.toFloat() ?: 0f,
        position = json?.optString("position", "start") ?: "start",
        reversed = json?.optBoolean("reversed", false) ?: false,
        scale = json?.optString("scale", "auto") ?: "auto",
        tickCount = (json?.optInt("tickCount", 4) ?: 4).coerceAtLeast(1),
        visible = if (json?.has("visible") == true) json.optBoolean("visible") else null,
      )
    }
  }
}

data class PlotPadding(
  val bottom: Float,
  val left: Float,
  val right: Float,
  val top: Float,
) {
  companion object {
    fun from(value: Any?): PlotPadding = when (value) {
      is Number -> PlotPadding(
        bottom = value.toFloat(),
        left = value.toFloat(),
        right = value.toFloat(),
        top = value.toFloat(),
      )
      is JSONObject -> PlotPadding(
        bottom = value.optDouble("bottom", 0.0).toFloat(),
        left = value.optDouble("left", 0.0).toFloat(),
        right = value.optDouble("right", 0.0).toFloat(),
        top = value.optDouble("top", 0.0).toFloat(),
      )
      else -> PlotPadding(0f, 0f, 0f, 0f)
    }
  }
}

data class PlotStyle(
  val backgroundColor: String?,
  val borderColor: String?,
  val borderRadius: Float,
  val borderWidth: Float,
  val clip: Boolean,
  val padding: PlotPadding,
) {
  companion object {
    fun from(json: JSONObject?): PlotStyle = PlotStyle(
      backgroundColor = json?.nullableString("backgroundColor"),
      borderColor = json?.nullableString("borderColor"),
      borderRadius = json?.optDouble("borderRadius", 0.0)?.toFloat() ?: 0f,
      borderWidth = json?.optDouble("borderWidth", 0.0)?.toFloat() ?: 0f,
      clip = json?.optBoolean("clip", true) ?: true,
      padding = PlotPadding.from(json?.opt("padding")),
    )
  }
}

data class SeriesStyle(
  val color: String?,
  val fillOpacity: Float,
  val opacity: Float,
  val strokeDash: List<Float>,
  val strokeWidth: Float?,
  val symbol: String,
  val symbolSize: Float,
) {
  companion object {
    fun from(json: JSONObject): SeriesStyle = SeriesStyle(
      color = json.nullableString("color"),
      fillOpacity = json.optDouble("fillOpacity", 0.16).toFloat(),
      opacity = json.optDouble("opacity", 1.0).toFloat(),
      strokeDash = json.optJSONArray("strokeDash")?.let { array ->
        (0 until array.length()).map { array.optDouble(it).toFloat() }
      } ?: emptyList(),
      strokeWidth = json.nullableDouble("strokeWidth")?.toFloat(),
      symbol = json.optString("symbol", "none"),
      symbolSize = json.optDouble("symbolSize", 7.0).toFloat(),
    )
  }
}

data class AnimationOptions(
  val delayMillis: Int,
  val durationMillis: Int,
  val easing: String,
  val enabled: Boolean,
  val initial: Boolean,
  val updates: Boolean,
) {
  companion object {
    fun from(json: JSONObject?): AnimationOptions = AnimationOptions(
      delayMillis = json?.optInt("delay", 0) ?: 0,
      durationMillis = json?.optInt("duration", 320) ?: 320,
      easing = json?.optString("easing", "ease-out") ?: "ease-out",
      enabled = json?.optBoolean("enabled", true) ?: true,
      initial = json?.optBoolean("initial", true) ?: true,
      updates = json?.optBoolean("updates", true) ?: true,
    )
  }
}

data class InteractionOptions(
  val crosshair: String,
  val dimOpacity: Float,
  val haptics: Boolean,
  val highlightScale: Float,
  val hover: String,
  val pan: Boolean,
  val selection: String,
  val tooltip: Boolean,
  val zoom: Boolean,
) {
  val isEnabled: Boolean
    get() = hover != "none" || crosshair != "none" || selection != "none" || tooltip

  companion object {
    fun from(json: JSONObject?): InteractionOptions = InteractionOptions(
      crosshair = json?.optString("crosshair", "none") ?: "none",
      dimOpacity = json?.optDouble("dimOpacity", 0.25)?.toFloat() ?: 0.25f,
      haptics = json?.optBoolean("haptics", false) ?: false,
      highlightScale = json?.optDouble("highlightScale", 1.0)?.toFloat() ?: 1f,
      hover = json?.optString("hover", "none") ?: "none",
      pan = json?.optBoolean("pan", false) ?: false,
      selection = json?.optString("selection", "none") ?: "none",
      tooltip = json?.optBoolean("tooltip", true) ?: true,
      zoom = json?.optBoolean("zoom", false) ?: false,
    )
  }
}

data class ChartAnnotation(
  val axis: String?,
  val color: String?,
  val dash: List<Float>,
  val end: Any?,
  val id: String,
  val label: String?,
  val opacity: Float,
  val start: Any?,
  val text: String?,
  val type: String,
  val value: Any?,
  val x: Any?,
  val y: Double?,
) {
  companion object {
    fun from(json: JSONObject): ChartAnnotation = ChartAnnotation(
      axis = json.nullableString("axis"),
      color = json.nullableString("color"),
      dash = json.optJSONArray("dash")?.let { array ->
        (0 until array.length()).map { array.optDouble(it).toFloat() }
      } ?: emptyList(),
      end = json.opt("end").takeUnless { it == JSONObject.NULL },
      id = json.optString("id"),
      label = json.nullableString("label"),
      opacity = json.optDouble("opacity", 0.12).toFloat(),
      start = json.opt("start").takeUnless { it == JSONObject.NULL },
      text = json.nullableString("text"),
      type = json.optString("type"),
      value = json.opt("value").takeUnless { it == JSONObject.NULL },
      x = json.opt("x").takeUnless { it == JSONObject.NULL },
      y = json.nullableDouble("y"),
    )
  }
}

internal fun JSONObject.nullableString(name: String): String? =
  optString(name).takeIf { it.isNotEmpty() && it != "null" }

internal fun JSONObject.nullableDouble(name: String): Double? =
  if (has(name) && !isNull(name)) optDouble(name) else null
