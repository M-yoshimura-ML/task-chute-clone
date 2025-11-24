'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Statistics from '@/components/Statistics';
import TaskList from '@/components/TaskList';
import { Task, Category } from '@/types';

export default function Home() {
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

  // サンプルタスクの初期化
  useEffect(() => {
    const sampleTasks: Task[] = [
      {
        id: '1',
        title: '【普通人】健康\n朝を狩りに行く (1)',
        category: 'A',
        mode: '暮らし',
        estimatedMinutes: 5,
        actualMinutes: 3,
        startTime: new Date('2024-01-14T03:21:00'),
        endTime: new Date('2024-01-14T03:24:00'),
        isCompleted: true,
        order: 1,
        userId: 'demo',
      },
      {
        id: '2',
        title: '【普通人】喜多方\n頭を洗う',
        category: 'B',
        mode: '単純作業',
        estimatedMinutes: 1,
        actualMinutes: 3,
        startTime: new Date('2024-01-14T03:24:00'),
        endTime: new Date('2024-01-14T03:27:00'),
        isCompleted: true,
        order: 2,
        userId: 'demo',
      },
      {
        id: '3',
        title: '【普通人】健康\n体重を計測して記録する',
        category: 'A',
        mode: '単純作業',
        estimatedMinutes: 1,
        actualMinutes: 0,
        startTime: new Date('2024-01-14T03:27:00'),
        endTime: new Date('2024-01-14T03:27:00'),
        isCompleted: true,
        order: 3,
        userId: 'demo',
      },
    ];
    setTasks(sampleTasks);
  }, []);

  const handleAddTask = (task: Omit<Task, 'id' | 'userId'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      userId: 'demo',
    };
    setTasks([...tasks, newTask]);
  };

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleToggleComplete = (taskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const isCompleting = !task.isCompleted;
        return {
          ...task,
          isCompleted: isCompleting,
          startTime: isCompleting && !task.startTime ? new Date() : task.startTime,
          endTime: isCompleting ? new Date() : null,
        };
      }
      return task;
    }));
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
