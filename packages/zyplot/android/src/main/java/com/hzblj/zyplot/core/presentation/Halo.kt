package com.hzblj.zyplot.core.presentation

import com.hzblj.zyplot.core.json.nullableString
import org.json.JSONObject

data class Halo(
  val color: String?,
  val opacity: Float,
  val size: Float,
) {
  companion object {
    fun from(json: JSONObject?): Halo? = json?.let {
      Halo(
        color = it.nullableString("color"),
        opacity = it.optDouble("opacity", 1.0).toFloat(),
        size = it.optDouble("size", 12.0).toFloat(),
      )
    }
  }
}
