import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";

/**
 * 開発者アカウントを一回限り作成するためのAPIエンドポイント。
 * 秘密キー（SETUP_SECRET環境変数）で保護されています。
 * 
 * 使い方:
 * curl -X POST https://(URL)/api/developer/setup-dev-account \
 *   -H "Content-Type: application/json" \
 *   -d '{"secret":"SETUP_SECRETの値","email":"dev@example.com","password":"パスワード"}'
 */
export async function POST(req: Request) {
    try {
        const { secret, email, password } = await req.json();

        // 秘密キーの検証
        const setupSecret = process.env.SETUP_SECRET;
        if (!setupSecret || secret !== setupSecret) {
            return new NextResponse("Unauthorized: Invalid secret", { status: 401 });
        }

        if (!email || !password) {
            return new NextResponse("Missing email or password", { status: 400 });
        }

        // Firebase Authにユーザーを作成（既存の場合はそのまま使用）
        let userRecord;
        try {
            userRecord = await adminAuth.getUserByEmail(email);
            console.log(`既存ユーザーを発見: ${email}`);
        } catch (e) {
            // ユーザーが存在しない場合は新規作成
            userRecord = await adminAuth.createUser({
                email,
                password,
                emailVerified: true,
                displayName: "Developer",
            });
            console.log(`新規開発者アカウントを作成: ${email}`);
        }

        // developerロールのCustom Claimsを付与
        await adminAuth.setCustomUserClaims(userRecord.uid, {
            role: "developer",
        });

        return NextResponse.json({
            success: true,
            message: `開発者アカウントのセットアップが完了しました: ${email}`,
            uid: userRecord.uid,
        });

    } catch (error: any) {
        console.error("Setup error:", error);
        return new NextResponse(error.message, { status: 500 });
    }
}
