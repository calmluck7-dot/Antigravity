// Node.js v20+ has built-in fetch and .env support
// Run with: node --env-file=.env scripts/test_creatomate.mjs

// ユーザーから提供されたテンプレートID
const TEMPLATE_ID = '498250d8-353d-46b8-9140-bb138657101d';
const API_KEY = process.env.CREATOMATE_API_KEY;

if (!API_KEY) {
    console.error("❌ エラー: CREATOMATE_API_KEY が設定されていません。.envファイルを確認してください。");
    process.exit(1);
}

console.log(`🚀 動画生成を開始します... (Template ID: ${TEMPLATE_ID})`);

const options = {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        template_id: TEMPLATE_ID,
        modifications: {
            "Video-DHM.source": "https://creatomate.com/files/assets/b68f979c-48c4-41f1-9bf2-98d620b420e7"
        }
    }),
};

try {
    const response = await fetch('https://api.creatomate.com/v1/renders', options);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(`API Error: ${data.message || response.statusText}`);
    }

    console.log("✅ リクエスト成功！");
    console.log("------------------------------------------------");
    console.log(`Render ID: ${data.id}`);
    console.log(`Status: ${data.status}`);
    console.log(`URL: ${data.url}`); // 生成完了前は null の可能性があります
    console.log("------------------------------------------------");
    console.log("詳細:", JSON.stringify(data, null, 2));

} catch (error) {
    console.error("❌ 失敗しました:", error.message);
}
