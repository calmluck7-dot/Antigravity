import Foundation

/// アプリ全体で統一的に利用するエラー型
enum AppError: LocalizedError {
    // 音声関連
    case speechRecognizerUnavailable
    case speechRequestFailed
    case microphonePermissionDenied
    
    // AI関連
    case networkError(underlying: Error)
    case aiParsingFailed
    
    // PDF・保存関連
    case pdfGenerationFailed
    case storageFailed
    
    var errorDescription: String? {
        switch self {
        case .speechRecognizerUnavailable:
            return "音声認識が利用できません"
        case .speechRequestFailed:
            return "音声認識リクエストの作成に失敗しました"
        case .microphonePermissionDenied:
            return "マイクの使用が許可されていません"
        case .networkError(let underlying):
            return "ネットワークエラー: \(underlying.localizedDescription)"
        case .aiParsingFailed:
            return "AIからの応答を解析できませんでした"
        case .pdfGenerationFailed:
            return "PDF生成に失敗しました"
        case .storageFailed:
            return "ファイルの保存に失敗しました"
        }
    }
}
