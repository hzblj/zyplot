package com.hzblj.zyplot.charts.interaction

import androidx.compose.ui.geometry.Offset
import com.hzblj.zyplot.charts.plotLeft
import com.hzblj.zyplot.charts.plotRight
import com.hzblj.zyplot.charts.presentation.categoryX
import com.hzblj.zyplot.core.ChartConfiguration

internal data class ChartSelection(
  val category: String?,
  val seriesId: String?,
  val value: Double?,
  val index: Int? = null,
  val detail: List<String> = emptyList(),
  val rows: List<Pair<String, String>> = emptyList(),
)

/** The span two fingers are on, in data order rather than in the order they landed. */
internal data class ChartRange(
  val startIndex: Int,
  val endIndex: Int,
)

internal fun chartRange(
  config: ChartConfiguration,
  first: Offset,
  second: Offset,
  width: Float,
  density: Float = 1f,
): ChartRange? {
  val start = chartSelection(config, first, width, density).index ?: return null
  val end = chartSelection(config, second, width, density).index ?: return null
  return ChartRange(minOf(start, end), maxOf(start, end))
}

/** Where a category's mark sits, measured off the view rather than off a plot already in hand. */
internal fun categoryCentre(
  config: ChartConfiguration,
  index: Int,
  width: Float,
  density: Float = 1f,
  align: String = "center",
): Float {
  val left = plotLeft(config, density)
  val right = plotRight(config, width, density)
  return categoryX(config, index, left, right - left, align)
}

internal fun chartSelection(
  config: ChartConfiguration,
  pointer: Offset,
  width: Float,
  density: Float = 1f,
): ChartSelection {
  val left = plotLeft(config, density)
  val right = plotRight(config, width, density)
  val plotWidth = (right - left).coerceAtLeast(1f)
  val ratio = ((pointer.x - left) / plotWidth).coerceIn(0f, 0.9999f)

  if (config.type == "boxplot") {
    return boxplotSelection(config, ratio)
  }

  val index = (ratio * config.categories.size).toInt()
    .coerceIn(0, (config.categories.size - 1).coerceAtLeast(0))
  val category = config.categories.getOrNull(index)
  if (config.type == "candlestick") {
    return candlestickSelection(config, index, category)
  }
  val series = config.series.firstOrNull()
  return ChartSelection(
    category = category,
    seriesId = series?.id,
    value = series?.values?.getOrNull(index),
    index = index,
  )
}

private fun candlestickSelection(
  config: ChartConfiguration,
  index: Int,
  category: String?,
): ChartSelection {
  val candles = config.array("candlesticks")
  val candle = candles.getOrNull(index)
    ?: return ChartSelection(category, null, null, index)
  val labels = config.objectValue("labels")
  val open = candle.optDouble("open")
  val close = candle.optDouble("close")
  val change = if (open == 0.0) 0.0 else (close - open) / open * 100
  val rows = buildList {
    fun row(key: String, value: String) {
      labels?.optString(key)?.takeIf { it.isNotEmpty() }?.let { add(it to value) }
    }
    row("open", config.format.format(open))
    row("close", config.format.format(close))
    row("high", config.format.format(candle.optDouble("high")))
    row("low", config.format.format(candle.optDouble("low")))
    row("change", String.format("%+.2f %%", change))
  }
  return ChartSelection(
    category = category,
    seriesId = candle.optString("id"),
    value = close,
    index = index,
    rows = rows,
  )
}

private fun boxplotSelection(
  config: ChartConfiguration,
  ratio: Float,
): ChartSelection {
  val groups = config.array("groups")
  if (groups.isEmpty()) return ChartSelection(null, null, null)
  val index = (ratio * groups.size).toInt().coerceIn(0, groups.lastIndex)
  val group = groups[index]
  val labels = config.objectValue("labels")
  fun row(key: String, fallback: String) =
    "${labels?.optString(key)?.takeIf { it.isNotEmpty() } ?: fallback} " +
      config.format.format(group.optDouble(key))

  return ChartSelection(
    category = group.optString("label"),
    seriesId = group.optString("id"),
    value = group.optDouble("median"),
    index = index,
    detail = listOf(
      row("max", "Max"),
      row("q3", "Q3"),
      row("median", "Median"),
      row("q1", "Q1"),
      row("min", "Min"),
    ),
  )
}

/**
 * What is being read, never where the finger is. Where it is goes to the views the chart mounted for
 * it, placed in its own layout pass — see `ChartSlots`.
 */
internal fun interactionPayload(
  selection: ChartSelection,
  phase: String,
): Map<String, Any> = buildMap {
  selection.category?.let { put("category", it) }
  selection.index?.let { put("index", it) }
  selection.seriesId?.let { put("seriesId", it) }
  selection.value?.let { put("value", it) }
  put("phase", phase)
}

/** What the span is, not where it reaches: a view centred over it is the chart's `rangeView`. */
internal fun rangePayload(
  config: ChartConfiguration,
  range: ChartRange,
  phase: String,
): Map<String, Any> = buildMap {
  put("phase", phase)
  put(
    "range",
    buildMap {
      config.categories.getOrNull(range.endIndex)?.let { put("endCategory", it) }
      put("endIndex", range.endIndex)
      config.categories.getOrNull(range.startIndex)?.let { put("startCategory", it) }
      put("startIndex", range.startIndex)
    },
  )
  config.series.firstOrNull()?.id?.let { put("seriesId", it) }
}
