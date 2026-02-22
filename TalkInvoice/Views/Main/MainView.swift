import SwiftUI
import SwiftData

/// メイン画面：音声入力インターフェース
/// 大きなマイクボタンを中心に、状態に応じてUIが変化する
struct MainView: View {
    @EnvironmentObject private var container: DependencyContainer
    @EnvironmentObject private var subscriptionManager: SubscriptionManager
    @Environment(\.modelContext) private var modelContext
    
    @StateObject private var viewModel: VoiceInputViewModel = {
        // 仮のVM（onAppearでDIコンテナから再設定）
        // Note: SwiftUIの制約上、environmentObjectをStateObject初期化に使えないため
        // この方式を採用。実際の注入はonAppearで行う。
        return VoiceInputViewModel.placeholder()
    }()
    
    @State private var showHistory = false
    
    // MARK: - カラーパレット
    private let bgColor = Color(red: 0.04, green: 0.04, blue: 0.04)
    private let cardBg = Color(red: 0.10, green: 0.10, blue: 0.12)
    private let accentGold = Color(red: 1.0, green: 0.78, blue: 0.28)
    private let accentBlue = Color(red: 0.35, green: 0.55, blue: 1.0)
    private let subtleGray = Color(red: 0.45, green: 0.45, blue: 0.50)
    private let textPrimary = Color(red: 0.95, green: 0.95, blue: 0.97)
    private let textSecondary = Color(red: 0.70, green: 0.70, blue: 0.75)
    
    var body: some View {
        ZStack {
            bgColor.ignoresSafeArea()
            
            VStack(spacing: 0) {
                // ナビゲーションバー
                navigationBar
                
                Spacer()
                
                // メインコンテンツ（状態に応じて変化）
                mainContent
                
                Spacer()
                
                // フッター（使用量表示）
                usageFooter
            }
        }
        .onAppear {
            // DIコンテナからViewModelに依存を注入
            viewModel.configure(
                speechRecognition: container.speechRecognition,
                speechSynthesis: container.speechSynthesis,
                aiService: container.aiService,
                invoiceService: container.invoiceService,
                usageTracker: container.usageTracker,
                subscriptionManager: subscriptionManager,
                modelContext: modelContext
            )
            // 初期化処理を実行
            Task { await viewModel.onAppear() }
        }
        .sheet(isPresented: $viewModel.showPaywall) {
            PaywallView(currentUsage: viewModel.currentUsage)
                .environmentObject(subscriptionManager)
        }
        .sheet(isPresented: $showHistory) {
            InvoiceHistoryView()
        }
        .preferredColorScheme(.dark)
    }
    
    // MARK: - Navigation Bar
    
    private var navigationBar: some View {
        HStack {
            // アプリタイトル
            VStack(alignment: .leading, spacing: 2) {
                Text("TalkInvoice")
                    .font(.system(size: 24, weight: .bold))
                    .foregroundStyle(textPrimary)
                
                Text(planBadgeText)
                    .font(.system(size: 11, weight: .semibold))
                    .foregroundStyle(planBadgeColor)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 2)
                    .background(planBadgeColor.opacity(0.15))
                    .clipShape(Capsule())
            }
            
            Spacer()
            
            // 履歴ボタン
            Button {
                showHistory = true
            } label: {
                ZStack {
                    Circle()
                        .fill(cardBg)
                        .frame(width: 44, height: 44)
                    
                    Image(systemName: "doc.text.magnifyingglass")
                        .font(.system(size: 18))
                        .foregroundStyle(textSecondary)
                }
            }
        }
        .padding(.horizontal, 24)
        .padding(.top, 8)
    }
    
    // MARK: - Main Content (状態遷移)
    
    @ViewBuilder
    private var mainContent: some View {
        switch viewModel.state {
        case .idle:
            idleView
        case .listening:
            listeningView
        case .processing:
            processingView
        case .preview(let url):
            InvoicePreviewView(pdfURL: url) {
                viewModel.resetToIdle()
            }
        case .error(let message):
            errorView(message: message)
        }
    }
    
    // MARK: - Idle State
    
    private var idleView: some View {
        VStack(spacing: 32) {
            // 案内テキスト
            VStack(spacing: 8) {
                Text("マイクボタンを押して")
                    .font(.system(size: 18, weight: .medium))
                    .foregroundStyle(textSecondary)
                
                Text("請求内容を話してください")
                    .font(.system(size: 22, weight: .bold))
                    .foregroundStyle(textPrimary)
            }
            
            // 例文
            VStack(spacing: 6) {
                exampleText("「株式会社○○にウェブ制作費10万円」")
                exampleText("「田中建設に現場作業費、3日分で15万円」")
            }
            
            // マイクボタン
            micButton
        }
    }
    
    // MARK: - Listening State
    
    private var listeningView: some View {
        VStack(spacing: 28) {
            // 波形アニメーション
            VoiceWaveformView(isAnimating: true)
                .frame(height: 60)
            
            Text("聞いています...")
                .font(.system(size: 16, weight: .medium))
                .foregroundStyle(accentGold)
            
            // 文字起こしテキスト
            if !viewModel.transcribedText.isEmpty {
                Text(viewModel.transcribedText)
                    .font(.system(size: 18))
                    .foregroundStyle(textPrimary)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 32)
                    .transition(.opacity)
            }
            
            // 停止ボタン
            micButton
            
            Text("もう一度タップで送信")
                .font(.system(size: 13))
                .foregroundStyle(subtleGray)
        }
    }
    
    // MARK: - Processing State
    
    private var processingView: some View {
        VStack(spacing: 24) {
            // ローディングアニメーション
            ZStack {
                Circle()
                    .stroke(subtleGray.opacity(0.3), lineWidth: 4)
                    .frame(width: 80, height: 80)
                
                ProgressView()
                    .scaleEffect(1.5)
                    .tint(accentGold)
            }
            
            Text("請求書を作成中...")
                .font(.system(size: 18, weight: .semibold))
                .foregroundStyle(textPrimary)
            
            // 認識されたテキスト
            Text(viewModel.transcribedText)
                .font(.system(size: 14))
                .foregroundStyle(textSecondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 32)
                .lineLimit(3)
        }
    }
    
    // MARK: - Error State
    
    private func errorView(message: String) -> some View {
        VStack(spacing: 24) {
            ZStack {
                Circle()
                    .fill(Color.red.opacity(0.15))
                    .frame(width: 72, height: 72)
                
                Image(systemName: "exclamationmark.triangle.fill")
                    .font(.system(size: 32))
                    .foregroundStyle(.red)
            }
            
            Text(message)
                .font(.system(size: 15))
                .foregroundStyle(textSecondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 32)
            
            Button {
                viewModel.resetToIdle()
            } label: {
                Text("もう一度試す")
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundStyle(.black)
                    .frame(width: 200, height: 48)
                    .background(accentGold)
                    .clipShape(RoundedRectangle(cornerRadius: 12))
            }
        }
    }
    
    // MARK: - Shared Components
    
    /// マイクボタン
    private var micButton: some View {
        Button {
            Task { await viewModel.micButtonTapped() }
        } label: {
            ZStack {
                // 外側のリング
                Circle()
                    .stroke(
                        viewModel.state == .listening ? accentGold : subtleGray.opacity(0.3),
                        lineWidth: viewModel.state == .listening ? 3 : 2
                    )
                    .frame(width: 100, height: 100)
                
                // 背景
                Circle()
                    .fill(
                        viewModel.state == .listening
                        ? AnyShapeStyle(accentGold)
                        : AnyShapeStyle(LinearGradient(
                            colors: [accentGold, Color(red: 1.0, green: 0.65, blue: 0.0)],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        ))
                    )
                    .frame(width: 80, height: 80)
                    .shadow(color: accentGold.opacity(0.4), radius: 16, y: 4)
                
                // アイコン
                Image(systemName: viewModel.state == .listening ? "stop.fill" : "mic.fill")
                    .font(.system(size: 32, weight: .medium))
                    .foregroundStyle(.black)
            }
        }
        .scaleEffect(viewModel.state == .listening ? 1.1 : 1.0)
        .animation(.easeInOut(duration: 0.3), value: viewModel.state == .listening)
    }
    
    /// 例文テキスト
    private func exampleText(_ text: String) -> some View {
        Text(text)
            .font(.system(size: 13))
            .foregroundStyle(subtleGray)
            .italic()
    }
    
    // MARK: - Usage Footer
    
    private var usageFooter: some View {
        HStack {
            Image(systemName: "doc.text")
                .font(.system(size: 14))
                .foregroundStyle(subtleGray)
            
            if let remaining = viewModel.remainingQuota {
                Text("今月の残り: \(remaining)枚")
                    .font(.system(size: 13))
                    .foregroundStyle(textSecondary)
            } else {
                Text("発行枚数: 無制限")
                    .font(.system(size: 13))
                    .foregroundStyle(accentGold)
            }
            
            Spacer()
            
            Text("\(subscriptionManager.currentPlan.displayName)プラン")
                .font(.system(size: 12, weight: .semibold))
                .foregroundStyle(planBadgeColor)
                .padding(.horizontal, 10)
                .padding(.vertical, 4)
                .background(planBadgeColor.opacity(0.12))
                .clipShape(Capsule())
        }
        .padding(.horizontal, 24)
        .padding(.vertical, 16)
        .background(cardBg)
    }
    
    // MARK: - Helper
    
    private var planBadgeText: String {
        subscriptionManager.currentPlan.displayName
    }
    
    private var planBadgeColor: Color {
        switch subscriptionManager.currentPlan {
        case .free: return subtleGray
        case .basic: return accentGold
        case .pro: return accentBlue
        }
    }
}

// MARK: - VoiceInputViewModel Placeholder

extension VoiceInputViewModel {
    /// SwiftUIのStateObject制約回避用のプレースホルダー
    /// 実際のService注入はMainView.onAppearで行われる
    static func placeholder() -> VoiceInputViewModel {
        let mock = MockSpeechRecognition()
        return VoiceInputViewModel(
            speechRecognition: mock,
            speechSynthesis: MockSpeechSynthesis(),
            aiService: MockAIService(),
            invoiceService: MockInvoiceService(),
            usageTracker: MockUsageTracker(),
            subscriptionManager: SubscriptionManager(),
            modelContext: {
                let schema = Schema([Invoice.self, InvoiceItem.self, MonthlyUsage.self])
                let config = ModelConfiguration(schema: schema, isStoredInMemoryOnly: true)
                let container = try! ModelContainer(for: schema, configurations: [config])
                return ModelContext(container)
            }()
        )
    }
}
