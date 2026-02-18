"use client";

import { useState, useEffect } from "react";
import { useMonthlyReports, DriverMonthlySummary } from "@/ui/hooks/useMonthlyReports";
import { useDrivers } from "@/ui/hooks/useDrivers";
import { Button } from "@/ui/components/Button";
import { Card } from "@/ui/components/Card";
import { Input } from "@/ui/components/Input";
import { FileText, Download, ChevronDown, ChevronUp } from "lucide-react";
import { generatePDF } from "@/lib/pdf-generator";

export default function MonthlyReportPage() {
    const { fetchMonthlySummary, loading } = useMonthlyReports();
    const { drivers } = useDrivers();

    const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
    const [summaries, setSummaries] = useState<DriverMonthlySummary[]>([]);
    const [expandedDriverId, setExpandedDriverId] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            const map: Record<string, string> = {};
            drivers.forEach(d => { map[d.uid] = d.name; });

            const data = await fetchMonthlySummary(currentMonth, map);
            setSummaries(data);
        };
        if (drivers.length > 0) {
            load();
        }
    }, [currentMonth, drivers, fetchMonthlySummary]);

    const handleDownloadPDF = async (summary: DriverMonthlySummary) => {
        const elementId = `invoice-${summary.driverId}`;
        await generatePDF(elementId, `請求書_${summary.driverName}_${currentMonth}.pdf`);
    };

    if (loading && summaries.length === 0) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                        <FileText className="w-8 h-8 text-indigo-600" />
                        月次集計・請求
                    </h1>
                    <p className="text-slate-500 font-bold">月ごとの稼働実績と請求書発行</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-600">対象月:</span>
                    <Input
                        type="month"
                        value={currentMonth}
                        onChange={e => setCurrentMonth(e.target.value)}
                        className="w-40"
                    />
                </div>
            </div>

            <div className="space-y-4">
                {summaries.map((summary) => (
                    <Card key={summary.driverId} className="overflow-hidden">
                        <div className="p-4 flex items-center justify-between bg-white dark:bg-slate-800">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xl">
                                    👤
                                </div>
                                <div>
                                    <h3 className="font-black text-lg text-slate-800 dark:text-white">{summary.driverName}</h3>
                                    <div className="text-xs text-slate-500 font-bold">
                                        稼働日数: {new Set(summary.reports.map(r => r.date)).size}日
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="text-right hidden md:block">
                                    <div className="text-sm text-slate-500 font-bold">売上合計</div>
                                    <div className="text-xl font-black">¥{summary.totalSales.toLocaleString()}</div>
                                </div>
                                <div className="text-right hidden md:block">
                                    <div className="text-sm text-slate-500 font-bold">配完個数</div>
                                    <div className="text-xl font-black">{summary.totalDelivered}個</div>
                                </div>

                                <Button variant="outline" onClick={() => handleDownloadPDF(summary)}>
                                    <Download className="w-4 h-4 mr-1" /> PDF出力
                                </Button>

                                <button
                                    onClick={() => setExpandedDriverId(expandedDriverId === summary.driverId ? null : summary.driverId)}
                                    className="p-2 hover:bg-slate-100 rounded-full"
                                >
                                    {expandedDriverId === summary.driverId ? <ChevronUp /> : <ChevronDown />}
                                </button>
                            </div>
                        </div>

                        <div className="fixed top-0 left-0 -z-50 opacity-0 pointer-events-none">
                            <div id={`invoice-${summary.driverId}`} className="w-[595pt] bg-white p-16 text-slate-900">
                                <div className="border-b-2 border-slate-800 pb-8 mb-8 flex justify-between items-end">
                                    <div>
                                        <h1 className="text-2xl font-black tracking-widest mb-2">御請求書・支払明細書</h1>
                                        <p className="text-sm text-slate-500">No. {summary.driverId.slice(0, 8)}-{currentMonth.replace("-", "")}</p>
                                    </div>
                                    <div className="text-right">
                                        <h2 className="font-bold text-lg mb-1">株式会社サンプル運送</h2>
                                        <p className="text-xs text-slate-500">東京都渋谷区...</p>
                                        <p className="text-xs text-slate-500">TEL: 03-1234-5678</p>
                                    </div>
                                </div>

                                <div className="flex justify-between mb-12">
                                    <div className="w-1/2">
                                        <h3 className="text-xl font-bold border-b border-slate-300 pb-2 mb-2">
                                            {summary.driverName} 様
                                        </h3>
                                        <p className="text-sm text-slate-500">下記期間の配送委託料として</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-bold text-slate-500 mb-1">御請求金額 (税込)</div>
                                        <div className="text-3xl font-black tracking-tighter">
                                            ¥{Math.floor(summary.totalSales * 1.1).toLocaleString()}
                                        </div>
                                        <div className="text-xs text-slate-400 mt-1">(税抜 ¥{summary.totalSales.toLocaleString()})</div>
                                    </div>
                                </div>

                                <table className="w-full text-sm mb-8">
                                    <thead>
                                        <tr className="border-b-2 border-slate-800 text-left">
                                            <th className="py-2 font-black">日付</th>
                                            <th className="py-2 font-black">業務内容 / 配送エリア</th>
                                            <th className="py-2 font-black text-right">単価</th>
                                            <th className="py-2 font-black text-right">個数</th>
                                            <th className="py-2 font-black text-right">小計</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {summary.reports.map((r, i) => (
                                            <tr key={i} className="border-b border-slate-200">
                                                <td className="py-3">{r.date}</td>
                                                <td className="py-3">
                                                    <div>{r.rateName}</div>
                                                    <div className="text-[10px] text-slate-500">{r.location}</div>
                                                </td>
                                                <td className="py-3 text-right">¥{r.unitPrice}</td>
                                                <td className="py-3 text-right">{r.delivered}</td>
                                                <td className="py-3 text-right font-bold">
                                                    ¥{(r.delivered * r.unitPrice + r.allowance).toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="border-t-2 border-slate-800">
                                            <td colSpan={4} className="py-4 text-right font-black">合計 (税抜)</td>
                                            <td className="py-4 text-right font-black text-lg">¥{summary.totalSales.toLocaleString()}</td>
                                        </tr>
                                    </tfoot>
                                </table>

                                <div className="text-xs text-slate-400 mt-12 text-center">
                                    Powered by 報個くん
                                </div>
                            </div>
                        </div>

                        {expandedDriverId === summary.driverId && (
                            <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-slate-500 font-bold border-b dark:border-slate-700 text-left">
                                            <th className="pb-2">日付</th>
                                            <th className="pb-2">業務</th>
                                            <th className="pb-2 text-right">単価</th>
                                            <th className="pb-2 text-right">配完</th>
                                            <th className="pb-2 text-right">売上</th>
                                            <th className="pb-2 text-center">状態</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y dark:divide-slate-700">
                                        {summary.reports.map((r) => (
                                            <tr key={r.id}>
                                                <td className="py-2 font-mono text-slate-600 dark:text-slate-300">{r.date}</td>
                                                <td className="py-2 text-slate-800 dark:text-white">{r.rateName}</td>
                                                <td className="py-2 text-right text-slate-500">¥{r.unitPrice}</td>
                                                <td className="py-2 text-right font-bold">{r.delivered}</td>
                                                <td className="py-2 text-right font-black">¥{(r.delivered * r.unitPrice + r.allowance).toLocaleString()}</td>
                                                <td className="py-2 text-center">
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${r.isApproved ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`}>
                                                        {r.isApproved ? "承認済" : "未承認"}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </Card>
                ))}

                {summaries.length === 0 && !loading && (
                    <div className="py-12 text-center text-slate-400 font-bold">
                        データがありません。
                    </div>
                )}
            </div>
        </div>
    );
}
