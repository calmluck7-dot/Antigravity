import Foundation
import SwiftData

/// アプリ全体の依存性注入コンテナ
/// テスト時やPreview時にMock実装を注入可能にする
@MainActor
final class DependencyContainer: ObservableObject {
    let speechRecognition: SpeechRecognitionProtocol
    let speechSynthesis: SpeechSynthesisProtocol
    let aiService: AIServiceProtocol
    let invoiceService: InvoiceServiceProtocol
    let usageTracker: UsageTrackerProtocol
    let subscriptionManager: SubscriptionManager
    
    init(
        speechRecognition: SpeechRecognitionProtocol? = nil,
        speechSynthesis: SpeechSynthesisProtocol? = nil,
        aiService: AIServiceProtocol? = nil,
        invoiceService: InvoiceServiceProtocol? = nil,
        usageTracker: UsageTrackerProtocol? = nil,
        subscriptionManager: SubscriptionManager? = nil,
        modelContainer: ModelContainer? = nil
    ) {
        let speechManager = SpeechManager()
        self.speechRecognition = speechRecognition ?? speechManager
        self.speechSynthesis = speechSynthesis ?? speechManager
        self.aiService = aiService ?? GeminiAIService()
        self.invoiceService = invoiceService ?? PDFInvoiceGenerator()
        self.subscriptionManager = subscriptionManager ?? SubscriptionManager()
        
        // UsageTracker は ModelContainer が必要
        if let tracker = usageTracker {
            self.usageTracker = tracker
        } else if let container = modelContainer {
            self.usageTracker = UsageTracker(modelContainer: container)
        } else {
            // フォールバック: 新しいコンテナを作成
            let schema = Schema([Invoice.self, InvoiceItem.self, MonthlyUsage.self])
            let config = ModelConfiguration(schema: schema)
            let container = try! ModelContainer(for: schema, configurations: [config])
            self.usageTracker = UsageTracker(modelContainer: container)
        }
    }
}
