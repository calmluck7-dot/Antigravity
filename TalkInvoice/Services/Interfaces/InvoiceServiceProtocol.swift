import Foundation

protocol InvoiceServiceProtocol: Sendable {
    /// Generates a PDF file from the invoice data
    /// - Parameter invoice: The invoice data model
    /// - Returns: The URL of the generated temporary PDF file
    func generatePDF(for invoice: Invoice) async throws -> URL
    
    /// Saves the invoice to the persistent store (if not using SwiftData context directly in VM)
    // Note: With SwiftData, ViewModels often interact with ModelContext directly, 
    // but a service can encapsulate complex saving logic or file writing.
    func savePDF(to url: URL, filename: String) throws -> URL
}
