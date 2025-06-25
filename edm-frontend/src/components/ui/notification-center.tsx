'use client';

import { useState } from 'react';
import { Bell, X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent } from './card';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuTrigger 
} from './dropdown-menu';
import { cn } from '@/lib/utils';

export interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionLabel?: string;
  onAction?: () => void;
}

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onRemove: (id: string) => void;
}

const notificationIcons = {
  success: CheckCircle,
  warning: AlertTriangle,
  info: Info,
  error: AlertCircle,
};

const notificationColors = {
  success: 'text-green-600',
  warning: 'text-yellow-600',
  info: 'text-blue-600',
  error: 'text-red-600',
};

export function NotificationCenter({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onRemove,
}: NotificationCenterProps) {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">通知</h3>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onMarkAllAsRead}
                className="text-xs"
              >
                全部标记为已读
              </Button>
            )}
          </div>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">暂无通知</p>
            </div>
          ) : (
            notifications.map((notification) => {
              const Icon = notificationIcons[notification.type];
              return (
                <div
                  key={notification.id}
                  className={cn(
                    'p-4 border-b hover:bg-gray-50 cursor-pointer',
                    !notification.read && 'bg-blue-50'
                  )}
                  onClick={() => !notification.read && onMarkAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <Icon className={cn('h-5 w-5 mt-0.5', notificationColors[notification.type])} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={cn(
                          'text-sm font-medium',
                          !notification.read && 'text-gray-900',
                          notification.read && 'text-gray-600'
                        )}>
                          {notification.title}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemove(notification.id);
                          }}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-gray-400">
                          {new Date(notification.timestamp).toLocaleString('zh-CN')}
                        </p>
                        {notification.actionLabel && notification.onAction && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              notification.onAction?.();
                            }}
                            className="text-xs h-6"
                          >
                            {notification.actionLabel}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Mock通知数据
export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'warning',
    title: '邮件额度不足',
    message: '您的免费额度已使用90%，剩余10封邮件',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    read: false,
    actionLabel: '升级套餐',
    onAction: () => console.log('升级套餐'),
  },
  {
    id: '2',
    type: 'success',
    title: '域名验证成功',
    message: 'service.mycompany.com 已通过DNS验证',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: '3',
    type: 'info',
    title: '新活动报告',
    message: 'Q3促销活动数据已更新，打开率达到38.1%',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
  {
    id: '4',
    type: 'error',
    title: 'API调用失败',
    message: '检测到API密钥认证失败，请检查密钥配置',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
];
