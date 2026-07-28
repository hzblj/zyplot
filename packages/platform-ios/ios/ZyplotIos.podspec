Pod::Spec.new do |s|
  s.name           = 'ZyplotIos'
  s.version        = '0.0.0'
  s.summary        = 'Native Swift Charts renderer for Zyplot'
  s.description    = 'Expo Module backed by SwiftUI and Swift Charts.'
  s.author         = 'Jan Blazej'
  s.homepage       = 'https://github.com/hzblj/zyplot'
  s.license        = 'MIT'
  s.platforms      = { :ios => '17.0' }
  s.source         = { :git => 'https://github.com/hzblj/zyplot.git' }
  s.static_framework = true
  s.dependency 'ExpoModulesCore'
  s.source_files = '**/*.{h,m,mm,swift,hpp,cpp}'
end

