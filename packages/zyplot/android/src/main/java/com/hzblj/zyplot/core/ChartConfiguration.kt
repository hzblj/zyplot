package com.hzblj.zyplot.core

import android.graphics.Color as AndroidColor
import androidx.compose.ui.graphics.Color
import com.hzblj.zyplot.core.finance.CandlestickStyle
import com.hzblj.zyplot.core.presentation.AnimationOptions
import com.hzblj.zyplot.core.presentation.AxisOptions
import com.hzblj.zyplot.core.presentation.ChartAnnotation
import com.hzblj.zyplot.core.presentation.InteractionOptions
import com.hzblj.zyplot.core.presentation.NumberFormat
import com.hzblj.zyplot.core.presentation.PlotStyle
import com.hzblj.zyplot.core.presentation.SeriesStyle
import com.hzblj.zyplot.core.presentation.nullableDouble
import org.json.JSONArray
import org.json.JSONObject

data class ChartSeries(
  val color: String?,
  val id: String,
  val label: String,
  val slot: Int?,
  val values: List<Double?>,
)

data class ChartDatum(
  val color: String?,
  val id: String,
  val label: String,
  val slot: Int?,
  val value: Double,
)

data class ScatterPoint(
  val label: String?,
  val size: Double?,
  val x: Double,
  val y: Double,
)

data class ScatterSeries(
  val color: String?,
  val id: String,
  val label: String,
  val points: List<ScatterPoint>,
  val slot: Int?,
)

class ChartConfiguration(raw: String, isSystemDark: Boolean = false) {
  private val json = runCatching { JSONObject(raw) }
    .getOrElse { JSONObject("""{"type":"line"}""") }

  val type: String = json.optString("type", "line")
  val accessibilityLabel: String = json.optString("accessibilityLabel", "Chart")
  val isLoading: Boolean = json.optBoolean("isLoading", false)
  val orientation: String = json.optString("orientation", "vertical")
  val isHorizontal: Boolean = orientation == "horizontal"
  val isStacked: Boolean = json.optBoolean("isStacked", type == "stacked-bar")
  val isSmooth: Boolean = json.optBoolean("isSmooth", false)
  val value: Double = json.optDouble("value", 0.0)
  val change: Double? = json.nullableDouble("change")
  val minimum: Double = json.optDouble("min", 0.0)
  val maximum: Double = json.optDouble("max", 100.0)
  val label: String? = json.optString("label").takeIf { it.isNotEmpty() }
  val color: String? = json.optNullableString("color")
  val colorMode: String = json.optString("colorMode", "system")
  val emphasisId: String? = json.optNullableString("emphasisId")
  val format = NumberFormat.from(json.optJSONObject("format"))
  val innerRadius: Double = json.optDouble("innerRadius", 0.0)
  val binCount: Int = json.optInt("binCount", 8)
  val animation = AnimationOptions.from(json.optJSONObject("animation"))
  val interaction = InteractionOptions.from(json.optJSONObject("interaction"))
  val plot = PlotStyle.from(json.optJSONObject("plot"))
  val xAxis = AxisOptions.from(json.optJSONObject("xAxis"))
  val yAxis = AxisOptions.from(json.optJSONObject("yAxis"))

  // Scatter names its axes with `xLabel`/`xFormat` instead of a full
  // `ChartAxisOptions`, so the detailed form wins and these fill in behind it.
  val xAxisLabel: String? = xAxis.label ?: json.optNullableString("xLabel")
  val yAxisLabel: String? = yAxis.label ?: json.optNullableString("yLabel")
  val xAxisFormat: NumberFormat =
    if (json.optJSONObject("xAxis")?.has("format") == true) {
      NumberFormat.from(json.optJSONObject("xAxis")?.optJSONObject("format"))
    } else {
      NumberFormat.from(json.optJSONObject("xFormat"))
    }
  val yAxisFormat: NumberFormat =
    if (json.optJSONObject("yAxis")?.has("format") == true) {
      NumberFormat.from(json.optJSONObject("yAxis")?.optJSONObject("format"))
    } else {
      NumberFormat.from(json.optJSONObject("yFormat"))
    }
  val xAxisVisible: Boolean =
    xAxis.visible ?: json.optJSONObject("axis")?.optBoolean("x", true) ?: true
  val yAxisVisible: Boolean =
    yAxis.visible ?: json.optJSONObject("axis")?.optBoolean("y", true) ?: true
  val annotations: List<ChartAnnotation> =
    json.optJSONArray("annotations").objects().map(ChartAnnotation::from)
  val seriesStyles: Map<String, SeriesStyle> =
    json.optJSONObject("seriesStyles")?.let { styles ->
      styles.keys().asSequence().mapNotNull { key ->
        styles.optJSONObject(key)?.let { key to SeriesStyle.from(it) }
      }.toMap()
    } ?: emptyMap()
  val candlestickStyle = CandlestickStyle.from(json.optJSONObject("style"))
  val showVolume = json.optBoolean("showVolume", false)

  val categories: List<String> =
    json.optJSONArray("categories").strings().ifEmpty {
      if (type == "candlestick") {
        json.optJSONArray("candlesticks").objects().map { it.optString("category") }
      } else {
        emptyList()
      }
    }
  val columns: List<String> = json.optJSONArray("columns").strings()
  val rowLabels: List<String> = json.optJSONArray("rowLabels").strings()
  val values: List<Double> = json.optJSONArray("values").doubles()
  val series: List<ChartSeries> = json.optJSONArray("series").objects().map {
    ChartSeries(
      color = it.optNullableString("color"),
      id = it.optString("id"),
      label = it.optString("label"),
      slot = it.optInt("slot").takeIf { value -> value > 0 },
      values = it.optJSONArray("values").nullableDoubles(),
    )
  }
  val data: List<ChartDatum> = json.optJSONArray("data").objects().map {
    ChartDatum(
      color = it.optNullableString("color"),
      id = it.optString("id"),
      label = it.optString("label"),
      slot = it.optInt("slot").takeIf { value -> value > 0 },
      value = it.optDouble("value"),
    )
  }
  val scatterSeries: List<ScatterSeries> =
    json.optJSONArray("scatterSeries").objects().map {
      ScatterSeries(
        color = it.optNullableString("color"),
        id = it.optString("id"),
        label = it.optString("label"),
        points = it.optJSONArray("points").objects().map { point ->
          ScatterPoint(
            label = point.optNullableString("label"),
            size = point.optDouble("size").takeIf { size -> size > 0 },
            x = point.optDouble("x"),
            y = point.optDouble("y"),
          )
        },
        slot = it.optInt("slot").takeIf { value -> value > 0 },
      )
    }

  fun array(name: String): List<JSONObject> = json.optJSONArray(name).objects()
  fun objectValue(name: String): JSONObject? = json.optJSONObject(name)

  val palette: List<Color> =
    json.optJSONObject("theme")
      ?.optJSONObject("colors")
      ?.optJSONArray("categorical")
      .strings()
      .ifEmpty {
        listOf("#6d28d9", "#0284c7", "#ea580c", "#16a34a", "#db2777", "#ca8a04")
      }
      .map(::parseColor)

  val positiveColor: Color = themeColor("positive", "#16a34a")
  val negativeColor: Color = themeColor("negative", "#dc2626")
  val gridColor: Color = themeColor("grid", "#e4e4e7")
  val trackColor: Color = themeColor("track", "#f4f4f5")

  /** The container around the plot, already merged with the provider in JS. */
  val surface: ChartSurfaceStyle? =
    json.optJSONObject("surface")?.let(ChartSurfaceStyle::from)

  /**
   * Tick labels on the value axis, for the forms whose y axis is categorical.
   * A word like "Android" needs far more room than "1,234", so the gutter has
   * to be measured rather than assumed.
   */
  val yCategoryLabels: List<String> = when (type) {
    "diverging-bar" -> data.map(ChartDatum::label)
    "dumbbell" -> array("rows").map { it.optString("label") }
    "heatmap" -> rowLabels
    else -> emptyList()
  }

  /**
   * Width reserved for [yCategoryLabels], measured once per draw and shared.
   * Hit-testing runs outside a `DrawScope` and cannot measure text; reading the
   * same number is what keeps tap targets aligned with the marks.
   */
  var measuredYGutter: Float? = null

  /** `colorMode: "system"` cannot be answered from the payload alone. */
  val isDark: Boolean = when (colorMode) {
    "dark" -> true
    "light" -> false
    else -> isSystemDark
  }

  /**
   * An explicit `theme.colors.label` always wins — a caller that named a colour
   * meant it in both modes.
   */
  val labelColor: Color = themeColorOrNull("label")
    ?: if (isDark) Color(0xFFA1A1AA) else Color(0xFF71717A)

  val contentColor: Color = if (isDark) Color(0xFFFAFAFA) else Color(0xFF18181B)

  fun colorFor(index: Int, color: String? = null, slot: Int? = null): Color {
    color?.let { return parseColor(it) }
    val offset = ((slot ?: index + 1) - 1).coerceAtLeast(0)
    return palette[offset % palette.size]
  }

  fun seriesColor(index: Int, series: ChartSeries): Color =
    (
      seriesStyles[series.id]?.color?.let(::parseColor)
        ?: colorFor(index, series.color, series.slot)
      ).copy(alpha = dimming(series.id))

  /**
   * `1f` unless some *other* series is emphasized — the emphasized one keeps full
   * opacity, so only its peers get dimmed.
   */
  fun dimming(id: String): Float =
    if (emphasisId.isNullOrEmpty() || emphasisId == id) 1f else interaction.dimOpacity

  fun valueExtent(values: List<Double>): Pair<Double, Double> {
    val minimum = values.minOrNull() ?: 0.0
    val maximum = values.maxOrNull() ?: 1.0
    val inferred = if (minimum == maximum) minimum to (maximum + 1) else minimum to maximum
    return (yAxis.domain.minimum ?: inferred.first) to
      (yAxis.domain.maximum ?: inferred.second)
  }

  private fun themeColor(name: String, fallback: String): Color =
    themeColorOrNull(name) ?: parseColor(fallback)

  private fun themeColorOrNull(name: String): Color? =
    json.optJSONObject("theme")
      ?.optJSONObject("colors")
      ?.optString(name)
      ?.takeIf { it.isNotEmpty() && it != "null" }
      ?.let(::parseColor)
}

fun parseColor(value: String): Color =
  runCatching { Color(AndroidColor.parseColor(value)) }.getOrElse { Color.Magenta }

private fun JSONObject.optNullableString(name: String): String? =
  optString(name).takeIf { it.isNotEmpty() && it != "null" }

private fun JSONArray?.objects(): List<JSONObject> =
  if (this == null) emptyList() else (0 until length()).mapNotNull(::optJSONObject)

private fun JSONArray?.strings(): List<String> =
  if (this == null) emptyList() else (0 until length()).mapNotNull {
    optString(it).takeIf(String::isNotEmpty)
  }

private fun JSONArray?.doubles(): List<Double> =
  if (this == null) emptyList() else (0 until length()).map { optDouble(it) }

private fun JSONArray?.nullableDoubles(): List<Double?> =
  if (this == null) emptyList() else (0 until length()).map {
    if (isNull(it)) null else optDouble(it)
  }
