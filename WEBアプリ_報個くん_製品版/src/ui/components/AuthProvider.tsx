"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/infra/firebase";

type AuthContextType = {
    user: User | null;
    role: string | null;
    loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    role: null,
    loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for local admin/dev flag
        const isLocalAdmin = localStorage.getItem("isLocalAdmin");
        const isLocalDev = localStorage.getItem("isLocalDev");

        if (isLocalAdmin === "true") {
            setLoading(false);
            const mockUser = {
                uid: "local-admin",
                email: "admin@local.test",
                displayName: "Local Admin",
                emailVerified: true,
                isAnonymous: false,
                metadata: {},
                providerData: [],
                refreshToken: "",
                tenantId: null,
                delete: async () => { },
                getIdToken: async () => "mock-token",
                getIdTokenResult: async () => ({
                    authTime: new Date().toISOString(),
                    expirationTime: new Date().toISOString(),
                    issuedAtTime: new Date().toISOString(),
                    signInProvider: "custom",
                    signInSecondFactor: null,
                    token: "mock-token",
                    claims: { role: "admin", companyId: "local-company" }
                }),
                reload: async () => { },
                toJSON: () => ({}),
                phoneNumber: null,
                photoURL: null,
            } as unknown as User;
            setUser(mockUser);
            setRole("admin");
            return;
        }

        if (isLocalDev === "true") {
            setLoading(false);
            const mockUser = {
                uid: "local-dev",
                email: "dev@local.test",
                displayName: "Local Developer",
                emailVerified: true,
                isAnonymous: false,
                metadata: {},
                providerData: [],
                refreshToken: "",
                tenantId: null,
                delete: async () => { },
                getIdToken: async () => "mock-token",
                getIdTokenResult: async () => ({
                    authTime: new Date().toISOString(),
                    expirationTime: new Date().toISOString(),
                    issuedAtTime: new Date().toISOString(),
                    signInProvider: "custom",
                    signInSecondFactor: null,
                    token: "mock-token",
                    claims: { role: "developer" }
                }),
                reload: async () => { },
                toJSON: () => ({}),
                phoneNumber: null,
                photoURL: null,
            } as unknown as User;
            setUser(mockUser);
            setRole("developer");
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user);
            if (user) {
                try {
                    const tokenResult = await user.getIdTokenResult();
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

    const loginAsLocalAdmin = () => {
        localStorage.setItem("isLocalAdmin", "true");
        localStorage.removeItem("isLocalDev"); // Clear dev flag
        setLoading(false);
        const mockUser = {
            uid: "local-admin",
            email: "admin@local.test",
            displayName: "Local Admin",
            emailVerified: true,
            isAnonymous: false,
            metadata: {},
            providerData: [],
            refreshToken: "",
            tenantId: null,
            delete: async () => { },
            getIdToken: async () => "mock-token",
            getIdTokenResult: async () => ({
                authTime: new Date().toISOString(),
                expirationTime: new Date().toISOString(),
                issuedAtTime: new Date().toISOString(),
                signInProvider: "custom",
                signInSecondFactor: null,
                token: "mock-token",
                claims: { role: "admin", companyId: "local-company" }
            }),
            reload: async () => { },
            toJSON: () => ({}),
            phoneNumber: null,
            photoURL: null,
        } as unknown as User;
        setUser(mockUser);
        setRole("admin");
    };

    const loginAsLocalDeveloper = () => {
        localStorage.setItem("isLocalDev", "true");
        localStorage.removeItem("isLocalAdmin"); // Clear admin flag
        setLoading(false);
        const mockUser = {
            uid: "local-dev",
            email: "dev@local.test",
            displayName: "Local Developer",
            emailVerified: true,
            isAnonymous: false,
            metadata: {},
            providerData: [],
            refreshToken: "",
            tenantId: null,
            delete: async () => { },
            getIdToken: async () => "mock-token",
            getIdTokenResult: async () => ({
                authTime: new Date().toISOString(),
                expirationTime: new Date().toISOString(),
                issuedAtTime: new Date().toISOString(),
                signInProvider: "custom",
                signInSecondFactor: null,
                token: "mock-token",
                claims: { role: "developer" }
            }),
            reload: async () => { },
            toJSON: () => ({}),
            phoneNumber: null,
            photoURL: null,
        } as unknown as User;
        setUser(mockUser);
        setRole("developer");
    };

    const logoutLocal = async () => {
        localStorage.removeItem("isLocalAdmin");
        localStorage.removeItem("isLocalDev");
        await auth.signOut();
        setRole(null);
        window.location.href = "/login";
    };

    return (
        <AuthContext.Provider value={{ user, role, loading, loginAsLocalAdmin, loginAsLocalDeveloper, logoutLocal } as any}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext) as AuthContextType & { loginAsLocalAdmin: () => void, loginAsLocalDeveloper: () => void, logoutLocal: () => void };

