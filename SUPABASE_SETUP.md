# Supabaseセットアップガイド

このガイドでは、TaskChuteクローンアプリのためのSupabaseプロジェクトのセットアップ方法を説明します。

## 1. Supabaseプロジェクトの作成

1. [Supabase](https://supabase.com/)にアクセスし、アカウントを作成/ログインします
2. 「New Project」をクリックし、新しいプロジェクトを作成します
   - プロジェクト名: taskchute-clone（任意）
   - データベースパスワード: 安全なパスワードを設定
   - リージョン: 最寄りのリージョンを選択（例: Northeast Asia (Tokyo)）
3. プロジェクトの作成が完了するまで待ちます（数分かかります）

## 2. データベーススキーマの作成

1. Supabaseダッシュボードで、左サイドバーから「SQL Editor」を選択
2. 「New Query」をクリック
3. `supabase/schema.sql`ファイルの内容をコピー&ペースト
4. 「Run」ボタンをクリックしてSQLを実行

## 3. 環境変数の設定

1. Supabaseダッシュボードで、「Settings」→「API」を選択
2. 以下の情報をコピー：
   - Project URL
   - anon public key

3. プロジェクトのルートディレクトリに`.env.local`ファイルを作成し、以下を記述：

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 4. 認証設定

1. Supabaseダッシュボードで、「Authentication」→「URL Configuration」を選択
2. 以下のURLを追加：
   - Site URL: `http://localhost:3000`（開発環境）
   - Redirect URLs: 
     - `http://localhost:3000/auth/callback`
     - 本番環境のURLも追加（デプロイ後）

3. 「Authentication」→「Providers」で、メール認証を有効にします
   - Email: デフォルトで有効
   - 必要に応じて、Google、GitHubなどのOAuth認証も設定可能

## 5. デフォルトカテゴリの作成（オプション）

ユーザー登録後、以下のSQLを実行してデフォルトカテゴリを作成できます：

```sql
-- 自分のuser_idに置き換えてください
INSERT INTO categories (user_id, name, label, color) VALUES
  ('your-user-id', 'A', 'カテゴリA', '#ef4444'),
  ('your-user-id', 'B', 'カテゴリB', '#f97316'),
  ('your-user-id', 'C', 'カテゴリC', '#eab308'),
  ('your-user-id', 'D', 'カテゴリD', '#22c55e'),
  ('your-user-id', 'E', 'カテゴリE', '#3b82f6'),
  ('your-user-id', 'F', 'カテゴリF', '#6366f1'),
  ('your-user-id', 'G', 'カテゴリG', '#a855f7'),
  ('your-user-id', 'H', 'カテゴリH', '#ec4899');
```

## 6. 開発サーバーの再起動

環境変数を設定した後、開発サーバーを再起動します：

```bash
npm run dev
```

## 料金について

Supabaseの無料枠には以下が含まれます：
- 500MB データベース容量
- 50,000 月間アクティブユーザー
- 2GB 転送量
- Row Level Securityによるセキュリティ

個人利用であれば、無料枠で十分に運用可能です。

## セキュリティ

- `.env.local`ファイルは`.gitignore`に含まれているため、Gitにコミットされません
- Row Level Security (RLS)により、各ユーザーは自分のデータのみアクセス可能
- anon keyは公開されても安全ですが、service_role keyは絶対に公開しないでください

