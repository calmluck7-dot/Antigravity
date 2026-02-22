import Foundation

/// サブスクリプションの購入・復元・状態監視を管理するプロトコル
/// StoreKit 2 をラップし、ViewModelから疎結合で利用可能にする
@MainActor
protocol SubscriptionServiceProtocol: ObservableObject {
    /// 現在のアクティブなプラン（リアルタイム監視）
    var currentPlan: SubscriptionPlan { get }
    
    /// 購入処理中かどうか
    var isPurchasing: Bool { get }
    
    /// サブスクリプションを購入する
    /// - Parameter plan: 購入するプラン（.basic or .pro）
    func purchase(_ plan: SubscriptionPlan) async throws
    
    /// 購入履歴を復元する
    func restorePurchases() async throws
    
    /// 現在のサブスクリプション状態を更新する（アプリ起動時に呼ぶ）
    func refreshStatus() async
}
