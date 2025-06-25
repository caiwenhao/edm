import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from './card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  change?: {
    value: string;
    trend: 'up' | 'down' | 'neutral';
  };
  subtitle?: string;
  className?: string;
  children?: ReactNode;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  iconColor = 'text-blue-600',
  change,
  subtitle,
  className,
  children,
}: StatCardProps) {
  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600',
  };

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex items-center space-x-2 mb-2">
          <Icon className={cn('h-5 w-5', iconColor)} />
          <span className="text-sm font-medium text-gray-600">{title}</span>
        </div>
        
        <div className="mt-2">
          <div className="text-2xl font-bold text-gray-900">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>
          
          {(change || subtitle) && (
            <div className="flex items-center justify-between mt-1">
              {change && (
                <div className={cn('text-xs', trendColors[change.trend])}>
                  {change.value}
                </div>
              )}
              {subtitle && (
                <div className="text-xs text-gray-500">
                  {subtitle}
                </div>
              )}
            </div>
          )}
        </div>
        
        {children}
      </CardContent>
    </Card>
  );
}
