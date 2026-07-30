import Foundation

struct ZyplotThemeColors: Codable {
  var axis: String?
  var background: String?
  var categorical: [String]?
  var grid: String?
  var label: String?
  var negative: String?
  var positive: String?
  var surface: String?
  var track: String?
}

struct ZyplotThemeTypography: Codable {
  var fontFamily: String?
}

struct ZyplotTheme: Codable {
  var colors: ZyplotThemeColors?
  var typography: ZyplotThemeTypography?
}
