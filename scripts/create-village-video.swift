// Render an original illustrated reel with macOS CoreGraphics and AVFoundation.
// Run: swift -module-cache-path /private/tmp/mehchana-swift-cache scripts/create-village-video.swift
import Foundation
import CoreGraphics
import AVFoundation
import AppKit

let width = 540, height = 960, fps: Int32 = 24
let duration = 16.0
let root = URL(fileURLWithPath: FileManager.default.currentDirectoryPath)
let output = root.appendingPathComponent("public/videos/mehchana-village-mornings.mp4")
let renderOutput = FileManager.default.temporaryDirectory.appendingPathComponent("mehchana-village-\(UUID().uuidString).mp4")
let poster = root.appendingPathComponent("public/images/mehchana-village-mornings-poster.png")
try FileManager.default.createDirectory(at: output.deletingLastPathComponent(), withIntermediateDirectories: true)

func color(_ hex: UInt32, _ alpha: CGFloat = 1) -> CGColor {
    CGColor(red: CGFloat((hex >> 16) & 255) / 255, green: CGFloat((hex >> 8) & 255) / 255, blue: CGFloat(hex & 255) / 255, alpha: alpha)
}
func rect(_ c: CGContext, _ x: CGFloat, _ y: CGFloat, _ w: CGFloat, _ h: CGFloat, _ fill: UInt32, _ radius: CGFloat = 0) {
    c.setFillColor(color(fill))
    c.addPath(CGPath(roundedRect: CGRect(x: x, y: y, width: w, height: h), cornerWidth: radius, cornerHeight: radius, transform: nil))
    c.fillPath()
}
func ellipse(_ c: CGContext, _ x: CGFloat, _ y: CGFloat, _ w: CGFloat, _ h: CGFloat, _ fill: UInt32, _ alpha: CGFloat = 1) {
    c.setFillColor(color(fill, alpha)); c.fillEllipse(in: CGRect(x: x, y: y, width: w, height: h))
}
func line(_ c: CGContext, _ points: [CGPoint], _ stroke: UInt32, _ thickness: CGFloat) {
    guard let first = points.first else { return }
    c.beginPath(); c.move(to: first)
    for p in points.dropFirst() { c.addLine(to: p) }
    c.setStrokeColor(color(stroke)); c.setLineWidth(thickness); c.setLineCap(.round); c.setLineJoin(.round); c.strokePath()
}
func poly(_ c: CGContext, _ points: [CGPoint], _ fill: UInt32) {
    guard let first = points.first else { return }
    c.beginPath(); c.move(to: first)
    for p in points.dropFirst() { c.addLine(to: p) }
    c.closePath(); c.setFillColor(color(fill)); c.fillPath()
}
func text(_ c: CGContext, _ value: String, _ y: CGFloat, _ size: CGFloat, _ fill: UInt32, serif: Bool = false) {
    c.saveGState()
    let font = (serif ? NSFont(name: "Georgia", size: size) : NSFont.systemFont(ofSize: size, weight: .medium)) ?? NSFont.systemFont(ofSize: size)
    let string = NSAttributedString(string: value, attributes: [.font: font, .foregroundColor: NSColor(cgColor: color(fill))!])
    let size = string.size()
    c.translateBy(x: 0, y: CGFloat(height)); c.scaleBy(x: 1, y: -1)
    NSGraphicsContext.saveGraphicsState()
    NSGraphicsContext.current = NSGraphicsContext(cgContext: c, flipped: false)
    string.draw(at: NSPoint(x: (CGFloat(width) - size.width) / 2, y: CGFloat(height) - y - size.height))
    NSGraphicsContext.restoreGraphicsState(); c.restoreGState()
}
func ease(_ x: Double) -> CGFloat { let v = max(0, min(1, x)); return CGFloat(v * v * (3 - 2 * v)) }
let skin: UInt32 = 0xAA724C, ink: UInt32 = 0x233E33

func can(_ c: CGContext, _ x: CGFloat, _ y: CGFloat, _ s: CGFloat, level: CGFloat = 0) {
    c.saveGState(); c.translateBy(x: x, y: y); c.scaleBy(x: s, y: s)
    line(c, [CGPoint(x: -19, y: 20), CGPoint(x: -28, y: 20), CGPoint(x: -28, y: 47), CGPoint(x: -20, y: 47)], 0x748D89, 4)
    rect(c, -22, 12, 44, 57, 0xABBDB6, 7)
    rect(c, -15, 0, 30, 20, 0xC3D1C9, 4)
    ellipse(c, -17, -3, 34, 10, 0x5C7670)
    ellipse(c, -13, -1, 26, 5, 0xF9F2D9)
    rect(c, -16, 23, 6, 37, 0xD9E2D6, 3)
    line(c, [CGPoint(x: -18, y: 62), CGPoint(x: 18, y: 62)], 0x7C958E, 2)
    if level > 0 { rect(c, -13, 55 - level * 28, 26, level * 28, 0xF8EAC7, 3) }
    c.restoreGState()
}
func person(_ c: CGContext, _ x: CGFloat, _ y: CGFloat, _ s: CGFloat, shirt: UInt32, pouring: CGFloat = 0, riding: Bool = false, phase: CGFloat = 0) {
    c.saveGState(); c.translateBy(x: x, y: y); c.scaleBy(x: s, y: s)
    let pedal = riding ? sin(phase) * 12 : 0
    line(c, [CGPoint(x: -10, y: 77), CGPoint(x: -16 + pedal, y: 105), CGPoint(x: -12 - pedal, y: 133)], 0xD3CBB0, 13)
    line(c, [CGPoint(x: 9, y: 77), CGPoint(x: 18 - pedal, y: 105), CGPoint(x: 14 + pedal, y: 133)], 0xE8DFC5, 13)
    line(c, [CGPoint(x: -17 - pedal, y: 135), CGPoint(x: -5 - pedal, y: 135)], ink, 6)
    line(c, [CGPoint(x: 9 + pedal, y: 135), CGPoint(x: 21 + pedal, y: 135)], ink, 6)
    poly(c, [CGPoint(x: -20, y: 22), CGPoint(x: 16, y: 22), CGPoint(x: 23, y: 86), CGPoint(x: -25, y: 86)], shirt)
    line(c, [CGPoint(x: 0, y: 32), CGPoint(x: 0, y: 63)], 0xC0B79C, 1.5)
    ellipse(c, -14, -12, 30, 37, skin)
    ellipse(c, 10, 0, 8, 12, skin)
    rect(c, -20, -21, 42, 21, 0xEFE6CB, 10)
    line(c, [CGPoint(x: -16, y: -8), CGPoint(x: 17, y: -14)], 0xCEBE9E, 2)
    ellipse(c, 7, 0, 3, 3, ink)
    line(c, [CGPoint(x: 7, y: 12), CGPoint(x: 15, y: 13)], 0x674C37, 2)
    if pouring > 0 {
        line(c, [CGPoint(x: 16, y: 35), CGPoint(x: 39, y: 27), CGPoint(x: 58, y: 17)], skin, 9)
        line(c, [CGPoint(x: -14, y: 36), CGPoint(x: 10, y: 51), CGPoint(x: 56, y: 27)], skin, 9)
        c.saveGState(); c.translateBy(x: 65, y: 18); c.rotate(by: 0.35 + pouring * 0.55)
        rect(c, -15, -16, 32, 35, 0xC2CEC6, 5)
        line(c, [CGPoint(x: -12, y: -19), CGPoint(x: 12, y: -19)], 0x66827A, 3)
        c.restoreGState()
    } else {
        let handX: CGFloat = riding ? 48 : 21, handY: CGFloat = riding ? 53 : 76
        line(c, [CGPoint(x: 15, y: 34), CGPoint(x: 29, y: 56), CGPoint(x: handX, y: handY)], skin, 9)
        line(c, [CGPoint(x: -17, y: 35), CGPoint(x: -28, y: 58), CGPoint(x: -21, y: 77)], skin, 8)
    }
    c.restoreGState()
}
func wheel(_ c: CGContext, _ x: CGFloat, _ y: CGFloat, _ radius: CGFloat, _ angle: CGFloat) {
    c.setStrokeColor(color(ink)); c.setLineWidth(7); c.strokeEllipse(in: CGRect(x: x-radius, y: y-radius, width: radius*2, height: radius*2))
    c.setStrokeColor(color(0xAAB6A0)); c.setLineWidth(1.3)
    for i in 0..<8 {
        let a = angle + CGFloat(i) * .pi / 4
        c.move(to: CGPoint(x: x, y: y)); c.addLine(to: CGPoint(x: x + cos(a)*radius, y: y + sin(a)*radius)); c.strokePath()
    }
    ellipse(c, x-4, y-4, 8, 8, 0xC3AB72)
}
func bicycle(_ c: CGContext, _ x: CGFloat, _ y: CGFloat, _ angle: CGFloat, riding: Bool) {
    c.saveGState(); c.translateBy(x: x, y: y)
    ellipse(c, -79, 32, 190, 19, 0x866B45, 0.13)
    wheel(c, -55, 0, 36, angle); wheel(c, 70, 0, 36, angle)
    line(c, [CGPoint(x: -55, y: 0), CGPoint(x: -15, y: -55), CGPoint(x: 5, y: 0), CGPoint(x: -55, y: 0), CGPoint(x: 43, y: -51), CGPoint(x: 5, y: 0)], 0x314C3F, 5)
    line(c, [CGPoint(x: 43, y: -51), CGPoint(x: 70, y: 0), CGPoint(x: 38, y: -72), CGPoint(x: 55, y: -77)], ink, 5)
    line(c, [CGPoint(x: -15, y: -55), CGPoint(x: -19, y: -70)], ink, 4)
    line(c, [CGPoint(x: -33, y: -70), CGPoint(x: -5, y: -70)], 0x69523A, 7)
    line(c, [CGPoint(x: -90, y: -47), CGPoint(x: -32, y: -47)], ink, 4)
    can(c, -64, -108, 0.85)
    if riding { person(c, -10, -138, 0.83, shirt: 0xF1E5C5, riding: true, phase: angle) }
    c.restoreGState()
}
func motorcycle(_ c: CGContext, _ x: CGFloat, _ y: CGFloat, _ angle: CGFloat, riding: Bool) {
    c.saveGState(); c.translateBy(x: x, y: y)
    ellipse(c, -78, 29, 175, 18, 0x866B45, 0.15)
    wheel(c, -52, 0, 29, angle); wheel(c, 61, 0, 29, angle)
    line(c, [CGPoint(x: -52, y: 0), CGPoint(x: -27, y: -38), CGPoint(x: 24, y: -28), CGPoint(x: 61, y: 0), CGPoint(x: 40, y: -56), CGPoint(x: 49, y: -65)], ink, 7)
    rect(c, -30, -37, 51, 30, 0x596A5C, 7)
    rect(c, -35, -58, 57, 12, 0x273A32, 6)
    ellipse(c, 4, -56, 42, 22, 0xA45D3F)
    ellipse(c, 43, -58, 13, 14, 0xECD89C)
    can(c, -57, -68, 0.65)
    if riding { person(c, -8, -149, 0.83, shirt: 0x6F8564, riding: true) }
    c.restoreGState()
}
func house(_ c: CGContext, _ x: CGFloat, _ y: CGFloat, _ s: CGFloat, second: Bool = false) {
    c.saveGState(); c.translateBy(x: x, y: y); c.scaleBy(x: s, y: s)
    rect(c, 0, 0, 210, 198, second ? 0xD5B18C : 0xDBBB93, 3)
    rect(c, -9, -12, 228, 18, 0xAD7955, 3)
    rect(c, 19, 8, 173, 4, 0xBD9770)
    rect(c, 104, 83, 61, 115, 0x645C42, 28)
    rect(c, 110, 101, 49, 97, 0x58654E, 3)
    rect(c, 24, 62, 46, 48, 0x6C7355, 4)
    line(c, [CGPoint(x: 47, y: 64), CGPoint(x: 47, y: 108)], 0xCEAF7C, 3)
    line(c, [CGPoint(x: 26, y: 85), CGPoint(x: 67, y: 85)], 0xCEAF7C, 3)
    for row in 0..<4 { for col in 0..<3 { rect(c, CGFloat(12 + col*24 + (row%2)*8), CGFloat(127 + row*16), 17, 2, 0xC4A17D) } }
    rect(c, 93, 192, 85, 10, 0xBAA17D, 2)
    c.restoreGState()
}
func background(_ c: CGContext, _ t: Double, second: Bool) {
    rect(c, 0, 0, 540, 960, 0xF4EBD3)
    ellipse(c, 360, 136, 95, 95, 0xE9C87C)
    for i in 0..<3 {
        let x = CGFloat(i*215 - 80) + CGFloat(sin(t*0.08))*12
        ellipse(c, x, 249 + CGFloat(i%2)*23, 150, 29, 0xFFFAE9, 0.8)
    }
    poly(c, [CGPoint(x:0,y:447),CGPoint(x:110,y:400),CGPoint(x:225,y:430),CGPoint(x:392,y:394),CGPoint(x:540,y:437),CGPoint(x:540,y:645),CGPoint(x:0,y:645)], 0xB8C299)
    rect(c, 0, 538, 540, 150, 0xC4C798)
    for i in 0..<48 {
        let x = CGFloat((i*37)%550), y = CGFloat(559+(i*19)%93)
        line(c, [CGPoint(x:x,y:y+12),CGPoint(x:x+2,y:y)], 0x8F9F69, 1.5)
        ellipse(c, x-1, y-3, 5, 5, 0xE8C867)
    }
    house(c, second ? -25 : 325, 423, 0.92, second: second)
    rect(c, 0, 633, 540, 327, 0xDECCAA)
    poly(c, [CGPoint(x:0,y:706),CGPoint(x:540,y:651),CGPoint(x:540,y:768),CGPoint(x:0,y:835)], 0xEADABD)
    for i in 0..<25 { ellipse(c, CGFloat((i*89)%540), CGFloat(716+(i*17)%105), 3, 2, 0xBDAA88, 0.6) }
    let treeX: CGFloat = second ? 467 : 62
    line(c, [CGPoint(x:treeX,y:639),CGPoint(x:treeX-5,y:419),CGPoint(x:treeX-39,y:353)], 0x88754F, 19)
    line(c, [CGPoint(x:treeX-4,y:466),CGPoint(x:treeX+39,y:386)], 0x88754F, 10)
    for i in 0..<8 {
        let a = CGFloat(i) * .pi / 4
        ellipse(c, treeX + cos(a)*57 - 52 + CGFloat(sin(t*0.8+Double(i)))*2, 347 + sin(a)*48 - 44, 112, 91, i%2 == 0 ? 0x71865A : 0x85965E)
    }
    ellipse(c, treeX-52, 297, 99, 85, 0x8F9E68)
    for i in 0..<2 {
        let x = CGFloat(147 + i*42) + CGFloat(t*3).truncatingRemainder(dividingBy: 70)
        let y: CGFloat = 310 + CGFloat(i*24)
        let flap = CGFloat(sin(t*4+Double(i)))*3
        line(c, [CGPoint(x:x-7,y:y+flap),CGPoint(x:x,y:y+4),CGPoint(x:x+7,y:y+flap)], 0x7D8C70, 1.8)
    }
    text(c, "MEHCHANA", 146, 15, 0x8F713E)
    text(c, "Village mornings", 176, 36, 0x214635, serif: true)
}

func frame(_ c: CGContext, _ t: Double) {
    let second = t >= 7
    background(c, t, second: second)
    let movingFirst = t < 2.5, movingSecond = t >= 5.8 && t < 8.8
    var bikeX: CGFloat = 164
    if movingFirst { bikeX = -160 + 324 * ease(t/2.5) }
    else if t >= 5.8 && t < 7 { bikeX = 164 + 540 * ease((t-5.8)/1.2) }
    else if t >= 7 && t < 8.8 { bikeX = -170 + 334 * ease((t-7)/1.8) }
    let riding = movingFirst || movingSecond
    bicycle(c, bikeX, 730, riding ? CGFloat(t*6) : 0, riding: riding)
    let collecting = (t >= 2.5 && t < 5.8) || (t >= 8.8 && t < 12.2)
    let pourStart = second ? 9.2 : 2.9
    let pouring = collecting && t > pourStart && t < pourStart+2.1
    let farmerX: CGFloat = second ? 320 : 322
    // The farmer faces left, pouring into the collector's stationary drum.
    c.saveGState(); c.translateBy(x: farmerX, y: 0); c.scaleBy(x: -1, y: 1)
    person(c, 0, 581, 0.98, shirt: second ? 0xAC734F : 0x7D926D, pouring: pouring ? 1 : 0)
    c.restoreGState()
    if !riding {
        person(c, 169, 576, 1.02, shirt: 0xF1E5C5)
        can(c, 239, 620, 1.12, level: collecting ? ease((t-pourStart)/2.1) : 1)
    }
    if pouring {
        let wiggle = CGFloat(sin(t*15))*1.8
        line(c, [CGPoint(x:253,y:609),CGPoint(x:247+wiggle,y:617),CGPoint(x:239+wiggle,y:623)], 0xFFFBE8, 5)
        for i in 0..<3 { ellipse(c, 234+CGFloat(i*5), 624+CGFloat(sin(t*8+Double(i)))*2, 3, 2, 0xFFFEF4) }
    }
    if t >= 12 {
        let x = 735 - 320 * ease((t-12)/2.5)
        motorcycle(c, x, 784, t < 14.5 ? CGFloat(t*7) : 0, riding: t < 14.5)
        if t >= 14.5 { person(c, 474, 690, 0.87, shirt: 0x6F8564) }
    }
    let caption = t < 2.5 ? "A new morning. A familiar journey." : t < 5.8 ? "Fresh milk, collected with care." : t < 8.8 ? "On to the next village home." : t < 12 ? "Another stop. The same care." : "Bringing the village together."
    text(c, caption, 825, 17, 0x4D6450)
    for i in 0..<3 {
        let active = t < 5.8 ? 0 : t < 12 ? 1 : 2
        rect(c, CGFloat(225+i*34), 867, 25, 3, i <= active ? 0xA88643 : 0xCBBE9C, 1.5)
    }
    // A brief cream dissolve conceals the move between two distinct courtyards.
    let dissolve = max(0, 1 - abs(t-7)/0.3)
    if dissolve > 0 { c.setFillColor(color(0xF4EBD3, CGFloat(dissolve))); c.fill(CGRect(x: 0, y: 0, width: width, height: height)) }
}

let writer = try AVAssetWriter(outputURL: renderOutput, fileType: .mp4)
let settings: [String: Any] = [AVVideoCodecKey: AVVideoCodecType.h264, AVVideoWidthKey: width, AVVideoHeightKey: height, AVVideoCompressionPropertiesKey: [AVVideoAverageBitRateKey: 1_500_000, AVVideoMaxKeyFrameIntervalKey: fps * 2, AVVideoProfileLevelKey: AVVideoProfileLevelH264MainAutoLevel]]
let input = AVAssetWriterInput(mediaType: .video, outputSettings: settings)
input.expectsMediaDataInRealTime = false
let attributes: [String: Any] = [kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32ARGB, kCVPixelBufferWidthKey as String: width, kCVPixelBufferHeightKey as String: height, kCVPixelBufferCGImageCompatibilityKey as String: true, kCVPixelBufferCGBitmapContextCompatibilityKey as String: true]
let adaptor = AVAssetWriterInputPixelBufferAdaptor(assetWriterInput: input, sourcePixelBufferAttributes: attributes)
writer.shouldOptimizeForNetworkUse = true
writer.add(input)
guard writer.startWriting() else { throw writer.error! }
writer.startSession(atSourceTime: .zero)
let frames = Int(duration * Double(fps))
for index in 0..<frames {
    try autoreleasepool {
        while !input.isReadyForMoreMediaData {
            if writer.status == .failed { throw writer.error! }
            Thread.sleep(forTimeInterval: 0.005)
        }
        var pixel: CVPixelBuffer?
        guard let pool = adaptor.pixelBufferPool, CVPixelBufferPoolCreatePixelBuffer(nil, pool, &pixel) == kCVReturnSuccess, let pixel else { throw NSError(domain: "VillageVideo", code: 2) }
        CVPixelBufferLockBaseAddress(pixel, [])
        defer { CVPixelBufferUnlockBaseAddress(pixel, []) }
        let c = CGContext(data: CVPixelBufferGetBaseAddress(pixel), width: width, height: height, bitsPerComponent: 8, bytesPerRow: CVPixelBufferGetBytesPerRow(pixel), space: CGColorSpaceCreateDeviceRGB(), bitmapInfo: CGImageAlphaInfo.noneSkipFirst.rawValue)!
        c.translateBy(x: 0, y: CGFloat(height)); c.scaleBy(x: 1, y: -1)
        frame(c, Double(index) / Double(fps))
        if index == 4 * Int(fps), let cgImage = c.makeImage() {
            let bitmap = NSBitmapImageRep(cgImage: cgImage)
            try bitmap.representation(using: .png, properties: [:])!.write(to: poster)
        }
        guard adaptor.append(pixel, withPresentationTime: CMTime(value: Int64(index), timescale: fps)) else { throw writer.error ?? NSError(domain: "VillageVideo", code: 3) }
        if index % Int(fps * 4) == 0 { print("Rendered \(index)/\(frames) frames") }
    }
}
input.markAsFinished()
let finished = DispatchSemaphore(value: 0)
writer.finishWriting { finished.signal() }
finished.wait()
guard writer.status == .completed else { throw writer.error! }
try Data(contentsOf: renderOutput).write(to: output, options: .atomic)
try FileManager.default.removeItem(at: renderOutput)
print("Created \(output.path)")
