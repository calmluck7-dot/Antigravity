import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import Stripe from "stripe";




export async function POST(req: Request) {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === "checkout.session.completed") {
        const companyName = session.metadata?.companyName;
        const purchaserEmail = session.customer_details?.email || session.metadata?.purchaserEmail;

        if (!companyName || !purchaserEmail) {
            return new NextResponse("Missing metadata", { status: 400 });
        }

        try {
            // 1. Create Company
            const companyRef = adminDb.collection("companies").doc();
            await companyRef.set({
                name: companyName,
                plan: "buyout", // Or from metadata
                stripeCustomerId: session.customer,
                stripeSubscriptionId: session.subscription,
                createdAt: new Date(),
            });

            const companyId = companyRef.id;

            // 2. Create/Get User
            let userRecord;
            try {
                userRecord = await adminAuth.getUserByEmail(purchaserEmail);
            } catch (e) {
                // User doesn't exist, create new
                userRecord = await adminAuth.createUser({
                    email: purchaserEmail,
                    emailVerified: true,
                    displayName: "Admin",
                });
            }

            // 3. Set Custom Claims (Role & CompanyId)
            await adminAuth.setCustomUserClaims(userRecord.uid, {
                companyId: companyId,
                role: "admin",
            });

            // 4. Create User Record in Firestore
            await companyRef.collection("users").doc(userRecord.uid).set({
                name: "管理者",
                email: purchaserEmail,
                role: "admin",
                createdAt: new Date(),
            });

            // Googleログインでアクセスするため、メールリンクの生成は不要
            console.log(`[Stripe Webhook] 企業 "${companyName}" (${companyId}) を作成しました。管理者: ${purchaserEmail}`);

        } catch (error: any) {
            console.error("Error in webhook processing:", error);
            return new NextResponse(`Server Error: ${error.message}`, { status: 500 });
        }
    }

    return new NextResponse(null, { status: 200 });
}
