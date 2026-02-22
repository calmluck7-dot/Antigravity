import Foundation

/// 月間使用量のトラッキングを管理するプロトコル
/// SwiftData を使用してローカルにカウントを保持する
protocol UsageTrackerProtocol: Sendable {
    /// 今月の発行枚数を取得する
    func currentMonthUsage() async -> Int
    
    /// 発行枚数を1つインクリメントする
    func incrementUsage() async
    
    /// 現在のプランの残り発行可能枚数を取得する（nil = 無制限）
    func remainingQuota(for plan: SubscriptionPlan) async -> Int?
    
    /// 現在のプランで発行可能かチェックする
    func canCreateInvoice(for plan: SubscriptionPlan) async -> Bool
}
