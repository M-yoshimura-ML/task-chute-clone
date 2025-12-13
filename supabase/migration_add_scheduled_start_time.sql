-- 開始予定時刻カラムを追加
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS scheduled_start_time TIMESTAMPTZ;

-- コメントを追加
COMMENT ON COLUMN tasks.scheduled_start_time IS 'タスクの開始予定時刻';

