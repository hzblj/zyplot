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

  /** The span under two fingers. Set only while both are down, and never together with a pointer. */
  val range: MutableState<ChartRange?> = mutableStateOf(null)

  var isScrubbing: Boolean = false
    private set

  /**
   * The last mark that was read, kept after the touch has gone. The lighting on it outlives the
   * reading by however long the step back takes to come up, and it is read in the draw rather than
   * watched, so it is deliberately not snapshot state.
   */
  var lastIndex: Int? = null
    private set

  /** The last span that was read, kept past the fingers the way `lastIndex` is kept past the touch. */
  var lastRange: IntRange? = null
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

  /**
   * Moves to a span, which is a reading in its own right: the single pointer steps aside so
   * the marker and the crosshair that belong to one finger do not survive the second one.
   */
  fun moveRange(
    config: ChartConfiguration,
    first: Offset,
    second: Offset,
    width: Float,
    density: Float = 1f,
  ): ChartRange? {
    pointer.value = null
    resolved = null
    resolvedAt = null
    lastIndex = null
    return chartRange(config, first, second, width, density).also {
      range.value = it
      if (it != null) lastRange = it.startIndex..it.endIndex
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
    range.value = null
    lastRange = null
    pointer.value = held
    return ChartMove(
      position = held,
      previousIndex = previous,
      selection = chartSelection(config, held, width, density),
    ).also {
      resolvedAt = held
      resolvedWidth = width
      resolved = it.selection
      it.selection.index?.let { index -> lastIndex = index }
    }
  }

  fun begin() {
    isScrubbing = true
  }

  fun end(keepsSelection: Boolean) {
    isScrubbing = false
    range.value = null
    if (keepsSelection) return
    pointer.value = null
    resolved = null
    resolvedAt = null
  }
}

@Composable
internal fun rememberChartScrub(datasetKey: String): ChartScrub =
  remember(datasetKey) { ChartScrub() }
