package com.hzblj.zyplot.core.presentation

import com.hzblj.zyplot.core.json.nullableString
import org.json.JSONObject

data class PlotPadding(
  val bottom: Float,
  val left: Float,
  val right: Float,
  val top: Float,
) {
  companion object {
    val None = PlotPadding(0f, 0f, 0f, 0f)

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
      else -> None
    }
  }
}

data class PlotStyle(
  val backgroundColor: String?,
  val borderColor: String?,
  val borderRadius: Float,
  val borderWidth: Float,
  val padding: PlotPadding,
) {
  companion object {
    fun from(json: JSONObject?): PlotStyle = PlotStyle(
      backgroundColor = json?.nullableString("backgroundColor"),
      borderColor = json?.nullableString("borderColor"),
      borderRadius = json?.optDouble("borderRadius", 0.0)?.toFloat() ?: 0f,
      borderWidth = json?.optDouble("borderWidth", 0.0)?.toFloat() ?: 0f,
      padding = PlotPadding.from(json?.opt("padding")),
    )
  }
}
