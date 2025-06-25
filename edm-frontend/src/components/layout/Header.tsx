'use client';

import { useState } from 'react';
import { User, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NotificationCenter, mockNotifications, Notification } from '@/components/ui/notification-center';

interface HeaderProps {
  user?: {
    name?: string;
    email: string;
  };
  onLogout?: () => void;
}

export function Header({ user, onLogout }: HeaderProps) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const handleRemoveNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex items-center space-x-4 flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="搜索活动、域名..."
            className="pl-10 w-80"
          />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <NotificationCenter
          notifications={notifications}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
          onRemove={handleRemoveNotification}
        />

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name || user?.email?.split('@')[0] || '用户'}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>我的账户</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              个人资料
            </DropdownMenuItem>
            <DropdownMenuItem>
              账户设置
            </DropdownMenuItem>
            <DropdownMenuItem>
              计费信息
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout} className="text-red-600">
              退出登录
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
