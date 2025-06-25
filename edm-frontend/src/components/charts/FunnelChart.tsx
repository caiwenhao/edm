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
                              <div className="h-3.5 w-3.5">
                                {item.icon}
                              </div>
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

  const maxValue = data[0].value; // 使用第一层（发送）作为基准值
  const totalConversionRate = data.length > 0 ? ((data[data.length - 1].value / data[0].value) * 100) : 0;

  return (
    <div className="w-full overflow-hidden" style={{ height: Math.min(height, 280) }}>
      <div className="h-full flex flex-col justify-center px-3 py-4">
        <div className="space-y-3 flex-1 flex flex-col justify-center">
          {data.map((item, index) => {
            // 相对于第一层的百分比
            const overallPercentage = (item.value / maxValue) * 100;
            // 相对于上一层的转化率
            const conversionRate = index > 0 ? (item.value / data[index - 1].value) * 100 : 100;
            // 漏斗宽度基于相对值
            const widthPercentage = Math.max(30, 30 + (overallPercentage / 100) * 60); // 30% 到 90% 的宽度范围

            return (
              <div key={item.name}>
                <div className="flex items-center gap-3">
                  {/* 漏斗形状 */}
                  <div className="flex-1 flex justify-center">
                    <div
                      className="relative overflow-hidden transition-all duration-300 hover:opacity-90"
                      style={{
                        width: `${widthPercentage}%`,
                        height: '32px',
                        background: `linear-gradient(135deg, ${item.color}, ${item.color}dd)`,
                        clipPath: index === data.length - 1
                          ? 'polygon(12% 0, 88% 0, 76% 100%, 24% 100%)'
                          : 'polygon(4% 0, 96% 0, 84% 100%, 16% 100%)',
                        borderRadius: '2px',
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      <div className="flex items-center justify-center h-full text-white px-2">
                        <div className="text-center min-w-0">
                          <div className="font-bold text-sm leading-tight truncate">
                            {item.value.toLocaleString()}
                          </div>
                          <div className="text-xs opacity-90 truncate">
                            {item.name}
                          </div>
                        </div>
                      </div>

                      {/* 光泽效果 */}
                      <div
                        className="absolute inset-0 opacity-20 pointer-events-none"
                        style={{
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.5) 0%, transparent 60%)'
                        }}
                      />
                    </div>
                  </div>

                  {/* 右侧数据 - 优化布局避免重叠 */}
                  <div className="text-right min-w-[85px] flex-shrink-0">
                    {index === 0 ? (
                      // 第一层显示基准
                      <div className="space-y-1">
                        <div className="text-xs text-gray-500">基准</div>
                        <div className="text-sm font-bold text-gray-900">100.0%</div>
                      </div>
                    ) : (
                      // 其他层显示占比和转化率，使用更清晰的布局
                      <div className="space-y-1">
                        <div className="flex flex-col">
                          <div className="text-xs text-gray-500 leading-tight">占比</div>
                          <div className="text-sm font-bold text-gray-900 leading-tight">{overallPercentage.toFixed(1)}%</div>
                        </div>
                        <div className="flex flex-col">
                          <div className="text-xs text-gray-500 leading-tight">转化</div>
                          <div className="text-sm font-bold text-green-600 leading-tight">{conversionRate.toFixed(1)}%</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 连接线 */}
                {index < data.length - 1 && (
                  <div className="flex justify-center my-1.5">
                    <div className="w-px h-2 bg-gray-300"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 总体转化率 */}
        <div className="mt-4 text-center bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg px-4 py-3">
          <div className="text-sm text-blue-600 font-medium">总体转化率</div>
          <div className="text-xl font-bold text-blue-900 my-1">
            {totalConversionRate.toFixed(1)}%
          </div>
          <div className="text-xs text-blue-500">
            从发送到点击的完整转化
          </div>
        </div>
      </div>
    </div>
  );
}

// 增强版漏斗图，用于活动报告页面
export function EnhancedFunnelChart({ data, width = 400, height = 350 }: FunnelChartProps) {
  if (!data || data.length === 0) return null;

  const maxValue = data[0].value; // 使用第一层（发送）作为基准值
  const totalConversionRate = data.length > 0 ? ((data[data.length - 1].value / data[0].value) * 100) : 0;

  return (
    <div className="w-full overflow-hidden" style={{ height: Math.min(height, 400) }}>
      <div className="h-full flex flex-col justify-center px-4 py-6">
        <div className="space-y-4 flex-1 flex flex-col justify-center">
          {data.map((item, index) => {
            // 相对于第一层的百分比
            const overallPercentage = (item.value / maxValue) * 100;
            // 相对于上一层的转化率
            const conversionRate = index > 0 ? (item.value / data[index - 1].value) * 100 : 100;
            // 漏斗宽度基于相对值
            const widthPercentage = Math.max(25, 25 + (overallPercentage / 100) * 65); // 25% 到 90% 的宽度范围

            return (
              <div key={item.name}>
                <div className="flex items-center gap-4">
                  {/* 漏斗形状 */}
                  <div className="flex-1 flex justify-center">
                    <div
                      className="relative overflow-hidden transition-all duration-300 hover:opacity-90 hover:scale-105"
                      style={{
                        width: `${widthPercentage}%`,
                        height: '42px',
                        background: `linear-gradient(135deg, ${item.color}, ${item.color}dd)`,
                        clipPath: index === data.length - 1
                          ? 'polygon(15% 0, 85% 0, 70% 100%, 30% 100%)'
                          : 'polygon(5% 0, 95% 0, 80% 100%, 20% 100%)',
                        borderRadius: '3px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                      }}
                    >
                      <div className="flex items-center justify-center h-full text-white px-3">
                        <div className="flex items-center space-x-2 min-w-0">
                          {item.icon && (
                            <div className="flex-shrink-0 opacity-90">
                              <div className="h-5 w-5">
                                {item.icon}
                              </div>
                            </div>
                          )}
                          <div className="text-center min-w-0">
                            <div className="font-bold text-base leading-tight truncate">
                              {item.value.toLocaleString()}
                            </div>
                            <div className="text-sm opacity-90 truncate">
                              {item.name}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 光泽效果 */}
                      <div
                        className="absolute inset-0 opacity-25 pointer-events-none"
                        style={{
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, transparent 60%)'
                        }}
                      />
                    </div>
                  </div>

                  {/* 右侧数据 */}
                  <div className="text-right min-w-[100px] flex-shrink-0">
                    {index === 0 ? (
                      // 第一层显示基准
                      <div className="space-y-1">
                        <div className="text-sm text-gray-500">基准</div>
                        <div className="text-lg font-bold text-gray-900">100.0%</div>
                      </div>
                    ) : (
                      // 其他层显示占比和转化率
                      <div className="space-y-2">
                        <div className="flex flex-col">
                          <div className="text-sm text-gray-500">占比</div>
                          <div className="text-lg font-bold text-gray-900">{overallPercentage.toFixed(1)}%</div>
                        </div>
                        <div className="flex flex-col">
                          <div className="text-sm text-gray-500">转化</div>
                          <div className="text-lg font-bold text-green-600">{conversionRate.toFixed(1)}%</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 连接线 */}
                {index < data.length - 1 && (
                  <div className="flex justify-center my-3">
                    <div className="w-px h-4 bg-gray-300"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 总体转化率 */}
        <div className="mt-6 text-center bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg px-6 py-4">
          <div className="text-base text-blue-600 font-medium">总体转化率</div>
          <div className="text-2xl font-bold text-blue-900 my-2">
            {totalConversionRate.toFixed(1)}%
          </div>
          <div className="text-sm text-blue-500">
            从发送到点击的完整转化流程
          </div>
        </div>
      </div>
    </div>
  );
}
