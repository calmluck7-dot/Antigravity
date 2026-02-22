import SwiftData
import Foundation

/// 月間の請求書発行回数をトラッキングするモデル（SwiftData永続化）
@Model
final class MonthlyUsage {
    /// 年月を "yyyy-MM" 形式で保持（例: "2026-02"）
    var yearMonth: String
    
    /// 今月の発行枚数
    var invoiceCount: Int
    
    /// 最終更新日時
    var lastUpdated: Date
    
    init(yearMonth: String, invoiceCount: Int = 0) {
        self.yearMonth = yearMonth
        self.invoiceCount = invoiceCount
        self.lastUpdated = Date()
    }
    
    /// 現在の年月文字列を取得するユーティリティ
    static var currentYearMonth: String {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM"
        return formatter.string(from: Date())
    }
}
