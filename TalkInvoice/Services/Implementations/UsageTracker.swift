import Foundation
import SwiftData

/// 月間の請求書発行枚数をトラッキングする実装
/// SwiftData を使用し、月を跨いだら自動的に新しいレコードを作成
@MainActor
final class UsageTracker: UsageTrackerProtocol {
    private let modelContainer: ModelContainer
    
    init(modelContainer: ModelContainer) {
        self.modelContainer = modelContainer
    }
    
    @MainActor
    func currentMonthUsage() async -> Int {
        let context = modelContainer.mainContext
        let currentMonth = MonthlyUsage.currentYearMonth
        
        let descriptor = FetchDescriptor<MonthlyUsage>(
            predicate: #Predicate { $0.yearMonth == currentMonth }
        )
        
        guard let usage = try? context.fetch(descriptor).first else {
            return 0
        }
        return usage.invoiceCount
    }
    
    @MainActor
    func incrementUsage() async {
        let context = modelContainer.mainContext
        let currentMonth = MonthlyUsage.currentYearMonth
        
        let descriptor = FetchDescriptor<MonthlyUsage>(
            predicate: #Predicate { $0.yearMonth == currentMonth }
        )
        
        if let usage = try? context.fetch(descriptor).first {
            // 既存レコードをインクリメント
            usage.invoiceCount += 1
            usage.lastUpdated = Date()
        } else {
            // 新しい月: 新規レコード作成（カウント=1）
            let newUsage = MonthlyUsage(yearMonth: currentMonth, invoiceCount: 1)
            context.insert(newUsage)
        }
        
        try? context.save()
    }
    
    func remainingQuota(for plan: SubscriptionPlan) async -> Int? {
        guard let limit = plan.monthlyLimit else {
            return nil // 無制限
        }
        let used = await currentMonthUsage()
        return max(0, limit - used)
    }
    
    func canCreateInvoice(for plan: SubscriptionPlan) async -> Bool {
        guard let limit = plan.monthlyLimit else {
            return true // Pro: 無制限
        }
        let used = await currentMonthUsage()
        return used < limit
    }
}
