package com.hzblj.zyplot.core.presentation

import com.hzblj.zyplot.core.json.nullableString
import org.json.JSONObject

data class Glow(
  val color: String?,
  val opacity: Float,
  val radius: Float,
) {
  companion object {
    fun from(json: JSONObject?): Glow? = json?.let {
      Glow(
        color = it.nullableString("color"),
        opacity = it.optDouble("opacity", 0.55).toFloat(),
        radius = it.optDouble("radius", 6.0).toFloat(),
      )
    }
  }
}
