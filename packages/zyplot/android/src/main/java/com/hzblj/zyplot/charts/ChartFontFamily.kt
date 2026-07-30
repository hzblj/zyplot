package com.hzblj.zyplot.charts

import android.content.Context
import android.graphics.Typeface
import androidx.compose.ui.text.font.FontFamily
import com.facebook.react.common.assets.ReactFontManager

/**
 * Turns the family named in `theme.typography.fontFamily` into one Compose can draw
 * with.
 *
 * Resolution goes through React Native's own font manager rather than
 * `Typeface.create`, so a chart accepts exactly the families a `<Text>` in the same
 * app does: fonts dropped in `assets/fonts`, fonts in `res/font`, and anything
 * registered with `ReactFontManager.addCustomFont`. A family the app never shipped
 * falls back to the platform font, which is the same thing a canvas on the web does
 * with a name the browser cannot resolve.
 */
internal fun resolveFontFamily(name: String?, context: Context): FontFamily? {
  if (name.isNullOrEmpty()) {
    return null
  }

  val typeface = runCatching {
    ReactFontManager.getInstance().getTypeface(name, Typeface.NORMAL, context.assets)
  }.getOrNull() ?: return null

  return FontFamily(typeface)
}
