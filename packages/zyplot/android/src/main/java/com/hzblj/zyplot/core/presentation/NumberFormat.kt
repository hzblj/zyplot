package com.hzblj.zyplot.core.presentation

import com.hzblj.zyplot.core.json.nullableDouble
import com.hzblj.zyplot.core.json.nullableString
import java.util.Locale
import org.json.JSONObject

data class NumberFormat(
  val decimals: Int,
  val locale: String?,
  val prefix: String,
  val suffix: String,
) {
  private val resolvedLocale: Locale = locale?.takeIf { it.isNotEmpty() }
    ?.let(Locale::forLanguageTag)
    ?: Locale.US

  private val pattern: String = "%,.${decimals}f"

  fun format(value: Double): String =
    prefix + String.format(resolvedLocale, pattern, value) + suffix

  companion object {
    fun from(json: JSONObject?): NumberFormat = NumberFormat(
      decimals = (json?.nullableDouble("decimals")?.toInt() ?: 0).coerceIn(0, 20),
      locale = json?.nullableString("locale"),
      prefix = json?.nullableString("prefix") ?: "",
      suffix = json?.nullableString("suffix") ?: "",
    )
  }
}
