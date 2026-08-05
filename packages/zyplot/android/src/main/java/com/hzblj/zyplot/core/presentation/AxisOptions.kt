package com.hzblj.zyplot.core.presentation

import com.hzblj.zyplot.core.json.nullableDouble
import com.hzblj.zyplot.core.json.nullableString
import org.json.JSONObject

data class AxisDomain(
  val minimum: Double?,
  val maximum: Double?,
  val padding: Double,
)

data class AxisOptions(
  val domain: AxisDomain,
  val format: JSONObject?,
  val grid: Boolean,
  val label: String?,
  /** The first and last labels sit at the ends of the axis rather than centred on their own mark. */
  val labelEdgeAlign: Boolean,
  /** Null when the axis said nothing, so each side of the plot can keep its own spacing. */
  val labelInset: Float?,
  val labelOverflow: String,
  val labelSize: Float,
  val labelRotation: Float,
  /** Null when the axis said nothing, which is not the same as asking for none. */
  val padEnd: Float?,
  val padStart: Float?,
  val position: String,
  val tickCount: Int,
  val ticks: Boolean,
  /** A shorter mark at every category, not only at the named ones. */
  val minorTicks: Boolean,
  /**
   * The same tick values as written, so a category axis can name the ones it wants. A
   * category is a string, and reading them only as numbers dropped every one of them.
   */
  val tickCategories: List<String>,
  val tickValues: List<Double>,
  val visible: Boolean?,
) {
  companion object {
    fun from(json: JSONObject?): AxisOptions {
      val domain = json?.optJSONObject("domain")
      return AxisOptions(
        domain = AxisDomain(
          minimum = domain?.nullableDouble("min"),
          maximum = domain?.nullableDouble("max"),
          padding = domain?.optDouble("padding", 0.0)?.takeIf(Double::isFinite) ?: 0.0,
        ),
        format = json?.optJSONObject("format"),
        grid = json?.optBoolean("grid", true) ?: true,
        label = json?.nullableString("label"),
        labelEdgeAlign = json?.optBoolean("labelEdgeAlign", false) ?: false,
        labelInset = json?.nullableDouble("labelInset")?.takeIf(Double::isFinite)?.toFloat(),
        labelSize = json?.optDouble("labelSize", 11.0)?.toFloat() ?: 11f,
        labelOverflow = json?.nullableString("labelOverflow") ?: "ellipsis",
        labelRotation = json?.optDouble("labelRotation", 0.0)?.toFloat() ?: 0f,
        padEnd = json?.nullableDouble("plotDimensionEndPadding")?.takeIf(Double::isFinite)?.toFloat(),
        padStart = json?.nullableDouble("plotDimensionStartPadding")?.takeIf(Double::isFinite)?.toFloat(),
        position = json?.optString("position", "start") ?: "start",
        tickCount = (json?.optInt("tickCount", 4) ?: 4).coerceAtLeast(1),
        ticks = json?.optBoolean("ticks", true) ?: true,
        minorTicks = json?.optBoolean("minorTicks", false) ?: false,
        tickCategories = json?.optJSONArray("tickValues")?.let { array ->
          (0 until array.length()).mapNotNull {
            if (array.isNull(it)) null else array.optString(it).takeIf(String::isNotEmpty)
          }
        } ?: emptyList(),
        tickValues = json?.optJSONArray("tickValues")?.let { array ->
          (0 until array.length()).mapNotNull {
            if (array.isNull(it)) null else array.optDouble(it).takeIf(Double::isFinite)
          }
        } ?: emptyList(),
        visible = if (json?.has("visible") == true) json.optBoolean("visible") else null,
      )
    }
  }
}
