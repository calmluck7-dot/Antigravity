import Foundation

/// アプリ設定の管理
/// APIキーなどの機密情報を安全に取得する
struct Configuration {
    /// Gemini APIキー
    /// .xcconfig ファイルから Info.plist 経由で読み込む
    /// 設定手順:
    ///   1. Secrets.xcconfig を作成し、GEMINI_API_KEY = your_key を記述
    ///   2. Info.plist に $(GEMINI_API_KEY) のエントリを追加
    ///   3. .gitignore に Secrets.xcconfig を追加（漏洩防止）
    static var geminiAPIKey: String {
        guard let key = Bundle.main.infoDictionary?["GEMINI_API_KEY"] as? String,
              !key.isEmpty,
              key != "your_gemini_api_key_here" else {
            print("⚠️ GEMINI_API_KEY が設定されていません。Secrets.xcconfig を確認してください。")
            return ""
        }
        return key
    }
}
