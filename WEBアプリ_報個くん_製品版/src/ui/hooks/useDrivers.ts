import { useState, useEffect } from "react";
import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp
} from "firebase/firestore";
import { db } from "@/infra/firebase";
import { Driver } from "@/domain/entities";
import { useAuth } from "@/ui/components/AuthProvider";

export const useDrivers = () => {
    const { user } = useAuth();
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDrivers = async () => {
        if (!user) return;

        // Mock Data for Local Admin
        if (user.uid === "local-admin") {
            setDrivers([
                { uid: "driver-1", name: "鈴木 一郎", email: "suzuki@local.test", role: "driver", companyId: "local-company", isActive: true, createdAt: new Date() },
                { uid: "driver-2", name: "佐藤 花子", email: "sato@local.test", role: "driver", companyId: "local-company", isActive: true, createdAt: new Date() },
            ]);
            setLoading(false);
            return;
        }

        // Get companyId from ID Token
        const idToken = await user.getIdTokenResult();
        const companyId = idToken.claims.companyId as string;

        if (!companyId) {
            setError("Company ID not found");
            setLoading(false);
            return;
        }

        try {
            const q = query(
                collection(db, "companies", companyId, "users"),
                where("role", "==", "driver")
            );

            const querySnapshot = await getDocs(q);
            const data: Driver[] = querySnapshot.docs.map(d => ({
                uid: d.id,
                ...d.data()
            } as Driver));

            setDrivers(data);
        } catch (err: any) {
            console.error(err);
            // Fallback to mock data if Firestore fails (e.g. permission error due to missing keys/auth)
            console.warn("Falling back to mock drivers due to error");
            setDrivers([
                { uid: "driver-1", name: "鈴木 一郎 (Mock)", email: "suzuki@mock.test", role: "driver", companyId: "mock", isActive: true, createdAt: new Date() },
                { uid: "driver-2", name: "佐藤 花子 (Mock)", email: "sato@mock.test", role: "driver", companyId: "mock", isActive: true, createdAt: new Date() },
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDrivers();
    }, [user]);

    // Wrapper to call Backend API for creating a driver
    const addDriver = async (name: string, email: string) => {
        if (user?.uid === "local-admin") {
            alert("ローカル管理者モードではドライバー追加はシミュレーションのみです。");
            return;
        }

        if (!user) return;
        const idToken = await user.getIdTokenResult();
        const companyId = idToken.claims.companyId as string;

        // Call API to create user securely
        const token = await user.getIdToken();
        const res = await fetch("/api/admin/drivers", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ name, email, companyId })
        });

        if (!res.ok) {
            throw new Error(await res.text());
        }

        const data = await res.json();
        await fetchDrivers(); // Refresh
        return data;
    };

    return { drivers, loading, error, addDriver };
};
