'use client';

import { Task } from '@/types';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Trash2 } from 'lucide-react';

interface TaskDetailModalProps {
  task: Task;
  onClose: () => void;
  onUpdate: (updates: Partial<Task>) => void;
  onDelete: () => void;
  isNewTask?: boolean;
}

export default function TaskDetailModal({
  task,
  onClose,
  onUpdate,
  onDelete,
  isNewTask = false,
}: TaskDetailModalProps) {
  const [title, setTitle] = useState(task.title);
  const [category, setCategory] = useState(task.category);
  const [mode, setMode] = useState(task.mode);
  const [estimatedMinutes, setEstimatedMinutes] = useState(task.estimatedMinutes);
  const [taskDate, setTaskDate] = useState(task.taskDate);
  const [notes, setNotes] = useState(task.notes || '');

  const handleSave = () => {
    onUpdate({
      title,
      category,
      mode,
      estimatedMinutes,
      taskDate,
      notes,
    });
  };

  const handleDelete = () => {
    if (isNewTask) {
      onDelete();
    } else if (confirm('このタスクを削除しますか？')) {
      onDelete();
    }
  };

  const formatTime = (date: Date | null) => {
    if (!date) return '--:--:--';
    return date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '--/--/--';
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{isNewTask ? 'タスク詳細設定' : 'タスク詳細'}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              title={isNewTask ? 'キャンセル' : '削除'}
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* タスク名 */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              タスク名
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="タスク名を入力"
            />
          </div>

          {/* カテゴリとモード */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                カテゴリ
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map((cat) => (
                  <option key={cat} value={cat}>
                    カテゴリ {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                モード
              </label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {['暮らし', '単純作業', '思慮深', '集中', '休憩'].map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 見積時間 */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              見積時間（分）
            </label>
            <Input
              type="number"
              value={estimatedMinutes}
              onChange={(e) => setEstimatedMinutes(parseInt(e.target.value) || 0)}
              min="0"
            />
          </div>

          {/* タスク日付 */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              タスク日付
            </label>
            <Input
              type="date"
              value={taskDate.toISOString().split('T')[0]}
              onChange={(e) => setTaskDate(new Date(e.target.value))}
            />
          </div>

          {/* 時刻情報（既存タスクのみ） */}
          {!isNewTask && (
            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="text-xs text-gray-600 mb-1">開始時刻</div>
                <div className="font-mono text-sm">{formatTime(task.startTime)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">終了時刻</div>
                <div className="font-mono text-sm">{formatTime(task.endTime)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">実績時間</div>
                <div className="font-mono text-sm">{task.actualMinutes}分</div>
              </div>
            </div>
          )}

          {/* メモ */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              メモ
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="タスクに関するメモを入力"
              rows={5}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            キャンセル
          </Button>
          <Button onClick={handleSave} className="bg-[#3498db] hover:bg-[#2980b9]">
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

