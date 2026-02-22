#!/usr/bin/env node
/**
 * Cloud Run サービスに Firebase Admin 環境変数を設定するスクリプト
 * Cloud Run Admin API を有効化してから環境変数を設定します。
 */
const { GoogleAuth } = require("google-auth-library");
const fs = require("fs");
const path = require("path");

// ==== 設定 ====
const REGION = "asia-northeast1";
const PROJECT_ID = "deilvery-app";
const SERVICE_NAME = "hokokkun-prod";
// ==============

async function enableApi(accessToken, apiName) {
    console.log(`🔧 API を有効化中: ${apiName}`);
    const resp = await fetch(
        `https://serviceusage.googleapis.com/v1/projects/${PROJECT_ID}/services/${apiName}:enable`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        }
    );
    if (!resp.ok) {
        const txt = await resp.text();
        console.error("⚠️ API有効化でエラー:", txt.substring(0, 200));
    } else {
        console.log(`✅ ${apiName} を有効化しました（反映まで少し待ちます...）`);
        await new Promise(r => setTimeout(r, 10000)); // 10秒待機
    }
}

async function main() {
    // サービスアカウントJSONを探す
    const scriptsDir = path.join(__dirname);
    const jsonFile = fs.readdirSync(scriptsDir).find(f => f.includes("firebase-adminsdk") && f.endsWith(".json"));
    if (!jsonFile) {
        console.error("❌ サービスアカウントJSONが見つかりません");
        process.exit(1);
    }

    const saPath = path.join(scriptsDir, jsonFile);
    console.log(`📄 使用するJSONファイル: ${jsonFile}`);
    const sa = JSON.parse(fs.readFileSync(saPath, "utf8"));

    // 認証クライアント作成
    const auth = new GoogleAuth({
        keyFile: saPath,
        scopes: ["https://www.googleapis.com/auth/cloud-platform"],
    });

    const client = await auth.getClient();
    const tokenResponse = await client.getAccessToken();
    const token = tokenResponse.token;

    // Cloud Run Admin API を有効化
    await enableApi(token, "run.googleapis.com");

    const apiBase = `https://run.googleapis.com/v2/projects/${PROJECT_ID}/locations/${REGION}/services/${SERVICE_NAME}`;

    console.log("🔍 現在のCloud Run設定を取得中...");
    const getResp = await fetch(apiBase, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!getResp.ok) {
        const err = await getResp.text();
        console.error("❌ サービス取得エラー:", err.substring(0, 500));
        process.exit(1);
    }

    const service = await getResp.json();

    // v2 APIの構造：template.containers[0].env
    const container = service.template.containers[0];
    const envVars = container.env || [];

    const upsertEnv = (name, value) => {
        const idx = envVars.findIndex(e => e.name === name);
        if (idx >= 0) {
            envVars[idx] = { name, value };
            console.log(`  📝 更新: ${name}`);
        } else {
            envVars.push({ name, value });
            console.log(`  ➕ 追加: ${name}`);
        }
    };

    upsertEnv("FIREBASE_CLIENT_EMAIL", sa.client_email);
    upsertEnv("FIREBASE_PRIVATE_KEY", sa.private_key);
    container.env = envVars;

    console.log("\n🚀 Cloud Runサービスを更新中...");
    const patchResp = await fetch(apiBase, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ template: service.template }),
    });

    if (!patchResp.ok) {
        const err = await patchResp.text();
        console.error("❌ 更新エラー:", err.substring(0, 500));
        process.exit(1);
    }

    console.log(`\n✅ 完了！新しいリビジョンのデプロイが始まりました（2〜4分かかります）`);
}

main().catch(err => {
    console.error("❌ エラー:", err.message);
    process.exit(1);
});
