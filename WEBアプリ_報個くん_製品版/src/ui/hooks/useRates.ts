import { useState, useEffect } from "react";
import {
    collection,
    query,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp
} from "firebase/firestore";
import { db } from "@/infra/firebase";
import { RateTable } from "@/domain/entities";
import { useAuth } from "@/ui/components/AuthProvider";

export const useRates = () => {
    const { user } = useAuth();
    const [rates, setRates] = useState<RateTable[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRates = async () => {
        if (!user) return;

        // Mock Data
        if (user.uid === "local-admin") {
            setRates([
                { id: "rate-1", name: "通常配送", unitPrice: 160, description: "基本単価", companyId: "local", isActive: true, createdAt: new Date() },
                { id: "rate-2", name: "スポット", unitPrice: 180, description: "繁忙期", companyId: "local", isActive: true, createdAt: new Date() },
            ]);
            setLoading(false);
            return;
        }

        const idToken = await user.getIdTokenResult();
        const companyId = idToken.claims.companyId as string;

        if (!companyId) return;

        try {
            const q = query(
                collection(db, "companies", companyId, "rateTables")
            );

            const querySnapshot = await getDocs(q);
            const data: RateTable[] = querySnapshot.docs.map(d => ({
                id: d.id,
                ...d.data()
            } as RateTable));

            setRates(data);
        } catch (err: any) {
            console.error(err);
            // Fallback
            setRates([
                { id: "rate-1", name: "通常配送 (Mock)", unitPrice: 160, description: "基本単価", companyId: "mock", isActive: true, createdAt: new Date() },
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRates();
    }, [user]);

    const addRateTable = async (name: string, unitPrice: number, description?: string) => {
        if (user?.uid === "local-admin") {
            alert("ローカル管理者モード: 単価を追加しました(SIMULATION)");
            setRates([...rates, { id: `rate-${Date.now()}`, name, unitPrice, description, companyId: "local", isActive: true, createdAt: new Date() }]);
            return "mock-id";
        }
        if (!user) return;
        const idToken = await user.getIdTokenResult();
        const companyId = idToken.claims.companyId as string;

        const docRef = await addDoc(collection(db, "companies", companyId, "rateTables"), {
            name,
            unitPrice: Number(unitPrice),
            description: description || "",
            companyId,
            isActive: true,
            createdAt: serverTimestamp(),
        });

        await fetchRates();
        return docRef.id;
    };

    const deleteRateTable = async (id: string) => {
        if (user?.uid === "local-admin") {
            setRates(rates.filter(r => r.id !== id));
            return;
        }
        if (!user) return;
        const idToken = await user.getIdTokenResult();
        const companyId = idToken.claims.companyId as string;

        await deleteDoc(doc(db, "companies", companyId, "rateTables", id));
        await fetchRates();
    };

    return { rates, loading, error, addRateTable, deleteRateTable };
};
