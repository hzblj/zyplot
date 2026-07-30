package com.hzblj.zyplot.core.presentation

import com.hzblj.zyplot.core.json.floats
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
  val gridDash: List<Float>,
  val label: String?,
  val labelInset: Float,
  val labelOverflow: String,
  val labelSize: Float,
  val labelRotation: Float,
  val padEnd: Float,
  val padStart: Float,
  val position: String,
  val reversed: Boolean,
  val scale: String,
  val tickCount: Int,
  val ticks: Boolean,
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
        gridDash = json?.optJSONArray("gridDash").floats(),
        label = json?.nullableString("label"),
        labelInset = json?.optDouble("labelInset", 2.0)?.toFloat() ?: 2f,
        labelSize = json?.optDouble("labelSize", 11.0)?.toFloat() ?: 11f,
        labelOverflow = json?.nullableString("labelOverflow") ?: "ellipsis",
        labelRotation = json?.optDouble("labelRotation", 0.0)?.toFloat() ?: 0f,
        padEnd = json?.optDouble("plotDimensionEndPadding", 0.0)?.toFloat() ?: 0f,
        padStart = json?.optDouble("plotDimensionStartPadding", 0.0)?.toFloat() ?: 0f,
        position = json?.optString("position", "start") ?: "start",
        reversed = json?.optBoolean("reversed", false) ?: false,
        scale = json?.optString("scale", "auto") ?: "auto",
        tickCount = (json?.optInt("tickCount", 4) ?: 4).coerceAtLeast(1),
        ticks = json?.optBoolean("ticks", true) ?: true,
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
