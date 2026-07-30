package com.hzblj.zyplot.core

import com.hzblj.zyplot.core.json.nullableDoubles
import com.hzblj.zyplot.core.json.nullableString
import com.hzblj.zyplot.core.json.objects
import com.hzblj.zyplot.core.json.strings
import com.hzblj.zyplot.core.presentation.SeriesStyle
import org.json.JSONObject

internal fun JSONObject.readSeries(): List<ChartSeries> =
  optJSONArray("series").objects().map {
    ChartSeries(
      color = it.nullableString("color"),
      id = it.optString("id"),
      label = it.optString("label"),
      slot = it.optInt("slot").takeIf { value -> value > 0 },
      values = it.optJSONArray("values").nullableDoubles(),
    )
  }

internal fun JSONObject.readData(): List<ChartDatum> =
  optJSONArray("data").objects().map {
    ChartDatum(
      color = it.nullableString("color"),
      id = it.optString("id"),
      label = it.optString("label"),
      slot = it.optInt("slot").takeIf { value -> value > 0 },
      value = it.optDouble("value"),
    )
  }

internal fun JSONObject.readScatterSeries(): List<ScatterSeries> =
  optJSONArray("scatterSeries").objects().map {
    ScatterSeries(
      color = it.nullableString("color"),
      id = it.optString("id"),
      label = it.optString("label"),
      points = it.optJSONArray("points").objects().map { point ->
        ScatterPoint(
          label = point.nullableString("label"),
          size = point.optDouble("size").takeIf { size -> size > 0 },
          x = point.optDouble("x"),
          y = point.optDouble("y"),
        )
      },
      slot = it.optInt("slot").takeIf { value -> value > 0 },
    )
  }

internal fun JSONObject.readCategories(type: String): List<String> =
  optJSONArray("categories").strings().ifEmpty {
    if (type == "candlestick") {
      optJSONArray("candlesticks").objects().map { it.optString("category") }
    } else {
      emptyList()
    }
  }

internal fun JSONObject.readSeriesStyles(): Map<String, SeriesStyle> =
  optJSONObject("seriesStyles")?.let { styles ->
    styles.keys().asSequence().mapNotNull { key ->
      styles.optJSONObject(key)?.let { key to SeriesStyle.from(it) }
    }.toMap()
  } ?: emptyMap()
