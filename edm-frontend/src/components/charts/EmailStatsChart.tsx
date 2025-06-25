'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316'];

interface EmailStatsData {
  date?: string;
  name?: string;
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
}

interface EmailStatsChartProps {
  data: EmailStatsData[];
  type: 'bar' | 'line' | 'pie';
  title: string;
  description?: string;
  height?: number;
}

export function EmailStatsChart({
  data,
  type,
  title,
  description,
  height = 300
}: EmailStatsChartProps) {
  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                formatter={(value, name) => [
                  typeof value === 'number' ? value.toLocaleString() : value,
                  name
                ]}
              />
              <Legend />
              <Bar dataKey="sent" fill={COLORS[0]} name="发送" />
              <Bar dataKey="delivered" fill={COLORS[1]} name="送达" />
              <Bar dataKey="opened" fill={COLORS[2]} name="打开" />
              <Bar dataKey="clicked" fill={COLORS[3]} name="点击" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                formatter={(value, name) => [
                  typeof value === 'number' ? value.toLocaleString() : value,
                  name
                ]}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="sent"
                stroke={COLORS[0]}
                strokeWidth={2}
                name="发送"
              />
              <Line
                type="monotone"
                dataKey="delivered"
                stroke={COLORS[1]}
                strokeWidth={2}
                name="送达"
              />
              <Line
                type="monotone"
                dataKey="opened"
                stroke={COLORS[2]}
                strokeWidth={2}
                name="打开"
              />
              <Line
                type="monotone"
                dataKey="clicked"
                stroke={COLORS[3]}
                strokeWidth={2}
                name="点击"
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'pie':
        const pieData = [
          { name: '已送达', value: data.reduce((sum, item) => sum + item.delivered, 0) },
          { name: '已打开', value: data.reduce((sum, item) => sum + item.opened, 0) },
          { name: '已点击', value: data.reduce((sum, item) => sum + item.clicked, 0) },
        ];

        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [
                typeof value === 'number' ? value.toLocaleString() : value
              ]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {renderChart()}
      </CardContent>
    </Card>
  );
}

// 专门的趋势图组件
interface TrendChartProps {
  data: { date: string; value: number; label?: string }[];
  title: string;
  description?: string;
  color?: string;
  height?: number;
}

export function TrendChart({
  data,
  title,
  description,
  color = COLORS[0],
  height = 200
}: TrendChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip
              formatter={(value) => [
                typeof value === 'number' ? value.toLocaleString() : value
              ]}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={{ fill: color, strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
