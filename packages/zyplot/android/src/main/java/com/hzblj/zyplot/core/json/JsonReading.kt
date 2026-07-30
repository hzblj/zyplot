package com.hzblj.zyplot.core.json

import org.json.JSONArray
import org.json.JSONObject

internal fun JSONObject.nullableString(name: String): String? =
  optString(name).takeIf { it.isNotEmpty() && it != "null" }

internal fun JSONObject.nullableDouble(name: String): Double? =
  if (has(name) && !isNull(name)) optDouble(name) else null

internal fun JSONArray?.objects(): List<JSONObject> =
  if (this == null) emptyList() else (0 until length()).mapNotNull(::optJSONObject)

internal fun JSONArray?.strings(): List<String> =
  if (this == null) emptyList() else (0 until length()).mapNotNull {
    optString(it).takeIf(String::isNotEmpty)
  }

internal fun JSONArray?.doubles(): List<Double> =
  if (this == null) emptyList() else (0 until length()).map { optDouble(it) }

internal fun JSONArray?.nullableDoubles(): List<Double?> =
  if (this == null) emptyList() else (0 until length()).map {
    if (isNull(it)) null else optDouble(it)
  }

internal fun JSONArray?.floats(): List<Float> =
  if (this == null) emptyList() else (0 until length()).map { optDouble(it).toFloat() }

internal fun List<Float>.dashOrNull(): List<Float>? = takeIf { it.size >= 2 }
