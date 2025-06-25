'use client';

import { useState } from 'react';
import { ChevronUp, ChevronDown, Search } from 'lucide-react';
import { Input } from './input';
import { Button } from './button';
import { cn } from '@/lib/utils';

export interface Column<T> {
  key: keyof T;
  title: string;
  sortable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
  width?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchable = false,
  searchPlaceholder = '搜索...',
  emptyMessage = '暂无数据',
  className,
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // 搜索过滤
  const filteredData = searchable
    ? data.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : data;

  // 排序
  const sortedData = sortConfig
    ? [...filteredData].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      })
    : filteredData;

  const handleSort = (key: keyof T) => {
    setSortConfig((current) => {
      if (current?.key === key) {
        return {
          key,
          direction: current.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      return { key, direction: 'asc' };
    });
  };

  return (
    <div className={cn('space-y-4', className)}>
      {searchable && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      )}

      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={String(column.key)}
                    className={cn(
                      'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                      column.sortable && 'cursor-pointer hover:bg-gray-100',
                      column.width && `w-${column.width}`
                    )}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{column.title}</span>
                      {column.sortable && (
                        <div className="flex flex-col">
                          <ChevronUp
                            className={cn(
                              'h-3 w-3',
                              sortConfig?.key === column.key && sortConfig.direction === 'asc'
                                ? 'text-gray-900'
                                : 'text-gray-400'
                            )}
                          />
                          <ChevronDown
                            className={cn(
                              'h-3 w-3 -mt-1',
                              sortConfig?.key === column.key && sortConfig.direction === 'desc'
                                ? 'text-gray-900'
                                : 'text-gray-400'
                            )}
                          />
                        </div>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                sortedData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    {columns.map((column) => (
                      <td
                        key={String(column.key)}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      >
                        {column.render
                          ? column.render(item[column.key], item)
                          : String(item[column.key])}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {searchable && searchTerm && (
        <div className="text-sm text-gray-500">
          找到 {sortedData.length} 条结果
        </div>
      )}
    </div>
  );
}
