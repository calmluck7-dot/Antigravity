"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/infra/firebase";
import { logout } from "@/infra/auth";

type AuthContextType = {
    user: User | null;
    role: string | null;
    loading: boolean;
    logoutLocal: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    role: null,
    loading: true,
    logoutLocal: async () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // LocalStorageの古いモックフラグを削除（旧バージョンとの互換性のため）
        localStorage.removeItem("isLocalAdmin");
        localStorage.removeItem("isLocalDev");

        // Firebaseの実際の認証状態を監視
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);
            if (firebaseUser) {
                try {
                    // Custom Claimsからロールを取得（常に最新のトークンで）
                    const tokenResult = await firebaseUser.getIdTokenResult(true);
                    setRole(tokenResult.claims.role as string || null);
                } catch (e) {
                    console.error("Failed to get role", e);
                    setRole(null);
                }
            } else {
                setRole(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const logoutLocal = async () => {
        await logout();
        window.location.href = "/login";
    };

    return (
        <AuthContext.Provider value={{ user, role, loading, logoutLocal } as any}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext) as AuthContextType & { loginAsLocalAdmin: () => void, loginAsLocalDeveloper: () => void, logoutLocal: () => void };
