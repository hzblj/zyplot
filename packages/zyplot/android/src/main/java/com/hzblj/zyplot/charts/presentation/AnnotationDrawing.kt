package com.hzblj.zyplot.charts.presentation

import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Rect
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.TextMeasurer
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.drawText
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp
import com.hzblj.zyplot.charts.normalizedY
import com.hzblj.zyplot.core.ChartConfiguration
import com.hzblj.zyplot.core.parseColor
import com.hzblj.zyplot.core.presentation.ChartAnnotation
import kotlin.math.abs

private const val DEFAULT_ANNOTATION_COLOR = "#71717a"
private const val BADGE_RADIUS = 13f
private const val BADGE_GAP = 4f
private const val LABEL_PADDING = 4f
private const val LABEL_RADIUS = 4f

internal fun DrawScope.drawAnnotations(
  config: ChartConfiguration,
  measurer: TextMeasurer? = null,
  pulse: Float = 0f,
  isScrubbing: Boolean = false,
  strength: Float = 1f,
) {
  if (config.annotations.isEmpty()) return
  val plot = presentationPlotRect(config)
  val extent = config.annotatedExtent

  config.annotations.forEach { annotation ->
    if (annotation.hidden) return@forEach
    val fade = (if (isScrubbing) annotation.scrubOpacity else 1f) * strength
    if (fade <= 0f) return@forEach
    val color = parseColor(annotation.color ?: DEFAULT_ANNOTATION_COLOR)
      .let { it.copy(alpha = it.alpha * fade) }
    val effect = annotation.dashPattern
      ?.let { pattern -> PathEffect.dashPathEffect(pattern.map { it * density }.toFloatArray()) }
    when (annotation.type) {
      "line" -> drawAnnotationLine(annotation, config, plot, extent, color, effect, measurer)
      "range" -> drawAnnotationRange(annotation, config, plot, extent, color)
      "point", "text" ->
        drawAnnotationPoint(annotation, config, plot, extent, color, fade, pulse, measurer)
    }
  }
}

private fun DrawScope.drawAnnotationLine(
  annotation: ChartAnnotation,
  config: ChartConfiguration,
  plot: Rect,
  extent: Pair<Double, Double>,
  color: Color,
  effect: PathEffect?,
  measurer: TextMeasurer?,
) {
  if (annotation.axis == "x") {
    xPosition(annotation.value, config, plot.left, plot.width, annotation.align)?.let { x ->
      val top = if (annotation.badge != null) {
        plot.top + (BADGE_RADIUS * 2f + BADGE_GAP) * density
      } else {
        plot.top
      }
      drawLine(
        color,
        Offset(x, top),
        Offset(x, plot.bottom),
        strokeWidth = (annotation.width ?: 1f) * density,
        pathEffect = effect,
      )
      measurer?.let {
        drawAnnotationLabel(config, annotation, it, x, plot.top + BADGE_RADIUS * density, color, plot)
      }
    }
    return
  }
  (annotation.value as? Number)?.toDouble()?.let { value ->
    val y = normalizedY(value, extent.first, extent.second, plot)
    drawLine(
      color,
      Offset(plot.left, y),
      Offset(plot.right, y),
      strokeWidth = (annotation.width ?: 1f) * density,
      pathEffect = effect,
    )
    measurer?.let { drawAnnotationLabel(config, annotation, it, plot.left, y, color, plot) }
  }
}

private fun DrawScope.drawAnnotationRange(
  annotation: ChartAnnotation,
  config: ChartConfiguration,
  plot: Rect,
  extent: Pair<Double, Double>,
  color: Color,
) {
  val rangeColor = color.copy(alpha = annotation.opacity)
  if (annotation.axis == "x") {
    val start = xPosition(annotation.start, config, plot.left, plot.width)
    val end = xPosition(annotation.end, config, plot.left, plot.width)
    if (start != null && end != null) {
      drawRect(
        rangeColor,
        Offset(minOf(start, end), plot.top),
        Size(abs(end - start), plot.height),
      )
    }
    return
  }
  val start = (annotation.start as? Number)?.toDouble()
  val end = (annotation.end as? Number)?.toDouble()
  if (start != null && end != null) {
    val top = normalizedY(maxOf(start, end), extent.first, extent.second, plot)
    val bottom = normalizedY(minOf(start, end), extent.first, extent.second, plot)
    drawRect(rangeColor, Offset(plot.left, top), Size(plot.width, bottom - top))
  }
}

private fun DrawScope.drawAnnotationPoint(
  annotation: ChartAnnotation,
  config: ChartConfiguration,
  plot: Rect,
  extent: Pair<Double, Double>,
  color: Color,
  fade: Float,
  pulse: Float,
  measurer: TextMeasurer?,
) {
  val x = xPosition(annotation.x, config, plot.left, plot.width) ?: return
  val yValue = annotation.y ?: return
  val y = normalizedY(yValue, extent.first, extent.second, plot)
  val radius = (annotation.size ?: 10f) / 2f * density
  val outer = maxOf(radius, (annotation.halo?.size ?: 0f) / 2f * density)
  annotation.pulse?.let { bloom ->
    val hue = (bloom.color ?: annotation.glow?.color)?.let(::parseColor) ?: color
    val ringColor = hue.copy(alpha = bloom.opacity * fade * (1f - pulse))
    drawCircle(ringColor, radius = outer * (1f + (bloom.scale - 1f) * pulse), center = Offset(x, y))
  }
  annotation.glow?.let { glow ->
    val glowColor = (glow.color?.let(::parseColor) ?: color)
      .copy(alpha = glow.opacity * fade)
    for (pass in GLOW_PASSES downTo 1) {
      drawCircle(
        glowColor.copy(alpha = glowColor.alpha * 0.32f / pass),
        radius = outer + glow.radius * density * pass / GLOW_PASSES,
        center = Offset(x, y),
      )
    }
  }
  if (annotation.type == "point") {
    annotation.halo?.let { halo ->
      val haloColor = (halo.color?.let(::parseColor) ?: color)
        .copy(alpha = halo.opacity * fade)
      drawCircle(haloColor, radius = halo.size / 2f * density, center = Offset(x, y))
    }
    drawCircle(color, radius = radius, center = Offset(x, y))
  }
  measurer?.let { drawAnnotationLabel(config, annotation, it, x, y, color, plot) }
}

private fun DrawScope.drawAnnotationLabel(
  config: ChartConfiguration,
  annotation: ChartAnnotation,
  measurer: TextMeasurer,
  x: Float,
  y: Float,
  color: Color,
  plot: Rect,
) {
  val badge = annotation.badge
  val text = badge ?: annotation.text ?: annotation.label ?: return
  val layout = measurer.measure(
    text,
    config.textStyle(
      color = color,
      fontSize = if (badge != null) 11.sp else 10.sp,
      fontWeight = if (badge != null) FontWeight.SemiBold else FontWeight.Normal,
    ),
  )
  if (badge != null) {
    drawCircle(color.copy(alpha = 0.18f), radius = BADGE_RADIUS * density, center = Offset(x, y))
    drawCircle(
      color.copy(alpha = 0.4f),
      radius = BADGE_RADIUS * density,
      center = Offset(x, y),
      style = Stroke(density),
    )
    drawText(
      layout,
      topLeft = Offset(x - layout.size.width / 2f, y - layout.size.height / 2f),
    )
    return
  }
  val side = if (annotation.labelPosition == "auto") {
    if (y > plot.center.y) "top" else "bottom"
  } else {
    annotation.labelPosition
  }
  val gap = 3f * density
  val inset = 2f * density
  val side_ = 6f * density
  val topLeft = when (side) {
    "top" -> Offset(x + inset, y - layout.size.height - gap)
    "trailing" -> Offset(x + side_, y - layout.size.height / 2f)
    "leading" -> Offset(x - layout.size.width - side_, y - layout.size.height / 2f)
    else -> Offset(x + inset, y + gap)
  }
  annotation.labelBackground?.let { background ->
    drawRoundRect(
      parseColor(background).copy(alpha = color.alpha),
      topLeft = Offset(
        topLeft.x - LABEL_PADDING * density,
        topLeft.y - LABEL_PADDING / 2f * density,
      ),
      size = Size(
        layout.size.width + LABEL_PADDING * 2f * density,
        layout.size.height + LABEL_PADDING * density,
      ),
      cornerRadius = CornerRadius(LABEL_RADIUS * density, LABEL_RADIUS * density),
    )
  }
  drawText(layout, topLeft = topLeft)
}
