package com.hzblj.zyplot.core

import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.TextUnit
import com.hzblj.zyplot.core.finance.CandlestickStyle
import com.hzblj.zyplot.core.json.doubles
import com.hzblj.zyplot.core.json.nullableString
import com.hzblj.zyplot.core.json.objects
import com.hzblj.zyplot.core.json.strings
import com.hzblj.zyplot.core.presentation.AnimationOptions
import com.hzblj.zyplot.core.presentation.AxisOptions
import com.hzblj.zyplot.core.presentation.ChartAnnotation
import com.hzblj.zyplot.core.presentation.InteractionOptions
import com.hzblj.zyplot.core.presentation.TooltipAnchor
import com.hzblj.zyplot.core.presentation.NumberFormat
import com.hzblj.zyplot.core.presentation.PlotStyle
import com.hzblj.zyplot.core.presentation.SeriesStyle
import org.json.JSONObject

private fun parsedConfiguration(raw: String): JSONObject =
  runCatching { JSONObject(raw) }.getOrElse { JSONObject("""{"type":"line"}""") }

class ChartConfiguration internal constructor(
  private val json: JSONObject,
  private val isSystemDark: Boolean,
  private val frame: MorphFrame?,
) {
  constructor(raw: String, isSystemDark: Boolean = false) : this(
    parsedConfiguration(raw),
    isSystemDark,
    null,
  )

  val type: String = json.optString("type", "line")
  val accessibilityLabel: String = json.optString("accessibilityLabel", "Chart")
  val isLoading: Boolean = json.optBoolean("isLoading", false)
  val orientation: String = json.optString("orientation", "vertical")
  val isHorizontal: Boolean = orientation == "horizontal"
  val isStacked: Boolean = json.optBoolean("isStacked", type == "stacked-bar")
  val isSmooth: Boolean = json.optBoolean("isSmooth", false)

  /**
   * Whether a category is a position on the plot rather than a band across it. A trace runs corner
   * to corner, so its first mark is the plot's leading edge and its last is the trailing one; a bar
   * owns a width and stands in the middle of it. Everything placed by category — an annotation, a
   * rule, the reported geometry — has to follow the marks it is placed against.
   */
  val laysMarksOnEdges: Boolean =
    type == "line" || type == "area" || type == "time-series" || type == "sparkline"
  val value: Double = json.optDouble("value", 0.0)
  val minimum: Double = json.optDouble("min", 0.0)
  val maximum: Double = json.optDouble("max", 100.0)
  val label: String? = json.optString("label").takeIf { it.isNotEmpty() }
  val color: String? = json.nullableString("color")
  val colorMode: String = json.optString("colorMode", "system")
  val emphasisId: String? = json.nullableString("emphasisId")
  val format = NumberFormat.from(json.optJSONObject("format"))
  val innerRadius: Double = json.optDouble("innerRadius", 0.0)
  val binCount: Int = json.optInt("binCount", 8)
  val animation = AnimationOptions.from(json.optJSONObject("animation"))
  val interaction = InteractionOptions.from(json.optJSONObject("interaction"))
  val tooltipAnchor = TooltipAnchor.from(json.optJSONObject("tooltipAnchor"))

  /** Where the app's own view for an annotation sits on its mark, for the ids that asked. */
  val annotationViewAlign: Map<String, String> = json.optJSONObject("annotationViewAlign")
    ?.let { aligns -> aligns.keys().asSequence().associateWith { aligns.optString(it) } }
    .orEmpty()
  val plot = PlotStyle.from(json.optJSONObject("plot"))
  val xAxis = AxisOptions.from(json.optJSONObject("xAxis"))
  val yAxis = frame?.yAxis ?: AxisOptions.from(json.optJSONObject("yAxis"))

  val xAxisLabel: String? = xAxis.label ?: json.nullableString("xLabel")
  val yAxisLabel: String? = yAxis.label ?: json.nullableString("yLabel")
  val xAxisFormat: NumberFormat = json.axisFormat("xAxis", "xFormat")
  val yAxisFormat: NumberFormat = json.axisFormat("yAxis", "yFormat")
  val xAxisVisible: Boolean = json.axisVisibility(xAxis, "x")
  val yAxisVisible: Boolean = json.axisVisibility(yAxis, "y")

  val yAxisAtEnd: Boolean = yAxis.position == "end" || yAxis.position == "overlay"

  val overlaysYAxis: Boolean = yAxis.position == "overlay"

  val overlayAxisGutter: Float =
    overlayGutter(overlaysYAxis, yAxisVisible, yAxis.tickValues, yAxisFormat)

  val annotations: List<ChartAnnotation> = frame?.annotations
    ?: json.optJSONArray("annotations").objects().map(ChartAnnotation::from)
  val seriesStyles: Map<String, SeriesStyle> = json.readSeriesStyles()
  val candlestickStyle = CandlestickStyle.from(json.optJSONObject("style"))
  val showVolume = json.optBoolean("showVolume", false)

  val categories: List<String> = json.readCategories(type)
  val columns: List<String> = json.optJSONArray("columns").strings()
  val rowLabels: List<String> = json.optJSONArray("rowLabels").strings()
  val values: List<Double> = json.optJSONArray("values").doubles()
  val series: List<ChartSeries> = frame?.series ?: json.readSeries()
  val data: List<ChartDatum> = json.readData()
  val scatterSeries: List<ScatterSeries> = json.readScatterSeries()

  private val arrays = HashMap<String, List<JSONObject>>()

  fun array(name: String): List<JSONObject> =
    arrays.getOrPut(name) { json.optJSONArray(name).objects() }

  fun objectValue(name: String): JSONObject? = json.optJSONObject(name)

  val candlestickExtremes: List<Double> by lazy(LazyThreadSafetyMode.NONE) {
    array("candlesticks").flatMap { listOf(it.optDouble("low"), it.optDouble("high")) }
  }

  val markValues: List<Double> by lazy(LazyThreadSafetyMode.NONE) {
    series.flatMap(ChartSeries::knownValues) + candlestickExtremes
  }

  val annotatedValues: List<Double> by lazy(LazyThreadSafetyMode.NONE) {
    markValues + data.map(ChartDatum::value)
  }

  val markExtent: Pair<Double, Double> by lazy(LazyThreadSafetyMode.NONE) {
    valueExtent(markValues)
  }

  val annotatedExtent: Pair<Double, Double> by lazy(LazyThreadSafetyMode.NONE) {
    valueExtent(annotatedValues)
  }

  val lastReadableIndex: Int? by lazy(LazyThreadSafetyMode.NONE) {
    val candles = array("candlesticks")
    if (candles.isNotEmpty()) return@lazy candles.lastIndex
    series.firstOrNull()?.values?.indexOfLast { it != null }?.takeIf { it >= 0 }
  }

  val seriesValues: List<Double> by lazy(LazyThreadSafetyMode.NONE) {
    series.flatMap(ChartSeries::knownValues)
  }

  val seriesExtent: Pair<Double, Double> by lazy(LazyThreadSafetyMode.NONE) {
    valueExtent(seriesValues)
  }

  val candlestickExtent: Pair<Double, Double> by lazy(LazyThreadSafetyMode.NONE) {
    valueExtent(candlestickExtremes)
  }

  val datasetKey: String by lazy(LazyThreadSafetyMode.NONE) {
    listOf(
      type,
      categories.size.toString(),
      categories.firstOrNull() ?: "",
      categories.lastOrNull() ?: "",
      series.joinToString(",") { it.id },
      String.format("%.4f", markValues.minOrNull() ?: 0.0),
      String.format("%.4f", markValues.maxOrNull() ?: 0.0),
    ).joinToString("|")
  }

  val palette: List<Color> = json.themePalette()
  val positiveColor: Color = json.themeColor("positive", "#16a34a")
  val negativeColor: Color = json.themeColor("negative", "#dc2626")
  val gridColor: Color = json.themeColor("grid", "#e4e4e7")
  val trackColor: Color = json.themeColor("track", "#f4f4f5")

  val backgroundColor: Color? = json.themeColorOrNull("background")

  val fontFamilyName: String? = json.themeFontFamily()

  var fontFamily: FontFamily? = null

  val surface: ChartSurfaceStyle? =
    json.optJSONObject("surface")?.let(ChartSurfaceStyle::from)

  val yCategoryLabels: List<String> = when (type) {
    "diverging-bar" -> data.map(ChartDatum::label)
    "dumbbell" -> array("rows").map { it.optString("label") }
    "heatmap" -> rowLabels
    else -> emptyList()
  }

  var measuredYGutter: Float? = null

  /** How far the marks are stepped back for the reading in progress. Ramped by the view. */
  var scrubDimming: Float = 1f

  /**
   * The mark whose stroke stays lit while the step back is coming back up, after the touch that was
   * reading it has gone. Dropping the lighting with the touch would leave the length of trace that
   * was never dimmed to come up with the rest of it, which reads as the whole chart flashing.
   */
  var scrubLit: Int? = null

  /**
   * The span whose stretch stays lit, for the same reason `scrubLit` outlives its touch. Never set
   * beside `scrubLit`: a span and a single reading are two readings, not one held two ways.
   */
  var scrubRange: IntRange? = null

  /**
   * How far the lighting has come up, which is how far the marks have stepped back. The lit stroke is
   * drawn that far from the trace's own colour towards the marker's, so it can be let go of at the
   * end of the ramp without anything showing.
   */
  val scrubLitStrength: Float
    get() {
      val span = 1f - (interaction.scrubDimOpacity ?: return 1f)
      if (span <= 0f) return 1f
      return ((1f - scrubDimming) / span).coerceIn(0f, 1f)
    }

  val isDark: Boolean = when (colorMode) {
    "dark" -> true
    "light" -> false
    else -> isSystemDark
  }

  val labelColor: Color = json.themeColorOrNull("label")
    ?: if (isDark) Color(0xFFA1A1AA) else Color(0xFF71717A)

  val axisColor: Color = json.themeColorOrNull("axis")
    ?: if (isDark) Color(0xFF52525B) else Color(0xFFA1A1AA)

  val surfaceColor: Color = json.themeColorOrNull("surface")
    ?: if (isDark) Color(0xE6222222) else Color(0xF2FFFFFF)

  val contentColor: Color = if (isDark) Color(0xFFFAFAFA) else Color(0xFF18181B)

  fun textStyle(
    fontSize: TextUnit,
    color: Color = labelColor,
    fontWeight: FontWeight? = null,
  ): TextStyle = TextStyle(
    color = color,
    fontFamily = fontFamily,
    fontSize = fontSize,
    fontWeight = fontWeight,
  )

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
   * The colour a held span is drawn in, or null where the chart named none. The span's own direction
   * rather than the period's, off the first series the way every other reading is — so a fortnight
   * down inside a year up is drawn as the fortnight.
   */
  fun rangeTint(from: Int, to: Int): String? {
    val style = interaction.rangeStyle ?: return null
    val values = series.firstOrNull()?.values
    return style.tint(rose = (values?.getOrNull(to) ?: 0.0) >= (values?.getOrNull(from) ?: 0.0))
  }

  fun dimming(id: String): Float =
    if (emphasisId.isNullOrEmpty() || emphasisId == id) 1f else interaction.dimOpacity

  internal fun framed(frame: MorphFrame): ChartConfiguration =
    ChartConfiguration(json, isSystemDark, frame).also {
      it.fontFamily = fontFamily
      it.measuredYGutter = measuredYGutter
      it.scrubDimming = scrubDimming
      it.scrubLit = scrubLit
      it.scrubRange = scrubRange
    }

  fun valueExtent(values: List<Double>): Pair<Double, Double> {
    val minimum = values.minOrNull() ?: 0.0
    val maximum = values.maxOrNull() ?: 1.0
    val inferred = if (minimum == maximum) minimum to (maximum + 1) else minimum to maximum
    val inset = (inferred.second - inferred.first) * yAxis.domain.padding
    return (yAxis.domain.minimum ?: (inferred.first - inset)) to
      (yAxis.domain.maximum ?: (inferred.second + inset))
  }
}
