"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { login, checkEmailLink, loginWithLink } from "@/infra/auth";
import { useAuth } from "@/ui/components/AuthProvider";
import { Button } from "@/ui/components/Button";
import { Input } from "@/ui/components/Input";
import { Card } from "@/ui/components/Card";
import { LogIn, MonitorPlay } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isLinkLogin, setIsLinkLogin] = useState(false);

    useEffect(() => {
        if (user) {
            router.push("/admin/dashboard");
        }
    }, [user, router]);

    useEffect(() => {
        if (checkEmailLink(window.location.href)) {
            setIsLinkLogin(true);
            const emailFromQuery = searchParams.get("email");
            if (emailFromQuery) {
                setEmail(emailFromQuery);
                handleLinkLogin(emailFromQuery);
            }
        }
    }, [searchParams]);

    const handleLinkLogin = async (emailToUse: string) => {
        setLoading(true);
        try {
            await loginWithLink(emailToUse, window.location.href);
            router.push("/dashboard");
        } catch (err: any) {
            console.error(err);
            setError("リンク認証に失敗しました。期限切れの可能性があります。");
            setLoading(false);
        }
    };

    const handleManualLinkLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            setError("メールアドレスを入力してください");
            return;
        }
        handleLinkLogin(email);
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await login(email, password);
            router.push("/dashboard");
        } catch (err: any) {
            console.error(err);
            setError("ログインに失敗しました。メールアドレスとパスワードを確認してください。");
        } finally {
            setLoading(false);
        }
    };

    if (isLinkLogin && !email) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-900 font-bold">
                <Card className="w-full max-w-sm p-8 space-y-8">
                    <h1 className="text-xl font-bold text-center">メール認証の確認</h1>
                    <p className="text-sm text-slate-500 font-bold">認証リンクを確認しました。セキュリティのため、メールアドレスを再入力してください。</p>
                    <form onSubmit={handleManualLinkLogin} className="space-y-4">
                        <Input
                            type="email"
                            placeholder="example@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Button type="submit" className="w-full py-4 text-xl" disabled={loading}>
                            {loading ? "認証中..." : "認証を完了する"}
                        </Button>
                    </form>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-900 font-bold">
            <Card className="w-full max-w-sm p-8 space-y-8 bg-white dark:bg-slate-800 shadow-xl border-slate-200 dark:border-slate-700">
                <div className="text-center space-y-2 mb-6">
                    <h1 className="text-4xl font-black text-center mb-2 dark:text-white tracking-tight">
                        📦 報個くん
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">
                        Product Version 2.0
                    </p>
                </div>

                {isLinkLogin ? (
                    <div className="text-center font-bold text-orange-600 text-xl animate-pulse">認証中...</div>
                ) : (
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="sr-only">ログインID</label>
                            <Input
                                type="email"
                                placeholder="ログインID (メール)"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="username"
                                className="text-lg"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="sr-only">パスワード</label>
                            <Input
                                type="password"
                                placeholder="パスワード"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                                className="text-lg"
                            />
                        </div>

                        {error && (
                            <div className="p-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-xl font-bold border border-red-100 dark:border-red-900/30">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full py-4 text-xl shadow-lg hover:shadow-xl transition-all"
                            variant="primary"
                            disabled={loading}
                        >
                            {loading ? "ログイン中..." : "ログイン"}
                        </Button>
                    </form>
                )}

                <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-slate-200 dark:border-slate-700" />
                    </div>
                </div>

                <Button
                    onClick={() => router.push("/demo")}
                    variant="outline"
                    className="w-full py-4 text-lg font-bold"
                >
                    <MonitorPlay className="w-5 h-5 mr-2" />
                    デモを見る (ログイン不要)
                </Button>

            </Card>
        </div>
    );
}
