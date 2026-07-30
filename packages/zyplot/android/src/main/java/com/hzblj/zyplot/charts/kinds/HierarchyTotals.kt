package com.hzblj.zyplot.charts.kinds

internal fun nodeTotal(node: org.json.JSONObject): Double {
  if (node.has("value")) return node.optDouble("value")
  val children = node.optJSONArray("children") ?: return 0.0
  return (0 until children.length()).sumOf {
    children.optJSONObject(it)?.let(::nodeTotal) ?: 0.0
  }
}
