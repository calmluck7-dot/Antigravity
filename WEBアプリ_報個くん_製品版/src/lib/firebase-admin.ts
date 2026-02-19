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
        // Mock initialization for build phase with dummy credentials to prevent ADC lookup failure
        admin.initializeApp({
            projectId,
            credential: admin.credential.cert({
                projectId,
                clientEmail: "build-mock@example.com",
                // Minimal valid-looking private key to pass validation
                privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQD0...mock...Key\n-----END PRIVATE KEY-----",
            }),
        });
    }
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
