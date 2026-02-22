import Foundation

/// 音声認識（STT）の責務を定義するプロトコル
protocol SpeechRecognitionProtocol: Sendable {
    var isRecording: Bool { get }
    
    /// マイクと音声認識の権限をリクエスト
    func requestPermissions() async -> Bool
    
    /// 録音を開始し、音声を文字起こしする
    /// - Returns: 部分的な文字起こし結果を逐次返す AsyncThrowingStream
    func startRecording() -> AsyncThrowingStream<String, Error>
    
    /// 録音を停止する
    func stopRecording()
}

/// 音声合成（TTS）の責務を定義するプロトコル
protocol SpeechSynthesisProtocol: Sendable {
    /// テキストを音声で読み上げる（ユーザーへのフィードバック）
    func speak(_ text: String)
}
