import SwiftUI
import SwiftData

/// 請求書履歴一覧画面
struct InvoiceHistoryView: View {
    @Environment(\.modelContext) private var modelContext
    @Environment(\.dismiss) private var dismiss
    @Query(sort: \Invoice.createdAt, order: .reverse) private var invoices: [Invoice]
    
    private let bgColor = Color(red: 0.04, green: 0.04, blue: 0.04)
    private let cardBg = Color(red: 0.10, green: 0.10, blue: 0.12)
    private let accentGold = Color(red: 1.0, green: 0.78, blue: 0.28)
    private let textPrimary = Color(red: 0.95, green: 0.95, blue: 0.97)
    private let textSecondary = Color(red: 0.70, green: 0.70, blue: 0.75)
    private let subtleGray = Color(red: 0.45, green: 0.45, blue: 0.50)
    
    var body: some View {
        NavigationStack {
            ZStack {
                bgColor.ignoresSafeArea()
                
                if invoices.isEmpty {
                    emptyState
                } else {
                    invoiceList
                }
            }
            .navigationTitle("請求書履歴")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("閉じる") { dismiss() }
                        .foregroundStyle(accentGold)
                }
            }
            .toolbarColorScheme(.dark, for: .navigationBar)
        }
        .preferredColorScheme(.dark)
    }
    
    // MARK: - Empty State
    
    private var emptyState: some View {
        VStack(spacing: 16) {
            Image(systemName: "doc.text.magnifyingglass")
                .font(.system(size: 48))
                .foregroundStyle(subtleGray)
            
            Text("まだ請求書がありません")
                .font(.system(size: 17, weight: .medium))
                .foregroundStyle(textSecondary)
            
            Text("マイクボタンを押して\n最初の請求書を作成しましょう")
                .font(.system(size: 14))
                .foregroundStyle(subtleGray)
                .multilineTextAlignment(.center)
        }
    }
    
    // MARK: - Invoice List
    
    private var invoiceList: some View {
        ScrollView {
            LazyVStack(spacing: 12) {
                ForEach(invoices) { invoice in
                    invoiceCard(invoice)
                }
            }
            .padding(.horizontal, 16)
            .padding(.top, 8)
        }
    }
    
    private func invoiceCard(_ invoice: Invoice) -> some View {
        HStack(spacing: 14) {
            // アイコン
            ZStack {
                RoundedRectangle(cornerRadius: 10)
                    .fill(accentGold.opacity(0.12))
                    .frame(width: 44, height: 44)
                
                Image(systemName: "doc.text.fill")
                    .font(.system(size: 18))
                    .foregroundStyle(accentGold)
            }
            
            // 請求書情報
            VStack(alignment: .leading, spacing: 4) {
                Text(invoice.clientName)
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundStyle(textPrimary)
                    .lineLimit(1)
                
                Text(formattedDate(invoice.issueDate))
                    .font(.system(size: 12))
                    .foregroundStyle(subtleGray)
            }
            
            Spacer()
            
            // 金額
            VStack(alignment: .trailing, spacing: 4) {
                Text("¥\(Int(invoice.totalAmount))")
                    .font(.system(size: 17, weight: .bold))
                    .foregroundStyle(textPrimary)
                
                // 送信済みバッジ
                if invoice.isSent {
                    Text("送信済")
                        .font(.system(size: 10, weight: .semibold))
                        .foregroundStyle(.green)
                        .padding(.horizontal, 6)
                        .padding(.vertical, 2)
                        .background(Color.green.opacity(0.15))
                        .clipShape(Capsule())
                }
            }
            
            Image(systemName: "chevron.right")
                .font(.system(size: 12))
                .foregroundStyle(subtleGray)
        }
        .padding(16)
        .background(
            RoundedRectangle(cornerRadius: 14)
                .fill(cardBg)
        )
    }
    
    private func formattedDate(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy/MM/dd"
        return formatter.string(from: date)
    }
}
