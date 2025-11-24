'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Statistics from '@/components/Statistics';
import TaskList from '@/components/TaskList';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Task, Category } from '@/types';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/AuthProvider';

function DashboardContent() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([
    { id: 'A', name: 'A', label: 'A', color: 'bg-red-500', totalMinutes: 0 },
    { id: 'B', name: 'B', label: 'B', color: 'bg-orange-500', totalMinutes: 0 },
    { id: 'C', name: 'C', label: 'C', color: 'bg-yellow-500', totalMinutes: 0 },
    { id: 'D', name: 'D', label: 'D', color: 'bg-green-500', totalMinutes: 0 },
    { id: 'E', name: 'E', label: 'E', color: 'bg-blue-500', totalMinutes: 0 },
    { id: 'F', name: 'F', label: 'F', color: 'bg-indigo-500', totalMinutes: 0 },
    { id: 'G', name: 'G', label: 'G', color: 'bg-purple-500', totalMinutes: 0 },
    { id: 'H', name: 'H', label: 'H', color: 'bg-pink-500', totalMinutes: 0 },
  ]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 現在時刻を1秒ごとに更新
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const supabase = createClient();

  // タスクの読み込み
  useEffect(() => {
    if (!user) return;

    const loadTasks = async () => {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .eq('task_date', today)
        .order('task_order', { ascending: true });

      if (error) {
        console.error('タスクの読み込みエラー:', error);
        return;
      }

      if (data) {
        const loadedTasks: Task[] = data.map((row: any) => ({
          id: row.id,
          title: row.title,
          category: row.category,
          mode: row.mode,
          estimatedMinutes: row.estimated_minutes,
          actualMinutes: row.actual_minutes,
          startTime: row.start_time ? new Date(row.start_time) : null,
          endTime: row.end_time ? new Date(row.end_time) : null,
          isCompleted: row.is_completed,
          order: row.task_order,
          userId: row.user_id,
        }));
        setTasks(loadedTasks);
      }
    };

    loadTasks();

    // リアルタイム更新のサブスクリプション
    const channel = supabase
      .channel('tasks_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          loadTasks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, supabase]);

  const handleAddTask = async (task: Omit<Task, 'id' | 'userId'>) => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];

    const { error } = await supabase.from('tasks').insert({
      user_id: user.id,
      title: task.title,
      category: task.category,
      mode: task.mode,
      estimated_minutes: task.estimatedMinutes,
      actual_minutes: task.actualMinutes,
      start_time: task.startTime?.toISOString(),
      end_time: task.endTime?.toISOString(),
      is_completed: task.isCompleted,
      task_order: task.order,
      task_date: today,
    });

    if (error) {
      console.error('タスクの追加エラー:', error);
    }
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    const dbUpdates: any = {};
    
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.category !== undefined) dbUpdates.category = updates.category;
    if (updates.mode !== undefined) dbUpdates.mode = updates.mode;
    if (updates.estimatedMinutes !== undefined) dbUpdates.estimated_minutes = updates.estimatedMinutes;
    if (updates.actualMinutes !== undefined) dbUpdates.actual_minutes = updates.actualMinutes;
    if (updates.startTime !== undefined) dbUpdates.start_time = updates.startTime?.toISOString();
    if (updates.endTime !== undefined) dbUpdates.end_time = updates.endTime?.toISOString();
    if (updates.isCompleted !== undefined) dbUpdates.is_completed = updates.isCompleted;
    if (updates.order !== undefined) dbUpdates.task_order = updates.order;

    const { error } = await supabase
      .from('tasks')
      .update(dbUpdates)
      .eq('id', taskId);

    if (error) {
      console.error('タスクの更新エラー:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);

    if (error) {
      console.error('タスクの削除エラー:', error);
    }
  };

  const handleToggleComplete = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const isCompleting = !task.isCompleted;
    const now = new Date();

    await handleUpdateTask(taskId, {
      isCompleted: isCompleting,
      startTime: isCompleting && !task.startTime ? now : task.startTime,
      endTime: isCompleting ? now : null,
      actualMinutes: isCompleting 
        ? Math.round((now.getTime() - (task.startTime?.getTime() || now.getTime())) / 60000)
        : 0,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <Statistics 
          tasks={tasks}
          categories={categories}
          currentTime={currentTime}
          selectedDate={selectedDate}
        />
        <TaskList
          tasks={tasks}
          onAddTask={handleAddTask}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
          onToggleComplete={handleToggleComplete}
        />
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
