import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

/**
 * Stripe Checkout Session を作成するAPI
 * POST /api/checkout
 * Body: { companyName: string }
 *
 * 決済完了後、Stripe Webhook が企業作成を自動処理する
 */
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { companyName } = body;

        if (!companyName) {
            return NextResponse.json(
                { error: "企業名は必須です" },
                { status: 400 }
            );
        }

        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

        // Stripe Checkout Session を作成
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "jpy",
                        product_data: {
                            name: "報個くん - 配送報告管理システム",
                            description: `企業名: ${companyName}`,
                        },
                        unit_amount: 10000, // ¥10,000
                    },
                    quantity: 1,
                },
            ],
            mode: "payment", // 買い切り
            success_url: `${appUrl}/login?purchased=true`,
            cancel_url: `${appUrl}/demo`,
            metadata: {
                companyName: companyName,
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error("Checkout Session 作成エラー:", error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
