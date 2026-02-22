"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/ui/components/Button";
import { Card } from "@/ui/components/Card";
import { ArrowLeft, Truck, Package, Calendar, CheckCircle, Smartphone, LayoutDashboard, Users, TrendingUp, AlertCircle } from "lucide-react";

export default function DemoPage() {
    const router = useRouter();
    const [viewMode, setViewMode] = useState<"driver" | "admin">("driver");
    const [showPurchase, setShowPurchase] = useState(false);
    const [companyName, setCompanyName] = useState("");
    const [purchasing, setPurchasing] = useState(false);
    const [purchaseError, setPurchaseError] = useState("");

    // Stripe Checkout に遷移する処理
    const handlePurchase = async () => {
        if (!companyName.trim()) {
            setPurchaseError("企業名を入力してください");
            return;
        }
        setPurchasing(true);
        setPurchaseError("");
        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ companyName: companyName.trim() }),
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                setPurchaseError(data.error || "エラーが発生しました");
            }
        } catch (e: any) {
            setPurchaseError("通信エラーが発生しました");
        } finally {
            setPurchasing(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
            {/* Header */}
            <header className="bg-slate-800 text-white p-4 sticky top-0 z-50 flex flex-col md:flex-row justify-between items-center shadow-md gap-4">
                <div className="font-black text-lg flex items-center gap-2 w-full md:w-auto justify-between md:justify-start">
                    <span className="flex items-center gap-2"><Truck className="w-6 h-6" /> 報個くん (デモ)</span>
                    <Button
                        variant="outline"
                        className="py-1 px-3 border-slate-600 text-white bg-transparent hover:bg-slate-700 text-xs"
                        onClick={() => router.push("/login")}
                    >
                        <ArrowLeft className="w-3 h-3 mr-1" /> 戻る
                    </Button>
                </div>

                {/* View Mode Toggle */}
                <div className="bg-slate-700 p-1 rounded-xl flex items-center w-full md:w-auto">
                    <button
                        onClick={() => setViewMode("driver")}
                        className={`flex-1 md:w-32 py-2 px-4 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${viewMode === "driver" ? "bg-orange-600 text-white shadow-md" : "text-slate-400 hover:text-white"}`}
                    >
                        <Smartphone className="w-4 h-4" /> ドライバー
                    </button>
                    <button
                        onClick={() => setViewMode("admin")}
                        className={`flex-1 md:w-32 py-2 px-4 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${viewMode === "admin" ? "bg-sky-600 text-white shadow-md" : "text-slate-400 hover:text-white"}`}
                    >
                        <LayoutDashboard className="w-4 h-4" /> オーナー
                    </button>
                </div>


            </header>

            <main className="max-w-xl mx-auto p-4 space-y-6">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200 text-sm font-bold text-center">
                    ⚠️ 現在はデモモードです。データは保存されません。
                </div>

                {viewMode === "driver" ? <DriverDemoView /> : <AdminDemoView />}

                {/* 購入セクション */}
                <div className="mt-8 bg-gradient-to-br from-emerald-500 to-sky-600 p-6 rounded-2xl text-white shadow-xl">
                    <h3 className="font-black text-xl text-center mb-2">🚀 本製品を導入する</h3>
                    <p className="text-sm text-center opacity-90 mb-4">
                        デモの機能がそのまま使えます。Googleアカウントで即日利用開始！
                    </p>
                    <div className="text-center mb-4">
                        <span className="text-4xl font-black">¥10,000</span>
                        <span className="text-sm opacity-80 ml-2">（税込・買い切り）</span>
                    </div>

                    {!showPurchase ? (
                        <Button
                            onClick={() => setShowPurchase(true)}
                            className="w-full bg-white text-emerald-700 font-black text-lg py-4 rounded-xl hover:bg-emerald-50 shadow-lg"
                        >
                            購入手続きへ進む →
                        </Button>
                    ) : (
                        <div className="space-y-3">
                            <input
                                type="text"
                                placeholder="企業名を入力（例: 株式会社サンプル運送）"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                className="w-full p-3 rounded-xl text-slate-800 font-bold placeholder:text-slate-400 placeholder:font-normal"
                            />
                            {purchaseError && (
                                <p className="text-red-200 text-sm font-bold text-center">{purchaseError}</p>
                            )}
                            <Button
                                onClick={handlePurchase}
                                disabled={purchasing}
                                className="w-full bg-white text-emerald-700 font-black text-lg py-4 rounded-xl hover:bg-emerald-50 shadow-lg disabled:opacity-50"
                            >
                                {purchasing ? "処理中..." : "Stripe で決済する（¥10,000）"}
                            </Button>
                            <button
                                onClick={() => setShowPurchase(false)}
                                className="w-full text-sm opacity-70 hover:opacity-100"
                            >
                                キャンセル
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

function DriverDemoView() {
    const demoRecords = [
        { date: "2024-02-18", location: "東京センター", delivered: 120, allowance: 0, remarks: "" },
        { date: "2024-02-17", location: "東京センター", delivered: 115, allowance: 500, remarks: "高速代" },
        { date: "2024-02-16", location: "横浜ステーション", delivered: 98, allowance: 0, remarks: "" },
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-orange-50 dark:bg-orange-900/10 p-6 rounded-2xl border border-orange-100 dark:border-orange-900/30 flex justify-between items-center shadow-sm">
                <div>
                    <span className="text-xs font-black text-orange-400 block tracking-widest uppercase">
                        Driver
                    </span>
                    <span className="font-black text-2xl text-slate-800 dark:text-white">
                        デモ 太郎 様
                    </span>
                </div>
                <div className="w-14 h-14 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center text-3xl shadow-inner border border-slate-100 dark:border-slate-600">
                    👤
                </div>
            </div>

            <div className="grid gap-4">
                <Button className="h-24 text-2xl font-black bg-orange-600 shadow-lg hover:bg-orange-700 rounded-2xl">
                    <Package className="w-8 h-8 mr-2" /> 日報入力
                </Button>
                <div className="grid grid-cols-2 gap-4">
                    <Button variant="secondary" className="h-24 flex-col text-lg font-black rounded-2xl">
                        <Calendar className="w-8 h-8 mb-1" /> スケジュール
                    </Button>
                    <Button variant="outline" className="h-24 flex-col text-lg font-black rounded-2xl">
                        <CheckCircle className="w-8 h-8 mb-1" /> 履歴確認
                    </Button>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="font-bold text-slate-500 dark:text-slate-400 px-1">最近の活動履歴</h3>
                {demoRecords.map((record, i) => (
                    <Card key={i} className="p-4 flex justify-between items-center border-l-4 border-slate-400 shadow-sm">
                        <div>
                            <div className="font-black text-lg text-slate-800 dark:text-white">{record.date}</div>
                            <div className="text-xs text-slate-400 font-bold">{record.location}</div>
                            {record.remarks && <div className="text-xs text-slate-400 mt-1">※{record.remarks}</div>}
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-black text-orange-600">{record.delivered}個</div>
                            {record.allowance > 0 && <div className="text-xs font-bold text-slate-500">+¥{record.allowance}</div>}
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}

function AdminDemoView() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-sky-50 dark:bg-sky-900/10 p-6 rounded-2xl border border-sky-100 dark:border-sky-900/30 flex justify-between items-center shadow-sm">
                <div>
                    <span className="text-xs font-black text-sky-500 block tracking-widest uppercase">
                        Owner
                    </span>
                    <span className="font-black text-2xl text-slate-800 dark:text-white">
                        管理者画面
                    </span>
                </div>
                <div className="w-14 h-14 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center text-3xl shadow-inner border border-slate-100 dark:border-slate-600">
                    🏢
                </div>
            </div>

            {/* Sales Summary */}
            <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 bg-slate-800 text-white border-none shadow-lg">
                    <div className="flex flex-col h-full justify-between gap-4">
                        <TrendingUp className="w-8 h-8 opacity-80 text-emerald-400" />
                        <div>
                            <p className="text-xs font-bold opacity-80">今月の売上見込</p>
                            <p className="text-2xl font-black">¥1,250,400</p>
                            <p className="text-[10px] text-emerald-400 font-bold">先月比 +12% 🚀</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <div className="flex flex-col h-full justify-between gap-4">
                        <Users className="w-8 h-8 text-sky-600" />
                        <div>
                            <p className="text-xs font-bold text-slate-500">稼働ドライバー</p>
                            <p className="text-2xl font-black text-slate-800 dark:text-white">8<span className="text-sm font-normal text-slate-400"> / 12名</span></p>
                            <p className="text-[10px] text-sky-600 font-bold">現在オンライン</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Action Required */}
            <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-xl shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-orange-100 p-2 rounded-full text-orange-600">
                        <AlertCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="font-bold text-slate-800">日報承認待ち</p>
                        <p className="text-xs text-slate-500">3件の未承認日報があります</p>
                    </div>
                </div>
                <Button className="bg-orange-600 text-white text-xs font-bold px-4 rounded-full">
                    確認する
                </Button>
            </div>

            {/* Recent Reports */}
            <div className="space-y-3">
                <h3 className="font-bold text-slate-500 dark:text-slate-400 px-1 text-sm">最新の日報 (承認待ち)</h3>
                {[
                    { name: "佐藤 健太", date: "2/18", count: 145, status: "未承認" },
                    { name: "鈴木 一郎", date: "2/18", count: 98, status: "未承認" },
                    { name: "田中 美咲", date: "2/18", count: 112, status: "未承認" },
                ].map((item, i) => (
                    <Card key={i} className="p-3 flex justify-between items-center border border-slate-100 dark:border-slate-700 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-black text-slate-600">
                                {item.name[0]}
                            </div>
                            <div>
                                <div className="font-black text-sm text-slate-800 dark:text-white">{item.name}</div>
                                <div className="text-xs text-slate-400 font-bold">{item.date} - {item.count}個</div>
                            </div>
                        </div>
                        <Button variant="outline" className="text-xs h-8 border-sky-200 text-sky-600 hover:bg-sky-50">
                            詳細
                        </Button>
                    </Card>
                ))}
            </div>
        </div>
    );
}
