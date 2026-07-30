package com.hzblj.zyplot.core.presentation

import com.hzblj.zyplot.core.json.dashOrNull
import com.hzblj.zyplot.core.json.floats
import com.hzblj.zyplot.core.json.nullableDouble
import com.hzblj.zyplot.core.json.nullableString
import org.json.JSONObject

data class SeriesStyle(
  val color: String?,
  val fill: SeriesFill?,
  val fillOpacity: Float,
  val glow: Glow?,
  val opacity: Float,
  val strokeDash: List<Float>,
  val strokeWidth: Float?,
  val symbol: String,
  val symbolSize: Float,
) {
  val dashPattern: List<Float>? = strokeDash.dashOrNull()

  companion object {
    fun from(json: JSONObject): SeriesStyle = SeriesStyle(
      color = json.nullableString("color"),
      glow = Glow.from(json.optJSONObject("glow")),
      fill = SeriesFill.from(json.optJSONObject("fill")),
      fillOpacity = json.optDouble("fillOpacity", 0.16).toFloat(),
      opacity = json.optDouble("opacity", 1.0).toFloat(),
      strokeDash = json.optJSONArray("strokeDash").floats(),
      strokeWidth = json.nullableDouble("strokeWidth")?.toFloat(),
      symbol = json.optString("symbol", "none"),
      symbolSize = json.optDouble("symbolSize", 7.0).toFloat(),
    )
  }
}
