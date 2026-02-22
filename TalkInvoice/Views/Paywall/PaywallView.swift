import SwiftUI

/// 課金誘導画面（ペイウォール）
/// Freeプランの上限到達時にsheetで表示される
/// 完全ダークモード仕様：夜間の車内でも目に優しいデザイン
struct PaywallView: View {
    @EnvironmentObject private var subscriptionManager: SubscriptionManager
    @Environment(\.dismiss) private var dismiss
    
    @State private var selectedPlan: SubscriptionPlan = .basic
    @State private var showError: Bool = false
    @State private var errorMessage: String = ""
    
    /// 今月の使用枚数（表示用）
    let currentUsage: Int
    
    // MARK: - カラーパレット
    private let bgColor = Color(red: 0.04, green: 0.04, blue: 0.04)       // #0A0A0A
    private let cardBg = Color(red: 0.10, green: 0.10, blue: 0.12)         // #1A1A1E
    private let accentGold = Color(red: 1.0, green: 0.78, blue: 0.28)      // #FFC847
    private let accentBlue = Color(red: 0.35, green: 0.55, blue: 1.0)      // #598CFF
    private let subtleGray = Color(red: 0.45, green: 0.45, blue: 0.50)     // #737380
    private let textPrimary = Color(red: 0.95, green: 0.95, blue: 0.97)    // #F2F2F8
    private let textSecondary = Color(red: 0.70, green: 0.70, blue: 0.75)  // #B3B3BF
    
    var body: some View {
        ZStack {
            bgColor.ignoresSafeArea()
            
            ScrollView {
                VStack(spacing: 28) {
                    // ドラッグインジケーター
                    dragIndicator
                    
                    // ヘッダー：使い切り通知
                    headerSection
                    
                    // キャッチコピー
                    catchCopySection
                    
                    // プラン選択カード
                    planCardsSection
                    
                    // 購入ボタン
                    purchaseButton
                    
                    // 購入復元リンク
                    restoreLink
                    
                    // フッター：安心マイクロコピー
                    trustFooter
                }
                .padding(.horizontal, 24)
                .padding(.bottom, 40)
            }
        }
        .alert("エラー", isPresented: $showError) {
            Button("OK") {}
        } message: {
            Text(errorMessage)
        }
    }
    
    // MARK: - UI Components
    
    /// ドラッグインジケーター
    private var dragIndicator: some View {
        RoundedRectangle(cornerRadius: 2.5)
            .fill(subtleGray)
            .frame(width: 40, height: 5)
            .padding(.top, 12)
    }
    
    /// ヘッダー：枠使い切り通知
    private var headerSection: some View {
        VStack(spacing: 12) {
            // アイコン
            ZStack {
                Circle()
                    .fill(accentGold.opacity(0.15))
                    .frame(width: 72, height: 72)
                
                Image(systemName: "doc.text.fill")
                    .font(.system(size: 32))
                    .foregroundStyle(accentGold)
            }
            
            Text("今月の無料枠（3枚）を\n使い切りました")
                .font(.system(size: 22, weight: .bold))
                .foregroundStyle(textPrimary)
                .multilineTextAlignment(.center)
                .lineSpacing(4)
            
            // 使用量バー
            usageBar
        }
    }
    
    /// 使用量プログレスバー
    private var usageBar: some View {
        VStack(spacing: 6) {
            HStack {
                Text("今月の発行枚数")
                    .font(.system(size: 13))
                    .foregroundStyle(textSecondary)
                Spacer()
                Text("\(currentUsage) / 3枚")
                    .font(.system(size: 13, weight: .semibold))
                    .foregroundStyle(accentGold)
            }
            
            GeometryReader { geometry in
                ZStack(alignment: .leading) {
                    RoundedRectangle(cornerRadius: 4)
                        .fill(subtleGray.opacity(0.3))
                        .frame(height: 8)
                    
                    RoundedRectangle(cornerRadius: 4)
                        .fill(
                            LinearGradient(
                                colors: [accentGold, Color.orange],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                        .frame(width: geometry.size.width, height: 8) // 100%到達
                }
            }
            .frame(height: 8)
        }
        .padding(.horizontal, 8)
        .padding(.top, 4)
    }
    
    /// キャッチコピー
    private var catchCopySection: some View {
        VStack(spacing: 8) {
            Text("ワンコインで、毎月の\n面倒な事務作業から解放。")
                .font(.system(size: 18, weight: .semibold))
                .foregroundStyle(textPrimary)
                .multilineTextAlignment(.center)
                .lineSpacing(3)
            
            Text("声で話すだけ。請求書が自動で完成します。")
                .font(.system(size: 14))
                .foregroundStyle(textSecondary)
                .multilineTextAlignment(.center)
        }
    }
    
    /// プラン選択カード
    private var planCardsSection: some View {
        VStack(spacing: 14) {
            // Basicプラン（一番人気）
            planCard(
                plan: .basic,
                isPopular: true,
                price: "¥500",
                period: "/月",
                subtitle: "月30枚まで"
            )
            
            // Proプラン
            planCard(
                plan: .pro,
                isPopular: false,
                price: "¥1,000",
                period: "/月",
                subtitle: "枚数 無制限"
            )
        }
    }
    
    /// プランカードコンポーネント
    private func planCard(plan: SubscriptionPlan, isPopular: Bool, price: String, period: String, subtitle: String) -> some View {
        let isSelected = selectedPlan == plan
        
        return Button {
            withAnimation(.easeInOut(duration: 0.2)) {
                selectedPlan = plan
            }
        } label: {
            VStack(spacing: 0) {
                // 人気バッジ（Basicのみ）
                if isPopular {
                    HStack {
                        Spacer()
                        Text("一番人気")
                            .font(.system(size: 11, weight: .bold))
                            .foregroundStyle(.black)
                            .padding(.horizontal, 12)
                            .padding(.vertical, 4)
                            .background(accentGold)
                            .clipShape(Capsule())
                        Spacer()
                    }
                    .padding(.top, -12)
                    .zIndex(1)
                }
                
                HStack(spacing: 16) {
                    // 選択インジケーター
                    ZStack {
                        Circle()
                            .stroke(isSelected ? accentGold : subtleGray, lineWidth: 2)
                            .frame(width: 24, height: 24)
                        
                        if isSelected {
                            Circle()
                                .fill(accentGold)
                                .frame(width: 14, height: 14)
                        }
                    }
                    
                    // プラン情報
                    VStack(alignment: .leading, spacing: 4) {
                        HStack(alignment: .firstTextBaseline, spacing: 2) {
                            Text(plan.displayName)
                                .font(.system(size: 18, weight: .bold))
                                .foregroundStyle(textPrimary)
                            
                            Text("プラン")
                                .font(.system(size: 14))
                                .foregroundStyle(textSecondary)
                        }
                        
                        Text(subtitle)
                            .font(.system(size: 13))
                            .foregroundStyle(textSecondary)
                        
                        // 機能リスト
                        ForEach(plan.features, id: \.self) { feature in
                            HStack(spacing: 6) {
                                Image(systemName: "checkmark")
                                    .font(.system(size: 10, weight: .bold))
                                    .foregroundStyle(accentGold)
                                
                                Text(feature)
                                    .font(.system(size: 12))
                                    .foregroundStyle(textSecondary)
                            }
                        }
                    }
                    
                    Spacer()
                    
                    // 価格
                    VStack(alignment: .trailing, spacing: 0) {
                        Text(price)
                            .font(.system(size: 24, weight: .bold))
                            .foregroundStyle(isPopular ? accentGold : textPrimary)
                        
                        Text(period)
                            .font(.system(size: 12))
                            .foregroundStyle(textSecondary)
                    }
                }
                .padding(20)
            }
            .background(
                RoundedRectangle(cornerRadius: 16)
                    .fill(cardBg)
                    .overlay(
                        RoundedRectangle(cornerRadius: 16)
                            .stroke(
                                isSelected ? (isPopular ? accentGold : accentBlue) : subtleGray.opacity(0.3),
                                lineWidth: isSelected ? 2 : 1
                            )
                    )
            )
        }
        .buttonStyle(.plain)
    }
    
    /// 購入ボタン
    private var purchaseButton: some View {
        Button {
            Task {
                do {
                    try await subscriptionManager.purchase(selectedPlan)
                    dismiss()
                } catch {
                    errorMessage = error.localizedDescription
                    showError = true
                }
            }
        } label: {
            HStack(spacing: 8) {
                if subscriptionManager.isPurchasing {
                    ProgressView()
                        .tint(.black)
                } else {
                    Text("\(selectedPlan.displayName)プランを始める")
                        .font(.system(size: 17, weight: .bold))
                }
            }
            .foregroundStyle(.black)
            .frame(maxWidth: .infinity)
            .frame(height: 56)
            .background(
                LinearGradient(
                    colors: [accentGold, Color(red: 1.0, green: 0.65, blue: 0.0)],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
            )
            .clipShape(RoundedRectangle(cornerRadius: 14))
            .shadow(color: accentGold.opacity(0.3), radius: 12, y: 4)
        }
        .disabled(subscriptionManager.isPurchasing)
    }
    
    /// 購入復元リンク
    private var restoreLink: some View {
        Button {
            Task {
                try? await subscriptionManager.restorePurchases()
            }
        } label: {
            Text("以前の購入を復元する")
                .font(.system(size: 13))
                .foregroundStyle(accentBlue)
                .underline()
        }
    }
    
    /// フッター：安心マイクロコピー
    private var trustFooter: some View {
        VStack(spacing: 10) {
            Divider()
                .background(subtleGray.opacity(0.3))
            
            HStack(spacing: 20) {
                trustBadge(icon: "xmark.circle", text: "いつでも\nキャンセル可能")
                
                trustBadge(icon: "lock.shield", text: "入力データはAIの\n学習に一切不使用")
                
                trustBadge(icon: "creditcard.trianglebadge.exclamationmark", text: "Apple経由の\n安全な決済")
            }
            
            Text("サブスクリプションはApple IDに課金されます。\n期間終了の24時間前までにキャンセルしない限り自動更新されます。")
                .font(.system(size: 10))
                .foregroundStyle(subtleGray)
                .multilineTextAlignment(.center)
                .lineSpacing(2)
                .padding(.top, 4)
        }
    }
    
    /// 安心バッジコンポーネント
    private func trustBadge(icon: String, text: String) -> some View {
        VStack(spacing: 6) {
            Image(systemName: icon)
                .font(.system(size: 18))
                .foregroundStyle(subtleGray)
            
            Text(text)
                .font(.system(size: 10))
                .foregroundStyle(subtleGray)
                .multilineTextAlignment(.center)
                .lineSpacing(1)
        }
        .frame(maxWidth: .infinity)
    }
}
