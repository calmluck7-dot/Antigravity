"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/ui/components/AuthProvider";
import {
    LayoutDashboard,
    Users,
    FileText,
    Settings,
    LogOut,
    Menu,
    X,
    CreditCard
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, loading, logoutLocal } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push("/login");
                return;
            }

            // forceRefresh: true でCustom Claimsの変更を即座に反映
            user.getIdTokenResult(true).then((idTokenResult) => {
                const role = idTokenResult.claims.role;
                // Allow admin and developer (as super-admin view)
                if (role === "admin" || role === "developer") {
                    setAuthorized(true);
                } else {
                    // If driver tries to access admin, redirect to driver console (future)
                    // For now just restrict.
                    alert("アクセス権限がありません。管理者アカウントでログインしてください。");
                    router.push("/dashboard");
                }
            });
        }
    }, [user, loading, router]);

    const handleLogout = async () => {
        await logoutLocal();
    };

    if (loading || !authorized) {
        return <div className="min-h-screen flex items-center justify-center font-bold text-slate-500">Loading Admin Console...</div>;
    }

    const navItems = [
        { label: "ダッシュボード", href: "/admin/dashboard", icon: LayoutDashboard },
        { label: "ドライバー管理", href: "/admin/drivers", icon: Users },
        { label: "単価設定", href: "/admin/rates", icon: CreditCard },
        { label: "日報承認", href: "/admin/reports", icon: FileText },
        { label: "月次集計・請求", href: "/admin/monthly", icon: FileText },
        { label: "請求設定", href: "/admin/settings", icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-64 bg-slate-800 text-white transform transition-transform duration-200 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
                <div className="p-6 flex justify-between items-center">
                    <h1 className="text-xl font-black tracking-tight">報個くん Admin</h1>
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="px-4 space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <button
                                key={item.href}
                                onClick={() => {
                                    router.push(item.href);
                                    setIsSidebarOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-colors ${isActive
                                    ? "bg-orange-600 text-white"
                                    : "text-slate-400 hover:bg-slate-700 hover:text-white"
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t border-slate-700">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg font-bold transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        ログアウト
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="bg-white dark:bg-slate-800 shadow-sm p-4 flex items-center md:hidden sticky top-0 z-30">
                    <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-slate-600 dark:text-slate-300">
                        <Menu className="w-6 h-6" />
                    </button>
                    <span className="ml-4 font-black text-slate-800 dark:text-white">Menu</span>
                </header>

                <main className="flex-1 p-6 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
