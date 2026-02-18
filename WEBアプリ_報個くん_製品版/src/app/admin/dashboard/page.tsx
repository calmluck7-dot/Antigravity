import { Card } from "@/ui/components/Card";
import { Users, FileText, TrendingUp, AlertCircle } from "lucide-react";

export default function AdminDashboard() {
    const stats = [
        { label: "今月の売上 (概算)", value: "¥1,204,000", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-100 dark:bg-emerald-900/20" },
        { label: "稼働ドライバー", value: "12 名", icon: Users, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/20" },
        { label: "未承認の日報", value: "5 件", icon: AlertCircle, color: "text-orange-500", bg: "bg-orange-100 dark:bg-orange-900/20" },
        { label: "今月の総個数", value: "8,450 個", icon: FileText, color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-900/20" },
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-black text-slate-800 dark:text-white">ダッシュボード</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <Card key={i} className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                            <p className="text-2xl font-black text-slate-800 dark:text-white mt-1">{stat.value}</p>
                        </div>
                        <div className={`p-3 rounded-full ${stat.bg}`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6 h-64 flex items-center justify-center border-dashed border-2">
                    <p className="text-slate-400 font-bold">売上推移グラフ (Coming Soon)</p>
                </Card>
                <Card className="p-6 h-64 flex items-center justify-center border-dashed border-2">
                    <p className="text-slate-400 font-bold">ドライバー稼働状況 (Coming Soon)</p>
                </Card>
            </div>
        </div>
    );
}
