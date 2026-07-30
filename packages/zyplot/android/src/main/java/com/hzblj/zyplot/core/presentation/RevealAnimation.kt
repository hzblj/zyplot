package com.hzblj.zyplot.core.presentation

import com.hzblj.zyplot.core.json.nullableDouble
import com.hzblj.zyplot.core.json.nullableString
import org.json.JSONObject

data class RevealAnimation(
  val durationMillis: Int,
  val easing: String?,
  val flashColor: String?,
  val flashDurationMillis: Int,
  val flashEasing: String?,
  val flashGlow: Float,
  val flashHoldMillis: Int,
  val flashOpacity: Float?,
  val startOpacity: Float,
  val style: String,
  val trackColor: String?,
  val trackOpacity: Float,
) {
  val isDrawn: Boolean get() = style == "draw"
  val isFaded: Boolean get() = style == "fade"
  val isEnabled: Boolean get() = isDrawn || isFaded

  fun flashOpacity(resting: Float): Float =
    flashOpacity ?: minOf(0.85f, resting * flashGlow)

  companion object {
    fun from(json: JSONObject?): RevealAnimation? = json?.let {
      RevealAnimation(
        durationMillis = it.optInt("duration", 700),
        easing = it.nullableString("easing"),
        flashColor = it.nullableString("flashColor"),
        flashDurationMillis = it.optInt("flashDuration", 900),
        flashEasing = it.nullableString("flashEasing"),
        flashGlow = it.optDouble("flashGlow", 4.0).toFloat(),
        flashHoldMillis = it.optInt("flashHold", 0),
        flashOpacity = it.nullableDouble("flashOpacity")?.toFloat(),
        startOpacity = it.optDouble("startOpacity", 0.5).toFloat(),
        style = it.optString("style", "none"),
        trackColor = it.nullableString("trackColor"),
        trackOpacity = it.optDouble("trackOpacity", 0.35).toFloat(),
      )
    }
  }
}
