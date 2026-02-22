import SwiftData
import Foundation

/// 請求書データモデル (SwiftData 永続化対象)
@Model
final class Invoice {
    var id: UUID
    var clientName: String
    var issueDate: Date
    var items: [InvoiceItem]
    var isSent: Bool
    var createdAt: Date
    
    /// 合計金額（常にitemsから計算されるため、データの不整合が起きない）
    var totalAmount: Double {
        items.reduce(0) { $0 + $1.total }
    }
    
    init(clientName: String, issueDate: Date = Date(), items: [InvoiceItem] = []) {
        self.id = UUID()
        self.clientName = clientName
        self.issueDate = issueDate
        self.items = items
        self.isSent = false
        self.createdAt = Date()
    }
}

/// 請求書の明細行
@Model
final class InvoiceItem {
    var name: String
    var unitPrice: Double
    var quantity: Int
    
    var total: Double {
        return unitPrice * Double(quantity)
    }
    
    init(name: String, unitPrice: Double, quantity: Int) {
        self.name = name
        self.unitPrice = unitPrice
        self.quantity = quantity
    }
}
