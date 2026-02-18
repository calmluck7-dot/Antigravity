import { useState, useCallback } from "react";
import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    orderBy,
    serverTimestamp
} from "firebase/firestore";
import { db } from "@/infra/firebase";
import { DailyReport } from "@/domain/entities";
import { useAuth } from "@/ui/components/AuthProvider";

export const useDailyReports = () => {
    const { user } = useAuth();
    const [reports, setReports] = useState<DailyReport[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchDriverReports = useCallback(async () => {
        if (!user) return;
        setLoading(true);

        // Mock Data for Local Admin (or if viewing as admin in general)
        if (user.uid === "local-admin") {
            setReports([
                { id: "report-1", driverId: "driver-1", date: "2024-02-18", location: "東京エリア", rateId: "rate-1", rateName: "通常配送", unitPrice: 160, pickedUp: 100, returned: 2, delivered: 98, allowance: 0, remarks: "", isApproved: false, companyId: "local", createdAt: new Date() },
                { id: "report-2", driverId: "driver-1", date: "2024-02-17", location: "東京エリア", rateId: "rate-1", rateName: "通常配送", unitPrice: 160, pickedUp: 120, returned: 0, delivered: 120, allowance: 500, remarks: "高速代", isApproved: true, companyId: "local", createdAt: new Date() },
            ]);
            setLoading(false);
            return;
        }

        try {
            const idToken = await user.getIdTokenResult();
            const companyId = idToken.claims.companyId as string;
            if (!companyId) return;

            const q = query(
                collection(db, "companies", companyId, "dailyReports"),
                where("driverId", "==", user.uid),
                orderBy("date", "desc")
            );

            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as DailyReport));
            setReports(data);
        } catch (err: any) {
            console.error(err);
            // Fallback
            setReports([
                { id: "report-1-mock", driverId: "mock", date: "2024-02-18", location: "東京エリア(Mock)", rateId: "rate-1", rateName: "通常配送", unitPrice: 160, pickedUp: 100, returned: 2, delivered: 98, allowance: 0, remarks: "", isApproved: false, companyId: "mock", createdAt: new Date() },
            ]);
        } finally {
            setLoading(false);
        }
    }, [user]);

    const addReport = async (
        date: string,
        location: string,
        rateId: string,
        rateName: string,
        unitPrice: number,
        pickedUp: number,
        returned: number,
        allowance: number,
        remarks: string
    ) => {
        if (!user) return;
        setLoading(true);
        setError(null);

        try {
            const idToken = await user.getIdTokenResult();
            const companyId = idToken.claims.companyId as string;

            if (!companyId) throw new Error("Company ID missing");

            const delivered = pickedUp - returned;

            await addDoc(collection(db, "companies", companyId, "dailyReports"), {
                driverId: user.uid,
                date,
                location,
                rateId,
                rateName,
                unitPrice,
                pickedUp,
                returned,
                delivered,
                allowance,
                remarks,
                isApproved: false,
                companyId,
                createdAt: serverTimestamp(),
            });

        } catch (err: any) {
            console.error(err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { reports, fetchDriverReports, addReport, loading, error };
};
