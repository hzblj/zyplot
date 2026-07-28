package com.hzblj.zyplot.core.finance

import com.hzblj.zyplot.core.presentation.nullableString
import org.json.JSONObject

data class CandlestickStyle(
  val candleWidth: Float,
  val downColor: String?,
  val hollowUp: Boolean,
  val neutralColor: String?,
  val upColor: String?,
  val volumeDownColor: String?,
  val volumeHeightRatio: Float,
  val volumeUpColor: String?,
  val wickWidth: Float,
) {
  companion object {
    fun from(json: JSONObject?): CandlestickStyle = CandlestickStyle(
      candleWidth = json?.optDouble("candleWidth", 0.52)?.toFloat() ?: 0.52f,
      downColor = json?.nullableString("downColor"),
      hollowUp = json?.optBoolean("hollowUp", false) ?: false,
      neutralColor = json?.nullableString("neutralColor"),
      upColor = json?.nullableString("upColor"),
      volumeDownColor = json?.nullableString("volumeDownColor"),
      volumeHeightRatio = json?.optDouble("volumeHeightRatio", 0.2)?.toFloat() ?: 0.2f,
      volumeUpColor = json?.nullableString("volumeUpColor"),
      wickWidth = json?.optDouble("wickWidth", 1.5)?.toFloat() ?: 1.5f,
    )
  }
}
