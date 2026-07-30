package com.hzblj.zyplot.charts.interaction

import androidx.compose.runtime.Composable
import androidx.compose.runtime.MutableState
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.geometry.Offset
import com.hzblj.zyplot.charts.scrubLimit
import com.hzblj.zyplot.core.ChartConfiguration

internal data class ChartMove(
  val position: Offset,
  val previousIndex: Int?,
  val selection: ChartSelection,
)

internal class ChartScrub {
  val pointer: MutableState<Offset?> = mutableStateOf(null)

  var isScrubbing: Boolean = false
    private set

  private var resolvedAt: Offset? = null
  private var resolvedWidth: Float = 0f
  private var resolved: ChartSelection? = null

  fun selection(config: ChartConfiguration, width: Float, density: Float = 1f): ChartSelection? {
    val at = pointer.value ?: return null
    if (resolved != null && resolvedAt == at && resolvedWidth == width) return resolved
    return chartSelection(config, at, width, density).also {
      resolvedAt = at
      resolvedWidth = width
      resolved = it
    }
  }

  fun moveTo(
    config: ChartConfiguration,
    position: Offset,
    width: Float,
    density: Float = 1f,
  ): ChartMove {
    val previous = selection(config, width, density)?.index
    val held = Offset(minOf(position.x, scrubLimit(config, width, density)), position.y)
    pointer.value = held
    return ChartMove(
      position = held,
      previousIndex = previous,
      selection = chartSelection(config, held, width, density),
    ).also {
      resolvedAt = held
      resolvedWidth = width
      resolved = it.selection
    }
  }

  fun begin() {
    isScrubbing = true
  }

  fun end(keepsSelection: Boolean) {
    isScrubbing = false
    if (keepsSelection) return
    pointer.value = null
    resolved = null
    resolvedAt = null
  }
}

@Composable
internal fun rememberChartScrub(datasetKey: String): ChartScrub =
  remember(datasetKey) { ChartScrub() }
