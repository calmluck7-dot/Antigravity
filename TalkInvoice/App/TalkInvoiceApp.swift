import SwiftUI
import SwiftData

@main
struct TalkInvoiceApp: App {
    /// DIコンテナ: 全Serviceのインスタンスを管理
    @StateObject private var container = DependencyContainer()
    
    var body: some Scene {
        WindowGroup {
            MainView()
                .environmentObject(container)
                .environmentObject(container.subscriptionManager)
        }
        .modelContainer(for: [Invoice.self, InvoiceItem.self, MonthlyUsage.self])
    }
}
