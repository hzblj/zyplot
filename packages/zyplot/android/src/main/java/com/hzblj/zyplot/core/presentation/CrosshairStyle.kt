package com.hzblj.zyplot.core.presentation

import com.hzblj.zyplot.core.json.dashOrNull
import com.hzblj.zyplot.core.json.floats
import com.hzblj.zyplot.core.json.nullableString
import com.hzblj.zyplot.core.json.strings
import org.json.JSONObject

data class CrosshairStyle(
  val color: String?,
  val dash: List<Float>,
  val labelColor: String?,
  val labelSize: Float,
  val labels: List<String>,
  val width: Float,
) {
  val dashPattern: List<Float>? = dash.dashOrNull()

  fun labelAt(index: Int?): String? = index?.takeIf { it in labels.indices }?.let(labels::get)

  companion object {
    fun from(json: JSONObject?): CrosshairStyle = CrosshairStyle(
      color = json?.nullableString("color"),
      dash = json?.optJSONArray("dash").floats(),
      labelColor = json?.nullableString("labelColor"),
      labelSize = json?.optDouble("labelSize", 13.0)?.toFloat() ?: 13f,
      labels = json?.optJSONArray("labels").strings(),
      width = json?.optDouble("width", 1.0)?.toFloat() ?: 1f,
    )
  }
}
