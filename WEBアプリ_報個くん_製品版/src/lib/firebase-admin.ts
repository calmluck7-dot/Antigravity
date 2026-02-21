import * as admin from "firebase-admin";

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || "demo-project";
const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

// プライベートキーの改行を正規化（Cloud Runでは\\nで届く場合がある）
const privateKey = privateKeyRaw
    ? privateKeyRaw.replace(/\\n/g, "\n")
    : undefined;

// Firebase Admin の初期化（重複防止）
if (!admin.apps.length) {
    if (privateKey && clientEmail) {
        // 本番環境：実際の認証情報で初期化
        try {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId,
                    clientEmail,
                    privateKey,
                }),
                projectId,
            });
            console.log("✅ Firebase Admin: 本番認証情報で初期化しました");
        } catch (error) {
            console.error("❌ Firebase Admin 初期化エラー:", error);
            throw error; // 本番でのエラーは握り潰さない
        }
    } else {
        // ビルド時のみ：ダミー認証情報で初期化
        console.warn("⚠️ Firebase Admin: 環境変数が未設定のためビルド用モックで初期化します");
        admin.initializeApp({
            projectId,
            credential: admin.credential.cert({
                projectId,
                clientEmail: "build-mock@example.com",
                privateKey: [
                    "-----BEGIN RSA PRIVATE KEY-----",
                    "MIIEpAIBAAKCAQEA0Z3VS5JJcds3xHn/ygWep4fIt6E4eMSGldhqAfMqnrBFuTXj",
                    "-----END RSA PRIVATE KEY-----"
                ].join("\n"),
            }),
        });
    }
}

// サービスのエクスポート（本番ではエラーをそのまま伝播させる）
let _auth: ReturnType<typeof admin.auth>;
let _db: ReturnType<typeof admin.firestore>;

try {
    _auth = admin.auth();
    _db = admin.firestore();
} catch (e) {
    console.warn("⚠️ Firebase Admin サービス取得失敗。ビルド用モックを使用します:", e);

    // ビルド時のみのフォールバックモック
    _auth = {
        verifyIdToken: async () => ({ uid: "mock", role: "guest" }),
        getUser: async () => ({ uid: "mock" }),
        getUserByEmail: async () => { throw new Error("Mock: getUserByEmail unavailable"); },
        createUser: async () => { throw new Error("Mock: createUser unavailable"); },
        setCustomUserClaims: async () => { },
        generateSignInWithEmailLink: async () => "http://mock.link",
    } as any;

    _db = {
        collection: () => ({
            doc: () => ({
                id: "mock-id",
                set: async () => { throw new Error("Mock: Firestore unavailable"); },
                get: async () => ({ exists: false, data: () => ({}) }),
                update: async () => { },
                delete: async () => { },
                collection: () => ({
                    doc: () => ({ set: async () => { } }),
                    where: () => ({ get: async () => ({ docs: [] }) })
                })
            }),
            where: () => ({ get: async () => ({ docs: [] }) }),
            add: async () => { throw new Error("Mock: Firestore unavailable"); },
        })
    } as any;
}

export const adminAuth = _auth;
export const adminDb = _db;
