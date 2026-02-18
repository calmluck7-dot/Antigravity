"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDailyReports } from "@/ui/hooks/useDailyReports";
import { Button } from "@/ui/components/Button";
import { Card } from "@/ui/components/Card";
import { ArrowLeft, CheckCircle, Clock } from "lucide-react";

export default function HistoryPage() {
    const router = useRouter();
    const { reports, fetchDriverReports, loading } = useDailyReports();

    useEffect(() => {
        fetchDriverReports();
    }, [fetchDriverReports]);

    if (loading && reports.length === 0) return <div className="p-8 text-center font-bold">読み込み中...</div>;

    return (
        <div className="space-y-6 pb-20">
            <Button onClick={() => router.push("/driver/dashboard")} variant="outline" className="w-full text-lg border-2">
                <ArrowLeft className="mr-2 w-5 h-5" /> メニューに戻る
            </Button>

            <div className="space-y-4">
                {reports.map((report) => {
                    const earnings = report.delivered * report.unitPrice + report.allowance;
                    return (
                        <Card key={report.id} className="p-5 border-l-8 border-l-orange-500 relative overflow-hidden shadow-md">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <div className="font-black text-xl text-slate-800 dark:text-white flex items-center gap-2">
                                        {report.date}
                                    </div>
                                    <div className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">
                                        {report.location} / {report.rateName}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-black text-slate-800 dark:text-white tracking-tighter">
                                        ¥{earnings.toLocaleString()}
                                    </div>
                                    <div className="text-xs font-bold text-slate-400">
                                        {report.delivered}個 (単価 ¥{report.unitPrice})
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                                <div className="text-xs text-slate-500 font-bold bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                                    {report.remarks || "備考なし"}
                                </div>
                                {report.isApproved ? (
                                    <span className="bg-emerald-100 text-emerald-700 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3" /> 承認済
                                    </span>
                                ) : (
                                    <span className="bg-slate-100 text-slate-500 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> 申請中
                                    </span>
                                )}
                            </div>
                        </Card>
                    );
                })}

                {reports.length === 0 && !loading && (
                    <div className="py-12 text-center text-slate-400 font-bold border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                        履歴はまだありません。
                    </div>
                )}
            </div>
        </div>
    );
}
