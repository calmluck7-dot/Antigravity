import SwiftUI
import PDFKit

/// PDF請求書のプレビュー・共有画面
struct InvoicePreviewView: View {
    let pdfURL: URL
    let onDismiss: () -> Void
    
    private let bgColor = Color(red: 0.04, green: 0.04, blue: 0.04)
    private let cardBg = Color(red: 0.10, green: 0.10, blue: 0.12)
    private let accentGold = Color(red: 1.0, green: 0.78, blue: 0.28)
    private let textPrimary = Color(red: 0.95, green: 0.95, blue: 0.97)
    private let textSecondary = Color(red: 0.70, green: 0.70, blue: 0.75)
    
    @State private var showShareSheet = false
    
    var body: some View {
        ZStack {
            bgColor.ignoresSafeArea()
            
            VStack(spacing: 20) {
                // ヘッダー
                header
                
                // PDF プレビュー
                pdfPreview
                
                // アクションボタン
                actionButtons
            }
            .padding(20)
        }
        .sheet(isPresented: $showShareSheet) {
            ShareSheet(items: [pdfURL])
        }
    }
    
    private var header: some View {
        HStack {
            VStack(alignment: .leading, spacing: 4) {
                Text("請求書が完成しました")
                    .font(.system(size: 20, weight: .bold))
                    .foregroundStyle(textPrimary)
                
                Text("内容を確認して共有できます")
                    .font(.system(size: 13))
                    .foregroundStyle(textSecondary)
            }
            
            Spacer()
            
            // 完了チェックアイコン
            ZStack {
                Circle()
                    .fill(accentGold.opacity(0.15))
                    .frame(width: 44, height: 44)
                
                Image(systemName: "checkmark.circle.fill")
                    .font(.system(size: 24))
                    .foregroundStyle(accentGold)
            }
        }
    }
    
    private var pdfPreview: some View {
        PDFKitView(url: pdfURL)
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .clipShape(RoundedRectangle(cornerRadius: 12))
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(Color.gray.opacity(0.2), lineWidth: 1)
            )
    }
    
    private var actionButtons: some View {
        HStack(spacing: 14) {
            // 共有ボタン
            Button {
                showShareSheet = true
            } label: {
                HStack(spacing: 8) {
                    Image(systemName: "square.and.arrow.up")
                    Text("共有する")
                }
                .font(.system(size: 16, weight: .semibold))
                .foregroundStyle(.black)
                .frame(maxWidth: .infinity)
                .frame(height: 52)
                .background(accentGold)
                .clipShape(RoundedRectangle(cornerRadius: 12))
            }
            
            // 閉じるボタン
            Button {
                onDismiss()
            } label: {
                HStack(spacing: 8) {
                    Image(systemName: "xmark")
                    Text("閉じる")
                }
                .font(.system(size: 16, weight: .semibold))
                .foregroundStyle(textPrimary)
                .frame(maxWidth: .infinity)
                .frame(height: 52)
                .background(cardBg)
                .clipShape(RoundedRectangle(cornerRadius: 12))
                .overlay(
                    RoundedRectangle(cornerRadius: 12)
                        .stroke(Color.gray.opacity(0.3), lineWidth: 1)
                )
            }
        }
    }
}

// MARK: - PDFKit UIViewRepresentable

/// PDFKitをSwiftUIで使用するためのラッパー
struct PDFKitView: UIViewRepresentable {
    let url: URL
    
    func makeUIView(context: Context) -> PDFView {
        let pdfView = PDFView()
        pdfView.autoScales = true
        pdfView.backgroundColor = .black
        return pdfView
    }
    
    func updateUIView(_ pdfView: PDFView, context: Context) {
        if let document = PDFDocument(url: url) {
            pdfView.document = document
        }
    }
}

// MARK: - ShareSheet UIActivityViewController

/// 共有シートのラッパー
struct ShareSheet: UIViewControllerRepresentable {
    let items: [Any]
    
    func makeUIViewController(context: Context) -> UIActivityViewController {
        return UIActivityViewController(activityItems: items, applicationActivities: nil)
    }
    
    func updateUIViewController(_ uiViewController: UIActivityViewController, context: Context) {}
}
