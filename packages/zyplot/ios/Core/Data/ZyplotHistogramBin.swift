import Foundation

struct ZyplotHistogramBin: Identifiable {
  let lower: Double
  let upper: Double
  let count: Int

  var id: Double { lower }
}
