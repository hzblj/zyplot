package com.hzblj.zyplot.charts.interaction

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.hzblj.zyplot.core.ChartConfiguration
import kotlin.math.roundToInt

@Composable
internal fun ChartTooltip(
  config: ChartConfiguration,
  scrub: ChartScrub,
  width: Float,
) {
  if (!config.interaction.tooltip || scrub.range.value != null) return
  val pointer = scrub.pointer.value ?: return
  val selection = scrub.selection(config, width, LocalDensity.current.density) ?: return

  if (selection.rows.isNotEmpty()) {
    Column(
      modifier = Modifier
        .offset {
          IntOffset(
            x = (pointer.x + 14f).roundToInt()
              .coerceAtMost((width - 190f).roundToInt().coerceAtLeast(8)),
            y = 12,
          )
        }
        .clip(RoundedCornerShape(12.dp))
        .background(config.surfaceColor)
        .padding(horizontal = 12.dp, vertical = 9.dp),
      verticalArrangement = Arrangement.spacedBy(3.dp),
    ) {
      selection.rows.forEach { (label, value) ->
        Row {
          Text(
            label,
            color = config.labelColor,
            fontFamily = config.fontFamily,
            fontSize = 12.sp,
          )
          Spacer(Modifier.width(18.dp))
          Text(
            value,
            color = config.contentColor,
            fontFamily = config.fontFamily,
            fontSize = 12.sp,
            fontWeight = FontWeight.Medium,
          )
        }
      }
    }
    return
  }

  if (selection.category == null && selection.value == null) return
  Text(
    text = if (selection.detail.isNotEmpty()) {
      (listOfNotNull(selection.category) + selection.detail).joinToString("\n")
    } else {
      listOfNotNull(
        selection.category,
        selection.value?.let(config.format::format),
      ).joinToString("  ")
    },
    modifier = Modifier
      .offset { IntOffset(x = (pointer.x - 42f).roundToInt().coerceAtLeast(8), y = 8) }
      .clip(RoundedCornerShape(8.dp))
      .background(config.surfaceColor)
      .padding(horizontal = 9.dp, vertical = 6.dp),
    color = config.contentColor,
    fontFamily = config.fontFamily,
    fontSize = 12.sp,
  )
}
