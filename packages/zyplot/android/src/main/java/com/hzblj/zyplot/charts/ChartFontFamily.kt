package com.hzblj.zyplot.charts

import android.content.Context
import android.graphics.Typeface
import androidx.compose.ui.text.font.FontFamily
import com.facebook.react.common.assets.ReactFontManager

internal fun resolveFontFamily(name: String?, context: Context): FontFamily? {
  if (name.isNullOrEmpty()) {
    return null
  }

  val typeface = runCatching {
    ReactFontManager.getInstance().getTypeface(name, Typeface.NORMAL, context.assets)
  }.getOrNull() ?: return null

  return FontFamily(typeface)
}
