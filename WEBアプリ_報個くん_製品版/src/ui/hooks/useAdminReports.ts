import { useState, useCallback } from "react";
import {
    collection,
    query,
    getDocs,
    orderBy,
    updateDoc,
    doc
} from "firebase/firestore";
import { db } from "@/infra/firebase";
import { DailyReport } from "@/domain/entities";
import { useAuth } from "@/ui/components/AuthProvider";

export const useAdminReports = () => {
    const { user } = useAuth();
    const [reports, setReports] = useState<DailyReport[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAllReports = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const idToken = await user.getIdTokenResult();
            const companyId = idToken.claims.companyId as string;
            if (!companyId) return;

            const q = query(
                collection(db, "companies", companyId, "dailyReports"),
                orderBy("date", "desc")
            );

            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as DailyReport));
            setReports(data);
        } catch (err: any) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user]);

    const toggleApproval = async (reportId: string, currentStatus: boolean) => {
        if (!user) return;
        const idToken = await user.getIdTokenResult();
        const companyId = idToken.claims.companyId as string;

        try {
            await updateDoc(doc(db, "companies", companyId, "dailyReports", reportId), {
                isApproved: !currentStatus
            });
            // Optimistic update or refresh
            await fetchAllReports();
        } catch (err: any) {
            console.error(err);
            alert("更新失敗: " + err.message);
        }
    };

    return { reports, fetchAllReports, toggleApproval, loading, error };
};
