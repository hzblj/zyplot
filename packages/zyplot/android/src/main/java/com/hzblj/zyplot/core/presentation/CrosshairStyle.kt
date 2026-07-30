package com.hzblj.zyplot.core.presentation

import com.hzblj.zyplot.core.json.dashOrNull
import com.hzblj.zyplot.core.json.floats
import com.hzblj.zyplot.core.json.nullableString
import org.json.JSONObject

data class CrosshairStyle(
  val color: String?,
  val dash: List<Float>,
  val width: Float,
) {
  val dashPattern: List<Float>? = dash.dashOrNull()

  companion object {
    fun from(json: JSONObject?): CrosshairStyle = CrosshairStyle(
      color = json?.nullableString("color"),
      dash = json?.optJSONArray("dash").floats(),
      width = json?.optDouble("width", 1.0)?.toFloat() ?: 1f,
    )
  }
}
