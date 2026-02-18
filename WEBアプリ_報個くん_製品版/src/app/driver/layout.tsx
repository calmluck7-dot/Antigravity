"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/ui/components/AuthProvider";
import {
    Home,
    PenTool,
    History,
    UserCircle,
    LogOut,
    Menu,
    X
} from "lucide-react";
import { logout } from "@/infra/auth";

export default function DriverLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push("/login");
                return;
            }

            user.getIdTokenResult().then((idTokenResult) => {
                const role = idTokenResult.claims.role;
                // Allow driver, but also admin/developer for testing/viewing
                if (role === "driver" || role === "admin" || role === "developer") {
                    setAuthorized(true);
                } else {
                    alert("アクセス権限がありません。");
                    router.push("/");
                }
            });
        }
    }, [user, loading, router]);

    const handleLogout = async () => {
        await logout();
        router.push("/login");
    };

    if (loading || !authorized) {
        return <div className="min-h-screen flex items-center justify-center font-bold text-slate-500">Loading Driver Console...</div>;
    }

    const navItems = [
        { label: "ホーム", href: "/driver/dashboard", icon: Home },
        { label: "日報入力", href: "/driver/report", icon: PenTool },
        { label: "履歴", href: "/driver/history", icon: History },
        // { label: "設定", href: "/driver/settings", icon: UserCircle },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 md:pb-0 md:flex">
            {/* Mobile Header */}
            <header className="bg-orange-600 text-white p-4 sticky top-0 z-30 shadow-md md:hidden flex justify-between items-center">
                <h1 className="font-black text-lg">報個くん Driver</h1>
                <button onClick={handleLogout} className="text-sm font-bold bg-white/20 px-3 py-1 rounded">
                    ログアウト
                </button>
            </header>

            {/* Desktop Sidebar (Optional/Future) - For now simple generic sidebar similar to Admin but simplified */}
            <aside className="hidden md:flex flex-col w-64 bg-slate-800 text-white min-h-screen sticky top-0">
                <div className="p-6">
                    <h1 className="text-2xl font-black">報個くん</h1>
                    <p className="text-slate-400 text-sm">for Drivers</p>
                </div>
                <nav className="flex-1 px-4 space-y-2">
                    {navItems.map((item) => (
                        <button
                            key={item.href}
                            onClick={() => router.push(item.href)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-colors ${pathname === item.href ? "bg-orange-600 text-white" : "text-slate-400 hover:text-white"
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </button>
                    ))}
                </nav>
                <div className="p-4 border-t border-slate-700">
                    <button onClick={handleLogout} className="flex items-center gap-2 text-slate-400 hover:text-white font-bold">
                        <LogOut className="w-5 h-5" /> ログアウト
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 max-w-lg mx-auto md:max-w-none w-full">
                {children}
            </main>

            {/* Mobile Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 md:hidden z-40 pb-safe">
                <div className="flex justify-around items-center h-16">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <button
                                key={item.href}
                                onClick={() => router.push(item.href)}
                                className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? "text-orange-600" : "text-slate-400"
                                    }`}
                            >
                                <item.icon className={`w-6 h-6 ${isActive ? "fill-orange-100" : ""}`} />
                                <span className="text-[10px] font-bold">{item.label}</span>
                            </button>
                        )
                    })}
                </div>
            </nav>
        </div>
    );
}
