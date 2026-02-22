import Foundation

/// Google Gemini 1.5 Flash REST API を使用した構造化データ抽出サービス
/// 音声テキストから「取引先・品目・金額」を JSON で構造化抽出する
/// 外部SDKに依存せず、URLSession で直接 Gemini API を呼び出す
final class GeminiAIService: AIServiceProtocol {
    private let apiKey: String
    private let urlSession: URLSession
    private let model: String
    
    init(
        apiKey: String = Configuration.geminiAPIKey,
        model: String = "gemini-2.0-flash",
        urlSession: URLSession = .shared
    ) {
        self.apiKey = apiKey
        self.model = model
        self.urlSession = urlSession
    }
    
    func extractInvoiceData(from text: String) async throws -> InvoiceDraft {
        // APIキーが空の場合はエラー
        guard !apiKey.isEmpty else {
            throw AppError.aiParsingFailed
        }
        
        let endpoint = "https://generativelanguage.googleapis.com/v1beta/models/\(model):generateContent?key=\(apiKey)"
        
        guard let url = URL(string: endpoint) else {
            throw AppError.networkError(underlying: URLError(.badURL))
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let prompt = """
        あなたは日本語の音声テキストから請求書データを構造化抽出するアシスタントです。
        以下のテキストから情報を抽出し、JSON形式で返してください。

        ## 抽出ルール
        - clientName: 取引先名（会社名・個人名）。見つからなければ null
        - date: 日付を "yyyy-MM-dd" 形式で。見つからなければ null
        - items: 品目の配列。各品目は name(品名), price(単価/整数), quantity(数量/整数) を持つ

        ## 出力JSON形式（これだけを返すこと）
        {
          "clientName": "株式会社〇〇",
          "date": "2026-01-15",
          "items": [
            { "name": "運賃", "price": 15000, "quantity": 1 }
          ]
        }

        ## 入力テキスト
        \(text)
        """
        
        // Gemini API リクエストボディ
        let body: [String: Any] = [
            "contents": [
                [
                    "parts": [
                        ["text": prompt]
                    ]
                ]
            ],
            "generationConfig": [
                "temperature": 0.0,
                "responseMimeType": "application/json"
            ]
        ]
        
        request.httpBody = try JSONSerialization.data(withJSONObject: body)
        
        let (data, response) = try await urlSession.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 else {
            throw AppError.networkError(underlying: URLError(.badServerResponse))
        }
        
        // Gemini API レスポンスをパース
        let apiResponse = try JSONDecoder().decode(GeminiResponse.self, from: data)
        
        guard let responseText = apiResponse.candidates?.first?.content?.parts?.first?.text,
              let jsonData = responseText.data(using: .utf8) else {
            throw AppError.aiParsingFailed
        }
        
        do {
            let draft = try JSONDecoder().decode(InvoiceDraft.self, from: jsonData)
            return draft
        } catch {
            print("[GeminiAIService] JSONデコードエラー: \(error)")
            throw AppError.aiParsingFailed
        }
    }
}

// MARK: - Gemini API レスポンス構造体
private struct GeminiResponse: Decodable {
    let candidates: [Candidate]?
    
    struct Candidate: Decodable {
        let content: Content?
    }
    
    struct Content: Decodable {
        let parts: [Part]?
    }
    
    struct Part: Decodable {
        let text: String?
    }
}
