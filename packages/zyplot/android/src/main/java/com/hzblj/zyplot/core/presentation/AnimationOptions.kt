package com.hzblj.zyplot.core.presentation

import org.json.JSONObject

data class AnimationOptions(
  val delayMillis: Int,
  val durationMillis: Int,
  val easing: String,
  val enabled: Boolean,
  val initial: Boolean,
  val reveal: RevealAnimation?,
  val transition: String,
  val updates: Boolean,
) {
  companion object {
    fun from(json: JSONObject?): AnimationOptions = AnimationOptions(
      delayMillis = json?.optInt("delay", 0) ?: 0,
      durationMillis = json?.optInt("duration", 320) ?: 320,
      easing = json?.optString("easing", "ease-out") ?: "ease-out",
      enabled = json?.optBoolean("enabled", true) ?: true,
      initial = json?.optBoolean("initial", true) ?: true,
      reveal = RevealAnimation.from(json?.optJSONObject("reveal"))
        ?.takeIf(RevealAnimation::isEnabled),
      transition = json?.optString("transition", "morph") ?: "morph",
      updates = json?.optBoolean("updates", true) ?: true,
    )
  }
}
