import Foundation

/// AIから抽出された中間データ（SwiftDataに保存する前の一時的な構造体）
struct InvoiceDraft: Codable {
    var clientName: String?
    var items: [InvoiceDraftItem]
    var date: Date?
}

struct InvoiceDraftItem: Codable {
    var name: String
    var price: Int
    var quantity: Int
}
