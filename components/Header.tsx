'use client';

import { Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/AuthProvider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const tabs = [
  { id: 'tasks', label: 'タスク', active: true },
  { id: 'routine', label: 'ルーチン', active: false },
  { id: 'review', label: 'レビュー', active: false },
];

export default function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-[#2d3e50] text-white shadow-md">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="text-xl font-bold">▷TaskChuteCloud</div>
            </div>
            <nav className="flex space-x-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`px-4 py-2 rounded transition-colors ${
                    tab.active
                      ? 'bg-[#3498db] text-white'
                      : 'text-gray-300 hover:text-white hover:bg-[#34495e]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
          <div className="flex items-center space-x-2">
            {user && (
              <span className="text-sm text-gray-300 mr-2">
                {user.email}
              </span>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-[#34495e]"
                >
                  <Settings className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  ログアウト
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}

