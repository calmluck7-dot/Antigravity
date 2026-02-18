"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDailyReports } from "@/ui/hooks/useDailyReports";
import { useRates } from "@/ui/hooks/useRates";
import { Button } from "@/ui/components/Button";
import { Card } from "@/ui/components/Card";
import { Input } from "@/ui/components/Input";
import { ArrowLeft, MapPin, Package, AlertCircle } from "lucide-react";

export default function ReportPage() {
    const router = useRouter();
    const { addReport, loading: submitting, error: submitError } = useDailyReports();
    const { rates, loading: ratesLoading } = useRates();

    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [location, setLocation] = useState("東京センター");
    const [selectedRateId, setSelectedRateId] = useState("");
    const [pickedUp, setPickedUp] = useState("");
    const [returned, setReturned] = useState("0");
    const [allowance, setAllowance] = useState("0");
    const [remarks, setRemarks] = useState("");

    useEffect(() => {
        if (rates.length > 0 && !selectedRateId) {
            setSelectedRateId(rates[0].id);
        }
    }, [rates]);

    const handleSubmit = async () => {
        if (!selectedRateId) {
            alert("単価設定を選択してください");
            return;
        }

        const rate = rates.find(r => r.id === selectedRateId);
        if (!rate) return;

        try {
            await addReport(
                date,
                location,
                rate.id,
                rate.name,
                rate.unitPrice,
                Number(pickedUp),
                Number(returned),
                Number(allowance),
                remarks
            );
            router.push("/driver/dashboard");
        } catch (e) {
            alert("送信失敗: " + e);
        }
    };

    const delivered = (Number(pickedUp) || 0) - (Number(returned) || 0);

    if (ratesLoading) return <div className="p-8 text-center font-bold">読み込み中...</div>;

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return `${d.getMonth() + 1}/${d.getDate()}`;
    };

    return (
        <div className="space-y-5 font-bold pb-32">
            <Button onClick={() => router.push("/driver/dashboard")} variant="outline" className="w-full text-lg border-2">
                <ArrowLeft className="mr-2 w-5 h-5" /> メニューに戻る
            </Button>

            {/* Date Picker Card */}
            <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                <input
                    type="date"
                    className="p-2 border-2 border-slate-200 rounded-xl font-black bg-slate-50 dark:bg-slate-700 text-xl w-[170px] h-[52px] dark:text-white text-center focus:ring-2 focus:ring-orange-500 outline-none"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                />
                <div className="text-2xl text-slate-800 dark:text-white font-black whitespace-nowrap ml-2">
                    {formatDate(date)} <span className="text-sm text-slate-400 font-bold">の日報</span>
                </div>
            </div>

            {/* Main Record Card */}
            <Card className="p-6 space-y-5 border-l-8 border-orange-500 shadow-md">
                <div className="flex justify-between items-center">
                    <span className="bg-slate-800 text-white text-xs px-3 py-1 rounded-full uppercase font-black tracking-wider">
                        New Record
                    </span>
                </div>

                <div className="space-y-2">
                    <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">拠点 / エリア</label>
                    <select
                        className="w-full p-4 border-2 border-slate-200 rounded-xl font-bold text-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                    >
                        <option value="東京センター">東京センター</option>
                        <option value="横浜ステーション">横浜ステーション</option>
                        <option value="埼玉支店">埼玉支店</option>
                        <option value="その他">その他</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">業務種別 (単価)</label>
                    <select
                        className="w-full p-4 border-2 border-slate-200 rounded-xl font-bold text-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                        value={selectedRateId}
                        onChange={e => setSelectedRateId(e.target.value)}
                    >
                        {rates.map(r => (
                            <option key={r.id} value={r.id}>{r.name} (@{r.unitPrice}円)</option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">持ち出し</label>
                        <input
                            type="number"
                            inputMode="numeric"
                            className="w-full p-4 border-2 border-slate-200 rounded-xl font-black text-2xl dark:bg-slate-700 dark:border-slate-600 dark:text-white text-right outline-none focus:border-orange-500 transition-all"
                            value={pickedUp}
                            onChange={e => setPickedUp(e.target.value)}
                            placeholder="0"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">持ち戻り</label>
                        <input
                            type="number"
                            inputMode="numeric"
                            className="w-full p-4 border-2 border-slate-200 rounded-xl font-black text-2xl dark:bg-slate-700 dark:border-slate-600 text-red-500 text-right outline-none focus:border-red-500 transition-all"
                            value={returned}
                            onChange={e => setReturned(e.target.value)}
                            placeholder="0"
                        />
                    </div>
                </div>

                <div className="flex justify-between bg-orange-50 dark:bg-orange-950/30 p-4 rounded-xl px-5 items-center border border-orange-100 dark:border-orange-900/50">
                    <span className="font-bold text-slate-600 dark:text-slate-300">配達完了</span>
                    <span className="text-4xl font-black text-orange-600 tracking-tighter">
                        {Math.max(0, delivered)} <span className="text-lg text-slate-400 font-normal">個</span>
                    </span>
                </div>

                <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">その他手当 (税抜)</label>
                    <input
                        type="number"
                        inputMode="numeric"
                        className="w-full p-4 border-2 border-slate-200 rounded-xl font-bold bg-slate-50 dark:bg-slate-800/50 text-xl dark:text-white text-right outline-none focus:border-orange-500 transition-all"
                        value={allowance}
                        onChange={e => setAllowance(e.target.value)}
                        placeholder="0"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">備考</label>
                    <input
                        type="text"
                        className="w-full p-4 border-2 border-slate-200 rounded-xl font-bold bg-white dark:bg-slate-700 dark:text-white text-lg outline-none focus:border-orange-500 transition-all"
                        value={remarks}
                        onChange={e => setRemarks(e.target.value)}
                        placeholder="入力なしは『インセンティブ』"
                    />
                </div>
            </Card>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-700 z-10 md:static md:bg-transparent md:border-none md:p-0">
                <Button
                    onClick={handleSubmit}
                    className="w-full py-6 text-2xl font-black shadow-xl bg-orange-600 hover:bg-orange-700 text-white rounded-2xl transition-transform active:scale-95"
                    disabled={submitting}
                >
                    {submitting ? "送信中..." : "日報を送信する"}
                </Button>
            </div>
        </div>
    );
}
