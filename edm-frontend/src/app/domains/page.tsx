'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Globe, 
  CheckCircle,
  AlertCircle,
  Clock,
  XCircle,
  Copy,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { Domain, DomainStatus } from '@/types';
import { domainsApi } from '@/lib/api';
import { toast } from 'sonner';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

const statusConfig = {
  pending: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50', label: '待验证' },
  verifying: { icon: RefreshCw, color: 'text-blue-600', bg: 'bg-blue-50', label: '验证中' },
  verified: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', label: '已验证' },
  failed: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', label: '验证失败' },
};

export default function DomainsPage() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newDomain, setNewDomain] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [verifyingDomains, setVerifyingDomains] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchDomains();
  }, []);

  const fetchDomains = async () => {
    try {
      const response = await domainsApi.getDomains();
      if (response.success && response.data) {
        setDomains(response.data);
      } else {
        toast.error('获取域名列表失败');
      }
    } catch (error) {
      toast.error('网络错误，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDomain = async () => {
    if (!newDomain.trim()) {
      toast.error('请输入域名');
      return;
    }

    // 简单的域名格式验证
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9])*$/;
    if (!domainRegex.test(newDomain.trim())) {
      toast.error('请输入有效的域名格式');
      return;
    }

    setIsAdding(true);
    try {
      const response = await domainsApi.addDomain(newDomain.trim());
      if (response.success && response.data) {
        setDomains(prev => [...prev, response.data!]);
        setNewDomain('');
        setShowAddDialog(false);
        toast.success('域名添加成功！请配置DNS记录');
      } else {
        toast.error('添加域名失败');
      }
    } catch (error) {
      toast.error('网络错误，请稍后重试');
    } finally {
      setIsAdding(false);
    }
  };

  const handleVerifyDomain = async (domainId: string) => {
    setVerifyingDomains(prev => new Set([...prev, domainId]));
    
    try {
      const response = await domainsApi.verifyDomain(domainId);
      if (response.success && response.data) {
        setDomains(prev => prev.map(domain => 
          domain.id === domainId ? response.data! : domain
        ));
        
        if (response.data.status === 'verified') {
          toast.success('域名验证成功！');
        } else {
          toast.error('域名验证失败，请检查DNS配置');
        }
      } else {
        toast.error('验证域名失败');
      }
    } catch (error) {
      toast.error('网络错误，请稍后重试');
    } finally {
      setVerifyingDomains(prev => {
        const newSet = new Set(prev);
        newSet.delete(domainId);
        return newSet;
      });
    }
  };

  const handleDeleteDomain = async (domainId: string) => {
    if (!confirm('确定要删除这个域名吗？此操作不可撤销。')) {
      return;
    }

    try {
      const response = await domainsApi.deleteDomain(domainId);
      if (response.success) {
        setDomains(prev => prev.filter(domain => domain.id !== domainId));
        toast.success('域名已删除');
      } else {
        toast.error('删除域名失败');
      }
    } catch (error) {
      toast.error('网络错误，请稍后重试');
    }
  };

  const handleCopyRecord = async (record: string) => {
    try {
      await navigator.clipboard.writeText(record);
      toast.success('DNS记录已复制到剪贴板');
    } catch (error) {
      toast.error('复制失败，请手动选择复制');
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">域名管理</h1>
            </div>
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-2/3"></div>
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
              <h1 className="text-2xl font-bold text-gray-900">域名管理</h1>
              <p className="text-gray-600">管理您的发信域名和DNS配置</p>
            </div>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  添加域名
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>添加新域名</DialogTitle>
                  <DialogDescription>
                    输入您要用于发送邮件的域名，我们将为您生成相应的DNS配置记录。
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="domain">域名</Label>
                    <Input
                      id="domain"
                      placeholder="例如：mail.yourdomain.com"
                      value={newDomain}
                      onChange={(e) => setNewDomain(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddDomain();
                        }
                      }}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowAddDialog(false)}
                    >
                      取消
                    </Button>
                    <Button
                      onClick={handleAddDomain}
                      disabled={isAdding || !newDomain.trim()}
                    >
                      {isAdding ? '添加中...' : '添加域名'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Domains List */}
          <div className="space-y-4">
            {domains.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    还没有域名
                  </h3>
                  <p className="text-gray-600 mb-4">
                    添加您的第一个发信域名来开始发送邮件
                  </p>
                  <Button onClick={() => setShowAddDialog(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    添加域名
                  </Button>
                </CardContent>
              </Card>
            ) : (
              domains.map((domain) => {
                const StatusIcon = statusConfig[domain.status].icon;
                const isVerifying = verifyingDomains.has(domain.id);
                
                return (
                  <Card key={domain.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <Globe className="h-5 w-5 text-gray-400" />
                          <h3 className="text-lg font-medium text-gray-900">
                            {domain.domain}
                          </h3>
                          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${statusConfig[domain.status].bg}`}>
                            <StatusIcon className={`h-3 w-3 ${statusConfig[domain.status].color} ${isVerifying ? 'animate-spin' : ''}`} />
                            <span className={statusConfig[domain.status].color}>
                              {isVerifying ? '验证中...' : statusConfig[domain.status].label}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {domain.status !== 'verified' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleVerifyDomain(domain.id)}
                              disabled={isVerifying}
                            >
                              <RefreshCw className={`h-4 w-4 mr-2 ${isVerifying ? 'animate-spin' : ''}`} />
                              {isVerifying ? '验证中' : '重新验证'}
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteDomain(domain.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="text-sm text-gray-500 mb-4">
                        <p>添加时间: {new Date(domain.createdAt).toLocaleString('zh-CN')}</p>
                        {domain.verifiedAt && (
                          <p>验证时间: {new Date(domain.verifiedAt).toLocaleString('zh-CN')}</p>
                        )}
                      </div>

                      {/* DNS Records */}
                      <Tabs defaultValue="spf" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="spf">SPF记录</TabsTrigger>
                          <TabsTrigger value="dkim">DKIM记录</TabsTrigger>
                          <TabsTrigger value="cname">CNAME记录</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="spf" className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium">SPF记录</Label>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCopyRecord(domain.dnsRecords.spf)}
                            >
                              <Copy className="h-3 w-3 mr-1" />
                              复制
                            </Button>
                          </div>
                          <code className="block bg-gray-100 p-3 rounded text-xs break-all">
                            {domain.dnsRecords.spf}
                          </code>
                        </TabsContent>
                        
                        <TabsContent value="dkim" className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium">DKIM记录</Label>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCopyRecord(domain.dnsRecords.dkim)}
                            >
                              <Copy className="h-3 w-3 mr-1" />
                              复制
                            </Button>
                          </div>
                          <code className="block bg-gray-100 p-3 rounded text-xs break-all">
                            {domain.dnsRecords.dkim}
                          </code>
                        </TabsContent>
                        
                        <TabsContent value="cname" className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium">CNAME记录</Label>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCopyRecord(domain.dnsRecords.cname)}
                            >
                              <Copy className="h-3 w-3 mr-1" />
                              复制
                            </Button>
                          </div>
                          <code className="block bg-gray-100 p-3 rounded text-xs break-all">
                            {domain.dnsRecords.cname}
                          </code>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>DNS配置说明</CardTitle>
              <CardDescription>
                如何在您的DNS服务商处配置这些记录
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">1. SPF记录</h4>
                <p className="text-sm text-gray-600">
                  在您的DNS管理面板中添加一条TXT记录，主机记录为"@"或您的域名，记录值为上面显示的SPF记录。
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">2. DKIM记录</h4>
                <p className="text-sm text-gray-600">
                  添加一条TXT记录，主机记录为"selector._domainkey"，记录值为上面显示的DKIM记录。
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">3. CNAME记录</h4>
                <p className="text-sm text-gray-600">
                  添加一条CNAME记录，按照上面显示的格式配置主机记录和记录值。
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>提示：</strong>DNS记录生效通常需要几分钟到几小时时间。配置完成后，点击"重新验证"按钮检查配置状态。
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
