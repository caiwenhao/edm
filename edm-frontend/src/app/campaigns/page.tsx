'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  BarChart3,
  Search,
  Mail,
  CheckCircle,
  Eye,
  MousePointer,
  Calendar,
  TrendingUp,
  Download
} from 'lucide-react';
import { Campaign } from '@/types';
import { campaignsApi } from '@/lib/api';
import { toast } from 'sonner';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCampaigns();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setFilteredCampaigns(
        campaigns.filter(campaign =>
          campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          campaign.id.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredCampaigns(campaigns);
    }
  }, [campaigns, searchTerm]);

  const fetchCampaigns = async () => {
    try {
      const response = await campaignsApi.getCampaigns();
      if (response.success && response.data) {
        setCampaigns(response.data);
      } else {
        toast.error('获取活动数据失败');
      }
    } catch (error) {
      toast.error('网络错误，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = () => {
    // 模拟导出功能
    toast.success('数据导出功能开发中...');
  };

  // 准备图表数据
  const chartData = filteredCampaigns.map(campaign => ({
    name: campaign.name.length > 10 ? campaign.name.substring(0, 10) + '...' : campaign.name,
    sent: campaign.stats.sent,
    delivered: campaign.stats.delivered,
    opened: campaign.stats.opened,
    clicked: campaign.stats.clicked,
  }));

  const pieData = [
    { name: '已送达', value: filteredCampaigns.reduce((sum, c) => sum + c.stats.delivered, 0) },
    { name: '已打开', value: filteredCampaigns.reduce((sum, c) => sum + c.stats.opened, 0) },
    { name: '已点击', value: filteredCampaigns.reduce((sum, c) => sum + c.stats.clicked, 0) },
  ];

  const totalStats = {
    sent: filteredCampaigns.reduce((sum, c) => sum + c.stats.sent, 0),
    delivered: filteredCampaigns.reduce((sum, c) => sum + c.stats.delivered, 0),
    opened: filteredCampaigns.reduce((sum, c) => sum + c.stats.opened, 0),
    clicked: filteredCampaigns.reduce((sum, c) => sum + c.stats.clicked, 0),
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">活动报告</h1>
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
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">活动报告</h1>
              <p className="text-gray-600">查看您的邮件活动详细数据和分析</p>
            </div>
            <Button onClick={handleExportData} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              导出数据
            </Button>
          </div>

          {/* Search */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="搜索活动名称或ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-600">总发送量</span>
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-bold text-gray-900">
                    {totalStats.sent.toLocaleString()}
                  </div>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-xs text-green-600">活跃活动 {filteredCampaigns.length} 个</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-600">总送达量</span>
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-bold text-gray-900">
                    {totalStats.delivered.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    送达率 {totalStats.sent > 0 ? ((totalStats.delivered / totalStats.sent) * 100).toFixed(1) : 0}%
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Eye className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium text-gray-600">总打开量</span>
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-bold text-gray-900">
                    {totalStats.opened.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    打开率 {totalStats.delivered > 0 ? ((totalStats.opened / totalStats.delivered) * 100).toFixed(1) : 0}%
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <MousePointer className="h-5 w-5 text-orange-600" />
                  <span className="text-sm font-medium text-gray-600">总点击量</span>
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-bold text-gray-900">
                    {totalStats.clicked.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    点击率 {totalStats.opened > 0 ? ((totalStats.clicked / totalStats.opened) * 100).toFixed(1) : 0}%
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>活动数据对比</CardTitle>
                <CardDescription>各活动的发送、送达、打开、点击数据对比</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sent" fill="#3B82F6" name="发送" />
                    <Bar dataKey="delivered" fill="#10B981" name="送达" />
                    <Bar dataKey="opened" fill="#F59E0B" name="打开" />
                    <Bar dataKey="clicked" fill="#EF4444" name="点击" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>总体数据分布</CardTitle>
                <CardDescription>送达、打开、点击数据的分布情况</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
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
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Campaigns List */}
          <Card>
            <CardHeader>
              <CardTitle>活动列表</CardTitle>
              <CardDescription>
                所有活动的详细数据 {searchTerm && `(搜索: "${searchTerm}")`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredCampaigns.length === 0 ? (
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchTerm ? '没有找到匹配的活动' : '还没有活动数据'}
                  </h3>
                  <p className="text-gray-600">
                    {searchTerm ? '尝试使用不同的搜索词' : '开始发送邮件后，活动数据将自动出现在这里'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredCampaigns.map((campaign) => (
                    <div key={campaign.id} className="border rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{campaign.name}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              创建: {new Date(campaign.createdAt).toLocaleDateString('zh-CN')}
                            </div>
                            {campaign.lastActivity && (
                              <div>
                                最后活动: {new Date(campaign.lastActivity).toLocaleDateString('zh-CN')}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          ID: {campaign.id}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded">
                          <div className="text-2xl font-bold text-blue-600">
                            {campaign.stats.sent.toLocaleString()}
                          </div>
                          <div className="text-sm text-blue-700">发送</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded">
                          <div className="text-2xl font-bold text-green-600">
                            {campaign.stats.deliveryRate}%
                          </div>
                          <div className="text-sm text-green-700">送达率</div>
                          <div className="text-xs text-green-600">
                            {campaign.stats.delivered.toLocaleString()} 封
                          </div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded">
                          <div className="text-2xl font-bold text-purple-600">
                            {campaign.stats.openRate}%
                          </div>
                          <div className="text-sm text-purple-700">打开率</div>
                          <div className="text-xs text-purple-600">
                            {campaign.stats.opened.toLocaleString()} 次
                          </div>
                        </div>
                        <div className="text-center p-3 bg-orange-50 rounded">
                          <div className="text-2xl font-bold text-orange-600">
                            {campaign.stats.clickRate}%
                          </div>
                          <div className="text-sm text-orange-700">点击率</div>
                          <div className="text-xs text-orange-600">
                            {campaign.stats.clicked.toLocaleString()} 次
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
