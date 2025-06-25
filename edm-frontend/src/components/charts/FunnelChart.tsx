'use client';

import React from 'react';

interface FunnelData {
  name: string;
  value: number;
  color: string;
  icon?: React.ReactNode;
}

interface FunnelChartProps {
  data: FunnelData[];
  width?: number;
  height?: number;
}

export function FunnelChart({ data, width = 400, height = 350 }: FunnelChartProps) {
  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="w-full overflow-hidden" style={{ height: Math.min(height, 350) }}>
      <div className="h-full flex flex-col justify-center px-1 sm:px-2 py-2 sm:py-3">
        {/* 漏斗层级 */}
        <div className="space-y-1.5 sm:space-y-2 flex-1 flex flex-col justify-center">
          {data.map((item, index) => {
            const percentage = (item.value / maxValue) * 100;
            const widthPercentage = Math.max(45, 45 + (percentage / 100) * 45); // 45% 到 90% 的宽度范围
            const conversionRate = index > 0 ? (item.value / data[index - 1].value) * 100 : 100;

            return (
              <div key={item.name} className="relative">
                {/* 漏斗层级 */}
                <div className="flex items-center gap-2 sm:gap-3">
                  {/* 漏斗形状 */}
                  <div className="flex-1 flex justify-center">
                    <div
                      className="relative overflow-hidden transition-all duration-300 hover:opacity-90"
                      style={{
                        width: `${widthPercentage}%`,
                        height: '38px',
                        background: `linear-gradient(135deg, ${item.color}, ${item.color}dd)`,
                        clipPath: index === data.length - 1
                          ? 'polygon(8% 0, 92% 0, 82% 100%, 18% 100%)'
                          : 'polygon(2% 0, 98% 0, 88% 100%, 12% 100%)',
                        borderRadius: '2px',
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
                      }}
                    >
                      {/* 内容 */}
                      <div className="flex items-center justify-center h-full text-white px-1.5 sm:px-2">
                        <div className="flex items-center space-x-1 sm:space-x-1.5 min-w-0">
                          {item.icon && (
                            <div className="hidden sm:block flex-shrink-0 opacity-90">
                              {React.cloneElement(item.icon as React.ReactElement, { className: 'h-3.5 w-3.5' })}
                            </div>
                          )}
                          <div className="text-center min-w-0">
                            <div className="font-bold text-xs sm:text-sm leading-tight truncate">
                              {item.value.toLocaleString()}
                            </div>
                            <div className="text-xs opacity-90 truncate">
                              {item.name}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 光泽效果 */}
                      <div
                        className="absolute inset-0 opacity-15 pointer-events-none"
                        style={{
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 60%)'
                        }}
                      />
                    </div>
                  </div>

                  {/* 右侧数据 */}
                  <div className="text-right min-w-[60px] sm:min-w-[70px] flex-shrink-0">
                    <div className="text-xs text-gray-500">占比</div>
                    <div className="font-bold text-gray-900 text-xs sm:text-sm">{percentage.toFixed(1)}%</div>
                    {index > 0 && (
                      <>
                        <div className="text-xs text-gray-500 mt-0.5">转化</div>
                        <div className="font-bold text-green-600 text-xs sm:text-sm">{conversionRate.toFixed(1)}%</div>
                      </>
                    )}
                  </div>
                </div>

                {/* 连接线 */}
                {index < data.length - 1 && (
                  <div className="flex justify-center my-1 sm:my-1.5">
                    <div className="w-px h-1 sm:h-1.5 bg-gray-300"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 总体转化率 */}
        <div className="mt-2 sm:mt-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-2 sm:p-2.5">
          <div className="text-center">
            <div className="text-xs text-blue-600 font-medium">总体转化率</div>
            <div className="text-base sm:text-lg font-bold text-blue-900">
              {data.length > 0 ? ((data[data.length - 1].value / data[0].value) * 100).toFixed(1) : 0}%
            </div>
            <div className="text-xs text-blue-500">
              从发送到点击的完整转化
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 简化版漏斗图，用于较小的空间
export function SimpleFunnelChart({ data, width = 300, height = 220 }: FunnelChartProps) {
  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="w-full overflow-hidden" style={{ height: Math.min(height, 220) }}>
      <div className="h-full flex flex-col justify-center px-1 sm:px-2 py-2">
        <div className="space-y-1 sm:space-y-1.5 flex-1 flex flex-col justify-center">
          {data.map((item, index) => {
            const percentage = (item.value / maxValue) * 100;
            const widthPercentage = Math.max(40, 40 + (percentage / 100) * 45); // 40% 到 85% 的宽度范围
            const conversionRate = index > 0 ? (item.value / data[index - 1].value) * 100 : 100;

            return (
              <div key={item.name}>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {/* 漏斗形状 */}
                  <div className="flex-1 flex justify-center">
                    <div
                      className="relative overflow-hidden transition-all duration-300 hover:opacity-90"
                      style={{
                        width: `${widthPercentage}%`,
                        height: '28px',
                        background: `linear-gradient(135deg, ${item.color}, ${item.color}dd)`,
                        clipPath: index === data.length - 1
                          ? 'polygon(10% 0, 90% 0, 78% 100%, 22% 100%)'
                          : 'polygon(2% 0, 98% 0, 86% 100%, 14% 100%)',
                        borderRadius: '1px',
                        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.08)',
                      }}
                    >
                      <div className="flex items-center justify-center h-full text-white px-1 sm:px-1.5">
                        <div className="text-center min-w-0">
                          <div className="font-bold text-xs leading-tight truncate">
                            {item.value.toLocaleString()}
                          </div>
                          <div className="text-xs opacity-90 truncate">
                            {item.name}
                          </div>
                        </div>
                      </div>

                      {/* 光泽效果 */}
                      <div
                        className="absolute inset-0 opacity-15 pointer-events-none"
                        style={{
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 60%)'
                        }}
                      />
                    </div>
                  </div>

                  {/* 右侧数据 */}
                  <div className="text-right min-w-[45px] sm:min-w-[50px] flex-shrink-0">
                    <div className="text-xs text-gray-900 font-semibold">{percentage.toFixed(1)}%</div>
                    {index > 0 && (
                      <div className="text-xs text-green-600 font-medium">{conversionRate.toFixed(1)}%</div>
                    )}
                  </div>
                </div>

                {index < data.length - 1 && (
                  <div className="flex justify-center my-0.5 sm:my-1">
                    <div className="w-px h-0.5 sm:h-1 bg-gray-300"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 简化的总体转化率 */}
        <div className="mt-1.5 sm:mt-2 text-center bg-blue-50 rounded-lg px-2 py-1.5">
          <div className="text-xs text-blue-600">总转化率</div>
          <div className="font-bold text-blue-900 text-sm">
            {data.length > 0 ? ((data[data.length - 1].value / data[0].value) * 100).toFixed(1) : 0}%
          </div>
        </div>
      </div>
    </div>
  );
}
