package com.hzblj.zyplot.charts.interaction

import androidx.compose.runtime.Composable
import androidx.compose.runtime.key
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Rect
import androidx.compose.ui.layout.layout
import androidx.compose.ui.unit.IntSize
import com.hzblj.zyplot.charts.plotRect
import com.hzblj.zyplot.core.ChartConfiguration
import kotlin.math.roundToInt

/**
 * Puts every node the app supplied where the chart says it belongs.
 *
 * The anchor is read inside the placement block rather than in composition, so a finger moving
 * costs a placement and not a recomposition — the same trade the tooltip the chart draws makes.
 */
@Composable
internal fun ChartSlots(
  config: ChartConfiguration,
  scrub: ChartScrub,
  width: Float,
  height: Float,
  density: Float,
  slot: @Composable (id: String, modifier: Modifier) -> Unit,
) {
  val plot = plotRect(config, width, height, density)
  /**
   * Kept past the touch so a node that fades out fades where it was read rather than at the corner.
   * Whether there is anything to show once the finger has gone is the app's to answer — it renders
   * the node or it does not — so the chart only ever answers where. Deliberately not snapshot
   * state: it is written in the placement block, which must not invalidate what it is placing.
   */
  val lastReading = remember { LastReading() }

  for (spot in annotationSpots(config, plot)) {
    key(spot.id) {
      val align = config.annotationViewAlign[spot.id]
      slot(
        "annotation:${spot.id}",
        Modifier.anchored { size ->
          when (spot.run) {
            SpotRun.ACROSS -> Offset(plot.left, alignedY(spot.at.y, size, align))
            SpotRun.DOWN -> Offset(spot.at.x - size.width / 2f, alignedY(plot, size, align))
            SpotRun.POINT -> Offset(spot.at.x - size.width / 2f, alignedY(spot.at.y, size, align))
          }
        },
      )
    }
  }

  // The plot arrives in pixels, so the anchor's own measurements have to leave dp to meet the ones
  // iOS holds in points.
  val anchor = config.tooltipAnchor
  val gap = anchor.gap * density
  val lift = anchor.lift * density

  slot(
    "tooltip",
    Modifier.anchored { size ->
      val at = pointer(scrub, lastReading) ?: return@anchored null
      if (anchor.isAbove) chip(at, size, plot, width, lift) else reading(at, size, plot, gap, anchor.align)
    },
  )

  slot(
    "range",
    Modifier.anchored { size ->
      val span = scrub.range.value ?: return@anchored null
      val start = categoryCentre(config, span.startIndex, width, density, align = "start")
      val end = categoryCentre(config, span.endIndex, width, density, align = "end")
      chip(Offset((start + end) / 2f, 0f), size, plot, width, lift)
    },
  )
}

/**
 * Where a view sits against a mark that has no height of its own — a point, or a rule that runs
 * across the plot. Centred on it unless asked otherwise: "top" puts its foot on the mark so it sits
 * above, "bottom" puts its head there so it hangs below.
 */
private fun alignedY(y: Float, size: IntSize, align: String?): Float = when (align) {
  "top" -> y - size.height
  "bottom" -> y
  else -> y - size.height / 2f
}

/**
 * Where a view sits against a rule that runs down the plot. That rule is a mark with a height of its
 * own, so the three are its head, its middle and its foot — and its head is where the chart's own
 * badge goes, which is what a view for one gets unless it asks for another.
 */
private fun alignedY(plot: Rect, size: IntSize, align: String?): Float = when (align) {
  "center" -> plot.center.y - size.height / 2f
  "bottom" -> plot.bottom - size.height
  else -> plot.top
}

private fun pointer(scrub: ChartScrub, lastReading: LastReading): Offset? {
  if (scrub.range.value != null) return null
  return scrub.pointer.value?.also { lastReading.at = it } ?: lastReading.at
}

/**
 * Centred on the reading and lifted clear of the plot, where the rule draws its own chip. Pinned to
 * the view rather than to the plot: the headroom the chip sits in is outside the plot's own box, and
 * a chip read at either end still belongs over the chart.
 */
private fun chip(pointer: Offset, size: IntSize, plot: Rect, viewWidth: Float, lift: Float): Offset {
  val centred = pointer.x - size.width / 2f

  return Offset(
    x = centred.coerceIn(0f, maxOf(0f, viewWidth - size.width)),
    y = plot.top - size.height - lift,
  )
}

private class LastReading {
  var at: Offset? = null
}

/**
 * Beside the reading where there is room for it, and on its other side where there is not.
 *
 * Down the plot it sits where the anchor says: against the top by the gap, which is where a card read
 * as belonging to the reading goes, or halfway down the plot, or against its floor.
 */
private fun reading(pointer: Offset, size: IntSize, plot: Rect, gap: Float, align: String?): Offset {
  val trailing = pointer.x + gap
  val x = if (trailing + size.width <= plot.right) trailing else pointer.x - gap - size.width
  val y = when (align) {
    "center" -> plot.center.y - size.height / 2f
    "bottom" -> plot.bottom - size.height - gap
    else -> plot.top + gap
  }

  return Offset(
    x = x.coerceIn(plot.left, maxOf(plot.left, plot.right - size.width)),
    y = y,
  )
}

/**
 * Places the node at whatever the anchor says, given its own measured size, and leaves it
 * unplaced — and so undrawn — when the anchor says nothing. Contributes no size of its own, so a
 * node the chart moves never grows the plot it sits on.
 */
private fun Modifier.anchored(anchor: (size: IntSize) -> Offset?): Modifier = layout { measurable, constraints ->
  val placeable = measurable.measure(constraints.copy(minHeight = 0, minWidth = 0))
  layout(0, 0) {
    val at = anchor(IntSize(placeable.width, placeable.height)) ?: return@layout
    placeable.place(at.x.roundToInt(), at.y.roundToInt())
  }
}
