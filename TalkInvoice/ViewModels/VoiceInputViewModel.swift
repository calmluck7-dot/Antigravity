import Foundation
import SwiftUI
import SwiftData

/// メイン画面のViewModel
/// マイクボタン押下 → 音声認識 → AI解析 → PDF生成 の一連フローを制御
@MainActor
class VoiceInputViewModel: ObservableObject {
    
    // MARK: - 状態
    
    enum AppState: Equatable {
        case idle                  // 待機中（マイクボタン表示）
        case listening             // 音声認識中
        case processing            // AI解析中
        case preview(URL)          // PDF生成完了 → プレビュー表示
        case error(String)         // エラー表示
        
        static func == (lhs: AppState, rhs: AppState) -> Bool {
            switch (lhs, rhs) {
            case (.idle, .idle), (.listening, .listening), (.processing, .processing):
                return true
            case (.preview(let a), .preview(let b)):
                return a == b
            case (.error(let a), .error(let b)):
                return a == b
            default:
                return false
            }
        }
    }
    
    @Published var state: AppState = .idle
    @Published var transcribedText: String = ""
    @Published var showPaywall: Bool = false
    @Published var currentUsage: Int = 0
    @Published var remainingQuota: Int? = nil
    
    // MARK: - 依存サービス（Protocol型 → 疎結合）
    
    private var speechRecognition: SpeechRecognitionProtocol
    private var speechSynthesis: SpeechSynthesisProtocol
    private var aiService: AIServiceProtocol
    private var invoiceService: InvoiceServiceProtocol
    private var usageTracker: UsageTrackerProtocol
    private var subscriptionManager: SubscriptionManager
    private var modelContext: ModelContext
    
    // MARK: - Init (DI)
    
    init(
        speechRecognition: SpeechRecognitionProtocol,
        speechSynthesis: SpeechSynthesisProtocol,
        aiService: AIServiceProtocol,
        invoiceService: InvoiceServiceProtocol,
        usageTracker: UsageTrackerProtocol,
        subscriptionManager: SubscriptionManager,
        modelContext: ModelContext
    ) {
        self.speechRecognition = speechRecognition
        self.speechSynthesis = speechSynthesis
        self.aiService = aiService
        self.invoiceService = invoiceService
        self.usageTracker = usageTracker
        self.subscriptionManager = subscriptionManager
        self.modelContext = modelContext
    }
    
    /// 依存サービスの注入（View.onAppear用）
    func configure(
        speechRecognition: SpeechRecognitionProtocol,
        speechSynthesis: SpeechSynthesisProtocol,
        aiService: AIServiceProtocol,
        invoiceService: InvoiceServiceProtocol,
        usageTracker: UsageTrackerProtocol,
        subscriptionManager: SubscriptionManager,
        modelContext: ModelContext
    ) {
        self.speechRecognition = speechRecognition
        self.speechSynthesis = speechSynthesis
        self.aiService = aiService
        self.invoiceService = invoiceService
        self.usageTracker = usageTracker
        self.subscriptionManager = subscriptionManager
        self.modelContext = modelContext
    }
    
    // MARK: - Public Actions
    
    /// アプリ起動時の初期化処理
    func onAppear() async {
        _ = await speechRecognition.requestPermissions()
        await refreshUsageInfo()
    }
    
    /// マイクボタン押下時のアクション
    func micButtonTapped() async {
        switch state {
        case .idle, .error:
            await startVoiceInput()
        case .listening:
            stopVoiceInput()
        default:
            break
        }
    }
    
    /// 使用量情報を更新
    func refreshUsageInfo() async {
        currentUsage = await usageTracker.currentMonthUsage()
        remainingQuota = await usageTracker.remainingQuota(for: subscriptionManager.currentPlan)
    }
    
    /// 状態をリセットして待機画面に戻る
    func resetToIdle() {
        state = .idle
        transcribedText = ""
    }
    
    // MARK: - Private: Core Flow
    
    /// 音声入力を開始する
    private func startVoiceInput() async {
        // 1. 発行枠のチェック
        let canCreate = await usageTracker.canCreateInvoice(for: subscriptionManager.currentPlan)
        guard canCreate else {
            // 枠超過 → ペイウォール表示
            showPaywall = true
            return
        }
        
        // 2. 音声認識開始
        state = .listening
        transcribedText = ""
        
        let stream = speechRecognition.startRecording()
        
        do {
            for try await partialResult in stream {
                transcribedText = partialResult
            }
            // 音声認識完了 → AI解析へ
            await processTranscription()
        } catch {
            #if targetEnvironment(simulator)
            state = .error("⚠️ シミュレータでは音声認識を利用できません。\n実機（iPhone）で動作確認してください。")
            #else
            state = .error("音声認識エラー: \(error.localizedDescription)")
            #endif
        }
    }
    
    /// 音声入力を停止する
    private func stopVoiceInput() {
        speechRecognition.stopRecording()
    }
    
    /// 文字起こし結果をAIで解析し、PDF生成まで行う
    private func processTranscription() async {
        guard !transcribedText.isEmpty else {
            state = .error("音声が認識できませんでした。もう一度お試しください。")
            return
        }
        
        state = .processing
        speechSynthesis.speak("請求書を作成しています。少々お待ちください。")
        
        do {
            // 3. AI解析: テキスト → 構造化データ
            let draft = try await aiService.extractInvoiceData(from: transcribedText)
            
            // 4. SwiftData保存
            let invoice = createInvoice(from: draft)
            modelContext.insert(invoice)
            try modelContext.save()
            
            // 5. PDF生成
            let pdfURL = try await invoiceService.generatePDF(for: invoice)
            
            // 6. 使用量をインクリメント
            await usageTracker.incrementUsage()
            await refreshUsageInfo()
            
            // 7. 完了 → プレビュー表示
            state = .preview(pdfURL)
            speechSynthesis.speak("\(draft.clientName ?? "")宛ての請求書が完成しました。")
            
        } catch {
            state = .error("請求書の作成に失敗しました: \(error.localizedDescription)")
            speechSynthesis.speak("エラーが発生しました。もう一度お試しください。")
        }
    }
    
    /// InvoiceDraft → Invoice (SwiftData) への変換
    private func createInvoice(from draft: InvoiceDraft) -> Invoice {
        let items = draft.items.map { item in
            InvoiceItem(
                name: item.name,
                unitPrice: Double(item.price),
                quantity: item.quantity
            )
        }
        
        return Invoice(
            clientName: draft.clientName ?? "不明",
            issueDate: draft.date ?? Date(),
            items: items
        )
    }
}
