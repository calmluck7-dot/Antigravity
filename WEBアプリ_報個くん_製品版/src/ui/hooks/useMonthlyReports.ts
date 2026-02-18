import { useState, useCallback } from "react";
import {
    collection,
    query,
    where,
    getDocs,
    orderBy
} from "firebase/firestore";
import { db } from "@/infra/firebase";
import { DailyReport } from "@/domain/entities";
import { useAuth } from "@/ui/components/AuthProvider";

export interface DriverMonthlySummary {
    driverId: string;
    driverName: string; // We need to join with driver list or store snapshot
    totalDelivered: number;
    totalSales: number;
    approvedCount: number;
    pendingCount: number;
    reports: DailyReport[];
}

export const useMonthlyReports = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchMonthlySummary = useCallback(async (yearMonth: string, driverMap: Record<string, string>) => {
        if (!user) return [];
        setLoading(true);
        setError(null);

        try {
            const idToken = await user.getIdTokenResult();
            const companyId = idToken.claims.companyId as string;
            if (!companyId) return [];

            // Build date range for the month
            const start = `${yearMonth}-01`;
            // easy way to get end of month:
            const [y, m] = yearMonth.split("-").map(Number);
            const nextMonth = new Date(y, m, 1);
            const end = nextMonth.toISOString().split("T")[0]; // First day of next month (exclusive in logic usually, but here string compare)
            // Actually string comparison works: "2023-10-01" <= date <= "2023-10-31"
            // Let's rely on string prefix or range query.

            const q = query(
                collection(db, "companies", companyId, "dailyReports"),
                where("date", ">=", start),
                where("date", "<", end),
                orderBy("date", "asc")
            );

            const snapshot = await getDocs(q);
            const reports = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as DailyReport));

            // Group by Driver
            const summaryMap: Record<string, DriverMonthlySummary> = {};

            reports.forEach(r => {
                if (!summaryMap[r.driverId]) {
                    summaryMap[r.driverId] = {
                        driverId: r.driverId,
                        driverName: driverMap[r.driverId] || "Unknown",
                        totalDelivered: 0,
                        totalSales: 0,
                        approvedCount: 0,
                        pendingCount: 0,
                        reports: []
                    };
                }
                const summary = summaryMap[r.driverId];
                summary.reports.push(r);
                summary.totalDelivered += r.delivered;
                const earnings = r.delivered * r.unitPrice + r.allowance;
                summary.totalSales += earnings;

                if (r.isApproved) {
                    summary.approvedCount++;
                } else {
                    summary.pendingCount++;
                }
            });

            return Object.values(summaryMap);

        } catch (err: any) {
            console.error(err);
            setError(err.message);
            return [];
        } finally {
            setLoading(false);
        }
    }, [user]);

    return { fetchMonthlySummary, loading, error };
};
