'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Plus, 
  Copy, 
  Trash2, 
  Key, 
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { ApiKey } from '@/types';
import { apiKeysApi } from '@/lib/api';
import { toast } from 'sonner';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      const response = await apiKeysApi.getApiKeys();
      if (response.success && response.data) {
        setApiKeys(response.data);
      } else {
        toast.error('获取API密钥失败');
      }
    } catch (error) {
      toast.error('网络错误，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) {
      toast.error('请输入密钥名称');
      return;
    }

    setIsCreating(true);
    try {
      const response = await apiKeysApi.createApiKey(newKeyName.trim());
      if (response.success && response.data) {
        setApiKeys(prev => [...prev, response.data!]);
        setNewKeyName('');
        setShowCreateDialog(false);
        toast.success('API密钥创建成功！');
      } else {
        toast.error('创建API密钥失败');
      }
    } catch (error) {
      toast.error('网络错误，请稍后重试');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteKey = async (keyId: string) => {
    if (!confirm('确定要删除这个API密钥吗？此操作不可撤销。')) {
      return;
    }

    try {
      const response = await apiKeysApi.deleteApiKey(keyId);
      if (response.success) {
        setApiKeys(prev => prev.filter(key => key.id !== keyId));
        toast.success('API密钥已删除');
      } else {
        toast.error('删除API密钥失败');
      }
    } catch (error) {
      toast.error('网络错误，请稍后重试');
    }
  };

  const handleCopyKey = async (key: string) => {
    try {
      await navigator.clipboard.writeText(key);
      toast.success('API密钥已复制到剪贴板');
    } catch (error) {
      toast.error('复制失败，请手动选择复制');
    }
  };

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(keyId)) {
        newSet.delete(keyId);
      } else {
        newSet.add(keyId);
      }
      return newSet;
    });
  };

  const maskKey = (key: string) => {
    if (key.length <= 8) return key;
    return key.substring(0, 12) + '•'.repeat(20) + key.substring(key.length - 8);
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">API密钥管理</h1>
            </div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
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
              <h1 className="text-2xl font-bold text-gray-900">API密钥管理</h1>
              <p className="text-gray-600">管理您的API密钥，用于应用程序集成</p>
            </div>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  创建新密钥
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>创建新的API密钥</DialogTitle>
                  <DialogDescription>
                    为您的API密钥输入一个描述性名称，以便于识别和管理。
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="keyName">密钥名称</Label>
                    <Input
                      id="keyName"
                      placeholder="例如：生产环境密钥"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleCreateKey();
                        }
                      }}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowCreateDialog(false)}
                    >
                      取消
                    </Button>
                    <Button
                      onClick={handleCreateKey}
                      disabled={isCreating || !newKeyName.trim()}
                    >
                      {isCreating ? '创建中...' : '创建密钥'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* API Keys List */}
          <div className="space-y-4">
            {apiKeys.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Key className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    还没有API密钥
                  </h3>
                  <p className="text-gray-600 mb-4">
                    创建您的第一个API密钥来开始使用我们的服务
                  </p>
                  <Button onClick={() => setShowCreateDialog(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    创建API密钥
                  </Button>
                </CardContent>
              </Card>
            ) : (
              apiKeys.map((apiKey) => (
                <Card key={apiKey.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-medium text-gray-900">
                            {apiKey.name}
                          </h3>
                          <div className="flex items-center space-x-1">
                            {apiKey.isActive ? (
                              <>
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span className="text-sm text-green-600">活跃</span>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-500">已禁用</span>
                              </>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 mb-2">
                          <code className="bg-gray-100 px-3 py-2 rounded font-mono text-sm flex-1">
                            {visibleKeys.has(apiKey.id) ? apiKey.key : maskKey(apiKey.key)}
                          </code>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleKeyVisibility(apiKey.id)}
                          >
                            {visibleKeys.has(apiKey.id) ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopyKey(apiKey.key)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="text-sm text-gray-500">
                          <p>创建时间: {new Date(apiKey.createdAt).toLocaleString('zh-CN')}</p>
                          {apiKey.lastUsed && (
                            <p>最后使用: {new Date(apiKey.lastUsed).toLocaleString('zh-CN')}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteKey(apiKey.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Usage Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>使用说明</CardTitle>
              <CardDescription>
                如何在您的应用程序中使用API密钥
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">1. 在请求头中添加认证信息</h4>
                <code className="block bg-gray-100 p-3 rounded text-sm">
                  Authorization: Bearer YOUR_API_KEY
                </code>
              </div>
              <div>
                <h4 className="font-medium mb-2">2. 发送邮件示例</h4>
                <code className="block bg-gray-100 p-3 rounded text-sm whitespace-pre">
{`POST /api/v1/send
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY

{
  "to": ["user@example.com"],
  "subject": "测试邮件",
  "html": "<h1>Hello World</h1>",
  "from": "noreply@yourdomain.com",
  "campaign_id": "test_campaign"
}`}
                </code>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
