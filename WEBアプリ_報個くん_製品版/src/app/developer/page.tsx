"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/ui/components/AuthProvider";
import { Button } from "@/ui/components/Button";
import { Card } from "@/ui/components/Card";
import { Input } from "@/ui/components/Input";
import { Building2, Plus, Users, ShieldAlert } from "lucide-react";

// Note: In a real app, these actions should be server actions or API calls
// that verify the 'developer' role via Custom Claims.
// For now, we will stub the API call structure.

export default function DeveloperConsole() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false);
    const [checkingRole, setCheckingRole] = useState(true);

    // Form State
    const [companyName, setCompanyName] = useState("");
    const [adminEmail, setAdminEmail] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push("/login");
                return;
            }

            // Check for developer claim
            user.getIdTokenResult().then((idTokenResult) => {
                if (idTokenResult.claims.role === "developer") {
                    setIsAdmin(true);
                } else {
                    // Redirect or show Access Denied
                    // For development, we might want to allow easy access if no dev exists?
                    // No, strict security is better.
                }
                setCheckingRole(false);
            });
        }
    }, [user, loading, router]);

    const handleCreateCompany = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("作成中...");

        try {
            const response = await fetch("/api/developer/create-company", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: companyName, adminEmail }),
            });

            if (!response.ok) {
                const err = await response.text();
                throw new Error(err);
            }

            const data = await response.json();
            setMessage(`成功！企業ID: ${data.companyId}, 招待リンク: ${data.inviteLink}`);
            setCompanyName("");
            setAdminEmail("");
        } catch (e: any) {
            setMessage(`エラー: ${e.message}`);
        }
    };

    if (loading || checkingRole) return <div className="min-h-screen flex items-center justify-center font-bold">Checking permissions...</div>;

    if (!isAdmin) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-900">
                <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
                <h1 className="text-2xl font-black text-slate-800 dark:text-white">Access Denied</h1>
                <p className="text-slate-500 mt-2">このページには開発者権限が必要です。</p>
                <Button onClick={() => router.push("/dashboard")} className="mt-6" variant="outline">
                    ダッシュボードへ戻る
                </Button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8">
            <header className="max-w-4xl mx-auto mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                        <Building2 className="w-8 h-8 text-indigo-600" />
                        Developer Console
                    </h1>
                    <p className="text-slate-500 font-bold">システム管理・企業発行</p>
                </div>
                <Button variant="outline" onClick={() => router.push("/dashboard")}>
                    アプリに戻る
                </Button>
            </header>

            <main className="max-w-4xl mx-auto space-y-6">
                <Card className="p-6">
                    <h2 className="text-xl font-black mb-4 flex items-center gap-2">
                        <Plus className="w-5 h-5" /> 新規企業作成
                    </h2>
                    <form onSubmit={handleCreateCompany} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-600 mb-1">企業名</label>
                            <Input
                                placeholder="株式会社サンプル運送"
                                value={companyName}
                                onChange={e => setCompanyName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-600 mb-1">管理者メールアドレス</label>
                            <Input
                                type="email"
                                placeholder="admin@sample.co.jp"
                                value={adminEmail}
                                onChange={e => setAdminEmail(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" variant="primary" className="w-full bg-indigo-600 hover:bg-indigo-700">
                            企業を作成して招待を送る
                        </Button>
                    </form>
                    {message && (
                        <div className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg whitespace-pre-wrap break-all border border-slate-200 dark:border-slate-700 font-mono text-sm">
                            {message}
                        </div>
                    )}
                </Card>

                {/* Future: List existing companies */}
                <Card className="p-6 opacity-50">
                    <h2 className="text-xl font-black mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5" /> 企業一覧
                    </h2>
                    <p className="text-slate-500">Coming Soon: 登録済み企業の一覧表示と編集機能</p>
                </Card>
            </main>
        </div>
    );
}
