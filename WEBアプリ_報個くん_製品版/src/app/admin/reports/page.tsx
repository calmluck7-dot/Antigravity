"use client";

import { useEffect, useState } from "react";
import { useAdminReports } from "@/ui/hooks/useAdminReports";
import { useDrivers } from "@/ui/hooks/useDrivers";
import { useAuth } from "@/ui/components/AuthProvider";
import { Button } from "@/ui/components/Button";
import { Card } from "@/ui/components/Card";
import { FileText, CheckCircle, XCircle, Search } from "lucide-react";

export default function AdminReportsPage() {
    const { reports, fetchAllReports, toggleApproval, loading } = useAdminReports();
    const { drivers } = useDrivers(); // To map driverId to Name
    const { role } = useAuth();

    const [driverMap, setDriverMap] = useState<Record<string, string>>({});

    useEffect(() => {
        fetchAllReports();
    }, [fetchAllReports]);

    useEffect(() => {
        if (drivers.length > 0) {
            const map: Record<string, string> = {};
            drivers.forEach(d => { map[d.uid] = d.name; });
            setDriverMap(map);
        }
    }, [drivers]);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                        <FileText className="w-8 h-8 text-indigo-600" />
                        日報承認
                    </h1>
                    <p className="text-slate-500 font-bold">ドライバーからの日報を確認・承認</p>
                </div>
                {/* Future: Date Filter / CSV Export */}
            </div>

            <div className="space-y-4">
                {reports.map((report) => {
                    const driverName = driverMap[report.driverId] || "不明なドライバー";
                    const earnings = report.delivered * report.unitPrice + report.allowance;

                    return (
                        <Card key={report.id} className={`p-4 border-l-4 ${report.isApproved ? "border-l-emerald-500" : "border-l-slate-300"}`}>
                            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-mono text-sm font-bold text-slate-500">{report.date}</span>
                                        <span className="font-black text-lg text-slate-800 dark:text-white">{driverName}</span>
                                    </div>
                                    <div className="text-sm text-slate-600 dark:text-slate-300">
                                        <span className="font-bold">{report.location}</span>
                                        <span className="mx-2 text-slate-300">|</span>
                                        {report.rateName} (@{report.unitPrice})
                                    </div>
                                    {report.remarks && (
                                        <div className="mt-2 text-xs bg-slate-100 dark:bg-slate-700 p-2 rounded inline-block">
                                            {report.remarks}
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-6 justify-between md:justify-end">
                                    <div className="text-right">
                                        <div className="text-xl font-black text-slate-800 dark:text-white">
                                            {report.delivered} <span className="text-sm font-normal">個</span>
                                        </div>
                                        <div className="text-xs font-bold text-slate-500">
                                            ¥{earnings.toLocaleString()}
                                        </div>
                                    </div>

                                    {role !== "developer" ? (
                                        <Button
                                            onClick={() => toggleApproval(report.id, report.isApproved)}
                                            variant={report.isApproved ? "success" : "secondary"}
                                            className={`w-32 ${report.isApproved ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : ""}`}
                                        >
                                            {report.isApproved ? (
                                                <>
                                                    <CheckCircle className="w-4 h-4 mr-1" /> 承認済
                                                </>
                                            ) : (
                                                <>
                                                    <div className="w-2 h-2 bg-slate-400 rounded-full mr-2" /> 未承認
                                                </>
                                            )}
                                        </Button>
                                    ) : (
                                        <div className={`px-4 py-2 rounded-lg font-bold text-sm ${report.isApproved ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>
                                            {report.isApproved ? "承認済" : "未承認"}
                                            <span className="block text-xs font-normal opacity-70">(閲覧のみ)</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    );
                })}

                {reports.length === 0 && (
                    <div className="text-center py-12 text-slate-400 font-bold">
                        日報はまだありません。
                    </div>
                )}
            </div>
        </div>
    );
}
