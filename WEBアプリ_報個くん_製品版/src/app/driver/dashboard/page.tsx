"use client";

import { useAuth } from "@/ui/components/AuthProvider";
import { Button } from "@/ui/components/Button";
import { useRouter } from "next/navigation";
import { FileText, Calendar, ShoppingBag, ClipboardCheck, User, Bell } from "lucide-react";

export default function DriverDashboard() {
    const { user } = useAuth();
    const router = useRouter();

    return (
        <div className="space-y-6 pb-20">
            {/* Header / User Info */}
            <div className="bg-orange-50 dark:bg-orange-900/10 p-6 rounded-2xl border border-orange-100 dark:border-orange-900/30 flex justify-between items-center shadow-sm">
                <div>
                    <span className="text-xs font-black text-orange-400 block tracking-widest uppercase">
                        Driver
                    </span>
                    <h2 className="font-black text-2xl text-slate-800 dark:text-white mt-1">
                        {user?.displayName || "ドライバー"} 様
                    </h2>
                </div>
                <div className="w-14 h-14 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-800 dark:text-slate-200 shadow-inner border border-slate-100 dark:border-slate-600">
                    <User className="w-8 h-8" />
                </div>
            </div>

            {/* Notifications (Placeholder) */}
            {/* 
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-5 rounded-xl border-l-4 border-yellow-400 shadow-sm">
                <div className="font-black text-yellow-800 dark:text-yellow-400 mb-2 flex items-center gap-2 text-lg">
                    <Bell className="w-5 h-5" /> Important
                </div>
                <div className="text-base text-yellow-900 dark:text-yellow-200 font-bold leading-relaxed">
                    年末年始の稼働についてお知らせがあります。掲示板をご確認ください。
                </div>
            </div> 
            */}

            {/* Main Menu Grid */}
            <div className="grid gap-5">
                <Button
                    onClick={() => router.push("/driver/report")}
                    className="h-32 text-3xl font-black shadow-lg flex items-center justify-center gap-4 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl"
                >
                    <FileText className="w-10 h-10" />
                    日報入力
                </Button>

                <div className="grid grid-cols-2 gap-5">
                    <Button
                        variant="secondary"
                        onClick={() => router.push("/driver/schedule")} // Future implement
                        className="h-28 flex-col text-lg font-black bg-slate-700 hover:bg-slate-800 text-white rounded-2xl gap-2 cursor-not-allowed opacity-60"
                        title="近日公開"
                    >
                        <Calendar className="w-8 h-8" />
                        スケジュール
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => router.push("/driver/offers")} // Future implement
                        className="h-28 flex-col text-lg font-black bg-white hover:bg-slate-50 text-slate-600 rounded-2xl gap-2 border-slate-200 cursor-not-allowed opacity-60"
                        title="近日公開"
                    >
                        <ShoppingBag className="w-8 h-8" />
                        オファー
                    </Button>
                </div>

                <Button
                    variant="outline"
                    onClick={() => router.push("/driver/history")}
                    className="h-24 text-xl font-black bg-white hover:bg-slate-50 text-slate-600 rounded-2xl gap-3 border-slate-200 shadow-sm"
                >
                    <ClipboardCheck className="w-7 h-7" />
                    履歴確認・報酬
                </Button>
            </div>
        </div>
    );
}
