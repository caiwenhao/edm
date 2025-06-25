'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Key,
  Globe,
  BarChart3,
  Settings,
  LogOut,
  Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  onLogout?: () => void;
}

const navigation = [
  {
    name: '仪表盘',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'API密钥',
    href: '/api-keys',
    icon: Key,
  },
  {
    name: '发信身份管理',
    href: '/domains',
    icon: Globe,
  },
  {
    name: '活动报告',
    href: '/campaigns',
    icon: BarChart3,
  },
  {
    name: '设置',
    href: '/settings',
    icon: Settings,
  },
];

export function Sidebar({ onLogout }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Mail className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-lg font-semibold text-gray-900">EDM网关</h1>
            <p className="text-xs text-gray-500">智能投递平台</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-gray-200 p-4">
        {onLogout && (
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-600 hover:text-red-600"
            size="sm"
            onClick={onLogout}
          >
            <LogOut className="mr-3 h-4 w-4" />
            退出登录
          </Button>
        )}
      </div>
    </div>
  );
}
