'use client';

import { Task } from '@/types';
import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Plus } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id' | 'userId'>) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleComplete: (taskId: string) => void;
}

export default function TaskList({
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onToggleComplete,
}: TaskListProps) {
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;

    const newTask: Omit<Task, 'id' | 'userId'> = {
      title: newTaskTitle,
      category: 'A',
      mode: '暮らし',
      estimatedMinutes: 5,
      actualMinutes: 0,
      startTime: null,
      endTime: null,
      isCompleted: false,
      order: tasks.length + 1,
    };

    onAddTask(newTask);
    setNewTaskTitle('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  const formatTime = (date: Date | null) => {
    if (!date) return '--:--';
    return date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  // タスクを順番にソート
  const sortedTasks = [...tasks].sort((a, b) => a.order - b.order);

  return (
    <div className="bg-white rounded-lg shadow">
      {/* テーブルヘッダー */}
      <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-gray-50 border-b text-sm font-medium text-gray-700">
        <div className="col-span-1"></div>
        <div className="col-span-4">タスク</div>
        <div className="col-span-2">モード</div>
        <div className="col-span-1 text-center">見積</div>
        <div className="col-span-1 text-center">実績</div>
        <div className="col-span-1 text-center">開始</div>
        <div className="col-span-1 text-center">終了</div>
        <div className="col-span-1"></div>
      </div>

      {/* 新規タスク入力 */}
      <div className="grid grid-cols-12 gap-2 px-4 py-3 border-b items-center hover:bg-gray-50">
        <div className="col-span-1 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-[#3498db] flex items-center justify-center text-white">
            <Plus className="h-5 w-5" />
          </div>
        </div>
        <div className="col-span-11">
          <Input
            type="text"
            placeholder="タスク名を入力"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyPress={handleKeyPress}
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
      </div>

      {/* セッション表示の例 */}
      <div className="px-4 py-2 bg-gray-600 text-white text-sm">
        ▶ 03:00～(非) セクションA「朝活タイム」((42203)
      </div>

      {/* タスクリスト */}
      <div className="divide-y">
        {sortedTasks.map((task) => (
          <div
            key={task.id}
            className="grid grid-cols-12 gap-2 px-4 py-3 items-center hover:bg-gray-50"
          >
            <div className="col-span-1 flex items-center justify-center">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                task.isCompleted ? 'bg-green-500' : 'bg-gray-200'
              }`}>
                <Checkbox
                  checked={task.isCompleted}
                  onCheckedChange={() => onToggleComplete(task.id)}
                  className="border-0 data-[state=checked]:bg-transparent"
                />
              </div>
            </div>
            <div className="col-span-4">
              <div className="text-sm">
                <span className="text-gray-500 text-xs mr-2">{task.order}.</span>
                {task.title.split('\n').map((line, i) => (
                  <div key={i} className={i === 0 ? 'text-gray-400 text-xs' : ''}>
                    {line}
                  </div>
                ))}
              </div>
            </div>
            <div className="col-span-2 text-sm text-gray-600">{task.mode}</div>
            <div className="col-span-1 text-center text-sm">{task.estimatedMinutes}分</div>
            <div className="col-span-1 text-center text-sm text-gray-600">
              {task.actualMinutes}分
            </div>
            <div className="col-span-1 text-center text-sm text-gray-600">
              {formatTime(task.startTime)}
            </div>
            <div className="col-span-1 text-center text-sm text-gray-600">
              {formatTime(task.endTime)}
            </div>
            <div className="col-span-1 flex items-center justify-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => {/* TODO: 編集機能 */}}>
                    編集
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {/* TODO: 複製機能 */}}>
                    複製
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onDeleteTask(task.id)}
                    className="text-red-600"
                  >
                    削除
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>

      {/* 詳細ボタン */}
      <div className="px-4 py-3 border-t">
        <Button variant="outline" className="w-full">
          詳細
        </Button>
      </div>
    </div>
  );
}

