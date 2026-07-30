package com.hzblj.zyplot.charts

import androidx.compose.animation.core.Easing
import androidx.compose.animation.core.FastOutLinearInEasing
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.FiniteAnimationSpec
import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.LinearOutSlowInEasing
import androidx.compose.animation.core.spring
import androidx.compose.animation.core.tween
import com.hzblj.zyplot.core.presentation.AnimationOptions

internal fun chartAnimationSpec(animation: AnimationOptions): FiniteAnimationSpec<Float> =
  when (animation.easing) {
    "linear" -> tween(animation.durationMillis, easing = LinearEasing)
    "ease-in" -> tween(animation.durationMillis, easing = FastOutLinearInEasing)
    "ease-in-out" -> tween(animation.durationMillis, easing = FastOutSlowInEasing)
    "spring" -> spring()
    else -> tween(animation.durationMillis, easing = LinearOutSlowInEasing)
  }

/** The reveal names its own curve, so it needs the easing without an animation spec. */
internal fun chartEasing(name: String?, fallback: Easing): Easing =
  when (name) {
    "linear" -> LinearEasing
    "ease-in" -> FastOutLinearInEasing
    "ease-in-out" -> FastOutSlowInEasing
    "ease-out" -> LinearOutSlowInEasing
    else -> fallback
  }
