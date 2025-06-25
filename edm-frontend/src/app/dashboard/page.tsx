'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Mail,
  CheckCircle,
  Eye,
  MousePointer,
  TrendingUp,
  AlertTriangle,
  Plus
} from 'lucide-react';
import { DashboardData } from '@/types';
import { dashboardApi } from '@/lib/api';
import { toast } from 'sonner';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/ui/stat-card';
import { EmailStatsChart, TrendChart } from '@/components/charts/EmailStatsChart';
import { Loading } from '@/components/ui/loading';

// 先创建一个简单的Progress组件，因为shadcn可能没有包含
const SimpleProgress = ({ value, className }: { value: number; className?: string }) => (
  <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
    <div
      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
      style={{ width: `${value}%` }}
    />
  </div>
);

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dashboardApi.getDashboardData();
        if (response.success && response.data) {
          setData(response.data);
        } else {
          toast.error('获取数据失败');
        }
      } catch (error) {
        toast.error('网络错误，请稍后重试');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">仪表盘</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">暂无数据</p>
      </div>
    );
  }

  const { quota, totalStats } = data;
  const isLowQuota = quota.percentage > 90;

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">仪表盘</h1>
              <p className="text-gray-600">欢迎回来，查看您的邮件发送概况</p>
            </div>
            <div className="flex space-x-3">
              <Button asChild>
                <Link href="/api-keys">
                  <Plus className="mr-2 h-4 w-4" />
                  创建API密钥
                </Link>
              </Button>
            </div>
          </div>

      {/* Quota Alert */}
      {isLowQuota && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-orange-800">
                  邮件额度即将用完
                </p>
                <p className="text-sm text-orange-700">
                  您的免费额度已使用 {quota.percentage}%，剩余 {quota.remaining} 封邮件
                </p>
              </div>
              <Button size="sm" variant="outline">
                升级套餐
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quota Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>邮件额度</span>
          </CardTitle>
          <CardDescription>
            您的当前邮件发送额度使用情况
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">已使用</span>
              <span className="text-sm font-medium">
                {quota.used} / {quota.total} 封
              </span>
            </div>
            <SimpleProgress value={quota.percentage} />
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">剩余额度</span>
              <span className="font-medium text-green-600">
                {quota.remaining} 封
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="总发送量"
          value={totalStats.sent}
          icon={Mail}
          iconColor="text-blue-600"
          change={{ value: '+12.5%', trend: 'up' }}
        />

        <StatCard
          title="送达率"
          value={`${totalStats.deliveryRate}%`}
          icon={CheckCircle}
          iconColor="text-green-600"
          subtitle={`${totalStats.delivered.toLocaleString()} 封送达`}
        />

        <StatCard
          title="打开率"
          value={`${totalStats.openRate}%`}
          icon={Eye}
          iconColor="text-purple-600"
          subtitle={`${totalStats.opened.toLocaleString()} 次打开`}
        />

        <StatCard
          title="点击率"
          value={`${totalStats.clickRate}%`}
          icon={MousePointer}
          iconColor="text-orange-600"
          subtitle={`${totalStats.clicked.toLocaleString()} 次点击`}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EmailStatsChart
          data={data.chartData}
          type="line"
          title="邮件发送趋势"
          description="过去7天的邮件发送、送达、打开、点击趋势"
        />

        <EmailStatsChart
          data={data.chartData}
          type="pie"
          title="数据分布"
          description="送达、打开、点击数据的分布情况"
        />
      </div>

      {/* Recent Campaigns */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>最近活动</CardTitle>
              <CardDescription>
                您最近的邮件活动表现
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/campaigns">查看全部</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.recentCampaigns.map((campaign) => (
              <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{campaign.name}</h4>
                  <p className="text-sm text-gray-500">
                    {new Date(campaign.createdAt).toLocaleDateString('zh-CN')}
                  </p>
                </div>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="text-center">
                    <div className="font-medium text-gray-900">
                      {campaign.stats.sent.toLocaleString()}
                    </div>
                    <div className="text-gray-500">发送</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-green-600">
                      {campaign.stats.deliveryRate}%
                    </div>
                    <div className="text-gray-500">送达</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-purple-600">
                      {campaign.stats.openRate}%
                    </div>
                    <div className="text-gray-500">打开</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-orange-600">
                      {campaign.stats.clickRate}%
                    </div>
                    <div className="text-gray-500">点击</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
