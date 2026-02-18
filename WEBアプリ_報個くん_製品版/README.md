# 報個くん（製品版）

マルチテナント対応の配送業務管理システム「報個くん」の製品版ソースコードです。

## 開発環境のセットアップ

### 前提条件
- Node.js v18.17以上
- npm

### インストール
```bash
npm install
```

### 環境変数
`.env.local` を作成し、Firebaseの設定を記述してください。

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Firebase Admin (Server-side)
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."

```

### 開発サーバー起動
```bash
npm run dev
```
http://localhost:3000 にアクセスしてください。

## デプロイ（Cloudflare Pages）

本アプリケーションは [Cloudflare Pages](https://pages.cloudflare.com/) へのデプロイを想定しています。

1. Cloudflare Dashboard で "Create a project" -> "Connect to Git" を選択
2. リポジトリ (`WEBアプリ_報個くん_製品版` 相当のディレクトリ) を選択
3. ビルド設定:
   - **Framework Preset**: Next.js (Static HTML Export または Node.js Edge Runtime)
   - **Build Command**: `npx @cloudflare/next-on-pages` (推奨) または `npm run build`
   - **Build Output Directory**: `.vercel/output/static` (next-on-pagesの場合)
4. Environment Variables を設定 (Firebase config)

※ Cloudflare Pages で動かす場合、`@cloudflare/next-on-pages` の利用を推奨します。
現状の `npm run build` は標準の Next.js ビルドを行います。

## 機能
- **ログイン**: Firebase Auth 利用
- **デモモード**: ログイン不要で画面イメージを確認可能
- **ダッシュボード**: ログイン後のプレースホルダー

## 構成
- `src/domain`: ドメインロジック
- `src/usecase`: アプリケーションロジック
- `src/infra`: Firebase接続等のインフラ層
- `src/ui`: 画面コンポーネント (Next.js App Router)
