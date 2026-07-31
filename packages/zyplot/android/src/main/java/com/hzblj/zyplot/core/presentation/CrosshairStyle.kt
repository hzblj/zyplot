package com.hzblj.zyplot.core.presentation

import com.hzblj.zyplot.core.json.dashOrNull
import com.hzblj.zyplot.core.json.floats
import com.hzblj.zyplot.core.json.nullableString
import com.hzblj.zyplot.core.json.strings
import org.json.JSONObject

private const val PADDING_ACROSS = 10f
private const val PADDING_DOWN = 5f

data class CrosshairStyle(
  val color: String?,
  val dash: List<Float>,
  val labelBackground: String?,
  val labelColor: String?,
  val labelLift: Float,
  val labelPaddingAcross: Float,
  val labelPaddingDown: Float,
  val labelRadius: Float?,
  val labelSize: Float,
  val labels: List<String>,
  val width: Float,
) {
  val dashPattern: List<Float>? = dash.dashOrNull()

  /** Room around the words, which only a chip has: without a background the label is the text. */
  val across: Float get() = if (labelBackground == null) 0f else labelPaddingAcross
  val down: Float get() = if (labelBackground == null) 0f else labelPaddingDown

  fun labelAt(index: Int?): String? = index?.takeIf { it in labels.indices }?.let(labels::get)

  companion object {
    fun from(json: JSONObject?): CrosshairStyle {
      val padding = json?.opt("labelPadding")
      val edges = padding as? JSONObject
      val both = (padding as? Number)?.toFloat()
      return CrosshairStyle(
        color = json?.nullableString("color"),
        dash = json?.optJSONArray("dash").floats(),
        labelBackground = json?.nullableString("labelBackground"),
        labelColor = json?.nullableString("labelColor"),
        labelLift = json?.optDouble("labelLift", 8.0)?.toFloat() ?: 8f,
        labelPaddingAcross = both
          ?: edges?.optDouble("x", PADDING_ACROSS.toDouble())?.toFloat()
          ?: PADDING_ACROSS,
        labelPaddingDown = both
          ?: edges?.optDouble("y", PADDING_DOWN.toDouble())?.toFloat()
          ?: PADDING_DOWN,
        labelRadius = json?.takeIf { it.has("labelRadius") }?.optDouble("labelRadius")?.toFloat(),
        labelSize = json?.optDouble("labelSize", 13.0)?.toFloat() ?: 13f,
        labels = json?.optJSONArray("labels").strings(),
        width = json?.optDouble("width", 1.0)?.toFloat() ?: 1f,
      )
    }
  }
}
