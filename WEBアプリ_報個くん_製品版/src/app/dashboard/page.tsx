"use client";

import { useAuth } from "@/ui/components/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { logout } from "@/infra/auth";
import { Button } from "@/ui/components/Button";

export default function DashboardPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return <div className="min-h-screen flex items-center justify-center font-bold">Loading...</div>;
    }

    const handleLogout = async () => {
        await logout();
        router.push("/login");
    };

    return (
        <div className="min-h-screen p-8 bg-slate-50 dark:bg-slate-900">
            <div className="max-w-4xl mx-auto space-y-8">
                <h1 className="text-3xl font-black text-slate-800 dark:text-white">Dashboard</h1>
                <p className="font-bold text-slate-600 dark:text-slate-300">
                    ようこそ、{user.email} さん
                </p>
                <Button onClick={handleLogout} variant="outline">
                    ログアウト
                </Button>
            </div>
        </div>
    );
}
