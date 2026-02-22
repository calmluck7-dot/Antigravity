import Foundation

// MARK: - テスト・Preview用モック実装

/// 音声認識モック
final class MockSpeechRecognition: SpeechRecognitionProtocol, @unchecked Sendable {
    var isRecording: Bool = false
    
    func requestPermissions() async -> Bool { return true }
    
    func startRecording() -> AsyncThrowingStream<String, Error> {
        return AsyncThrowingStream { continuation in
            continuation.yield("株式会社テスト宛にウェブサイト制作費10万円を請求")
            continuation.finish()
        }
    }
    
    func stopRecording() { isRecording = false }
}

/// 音声合成モック
final class MockSpeechSynthesis: SpeechSynthesisProtocol, @unchecked Sendable {
    func speak(_ text: String) {
        print("[Mock TTS] \(text)")
    }
}

/// AI解析モック
final class MockAIService: AIServiceProtocol, @unchecked Sendable {
    func extractInvoiceData(from text: String) async throws -> InvoiceDraft {
        return InvoiceDraft(
            clientName: "株式会社テスト",
            items: [InvoiceDraftItem(name: "ウェブサイト制作", price: 100000, quantity: 1)],
            date: Date()
        )
    }
}

/// PDF生成モック
final class MockInvoiceService: InvoiceServiceProtocol, @unchecked Sendable {
    func generatePDF(for invoice: Invoice) async throws -> URL {
        return FileManager.default.temporaryDirectory.appendingPathComponent("mock.pdf")
    }
    func savePDF(to url: URL, filename: String) throws -> URL { return url }
}

/// UsageTracker モック
final class MockUsageTracker: UsageTrackerProtocol, @unchecked Sendable {
    var mockUsage: Int = 3 // Freeプランの上限到達状態
    
    func currentMonthUsage() async -> Int { return mockUsage }
    func incrementUsage() async { mockUsage += 1 }
    func remainingQuota(for plan: SubscriptionPlan) async -> Int? {
        guard let limit = plan.monthlyLimit else { return nil }
        return max(0, limit - mockUsage)
    }
    func canCreateInvoice(for plan: SubscriptionPlan) async -> Bool {
        guard let limit = plan.monthlyLimit else { return true }
        return mockUsage < limit
    }
}

/// SubscriptionManager モック
class MockSubscriptionManager: ObservableObject, SubscriptionServiceProtocol {
    @Published var currentPlan: SubscriptionPlan = .free
    @Published var isPurchasing: Bool = false
    
    func purchase(_ plan: SubscriptionPlan) async throws {
        isPurchasing = true
        try await Task.sleep(nanoseconds: 1_000_000_000) // 1秒のシミュレーション
        currentPlan = plan
        isPurchasing = false
    }
    
    func restorePurchases() async throws {
        currentPlan = .free
    }
    
    func refreshStatus() async {
        // モックでは何もしない
    }
}
