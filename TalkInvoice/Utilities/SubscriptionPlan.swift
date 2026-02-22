import Foundation

/// サブスクリプションプランの定義
/// App Store Connect で設定する Product ID と対応
enum SubscriptionPlan: String, CaseIterable, Identifiable {
    case free = "free"
    case basic = "com.talkinvoice.basic.monthly"
    case pro = "com.talkinvoice.pro.monthly"
    
    var id: String { rawValue }
    
    /// プラン表示名
    var displayName: String {
        switch self {
        case .free: return "Free"
        case .basic: return "Basic"
        case .pro: return "Pro"
        }
    }
    
    /// 月額料金（表示用）
    var priceLabel: String {
        switch self {
        case .free: return "¥0"
        case .basic: return "¥500/月"
        case .pro: return "¥1,000/月"
        }
    }
    
    /// 月間発行枚数の上限（nil = 無制限）
    var monthlyLimit: Int? {
        switch self {
        case .free: return 3
        case .basic: return 30
        case .pro: return nil // 無制限
        }
    }
    
    /// プランの主な特徴（PaywallView表示用）
    var features: [String] {
        switch self {
        case .free:
            return ["月3枚まで無料", "基本PDF生成"]
        case .basic:
            return ["月30枚まで発行可能", "音声AIによる自動入力", "PDF即時生成・共有"]
        case .pro:
            return ["発行枚数 無制限", "音声AIによる自動入力", "PDF即時生成・共有", "優先サポート"]
        }
    }
}
