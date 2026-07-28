package com.hzblj.zyplot.charts.interaction

import androidx.compose.ui.geometry.Offset
import com.hzblj.zyplot.charts.plotLeft
import com.hzblj.zyplot.charts.plotRight
import com.hzblj.zyplot.core.ChartConfiguration

internal data class ChartSelection(
  val category: String?,
  val seriesId: String?,
  val value: Double?,
  /** Pre-formatted extra rows, e.g. a boxplot's five-number summary. */
  val detail: List<String> = emptyList(),
)

internal fun chartSelection(
  config: ChartConfiguration,
  pointer: Offset,
  width: Float,
): ChartSelection {
  // Derived from the same helpers the renderer draws with, so the tap target and
  // the marks cannot drift apart.
  val left = plotLeft(config)
  val right = plotRight(config, width)
  val plotWidth = (right - left).coerceAtLeast(1f)
  val ratio = ((pointer.x - left) / plotWidth).coerceIn(0f, 0.9999f)

  if (config.type == "boxplot") {
    return boxplotSelection(config, ratio)
  }

  val index = (ratio * config.categories.size).toInt()
    .coerceIn(0, (config.categories.size - 1).coerceAtLeast(0))
  val category = config.categories.getOrNull(index)
  val series = config.series.firstOrNull()
  return ChartSelection(
    category = category,
    seriesId = series?.id,
    value = series?.values?.getOrNull(index),
  )
}

/**
 * A boxplot has no single value to report, so the selection carries the whole
 * five-number summary using the caller's own `labels` — the terminology is
 * translated by the app, not by this module.
 */
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
    detail = listOf(
      row("max", "Max"),
      row("q3", "Q3"),
      row("median", "Median"),
      row("q1", "Q1"),
      row("min", "Min"),
    ),
  )
}

internal fun interactionPayload(
  selection: ChartSelection,
  pointer: Offset,
): Map<String, Any> = buildMap {
  selection.category?.let { put("category", it) }
  selection.seriesId?.let { put("seriesId", it) }
  selection.value?.let { put("value", it) }
  put("nativeX", pointer.x)
  put("nativeY", pointer.y)
}
