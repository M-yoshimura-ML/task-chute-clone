'use client';

import { Task } from '@/types';
import { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  MoreHorizontal, 
  Plus, 
  Play, 
  Square, 
  Hourglass,
  Clock,
  ExternalLink 
} from 'lucide-react';
import TaskDetailModal from './TaskDetailModal';

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
  const [isAddingNewTask, setIsAddingNewTask] = useState(false);
  const [showNewTaskDetail, setShowNewTaskDetail] = useState(false);
  const [newTaskData, setNewTaskData] = useState({
    title: '',
    estimatedMinutes: 5,
    taskDate: new Date(),
    notes: '',
    category: 'A',
    mode: '暮らし',
  });
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [runningTaskId, setRunningTaskId] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState<{ [key: string]: number }>({});

  // タイマー管理
  useEffect(() => {
    const interval = setInterval(() => {
      tasks.forEach((task) => {
        if (task.startTime && !task.endTime && !task.isCompleted) {
          const elapsed = Math.floor((Date.now() - task.startTime.getTime()) / 1000);
          setElapsedTime((prev) => ({ ...prev, [task.id]: elapsed }));
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [tasks]);

  const handleStartAddingTask = () => {
    setIsAddingNewTask(true);
    setNewTaskData({
      title: '',
      estimatedMinutes: 5,
      taskDate: new Date(),
      notes: '',
      category: 'A',
      mode: '暮らし',
    });
  };

  const handleSaveNewTask = () => {
    if (!newTaskData.title.trim()) {
      // タイトルが空の場合はキャンセル
      setIsAddingNewTask(false);
      setShowNewTaskDetail(false);
      return;
    }

    const newTask: Omit<Task, 'id' | 'userId'> = {
      title: newTaskData.title,
      category: newTaskData.category,
      mode: newTaskData.mode,
      estimatedMinutes: newTaskData.estimatedMinutes,
      actualMinutes: 0,
      startTime: null,
      endTime: null,
      isCompleted: false,
      order: tasks.length + 1,
      taskDate: newTaskData.taskDate,
      notes: newTaskData.notes,
    };

    onAddTask(newTask);
    setIsAddingNewTask(false);
    setShowNewTaskDetail(false);
    setNewTaskData({
      title: '',
      estimatedMinutes: 5,
      taskDate: new Date(),
      notes: '',
      category: 'A',
      mode: '暮らし',
    });
  };

  const handleCancelAddingTask = () => {
    setIsAddingNewTask(false);
    setShowNewTaskDetail(false);
    setNewTaskData({
      title: '',
      estimatedMinutes: 5,
      taskDate: new Date(),
      notes: '',
      category: 'A',
      mode: '暮らし',
    });
  };

  const handleShowNewTaskDetail = () => {
    setShowNewTaskDetail(true);
  };

  const handleNewTaskKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveNewTask();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancelAddingTask();
    }
  };

  const handleStartTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.startTime) return;

    onUpdateTask(taskId, {
      startTime: new Date(),
    });
    setRunningTaskId(taskId);
  };

  const handleStopTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task || !task.startTime) return;

    const actualMinutes = Math.round((Date.now() - task.startTime.getTime()) / 60000);
    
    onUpdateTask(taskId, {
      endTime: new Date(),
      actualMinutes: actualMinutes,
    });
    setRunningTaskId(null);
  };

  const handleEditTitle = (taskId: string, title: string) => {
    setEditingTaskId(taskId);
    setEditingTitle(title);
  };

  const handleSaveTitle = (taskId: string) => {
    if (editingTitle.trim()) {
      onUpdateTask(taskId, { title: editingTitle });
    }
    setEditingTaskId(null);
  };

  const handleEstimatedMinutesChange = (taskId: string, minutes: number) => {
    onUpdateTask(taskId, { estimatedMinutes: minutes });
  };

  const formatTime = (date: Date | null) => {
    if (!date) return '--:--';
    return date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const formatElapsedTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // タスクを順番にソート
  const sortedTasks = [...tasks].sort((a, b) => a.order - b.order);

  return (
    <div className="bg-white rounded-lg shadow">
      {/* テーブルヘッダー */}
      <div className="flex items-center px-4 py-3 bg-gray-50 border-b text-sm font-medium text-gray-700">
        <div className="w-12"></div>
        <div className="flex-1 min-w-0">タスク</div>
        <div className="w-24 text-center">
          <Hourglass className="h-4 w-4 inline-block" />
        </div>
        <div className="w-24 text-center">
          <Clock className="h-4 w-4 inline-block" />
        </div>
        <div className="w-20 text-center">開始</div>
        <div className="w-20 text-center">終了</div>
        <div className="w-12"></div>
      </div>

      {/* 新規タスク追加ボタン */}
      {!isAddingNewTask && (
        <div className="flex items-center px-4 py-2 border-b hover:bg-gray-50">
          <Button
            onClick={handleStartAddingTask}
            variant="ghost"
            size="sm"
            className="text-[#3498db] hover:text-[#2980b9] hover:bg-blue-50"
          >
            <Plus className="h-4 w-4 mr-1" />
            タスクを追加
          </Button>
        </div>
      )}

      {/* 新規タスク入力行 */}
      {isAddingNewTask && (
        <div className="flex items-center px-4 py-3 border-b bg-blue-50">
          {/* 空のアイコン */}
          <div className="w-12 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
              <Plus className="h-5 w-5 text-white" />
            </div>
          </div>

          {/* タスク名入力 */}
          <div className="flex-1 min-w-0">
            <Input
              value={newTaskData.title}
              onChange={(e) => setNewTaskData({ ...newTaskData, title: e.target.value })}
              onKeyDown={handleNewTaskKeyDown}
              onBlur={handleSaveNewTask}
              placeholder="タスク名を入力 (Enterで保存、Escでキャンセル)"
              autoFocus
              className="h-8 text-sm"
            />
          </div>

          {/* 見積時間入力 */}
          <div className="w-24 text-center">
            <Input
              type="number"
              value={newTaskData.estimatedMinutes}
              onChange={(e) => setNewTaskData({ ...newTaskData, estimatedMinutes: parseInt(e.target.value) || 0 })}
              onKeyDown={handleNewTaskKeyDown}
              className="h-8 text-sm text-center"
              min="0"
            />
          </div>

          {/* 実績時間 */}
          <div className="w-24 text-center text-sm text-gray-400">
            0分
          </div>

          {/* 開始時刻 */}
          <div className="w-20 text-center text-sm text-gray-400">
            --:--
          </div>

          {/* 終了時刻 */}
          <div className="w-20 text-center text-sm text-gray-400">
            --:--
          </div>

          {/* 詳細設定ボタン */}
          <div className="w-12 flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShowNewTaskDetail}
              className="h-8 w-8"
              title="詳細設定"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* タスクリスト */}
      {tasks.length === 0 && !isAddingNewTask ? (
        <div className="px-4 py-12 text-center text-gray-500">
          <p className="text-lg mb-2">タスクがありません</p>
          <p className="text-sm">上のボタンからタスクを追加してください</p>
        </div>
      ) : (
        <div>
          {sortedTasks.map((task) => {
            const isRunning = task.startTime && !task.endTime && !task.isCompleted;
            const elapsed = elapsedTime[task.id] || 0;
            const remainingMinutes = task.estimatedMinutes - Math.floor(elapsed / 60);

            return (
              <div key={task.id}>
                <div className="flex items-center px-4 py-3 border-b hover:bg-gray-50">
                  {/* 再生/停止ボタン */}
                  <div className="w-12 flex items-center justify-center">
                    {!task.isCompleted && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-10 w-10 rounded-full ${
                          isRunning ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                        onClick={() => isRunning ? handleStopTask(task.id) : handleStartTask(task.id)}
                      >
                        {isRunning ? <Square className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                      </Button>
                    )}
                    {task.isCompleted && (
                      <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                        <Checkbox
                          checked={true}
                          onCheckedChange={() => onToggleComplete(task.id)}
                          className="border-0 data-[state=checked]:bg-transparent"
                        />
                      </div>
                    )}
                  </div>

                  {/* タスク名と日付 */}
                  <div className="flex-1 min-w-0">
                    {editingTaskId === task.id ? (
                      <Input
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onBlur={() => handleSaveTitle(task.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSaveTitle(task.id);
                          }
                        }}
                        autoFocus
                        className="h-8 text-sm"
                      />
                    ) : (
                      <div
                        onClick={() => handleEditTitle(task.id, task.title)}
                        className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                      >
                        <div className="text-sm">{task.title}</div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {task.taskDate.toLocaleDateString('ja-JP', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            weekday: 'short'
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 見積時間 */}
                  <div className="w-24 text-center">
                    <Input
                      type="number"
                      value={task.estimatedMinutes}
                      onChange={(e) => handleEstimatedMinutesChange(task.id, parseInt(e.target.value) || 0)}
                      className="h-8 text-sm text-center"
                      min="0"
                    />
                  </div>

                  {/* 実績時間 */}
                  <div className="w-24 text-center text-sm">
                    {isRunning ? (
                      <span className="text-blue-600 font-semibold">
                        -{remainingMinutes}分
                      </span>
                    ) : (
                      <span>{task.actualMinutes}分</span>
                    )}
                  </div>

                  {/* 開始時刻 */}
                  <div className="w-20 text-center text-sm text-gray-600">
                    {formatTime(task.startTime)}
                  </div>

                  {/* 終了時刻 */}
                  <div className="w-20 text-center text-sm text-gray-600">
                    {formatTime(task.endTime)}
                  </div>

                  {/* メニュー */}
                  <div className="w-12 flex items-center justify-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedTaskId(task.id)}
                      className="h-8 w-8"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* タイマー表示 */}
                {isRunning && (
                  <div className="px-4 py-2 bg-blue-50 border-b">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">経過時間:</span>
                      <span className="font-mono font-semibold text-blue-600">
                        {formatElapsedTime(elapsed)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* タスク詳細モーダル */}
      {selectedTaskId && (
        <TaskDetailModal
          task={tasks.find((t) => t.id === selectedTaskId)!}
          onClose={() => setSelectedTaskId(null)}
          onUpdate={(updates) => {
            onUpdateTask(selectedTaskId, updates);
            setSelectedTaskId(null);
          }}
          onDelete={() => {
            onDeleteTask(selectedTaskId);
            setSelectedTaskId(null);
          }}
        />
      )}

      {/* 新規タスク詳細モーダル */}
      {showNewTaskDetail && (
        <TaskDetailModal
          task={{
            id: 'new',
            title: newTaskData.title,
            category: newTaskData.category,
            mode: newTaskData.mode,
            estimatedMinutes: newTaskData.estimatedMinutes,
            actualMinutes: 0,
            startTime: null,
            endTime: null,
            isCompleted: false,
            order: tasks.length + 1,
            userId: 'temp',
            taskDate: newTaskData.taskDate,
            notes: newTaskData.notes,
          }}
          onClose={() => setShowNewTaskDetail(false)}
          onUpdate={(updates) => {
            setNewTaskData({
              ...newTaskData,
              title: updates.title || newTaskData.title,
              category: updates.category || newTaskData.category,
              mode: updates.mode || newTaskData.mode,
              estimatedMinutes: updates.estimatedMinutes || newTaskData.estimatedMinutes,
              taskDate: updates.taskDate || newTaskData.taskDate,
              notes: updates.notes || newTaskData.notes,
            });
            setShowNewTaskDetail(false);
          }}
          onDelete={() => {
            handleCancelAddingTask();
          }}
          isNewTask={true}
        />
      )}
    </div>
  );
}

