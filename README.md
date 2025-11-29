# TaskChute Clone - タスク管理アプリ

日々の時間管理とタスク管理を効率化するためのTaskChuteクローンアプリです。

## 🎯 プロジェクトの目的

- 平日や週末の時間の使い方を可視化し、より生産的に過ごす
- Obsidian x Cursorでの知的財産構築の基盤として活用
- 月額983円のTaskChute Cloudの代わりに、コスト0円で運用

## ✨ 主要機能

- ✅ **本日1日のタスクを1シートで管理**
- ✅ **過去と未来のタスクを一元管理**
- ✅ **1分以上かかる作業をすべて記録**
- ✅ **すべてのタスクの見積もり時間を設定**
- ✅ **終業時間をリアルタイム計算**
- ✅ **カテゴリ別の時間配分を可視化**
- ✅ **ユーザー認証機能（個人専用）**

## 🛠️ 技術スタック

### フロントエンド・バックエンド
- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** - モダンなUIコンポーネント

### データベース・認証
- **Supabase** - PostgreSQL + 認証
  - Row Level Security (RLS)によるセキュリティ
  - リアルタイムデータ同期

### ホスティング
- **Vercel** - Next.jsとの完璧な統合

**総コスト: 0円**（無料枠で運用可能）

## 📦 インストール

### 前提条件

- Node.js 18以上
- npm または yarn
- Supabaseアカウント

### 1. プロジェクトのクローン

```bash
git clone <repository-url>
cd taskchute
```

### 2. 依存パッケージのインストール

```bash
npm install
```

### 3. Supabaseのセットアップ

詳細は `SUPABASE_SETUP.md` を参照してください。

#### 簡易手順:

1. [Supabase](https://supabase.com/)でプロジェクトを作成
2. SQL Editorで `supabase/schema.sql` を実行
3. プロジェクトのURLとAnon Keyを取得

### 4. 環境変数の設定

`.env.local` ファイルをプロジェクトルートに作成：

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 5. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` にアクセス

## 🚀 デプロイ（Vercel）

### 1. Vercelにプロジェクトをインポート

```bash
# Vercel CLIをインストール（初回のみ）
npm install -g vercel

# デプロイ
vercel
```

### 2. 環境変数の設定

Vercelダッシュボードで以下の環境変数を設定：
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Supabaseの認証設定を更新

Supabase Dashboard → Authentication → URL Configuration:
- Site URL: `https://your-app.vercel.app`
- Redirect URLs: `https://your-app.vercel.app/auth/callback`

## 📱 使い方

### 初回ログイン

1. `/signup` にアクセスして新規アカウントを作成
2. 確認メールが届くので、リンクをクリックして認証
3. `/login` からログイン

### タスク管理

1. **タスクの追加**: 上部の入力欄にタスク名を入力してEnter
2. **タスクの完了**: チェックボックスをクリック
3. **タスクの編集・削除**: 右端の「…」メニューから操作
4. **統計の確認**: 上部に表示される「全て/消化/残り」を確認

### カテゴリ設定

初回利用時は、Supabaseの `categories` テーブルに手動でカテゴリを追加してください。

```sql
INSERT INTO categories (user_id, name, label, color) VALUES
  ('your-user-id', 'A', '仕事', '#ef4444'),
  ('your-user-id', 'B', '健康', '#f97316'),
  -- 必要なカテゴリを追加
```

## 🗂️ プロジェクト構造

```
taskchute/
├── app/                      # Next.js App Router
│   ├── login/               # ログインページ
│   ├── signup/              # サインアップページ
│   ├── auth/callback/       # 認証コールバック
│   ├── layout.tsx           # ルートレイアウト
│   └── page.tsx             # メインダッシュボード
├── components/              # Reactコンポーネント
│   ├── ui/                  # shadcn/uiコンポーネント
│   ├── Header.tsx           # ヘッダー
│   ├── Statistics.tsx       # 統計表示
│   ├── TaskList.tsx         # タスクリスト
│   ├── AuthProvider.tsx     # 認証プロバイダー
│   └── ProtectedRoute.tsx   # 認証保護ルート
├── lib/                     # ユーティリティ
│   ├── supabase/            # Supabase設定
│   │   ├── client.ts        # クライアント側
│   │   ├── server.ts        # サーバー側
│   │   └── middleware.ts    # ミドルウェア
│   └── utils.ts             # ユーティリティ関数
├── types/                   # TypeScript型定義
│   └── index.ts
├── supabase/                # Supabaseスキーマ
│   └── schema.sql           # データベーススキーマ
└── middleware.ts            # Next.jsミドルウェア
```

## 🔐 セキュリティ

- **Row Level Security (RLS)**: 各ユーザーは自分のデータのみアクセス可能
- **認証必須**: すべての主要機能は認証が必要
- **環境変数の保護**: `.env.local`は.gitignoreに含まれる

## 📊 データベーススキーマ

### tasks テーブル
- タスクの管理
- ユーザーごとに分離（RLS）
- 日付、順序、完了状態などを管理

### sessions テーブル
- 時間帯セッションの管理（例: 朝活タイム）

### categories テーブル
- タスクカテゴリの管理
- カラーコード付き

## 🎨 カスタマイズ

### カラーテーマの変更

`app/globals.css` でカラー変数を編集：

```css
:root {
  --primary: oklch(0.205 0 0);
  --secondary: oklch(0.97 0 0);
  /* ... */
}
```

### UIコンポーネントの追加

```bash
npx shadcn@latest add [component-name]
```

## 🐛 トラブルシューティング

詳細なトラブルシューティングガイドは [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) を参照してください。

### よくある問題

#### タスクが追加できない

1. ブラウザのコンソール（F12）でエラーを確認
2. Supabaseの RLS ポリシーが正しく設定されているか確認
3. `.env.local` の環境変数を確認
4. 開発サーバーを再起動

#### 認証エラー

1. `.env.local` の環境変数を確認
2. Supabaseの認証設定（Redirect URLs）を確認
3. 開発サーバーを再起動

#### データが表示されない

1. Supabaseのスキーマが正しく作成されているか確認
2. RLSポリシーが有効になっているか確認
3. ブラウザのコンソールでエラーを確認

## 📝 今後の拡張予定

- [ ] ルーチンタスク機能
- [ ] レビュー機能（振り返り）
- [ ] グラフ・チャート表示
- [ ] Obsidianエクスポート機能
- [ ] セッション管理UI
- [ ] カテゴリ管理UI
- [ ] タスクテンプレート機能
- [ ] モバイル対応の最適化

## 📄 ライセンス

MIT License

## 🤝 貢献

個人プロジェクトのため、プルリクエストは受け付けていません。

## 📮 お問い合わせ

質問や提案がある場合は、Issueを作成してください。

---

**Made with ❤️ for better time management**
