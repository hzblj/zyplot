package com.hzblj.zyplot.core.presentation

import com.hzblj.zyplot.core.json.nullableString
import org.json.JSONObject

data class Pulse(
  val color: String? = null,
  val bloomMillis: Int = 450,
  val restMillis: Int = 1_550,
  val opacity: Float = 0.9f,
  val scale: Float = 2.2f,
) {
  val cycleMillis: Int get() = bloomMillis + restMillis

  companion object {
    fun from(value: Any?): Pulse? = when (value) {
      true -> Pulse()
      is JSONObject -> Pulse(
        color = value.nullableString("color"),
        bloomMillis = value.optInt("duration", 450),
        restMillis = value.optInt("interval", 1_550),
        opacity = value.optDouble("opacity", 0.9).toFloat(),
        scale = value.optDouble("scale", 2.2).toFloat(),
      )
      else -> null
    }
  }
}
