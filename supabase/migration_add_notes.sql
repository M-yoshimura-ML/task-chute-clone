-- タスクテーブルにメモ(notes)カラムを追加
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS notes TEXT;

-- 既存のインデックスとポリシーはそのまま維持されます

