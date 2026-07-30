package com.hzblj.zyplot.core

import android.graphics.Color as AndroidColor
import androidx.compose.ui.graphics.Color
import java.util.concurrent.ConcurrentHashMap

private val parsed = ConcurrentHashMap<String, Color>()

private const val CACHE_LIMIT = 512

fun parseColor(value: String): Color {
  parsed[value]?.let { return it }
  val color = runCatching { Color(AndroidColor.parseColor(value)) }.getOrElse { Color.Magenta }
  if (parsed.size < CACHE_LIMIT) parsed[value] = color
  return color
}
