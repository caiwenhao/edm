'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Copy, 
  Edit, 
  Trash2, 
  Search,
  Calendar,
  CheckCircle,
  Settings,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { campaignsApi } from '@/lib/api';
import { Campaign } from '@/types';

export default function CampaignManagePage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [newCampaignName, setNewCampaignName] = useState('');
  const [editCampaignName, setEditCampaignName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

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

  const handleCreateCampaign = async () => {
    if (!newCampaignName.trim()) {
      toast.error('请输入活动名称');
      return;
    }

    setIsCreating(true);
    try {
      const response = await campaignsApi.createCampaign({ name: newCampaignName.trim() });
      if (response.success && response.data) {
        toast.success('活动创建成功');
        setNewCampaignName('');
        setIsCreateDialogOpen(false);
        fetchCampaigns();
      } else {
        toast.error('创建活动失败');
      }
    } catch (error) {
      toast.error('网络错误，请稍后重试');
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditCampaign = async () => {
    if (!editingCampaign || !editCampaignName.trim()) {
      toast.error('请输入活动名称');
      return;
    }

    setIsUpdating(true);
    try {
      const response = await campaignsApi.updateCampaign(editingCampaign.id, { name: editCampaignName.trim() });
      if (response.success && response.data) {
        toast.success('活动更新成功');
        setEditCampaignName('');
        setEditingCampaign(null);
        setIsEditDialogOpen(false);
        fetchCampaigns();
      } else {
        toast.error('更新活动失败');
      }
    } catch (error) {
      toast.error('网络错误，请稍后重试');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteCampaign = async (campaign: Campaign) => {
    if (!confirm(`确定要删除活动"${campaign.name}"吗？删除后相关数据仍会保留，但活动将不再显示在列表中。`)) {
      return;
    }

    try {
      const response = await campaignsApi.deleteCampaign(campaign.id);
      if (response.success) {
        toast.success('活动删除成功');
        fetchCampaigns();
      } else {
        toast.error('删除活动失败');
      }
    } catch (error) {
      toast.error('网络错误，请稍后重试');
    }
  };

  const handleCopyId = (campaignId: string) => {
    navigator.clipboard.writeText(campaignId);
    toast.success('活动ID已复制到剪贴板');
  };

  const openEditDialog = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setEditCampaignName(campaign.name);
    setIsEditDialogOpen(true);
  };

  const getCreationTypeLabel = (creationType: string) => {
    return creationType === 'manual' ? '手动创建' : 'API自动发现';
  };

  const getCreationTypeBadgeVariant = (creationType: string) => {
    return creationType === 'manual' ? 'default' : 'secondary';
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">活动管理</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
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
              <h1 className="text-2xl font-bold text-gray-900">活动管理</h1>
              <p className="text-gray-600">创建和管理您的邮件活动，获取活动ID用于API调用</p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  创建活动
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>创建新活动</DialogTitle>
                  <DialogDescription>
                    输入活动名称，系统将自动生成唯一的活动ID
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="campaign-name">活动名称</Label>
                    <Input
                      id="campaign-name"
                      placeholder="例如：双十一大促"
                      value={newCampaignName}
                      onChange={(e) => setNewCampaignName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleCreateCampaign()}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      取消
                    </Button>
                    <Button onClick={handleCreateCampaign} disabled={isCreating}>
                      {isCreating ? '创建中...' : '创建'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
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

          {/* Campaigns Grid */}
          {filteredCampaigns.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? '没有找到匹配的活动' : '还没有活动'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm ? '尝试使用不同的搜索词' : '创建您的第一个活动，获取活动ID用于API调用'}
                </p>
                {!searchTerm && (
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    创建活动
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCampaigns.map((campaign) => (
                <Card key={campaign.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg truncate">{campaign.name}</CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant={getCreationTypeBadgeVariant(campaign.creationType)}>
                            {getCreationTypeLabel(campaign.creationType)}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 ml-2">
                        {campaign.creationType === 'manual' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(campaign)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {campaign.creationType === 'manual' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCampaign(campaign)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs text-gray-500">活动ID</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <code className="flex-1 text-xs bg-gray-100 px-2 py-1 rounded font-mono truncate">
                            {campaign.id}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyId(campaign.id)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        创建于 {new Date(campaign.createdAt).toLocaleDateString('zh-CN')}
                      </div>

                      {campaign.stats.sent > 0 && (
                        <div className="pt-2 border-t">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <div className="text-gray-500">发送量</div>
                              <div className="font-medium">{campaign.stats.sent.toLocaleString()}</div>
                            </div>
                            <div>
                              <div className="text-gray-500">送达率</div>
                              <div className="font-medium">{campaign.stats.deliveryRate.toFixed(1)}%</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>编辑活动</DialogTitle>
                <DialogDescription>
                  修改活动名称，活动ID将保持不变
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-campaign-name">活动名称</Label>
                  <Input
                    id="edit-campaign-name"
                    value={editCampaignName}
                    onChange={(e) => setEditCampaignName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleEditCampaign()}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    取消
                  </Button>
                  <Button onClick={handleEditCampaign} disabled={isUpdating}>
                    {isUpdating ? '更新中...' : '更新'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
