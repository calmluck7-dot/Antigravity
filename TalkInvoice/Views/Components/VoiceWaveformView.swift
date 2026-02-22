import SwiftUI

/// 音声認識中の波形アニメーション
/// 5本のバーが滑らかに波打つビジュアルフィードバック
struct VoiceWaveformView: View {
    let isAnimating: Bool
    
    @State private var phase: Double = 0
    
    private let barCount = 5
    private let accentGold = Color(red: 1.0, green: 0.78, blue: 0.28)
    
    var body: some View {
        HStack(spacing: 6) {
            ForEach(0..<barCount, id: \.self) { index in
                WaveformBar(
                    isAnimating: isAnimating,
                    delay: Double(index) * 0.15,
                    color: accentGold
                )
            }
        }
        .frame(height: 40)
    }
}

/// 個別の波形バー
private struct WaveformBar: View {
    let isAnimating: Bool
    let delay: Double
    let color: Color
    
    @State private var height: CGFloat = 8
    
    var body: some View {
        RoundedRectangle(cornerRadius: 3)
            .fill(color)
            .frame(width: 6, height: height)
            .onAppear {
                guard isAnimating else { return }
                startAnimation()
            }
            .onChange(of: isAnimating) { _, newValue in
                if newValue {
                    startAnimation()
                } else {
                    withAnimation(.easeOut(duration: 0.3)) {
                        height = 8
                    }
                }
            }
    }
    
    private func startAnimation() {
        withAnimation(
            .easeInOut(duration: 0.5)
            .repeatForever(autoreverses: true)
            .delay(delay)
        ) {
            height = CGFloat.random(in: 16...40)
        }
    }
}
