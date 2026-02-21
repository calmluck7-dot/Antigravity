import * as admin from "firebase-admin";

let initialized = false;

function initializeFirebaseAdmin() {
    if (admin.apps.length > 0) {
        initialized = true;
        return;
    }

    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;

    // 方法1: JSON全体をBase64で環境変数に入れる（最も確実）
    if (process.env.FIREBASE_SERVICE_ACCOUNT_B64) {
        try {
            const json = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_B64, "base64").toString("utf8"));
            admin.initializeApp({
                credential: admin.credential.cert(json),
                projectId: json.project_id || projectId,
            });
            console.log("✅ Firebase Admin: Base64 JSON で初期化しました");
            initialized = true;
            return;
        } catch (e) {
            console.error("❌ Firebase Admin Base64 初期化エラー:", e);
        }
    }

    // 方法2: 個別の環境変数（FIREBASE_PRIVATE_KEY + FIREBASE_CLIENT_EMAIL）
    if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
        try {
            const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n");
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: projectId || "demo-project",
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey,
                }),
                projectId: projectId || "demo-project",
            });
            console.log("✅ Firebase Admin: 個別の環境変数で初期化しました");
            initialized = true;
            return;
        } catch (e) {
            console.error("❌ Firebase Admin 個別変数 初期化エラー:", e);
        }
    }

    // ビルド時フォールバック（モック）
    console.warn("⚠️ Firebase Admin: 認証情報未設定。ビルド用モックで初期化します");
    try {
        admin.initializeApp({
            projectId: projectId || "mock-project-id",
        });
    } catch (e) {
        // 無視
    }
}

initializeFirebaseAdmin();

// サービスのエクスポート
let _auth: ReturnType<typeof admin.auth>;
let _db: ReturnType<typeof admin.firestore>;

try {
    _auth = admin.auth();
    _db = admin.firestore();
} catch (e) {
    console.warn("⚠️ Firebase Admin サービス取得失敗。ビルド用モックを使用します:", e);
    _auth = {
        verifyIdToken: async () => ({ uid: "mock", role: "guest" }),
        getUser: async () => ({ uid: "mock" }),
        getUserByEmail: async () => { throw new Error("Firebase Admin 未設定"); },
        createUser: async () => { throw new Error("Firebase Admin 未設定"); },
        setCustomUserClaims: async () => { },
        generateSignInWithEmailLink: async () => "http://mock.link",
    } as any;

    _db = {
        collection: () => ({
            doc: () => ({
                id: "mock-id",
                set: async () => { throw new Error("Firebase Admin 未設定"); },
                get: async () => ({ exists: false, data: () => ({}) }),
                update: async () => { },
                delete: async () => { },
                collection: () => ({
                    doc: () => ({ set: async () => { } }),
                    where: () => ({ get: async () => ({ docs: [] }) })
                })
            }),
            where: () => ({ get: async () => ({ docs: [] }) }),
            add: async () => { throw new Error("Firebase Admin 未設定"); },
        })
    } as any;
}

export const adminAuth = _auth;
export const adminDb = _db;
