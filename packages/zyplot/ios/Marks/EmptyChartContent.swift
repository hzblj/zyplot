import Charts

struct EmptyChartContent: ChartContent {
  var body: some ChartContent {
    RuleMark(y: .value("Empty", 0))
      .foregroundStyle(.clear)
  }
}
