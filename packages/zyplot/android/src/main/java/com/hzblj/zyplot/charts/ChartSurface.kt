package com.hzblj.zyplot.charts

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import com.hzblj.zyplot.core.ChartConfiguration

internal fun chartSurfaceModifier(config: ChartConfiguration): Modifier {
  val surface = config.surface ?: return Modifier
    .fillMaxSize()
    .semantics { contentDescription = config.accessibilityLabel }

  val shape = RoundedCornerShape(surface.cornerRadius.dp)
  return Modifier
    .fillMaxSize()
    .clip(shape)
    .then(surface.background?.let { Modifier.background(it, shape) } ?: Modifier)
    .then(
      if (surface.borderColor != null && surface.borderWidth > 0f) {
        Modifier.border(surface.borderWidth.dp, surface.borderColor, shape)
      } else {
        Modifier
      },
    )
    .padding(
      bottom = surface.padding.bottom.dp,
      end = surface.padding.end.dp,
      start = surface.padding.start.dp,
      top = surface.padding.top.dp,
    )
    .semantics { contentDescription = config.accessibilityLabel }
}
