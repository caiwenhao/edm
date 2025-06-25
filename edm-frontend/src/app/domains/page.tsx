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
  RefreshCw,
  Shield,
  Mail,
  Key,
  FileText,
  Server,
  UserPlus,
  AtSign
} from 'lucide-react';
import { Domain, DomainStatus, DnsRecord, DnsRecordStatus, SenderEmail } from '@/types';
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

const dnsRecordConfig = {
  ownership: { icon: Shield, label: '所有权验证', required: true },
  spf: { icon: Mail, label: 'SPF验证', required: true },
  dkim: { icon: Key, label: 'DKIM验证', required: false },
  dmarc: { icon: FileText, label: 'DMARC验证', required: false },
  mx: { icon: Server, label: 'MX验证', required: true },
};

export default function DomainsPage() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newDomain, setNewDomain] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [verifyingDomains, setVerifyingDomains] = useState<Set<string>>(new Set());

  // 发信邮箱管理状态
  const [showAddEmailDialog, setShowAddEmailDialog] = useState(false);
  const [selectedDomainId, setSelectedDomainId] = useState<string>('');
  const [newEmailPrefix, setNewEmailPrefix] = useState('');
  const [isAddingEmail, setIsAddingEmail] = useState(false);

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

  const handleCopyRecord = async (record: DnsRecord) => {
    try {
      const copyText = `${record.type} ${record.host} ${record.value}`;
      await navigator.clipboard.writeText(copyText);
      toast.success('DNS记录已复制到剪贴板');
    } catch (error) {
      toast.error('复制失败，请手动选择复制');
    }
  };

  const handleCopyValue = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success('记录值已复制到剪贴板');
    } catch (error) {
      toast.error('复制失败，请手动选择复制');
    }
  };

  // 发信邮箱管理函数
  const handleAddSenderEmail = async () => {
    if (!newEmailPrefix.trim()) {
      toast.error('请输入邮箱前缀');
      return;
    }

    // 简单的邮箱前缀验证
    const emailPrefixRegex = /^[a-zA-Z0-9][a-zA-Z0-9._-]*[a-zA-Z0-9]$|^[a-zA-Z0-9]$/;
    if (!emailPrefixRegex.test(newEmailPrefix.trim())) {
      toast.error('请输入有效的邮箱前缀格式');
      return;
    }

    setIsAddingEmail(true);
    try {
      const response = await domainsApi.addSenderEmail(selectedDomainId, newEmailPrefix.trim());
      if (response.success && response.data) {
        // 更新域名列表中的发信邮箱
        setDomains(prev => prev.map(domain =>
          domain.id === selectedDomainId
            ? { ...domain, senderEmails: [...(domain.senderEmails || []), response.data!] }
            : domain
        ));
        setNewEmailPrefix('');
        setShowAddEmailDialog(false);
        toast.success('发信邮箱添加成功！');
      } else {
        toast.error('添加发信邮箱失败，可能邮箱已存在或域名未验证');
      }
    } catch (error) {
      toast.error('网络错误，请稍后重试');
    } finally {
      setIsAddingEmail(false);
    }
  };

  const handleDeleteSenderEmail = async (emailId: string, domainId: string) => {
    if (!confirm('确定要删除这个发信邮箱吗？此操作不可撤销。')) {
      return;
    }

    try {
      const response = await domainsApi.deleteSenderEmail(emailId);
      if (response.success) {
        // 更新域名列表中的发信邮箱
        setDomains(prev => prev.map(domain =>
          domain.id === domainId
            ? { ...domain, senderEmails: (domain.senderEmails || []).filter(email => email.id !== emailId) }
            : domain
        ));
        toast.success('发信邮箱已删除');
      } else {
        toast.error('删除发信邮箱失败');
      }
    } catch (error) {
      toast.error('网络错误，请稍后重试');
    }
  };

  const openAddEmailDialog = (domainId: string) => {
    setSelectedDomainId(domainId);
    setNewEmailPrefix('');
    setShowAddEmailDialog(true);
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
              <h1 className="text-2xl font-bold text-gray-900">发信身份管理</h1>
              <p className="text-gray-600">管理您的发信域名、DNS配置和发信邮箱</p>
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

          {/* 添加发信邮箱对话框 */}
          <Dialog open={showAddEmailDialog} onOpenChange={setShowAddEmailDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>添加发信邮箱</DialogTitle>
                <DialogDescription>
                  为已验证的域名添加发信邮箱，系统将自动配置SMTP设置。
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="emailPrefix">邮箱前缀</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="emailPrefix"
                      placeholder="例如：service, noreply, support"
                      value={newEmailPrefix}
                      onChange={(e) => setNewEmailPrefix(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddSenderEmail();
                        }
                      }}
                    />
                    <span className="text-gray-500">@</span>
                    <span className="text-gray-700 font-medium">
                      {selectedDomainId ? domains.find(d => d.id === selectedDomainId)?.domain : ''}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    输入邮箱前缀，系统将自动生成完整的发信邮箱地址
                  </p>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowAddEmailDialog(false)}
                  >
                    取消
                  </Button>
                  <Button
                    onClick={handleAddSenderEmail}
                    disabled={isAddingEmail || !newEmailPrefix.trim()}
                  >
                    {isAddingEmail ? '添加中...' : '添加邮箱'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

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
                      <div className="space-y-4">
                        <h4 className="text-sm font-medium text-gray-900">DNS配置记录</h4>
                        <div className="overflow-hidden border rounded-lg">
                          <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-3 text-left font-medium text-gray-900">类型</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-900">主机记录</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-900">主域名</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-900">记录值</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-900">状态</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-900">操作</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {Object.entries(domain.dnsRecords).map(([key, record]) => {
                                const config = dnsRecordConfig[key as keyof typeof dnsRecordConfig];
                                const StatusIcon = statusConfig[record.status]?.icon;

                                // 如果配置不存在，跳过这个记录
                                if (!config) {
                                  console.warn(`DNS record config not found for key: ${key}`);
                                  return null;
                                }

                                // 如果状态配置不存在，跳过这个记录
                                if (!StatusIcon) {
                                  console.warn(`Status config not found for status: ${record.status}`);
                                  return null;
                                }

                                return (
                                  <tr key={key} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                      <div className="flex items-center space-x-2">
                                        <config.icon className="h-4 w-4 text-gray-400" />
                                        <span className="font-medium">{record.type}</span>
                                        {config.required && (
                                          <span className="text-red-500 text-xs">*</span>
                                        )}
                                      </div>
                                    </td>
                                    <td className="px-4 py-3">
                                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                                        {record.host}
                                      </code>
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">
                                      {domain.domain}
                                    </td>
                                    <td className="px-4 py-3">
                                      <div className="max-w-xs">
                                        <code className="text-xs bg-gray-100 px-2 py-1 rounded break-all">
                                          {record.value.length > 50
                                            ? `${record.value.substring(0, 50)}...`
                                            : record.value
                                          }
                                        </code>
                                      </div>
                                    </td>
                                    <td className="px-4 py-3">
                                      <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs w-fit ${statusConfig[record.status].bg}`}>
                                        <StatusIcon className={`h-3 w-3 ${statusConfig[record.status].color}`} />
                                        <span className={statusConfig[record.status].color}>
                                          {statusConfig[record.status].label}
                                        </span>
                                      </div>
                                    </td>
                                    <td className="px-4 py-3">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleCopyValue(record.value)}
                                        className="h-7 px-2"
                                      >
                                        <Copy className="h-3 w-3" />
                                      </Button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>

                        {/* DNS记录说明 */}
                        <div className="space-y-3 text-sm">
                          {Object.entries(domain.dnsRecords).map(([key, record]) => {
                            const config = dnsRecordConfig[key as keyof typeof dnsRecordConfig];

                            // 如果配置不存在，跳过这个记录
                            if (!config) {
                              console.warn(`DNS record config not found for key: ${key}`);
                              return null;
                            }

                            return (
                              <div key={key} className="flex items-start space-x-2">
                                <config.icon className="h-4 w-4 text-gray-400 mt-0.5" />
                                <div>
                                  <span className="font-medium">{config.label}:</span>
                                  <span className="text-gray-600 ml-1">{record.description}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* 发信邮箱管理 - 仅在域名已验证时显示 */}
                        {domain.status === 'verified' && (
                          <div className="mt-6 pt-6 border-t border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-sm font-medium text-gray-900 flex items-center">
                                <AtSign className="h-4 w-4 mr-2 text-gray-400" />
                                发信邮箱
                              </h4>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openAddEmailDialog(domain.id)}
                              >
                                <UserPlus className="h-4 w-4 mr-1" />
                                添加邮箱
                              </Button>
                            </div>

                            {domain.senderEmails && domain.senderEmails.length > 0 ? (
                              <div className="space-y-2">
                                {domain.senderEmails.map((email) => (
                                  <div key={email.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                      <AtSign className="h-4 w-4 text-gray-400" />
                                      <div>
                                        <div className="font-medium text-sm">{email.emailAddress}</div>
                                        <div className="text-xs text-gray-500">
                                          创建于 {new Date(email.createdAt).toLocaleDateString('zh-CN')}
                                          {email.lastUsed && (
                                            <span className="ml-2">
                                              最后使用: {new Date(email.lastUsed).toLocaleDateString('zh-CN')}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <div className={`px-2 py-1 rounded-full text-xs ${
                                        email.status === 'active'
                                          ? 'bg-green-100 text-green-700'
                                          : 'bg-yellow-100 text-yellow-700'
                                      }`}>
                                        {email.status === 'active' ? '正常' : '待激活'}
                                      </div>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDeleteSenderEmail(email.id, domain.id)}
                                        className="text-red-600 hover:text-red-700 h-7 px-2"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-6 text-gray-500">
                                <AtSign className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                                <p className="text-sm">还没有发信邮箱</p>
                                <p className="text-xs">添加发信邮箱后即可通过API发送邮件</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
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
                请按照以下步骤在您的DNS服务商处配置这些记录
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-medium">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">所有权验证 <span className="text-red-500">*必需</span></h4>
                    <p className="text-sm text-gray-600">
                      添加TXT记录验证域名所有权。主机记录：<code className="bg-gray-100 px-1 rounded">aliyundm.mail</code>
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-medium">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">SPF验证 <span className="text-red-500">*必需</span></h4>
                    <p className="text-sm text-gray-600">
                      添加TXT记录防止域名被伪造。主机记录：<code className="bg-gray-100 px-1 rounded">mail</code>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      如果您已有SPF记录，请在现有记录中加上 <code className="bg-gray-100 px-1 rounded">include:spfdm-ap-southeast-1.aliyun.com</code>
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">DKIM验证 <span className="text-gray-500">推荐</span></h4>
                    <p className="text-sm text-gray-600">
                      添加TXT记录提高邮件送达率。主机记录：<code className="bg-gray-100 px-1 rounded">aliyun-ap-southeast-1._domainkey.mail</code>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      特别推荐发往Gmail、Yahoo等邮箱时配置此项
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    4
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">DMARC验证 <span className="text-gray-500">推荐</span></h4>
                    <p className="text-sm text-gray-600">
                      添加TXT记录确保发送者身份真实性。主机记录：<code className="bg-gray-100 px-1 rounded">_dmarc.mail</code>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      防止域名被冒用进行欺诈邮件发送
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-medium">
                    5
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">MX验证 <span className="text-red-500">*必需</span></h4>
                    <p className="text-sm text-gray-600">
                      添加MX记录用于接收邮件。主机记录：<code className="bg-gray-100 px-1 rounded">mail</code>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      请保持此记录，否则会无法发信
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-amber-800 mb-1">重要提示</h5>
                    <ul className="text-sm text-amber-700 space-y-1">
                      <li>• DNS记录生效通常需要几分钟到几小时时间</li>
                      <li>• 标记为"*必需"的记录必须配置，否则无法发送邮件</li>
                      <li>• 配置完成后，点击"重新验证"按钮检查配置状态</li>
                      <li>• 如有疑问，请联系您的DNS服务商获取帮助</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
