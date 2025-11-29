# トラブルシューティングガイド

## タスクが追加できない場合

### 1. ブラウザのコンソールを確認

1. ブラウザで`F12`キーを押して開発者ツールを開く
2. 「Console」タブを選択
3. タスクを追加してみて、エラーメッセージを確認

### よくあるエラーと解決方法

#### エラー: "new row violates row-level security policy"

**原因**: Row Level Security (RLS) のポリシーが正しく設定されていない

**解決方法**:
1. Supabaseダッシュボードで「SQL Editor」を開く
2. 以下のSQLを実行してポリシーを確認:

```sql
-- ポリシーの確認
SELECT * FROM pg_policies WHERE tablename = 'tasks';
```

3. ポリシーがない場合は、`supabase/schema.sql` を再実行

#### エラー: "ユーザーが認証されていません"

**原因**: ログインしていないか、セッションが切れている

**解決方法**:
1. `/login` にアクセスして再ログイン
2. ブラウザのキャッシュをクリア
3. `.env.local` の環境変数を確認

#### エラー: "insert or update on table 'tasks' violates foreign key constraint"

**原因**: `user_id` が正しく設定されていない

**解決方法**:
1. Supabaseダッシュボードで「Authentication」→「Users」を確認
2. ユーザーIDが正しく作成されているか確認
3. ブラウザのコンソールで `user.id` を確認

### 2. データベースの確認

Supabaseダッシュボードで「Table Editor」を開いて、直接データを確認:

1. `tasks` テーブルに移動
2. 手動でレコードを追加してみる
3. RLSが有効になっているか確認（テーブルの設定で確認可能）

### 3. 環境変数の確認

`.env.local` ファイルが正しく設定されているか確認:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

- URLは `https://` で始まり `.supabase.co` で終わる
- Anon Keyは `eyJ` で始まる長い文字列

環境変数を変更した場合は、開発サーバーを再起動:

```bash
# Ctrl+C で停止
npm run dev
```

### 4. ネットワークリクエストの確認

1. ブラウザで`F12`キーを押して開発者ツールを開く
2. 「Network」タブを選択
3. タスクを追加してみる
4. `tasks` というリクエストを探す
5. リクエストの詳細（Status, Response）を確認

**期待される結果**:
- Status: 201 Created（成功の場合）
- Response: 追加されたタスクのデータ

### 5. Supabase接続の確認

以下のSQLをSupabase SQL Editorで実行して、接続とRLSをテスト:

```sql
-- 現在のユーザーIDを確認
SELECT auth.uid();

-- 自分のタスクを表示
SELECT * FROM tasks WHERE user_id = auth.uid();

-- タスクを手動で追加してみる
INSERT INTO tasks (user_id, title, category, mode, estimated_minutes, task_order, task_date)
VALUES (auth.uid(), 'テストタスク', 'A', '暮らし', 5, 1, CURRENT_DATE);
```

## タスクが表示されない場合

### 1. 日付フィルターの確認

現在のコードは本日の日付でフィルターしています。タスクが別の日付で作成されている可能性があります。

Supabase SQL Editorで確認:

```sql
SELECT * FROM tasks WHERE user_id = auth.uid();
```

### 2. リアルタイム更新の確認

ブラウザのコンソールでリアルタイム接続のログを確認:

```
タスクの読み込みエラー: ...
```

というメッセージがある場合は、Supabaseの設定を確認。

## その他の問題

### 開発サーバーが起動しない

```bash
# node_modulesを削除して再インストール
rm -rf node_modules package-lock.json
npm install

# 開発サーバーを起動
npm run dev
```

### Supabaseへの接続が遅い

Supabaseプロジェクトのリージョンが遠い可能性があります。新しいプロジェクトを作成する際は、「Northeast Asia (Tokyo)」を選択してください。

### RLSポリシーを無効化してテスト（非推奨）

**警告**: セキュリティ上の理由から、本番環境では絶対に行わないでください。

```sql
-- 一時的にRLSを無効化（デバッグ用）
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;

-- テスト後は必ず有効化
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
```

## サポート

上記の手順で解決しない場合は、以下の情報を含めてIssueを作成してください:

1. エラーメッセージ（コンソールとネットワーク）
2. Supabaseのバージョン
3. Next.jsのバージョン（`package.json`を確認）
4. 実行した手順
5. 期待される動作と実際の動作

