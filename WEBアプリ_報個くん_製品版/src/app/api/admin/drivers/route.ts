import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";




export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get("Authorization");
        const token = authHeader?.split("Bearer ")[1];

        if (!token) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Verify Admin Token
        const decodedToken = await adminAuth.verifyIdToken(token);
        if (decodedToken.role !== "admin" && decodedToken.role !== "developer") {
            return new NextResponse("Forbidden", { status: 403 });
        }

        const { name, email, companyId } = await req.json();

        // Ensure the admin is creating for their own company (unless developer)
        if (decodedToken.role === "admin" && decodedToken.companyId !== companyId) {
            return new NextResponse("Forbidden: Company Mismatch", { status: 403 });
        }

        // 1. Create Auth User
        let userRecord;
        try {
            userRecord = await adminAuth.getUserByEmail(email);
            // If user exists, we might want to check if they are already in another company?
            // For now, assume exclusive. Or maybe just update claims.
            // Let's just error if exists for safety in MVP.
            return new NextResponse("User already exists", { status: 400 });
        } catch (e) {
            // Create new
            userRecord = await adminAuth.createUser({
                email,
                emailVerified: true,
                displayName: name,
            });
        }

        // 2. Set Claims
        await adminAuth.setCustomUserClaims(userRecord.uid, {
            role: "driver",
            companyId
        });

        // 3. Create Firestore Record
        await adminDb.collection("companies").doc(companyId).collection("users").doc(userRecord.uid).set({
            name,
            email,
            role: "driver",
            isActive: true,
            createdAt: new Date(),
        });

        // 4. Generate Invite Link (Passwordless)
        const actionCodeSettings = {
            url: `${process.env.NEXT_PUBLIC_APP_URL}/login?companyId=${companyId}`, // Login page handles logic
            handleCodeInApp: true,
        };
        const link = await adminAuth.generateSignInWithEmailLink(email, actionCodeSettings);

        return NextResponse.json({ success: true, link });

    } catch (error: any) {
        console.error(error);
        return new NextResponse(error.message, { status: 500 });
    }
}
