import Foundation

/// AI解析サービスのプロトコル
/// テキストから請求書データを構造化抽出する
protocol AIServiceProtocol: Sendable {
    /// 文字起こしされたテキストを解析し、請求書データを抽出する
    /// - Parameter text: ユーザーの音声から得られた生テキスト
    /// - Returns: 構造化された請求書の下書きデータ
    func extractInvoiceData(from text: String) async throws -> InvoiceDraft
}
