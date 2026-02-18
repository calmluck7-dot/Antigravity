import * as admin from "firebase-admin";

if (!admin.apps.length) {
    const projectId = process.env.FIREBASE_PROJECT_ID || "dummy-project";
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL || "dummy@example.com";
    const privateKey = process.env.FIREBASE_PRIVATE_KEY
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
        : "-----BEGIN PRIVATE KEY-----\nMIIEvQIB ADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQD...dummy\n-----END PRIVATE KEY-----";

    if (process.env.FIREBASE_PRIVATE_KEY) {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId,
                clientEmail,
                privateKey,
            }),
        });
    } else {
        // Mock initialization for build phase
        admin.initializeApp({ projectId });
    }
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
