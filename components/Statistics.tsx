'use client';

import { Task, Category } from '@/types';
import { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { ChevronDown } from 'lucide-react';

interface StatisticsProps {
  tasks: Task[];
  categories: Category[];
  currentTime: Date;
  selectedDate: Date;
}

export default function Statistics({
  tasks,
  categories,
  currentTime,
  selectedDate,
}: StatisticsProps) {
  // 統計情報を計算
  const stats = useMemo(() => {
    const completed = tasks.filter(t => t.isCompleted);
    const remaining = tasks.filter(t => !t.isCompleted);

    const completedMinutes = completed.reduce((sum, t) => sum + t.actualMinutes, 0);
    const remainingMinutes = remaining.reduce((sum, t) => sum + t.estimatedMinutes, 0);
    const totalMinutes = tasks.reduce((sum, t) => sum + t.estimatedMinutes, 0);

    return {
      total: {
        count: tasks.length,
        hours: (totalMinutes / 60).toFixed(1),
      },
      completed: {
        count: completed.length,
        hours: (completedMinutes / 60).toFixed(1),
      },
      remaining: {
        count: remaining.length,
        hours: (remainingMinutes / 60).toFixed(1),
      },
    };
  }, [tasks]);

  // カテゴリ別の時間を計算
  const categoryStats = useMemo(() => {
    const stats = categories.map(cat => ({
      ...cat,
      totalMinutes: tasks
        .filter(t => t.category === cat.id)
        .reduce((sum, t) => sum + (t.isCompleted ? t.actualMinutes : t.estimatedMinutes), 0),
    }));
    return stats.filter(cat => cat.totalMinutes > 0);
  }, [tasks, categories]);

  // 終了予定時刻を計算
  const calculateEndTime = () => {
    const now = new Date();
    const remainingMinutes = tasks
      .filter(t => !t.isCompleted)
      .reduce((sum, t) => sum + t.estimatedMinutes, 0);
    const endTime = new Date(now.getTime() + remainingMinutes * 60000);
    return endTime;
  };

  const endTime = calculateEndTime();

  // 時刻フォーマット
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const formatTimeHHMM = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  // 日付フォーマット
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weekday = weekdays[date.getDay()];
    return `${year}.${month}.${day} (${weekday})`;
  };

  return (
    <div className="mb-6 space-y-4">
      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-white">
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-2">全て</div>
            <div className="text-4xl font-bold text-gray-800">{stats.total.count}</div>
            <div className="text-sm text-gray-500 mt-1">{stats.total.hours}h</div>
          </div>
        </Card>
        <Card className="p-4 bg-white">
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-2">消化</div>
            <div className="text-4xl font-bold text-gray-800">{stats.completed.count}</div>
            <div className="text-sm text-gray-500 mt-1">{stats.completed.hours}h</div>
          </div>
        </Card>
        <Card className="p-4 bg-white">
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-2">残り</div>
            <div className="text-4xl font-bold text-gray-800">{stats.remaining.count}</div>
            <div className="text-sm text-gray-500 mt-1">{stats.remaining.hours}h</div>
          </div>
        </Card>
      </div>

      {/* 時刻と予定 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-white">
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-2 flex items-center justify-center gap-1">
              {endTime.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', hour12: false })}までの終了予定
              <ChevronDown className="h-4 w-4" />
            </div>
            <div className="text-5xl font-bold text-gray-800">
              {formatTime(currentTime)}
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-white">
          <div className="grid grid-cols-4 gap-2 text-xs">
            {categoryStats.slice(0, 4).map((cat) => (
              <div key={cat.id} className="text-center">
                <div className="font-bold">{cat.id}</div>
                <div className="text-gray-600">{formatTimeHHMM(cat.totalMinutes)}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <button className="text-gray-400 hover:text-gray-600">
              前日
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">今日</span>
              <button className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1">
                {formatDate(selectedDate)}
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              翌日
            </button>
          </div>
        </Card>
      </div>

      {/* アイコンバー */}
      <div className="flex gap-2">
        <button className="p-2 bg-white rounded hover:bg-gray-100 border">
          <span className="text-gray-600">👁️</span>
        </button>
        <button className="p-2 bg-white rounded hover:bg-gray-100 border">
          <span className="text-gray-600">📋</span>
        </button>
        <button className="p-2 bg-white rounded hover:bg-gray-100 border">
          <span className="text-gray-600">↩️</span>
        </button>
        <button className="p-2 bg-white rounded hover:bg-gray-100 border">
          <span className="text-gray-600">🌙</span>
        </button>
      </div>
    </div>
  );
}

