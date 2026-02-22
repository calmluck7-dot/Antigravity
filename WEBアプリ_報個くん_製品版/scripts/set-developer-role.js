#!/usr/bin/env node
/**
 * 開発者ロール付与スクリプト（一回だけ実行する）
 *
 * 使い方:
 *   1. Firebase コンソール → プロジェクト設定 → サービスアカウント → 「新しい秘密鍵を生成」
 *   2. ダウンロードした JSON ファイルを このスクリプトと同じ場所に置く
 *   3. node scripts/set-developer-role.js
 */

const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");

// ダウンロードしたサービスアカウントJSONのパスを指定
// スクリプトと同じフォルダにある場合はファイル名だけで OK
const SERVICE_ACCOUNT_PATH = process.argv[2] || path.join(__dirname, "serviceAccount.json");

// 開発者にするメールアドレス
const DEVELOPER_EMAIL = "calmluck7@gmail.com";

async function main() {
    if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
        console.error(`❌ サービスアカウントJSONが見つかりません: ${SERVICE_ACCOUNT_PATH}`);
        console.error("使い方: node scripts/set-developer-role.js [サービスアカウントJSONのパス]");
        process.exit(1);
    }

    const serviceAccount = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_PATH, "utf8"));

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });

    console.log(`🔍 ユーザーを検索中: ${DEVELOPER_EMAIL}`);

    try {
        const user = await admin.auth().getUserByEmail(DEVELOPER_EMAIL);
        console.log(`✅ ユーザー発見: ${user.displayName || "(名前なし)"} (UID: ${user.uid})`);

        await admin.auth().setCustomUserClaims(user.uid, {
            role: "developer",
        });

        console.log(`🎉 完了！ ${DEVELOPER_EMAIL} に developer ロールを付与しました。`);
        console.log("次回ログイン時から有効になります（既にログイン中の場合は一旦ログアウトして再ログインしてください）");
    } catch (err) {
        if (err.errorInfo?.code === "auth/user-not-found") {
            console.error(`❌ ユーザーが見つかりません: ${DEVELOPER_EMAIL}`);
            console.error("先にアプリで一度 Google ログインを完了させてください。");
        } else {
            console.error("❌ エラー:", err.message);
        }
        process.exit(1);
    }

    process.exit(0);
}

main();
