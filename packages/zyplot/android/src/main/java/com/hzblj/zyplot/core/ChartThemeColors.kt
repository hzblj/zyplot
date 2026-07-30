package com.hzblj.zyplot.core

import androidx.compose.ui.graphics.Color
import com.hzblj.zyplot.core.json.strings
import org.json.JSONObject

private val DEFAULT_PALETTE = listOf(
  "#6d28d9",
  "#0284c7",
  "#ea580c",
  "#16a34a",
  "#db2777",
  "#ca8a04",
)

internal fun JSONObject.themePalette(): List<Color> =
  optJSONObject("theme")
    ?.optJSONObject("colors")
    ?.optJSONArray("categorical")
    .strings()
    .ifEmpty { DEFAULT_PALETTE }
    .map(::parseColor)

internal fun JSONObject.themeColor(name: String, fallback: String): Color =
  themeColorOrNull(name) ?: parseColor(fallback)

internal fun JSONObject.themeColorOrNull(name: String): Color? =
  optJSONObject("theme")
    ?.optJSONObject("colors")
    ?.optString(name)
    ?.takeIf { it.isNotEmpty() && it != "null" }
    ?.let(::parseColor)

/** The family named in `theme.typography.fontFamily`, if the chart named one at all. */
internal fun JSONObject.themeFontFamily(): String? =
  optJSONObject("theme")
    ?.optJSONObject("typography")
    ?.optString("fontFamily")
    ?.takeIf { it.isNotEmpty() && it != "null" }
