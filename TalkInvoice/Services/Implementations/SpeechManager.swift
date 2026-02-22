import Foundation
import Speech
import AVFoundation
import SwiftUI

/// 音声認識（STT）と音声合成（TTS）の両方を実装するマネージャ
/// DIコンテナ側で SpeechRecognitionProtocol / SpeechSynthesisProtocol として
/// それぞれ独立に注入できるため、将来的にTTSだけ別実装に差し替えることも可能
@MainActor
class SpeechManager: NSObject, @preconcurrency SpeechRecognitionProtocol, @preconcurrency SpeechSynthesisProtocol, ObservableObject {
    private let speechRecognizer = SFSpeechRecognizer(locale: Locale(identifier: "ja-JP"))
    private var recognitionRequest: SFSpeechAudioBufferRecognitionRequest?
    private var recognitionTask: SFSpeechRecognitionTask?
    private var audioEngine: AVAudioEngine?
    private let synthesizer = AVSpeechSynthesizer()
    
    @Published var isRecording: Bool = false
    
    override init() {
        super.init()
    }
    
    // MARK: - SpeechRecognitionProtocol
    
    func requestPermissions() async -> Bool {
        return await withCheckedContinuation { continuation in
            SFSpeechRecognizer.requestAuthorization { status in
                DispatchQueue.main.async {
                    switch status {
                    case .authorized:
                        // iOS 17+ 推奨 API
                        if #available(iOS 17.0, *) {
                            AVAudioApplication.requestRecordPermission { granted in
                                continuation.resume(returning: granted)
                            }
                        } else {
                            AVAudioSession.sharedInstance().requestRecordPermission { granted in
                                continuation.resume(returning: granted)
                            }
                        }
                    default:
                        continuation.resume(returning: false)
                    }
                }
            }
        }
    }
    
    func startRecording() -> AsyncThrowingStream<String, Error> {
        return AsyncThrowingStream { continuation in
            guard let recognizer = speechRecognizer, recognizer.isAvailable else {
                continuation.finish(throwing: AppError.speechRecognizerUnavailable)
                return
            }
            
            do {
                // 前回のセッションを確実にクリーンアップ
                self.cleanupAudioResources()
                
                // Audio Session 設定（inputNode アクセス前に必ず行う）
                let audioSession = AVAudioSession.sharedInstance()
                try audioSession.setCategory(.playAndRecord, mode: .measurement, options: [.duckOthers, .defaultToSpeaker])
                try audioSession.setActive(true, options: .notifyOthersOnDeactivation)
                
                // Audio Session 設定後に新しい AVAudioEngine を作成
                // （既存のエンジンは古いセッション設定のフォーマットをキャッシュしている可能性があるため）
                let engine = AVAudioEngine()
                self.audioEngine = engine
                
                recognitionRequest = SFSpeechAudioBufferRecognitionRequest()
                guard let recognitionRequest = recognitionRequest else {
                    continuation.finish(throwing: AppError.speechRequestFailed)
                    return
                }
                
                recognitionRequest.shouldReportPartialResults = true
                // オンデバイス認識を優先（プライバシー重視 & 安定性向上）
                if recognizer.supportsOnDeviceRecognition {
                    recognitionRequest.requiresOnDeviceRecognition = true
                }
                
                let inputNode = engine.inputNode
                
                // ストリームが終了済みかどうかのフラグ
                var isFinished = false
                
                recognitionTask = recognizer.recognitionTask(with: recognitionRequest) { result, error in
                    if let result = result {
                        continuation.yield(result.bestTranscription.formattedString)
                        
                        if result.isFinal {
                            guard !isFinished else { return }
                            isFinished = true
                            continuation.finish()
                        }
                    }
                    
                    if let error = error {
                        guard !isFinished else { return }
                        let nsError = error as NSError
                        
                        // シミュレータエラー（code 216）
                        if nsError.domain == "kAFAssistantErrorDomain" && nsError.code == 216 {
                            isFinished = true
                            continuation.finish(throwing: error)
                        }
                        // ユーザーキャンセル（code 1）or 認識完了（code 301）→ 正常終了扱い
                        else if nsError.code == 1 || nsError.code == 301 {
                            isFinished = true
                            continuation.finish()
                        }
                        // その他のエラー
                        else {
                            isFinished = true
                            continuation.finish(throwing: error)
                        }
                    }
                }
                
                // 入力フォーマットの取得（Audio Session設定後なので正しいフォーマットが取れる）
                let recordingFormat = inputNode.outputFormat(forBus: 0)
                
                // チャンネル数のバリデーション
                guard recordingFormat.channelCount > 0 else {
                    continuation.finish(throwing: AppError.speechRecognizerUnavailable)
                    return
                }
                
                inputNode.installTap(onBus: 0, bufferSize: 1024, format: recordingFormat) { (buffer, _) in
                    self.recognitionRequest?.append(buffer)
                }
                
                engine.prepare()
                try engine.start()
                
                self.isRecording = true
                
            } catch {
                continuation.finish(throwing: error)
            }
        }
    }
    
    func stopRecording() {
        // 録音を停止し、最後の認識結果を取得させる
        guard let engine = audioEngine else { return }
        
        engine.stop()
        engine.inputNode.removeTap(onBus: 0)
        recognitionRequest?.endAudio()
        
        // cancel() ではなく finish() を使用
        // cancel() は結果を破棄するが、finish() は最終結果を返してから終了する
        recognitionTask?.finish()
        
        recognitionRequest = nil
        recognitionTask = nil
        audioEngine = nil
        
        isRecording = false
        
        // Audio Session リセット（少し遅延させて認識処理の完了を待つ）
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
            try? AVAudioSession.sharedInstance().setActive(false, options: .notifyOthersOnDeactivation)
        }
    }
    
    /// オーディオリソースのクリーンアップ
    private func cleanupAudioResources() {
        if let engine = audioEngine, engine.isRunning {
            engine.stop()
            engine.inputNode.removeTap(onBus: 0)
        }
        recognitionRequest?.endAudio()
        recognitionTask?.cancel()
        recognitionRequest = nil
        recognitionTask = nil
        audioEngine = nil
    }
    
    // MARK: - SpeechSynthesisProtocol
    
    func speak(_ text: String) {
        // TTS用にAudio Sessionを一時的に再設定
        try? AVAudioSession.sharedInstance().setCategory(.playback, mode: .default)
        try? AVAudioSession.sharedInstance().setActive(true)
        
        let utterance = AVSpeechUtterance(string: text)
        utterance.voice = AVSpeechSynthesisVoice(language: "ja-JP")
        utterance.rate = 0.5
        synthesizer.speak(utterance)
    }
}
