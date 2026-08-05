package com.hzblj.zyplot.core.presentation

import com.hzblj.zyplot.core.json.dashOrNull
import com.hzblj.zyplot.core.json.floats
import com.hzblj.zyplot.core.json.nullableString
import com.hzblj.zyplot.core.json.strings
import org.json.JSONObject

/**
 * The rule that follows the finger, and the words above it. The words are drawn in the theme's own
 * label colour at the size the axes use: a label that has to be anything else is a view the app
 * hands over as `tooltipView`, not a field on here.
 */
data class CrosshairStyle(
  val color: String?,
  val dash: List<Float>,
  val labels: List<String>,
  val width: Float,
) {
  val dashPattern: List<Float>? = dash.dashOrNull()

  fun labelAt(index: Int?): String? = index?.takeIf { it in labels.indices }?.let(labels::get)

  companion object {
    const val LABEL_SIZE = 13f
    const val LABEL_LIFT = 8f

    fun from(json: JSONObject?): CrosshairStyle = CrosshairStyle(
      color = json?.nullableString("color"),
      dash = json?.optJSONArray("dash").floats(),
      labels = json?.optJSONArray("labels").strings(),
      width = json?.optDouble("width", 1.0)?.toFloat() ?: 1f,
    )
  }
}
