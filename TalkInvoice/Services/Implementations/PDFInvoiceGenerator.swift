import Foundation
import PDFKit
import UIKit

/// PDF請求書生成・保存サービス
final class PDFInvoiceGenerator: InvoiceServiceProtocol {
    
    func generatePDF(for invoice: Invoice) async throws -> URL {
        let format = UIGraphicsPDFRendererFormat()
        let metadata = [
            kCGPDFContextTitle: "Invoice #\(invoice.id.uuidString.prefix(8))",
            kCGPDFContextAuthor: Constants.appName
        ]
        format.documentInfo = metadata as [String: Any]
        
        // A4サイズ（ポイント単位）
        let pageWidth = 595.2
        let pageHeight = 841.8
        let pageRect = CGRect(x: 0, y: 0, width: pageWidth, height: pageHeight)
        
        let renderer = UIGraphicsPDFRenderer(bounds: pageRect, format: format)
        
        let data = renderer.pdfData { (context) in
            context.beginPage()
            drawHeader(context: context.cgContext, pageRect: pageRect, invoice: invoice)
            drawClientInfo(context: context.cgContext, pageRect: pageRect, invoice: invoice)
            drawItemsTable(context: context.cgContext, pageRect: pageRect, invoice: invoice)
            drawTotal(context: context.cgContext, pageRect: pageRect, invoice: invoice)
        }
        
        let tempURL = FileManager.default.temporaryDirectory
            .appendingPathComponent("Invoice_\(invoice.id.uuidString).pdf")
        
        do {
            try data.write(to: tempURL)
        } catch {
            throw AppError.pdfGenerationFailed
        }
        
        return tempURL
    }
    
    func savePDF(to url: URL, filename: String) throws -> URL {
        let fileManager = FileManager.default
        guard let documentsDirectory = fileManager.urls(for: .documentDirectory, in: .userDomainMask).first else {
            throw AppError.storageFailed
        }
        
        let destinationURL = documentsDirectory.appendingPathComponent(filename)
        
        if fileManager.fileExists(atPath: destinationURL.path) {
            try fileManager.removeItem(at: destinationURL)
        }
        
        do {
            try fileManager.copyItem(at: url, to: destinationURL)
        } catch {
            throw AppError.storageFailed
        }
        
        return destinationURL
    }
    
    // MARK: - PDF描画ヘルパー
    
    private func drawHeader(context: CGContext, pageRect: CGRect, invoice: Invoice) {
        let title = "請求書"
        let font = UIFont.boldSystemFont(ofSize: 24)
        let attributes: [NSAttributedString.Key: Any] = [.font: font]
        let size = title.size(withAttributes: attributes)
        
        let x = (pageRect.width - size.width) / 2
        let y: CGFloat = 50
        title.draw(at: CGPoint(x: x, y: y), withAttributes: attributes)
        
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy年MM月dd日"
        let dateString = "発行日: " + formatter.string(from: invoice.issueDate)
        
        let dateFont = UIFont.systemFont(ofSize: 12)
        let dateAttributes: [NSAttributedString.Key: Any] = [.font: dateFont]
        let dateSize = dateString.size(withAttributes: dateAttributes)
        let dateX = pageRect.width - dateSize.width - 40
        dateString.draw(at: CGPoint(x: dateX, y: y + 10), withAttributes: dateAttributes)
    }
    
    private func drawClientInfo(context: CGContext, pageRect: CGRect, invoice: Invoice) {
        let text = "\(invoice.clientName) 御中"
        let font = UIFont.systemFont(ofSize: 18)
        let attributes: [NSAttributedString.Key: Any] = [.font: font]
        text.draw(at: CGPoint(x: 40, y: 100), withAttributes: attributes)
    }
    
    private func drawItemsTable(context: CGContext, pageRect: CGRect, invoice: Invoice) {
        var y: CGFloat = 160
        let x: CGFloat = 40
        let width = pageRect.width - 80
        let rowHeight: CGFloat = 30
        
        // ヘッダー行
        drawTableRow(y: y, width: width, col1: "品目", col2: "単価", col3: "数量", col4: "金額", isHeader: true)
        y += rowHeight
        
        // 明細行
        for item in invoice.items {
            let total = Int(item.unitPrice) * item.quantity
            drawTableRow(
                y: y, width: width,
                col1: item.name, col2: "¥\(Int(item.unitPrice))",
                col3: "\(item.quantity)", col4: "¥\(total)",
                isHeader: false
            )
            y += rowHeight
        }
        
        // 罫線
        context.setStrokeColor(UIColor.black.cgColor)
        context.setLineWidth(1)
        context.move(to: CGPoint(x: x, y: y))
        context.addLine(to: CGPoint(x: x + width, y: y))
        context.strokePath()
    }
    
    private func drawTableRow(y: CGFloat, width: CGFloat, col1: String, col2: String, col3: String, col4: String, isHeader: Bool) {
        let font = isHeader ? UIFont.boldSystemFont(ofSize: 12) : UIFont.systemFont(ofSize: 12)
        let attributes: [NSAttributedString.Key: Any] = [.font: font]
        
        let col1Width = width * 0.5
        let col2Width = width * 0.2
        let col3Width = width * 0.1
        
        col1.draw(in: CGRect(x: 40, y: y, width: col1Width, height: 20), withAttributes: attributes)
        col2.draw(in: CGRect(x: 40 + col1Width, y: y, width: col2Width, height: 20), withAttributes: attributes)
        col3.draw(in: CGRect(x: 40 + col1Width + col2Width, y: y, width: col3Width, height: 20), withAttributes: attributes)
        col4.draw(in: CGRect(x: 40 + col1Width + col2Width + col3Width, y: y, width: width - (col1Width + col2Width + col3Width), height: 20), withAttributes: attributes)
    }
    
    private func drawTotal(context: CGContext, pageRect: CGRect, invoice: Invoice) {
        let y: CGFloat = 160 + CGFloat(invoice.items.count + 1) * 30 + 20
        let total = Int(invoice.totalAmount)
        let text = "合計金額: ¥\(total)"
        let font = UIFont.boldSystemFont(ofSize: 16)
        let attributes: [NSAttributedString.Key: Any] = [.font: font]
        let size = text.size(withAttributes: attributes)
        let x = pageRect.width - size.width - 40
        text.draw(at: CGPoint(x: x, y: y), withAttributes: attributes)
    }
}
