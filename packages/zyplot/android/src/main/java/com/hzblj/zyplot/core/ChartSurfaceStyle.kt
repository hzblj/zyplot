package com.hzblj.zyplot.core

import androidx.compose.ui.graphics.Color
import org.json.JSONObject

data class SurfacePadding(
  val bottom: Float = 0f,
  val end: Float = 0f,
  val start: Float = 0f,
  val top: Float = 0f,
)

/**
 * The container the chart is drawn in, decoded from the `surface` payload.
 *
 * JS has already merged the provider's value with the chart's own, so this only
 * has to read one object.
 */
data class ChartSurfaceStyle(
  val background: Color?,
  val borderColor: Color?,
  val borderWidth: Float,
  val cornerRadius: Float,
  val padding: SurfacePadding,
) {
  companion object {
    fun from(json: JSONObject): ChartSurfaceStyle {
      val border = json.optJSONObject("border")
      return ChartSurfaceStyle(
        background = json.optString("background")
          .takeIf { it.isNotEmpty() && it != "null" }
          ?.let(::parseColor),
        borderColor = border?.optString("color")
          ?.takeIf { it.isNotEmpty() && it != "null" }
          ?.let(::parseColor),
        borderWidth = border?.optDouble("width", 0.0)?.toFloat() ?: 0f,
        cornerRadius = json.optDouble("cornerRadius", 0.0).toFloat(),
        padding = readPadding(json),
      )
    }

    /**
     * `padding` is either one number for every side or an object naming them.
     * The named sides win over the `horizontal`/`vertical` pair, which wins over
     * the single number — most specific first, as in CSS.
     */
    private fun readPadding(json: JSONObject): SurfacePadding {
      val all = json.optDouble("padding", Double.NaN)
      if (!all.isNaN()) {
        return SurfacePadding(all.toFloat(), all.toFloat(), all.toFloat(), all.toFloat())
      }
      val padding = json.optJSONObject("padding") ?: return SurfacePadding()
      fun side(name: String, fallback: String): Float {
        val value = padding.optDouble(name, Double.NaN)
        if (!value.isNaN()) return value.toFloat()
        val shared = padding.optDouble(fallback, Double.NaN)
        return if (shared.isNaN()) 0f else shared.toFloat()
      }
      return SurfacePadding(
        bottom = side("bottom", "vertical"),
        end = side("right", "horizontal"),
        start = side("left", "horizontal"),
        top = side("top", "vertical"),
      )
    }
  }
}
