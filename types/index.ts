// タスクの型定義
export interface Task {
  id: string;
  title: string;
  category: string;
  mode: string;
  estimatedMinutes: number;
  actualMinutes: number;
  startTime: Date | null;
  endTime: Date | null;
  isCompleted: boolean;
  order: number;
  userId: string;
  taskDate: Date;
  notes?: string;
}

// セッションの型定義
export interface Session {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  color: string;
  userId: string;
}

// カテゴリの型定義
export interface Category {
  id: string;
  name: string;
  label: string;
  color: string;
  totalMinutes: number;
}

// 統計情報の型定義
export interface Statistics {
  totalTasks: number;
  completedTasks: number;
  remainingTasks: number;
  totalHours: string;
  completedHours: string;
  remainingHours: string;
}

