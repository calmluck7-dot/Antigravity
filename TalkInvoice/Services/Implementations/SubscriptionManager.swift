import Foundation
import StoreKit

/// StoreKit 2 を使用したサブスクリプション管理
/// Transaction.updates を監視し、リアルタイムでプラン状態を更新
@MainActor
class SubscriptionManager: ObservableObject, SubscriptionServiceProtocol {
    @Published var currentPlan: SubscriptionPlan = .free
    @Published var isPurchasing: Bool = false
    
    /// StoreKit 2 の Product キャッシュ
    private var products: [Product] = []
    
    /// Transaction更新の監視タスク
    private var updateListenerTask: Task<Void, Error>?
    
    init() {
        // トランザクション更新の監視を開始
        updateListenerTask = listenForTransactions()
        
        // 起動時にステータスを更新
        Task {
            await loadProducts()
            await refreshStatus()
        }
    }
    
    deinit {
        updateListenerTask?.cancel()
    }
    
    // MARK: - SubscriptionServiceProtocol
    
    func purchase(_ plan: SubscriptionPlan) async throws {
        guard plan != .free else { return }
        
        isPurchasing = true
        defer { isPurchasing = false }
        
        guard let product = products.first(where: { $0.id == plan.rawValue }) else {
            throw AppError.networkError(underlying: URLError(.badURL))
        }
        
        let result = try await product.purchase()
        
        switch result {
        case .success(let verification):
            let transaction = try checkVerified(verification)
            await transaction.finish()
            await refreshStatus()
            
        case .userCancelled:
            break // ユーザーがキャンセル
            
        case .pending:
            break // 承認待ち（ファミリー共有など）
            
        @unknown default:
            break
        }
    }
    
    func restorePurchases() async throws {
        try await AppStore.sync()
        await refreshStatus()
    }
    
    func refreshStatus() async {
        var highestPlan: SubscriptionPlan = .free
        
        // 現在アクティブなサブスクリプションをチェック
        for await result in Transaction.currentEntitlements {
            guard let transaction = try? checkVerified(result) else { continue }
            
            if transaction.productID == SubscriptionPlan.pro.rawValue {
                highestPlan = .pro
                break // Pro が最上位なのでこれ以上チェック不要
            } else if transaction.productID == SubscriptionPlan.basic.rawValue {
                highestPlan = .basic
            }
        }
        
        currentPlan = highestPlan
    }
    
    // MARK: - Private Helpers
    
    /// App Store Connect から Product を取得
    private func loadProducts() async {
        let productIDs = [
            SubscriptionPlan.basic.rawValue,
            SubscriptionPlan.pro.rawValue
        ]
        
        do {
            products = try await Product.products(for: Set(productIDs))
        } catch {
            print("[SubscriptionManager] Product読み込みエラー: \(error)")
        }
    }
    
    /// トランザクションのリアルタイム監視
    private func listenForTransactions() -> Task<Void, Error> {
        return Task.detached { [weak self] in
            for await result in Transaction.updates {
                guard let self = self else { return }
                if let _ = try? self.checkVerified(result) {
                    await self.refreshStatus()
                }
            }
        }
    }
    
    /// JWS検証
    nonisolated private func checkVerified<T>(_ result: VerificationResult<T>) throws -> T {
        switch result {
        case .unverified:
            throw AppError.networkError(underlying: URLError(.secureConnectionFailed))
        case .verified(let value):
            return value
        }
    }
}
