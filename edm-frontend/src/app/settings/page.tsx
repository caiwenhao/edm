'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { 
  User, 
  Bell, 
  Shield, 
  CreditCard,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/components/providers/AuthProvider';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { user } = useAuth();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  // 个人信息状态
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    company: 'MyCompany Inc.',
    phone: '+86 138 0013 8000',
  });

  // 通知设置状态
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    quotaAlerts: true,
    campaignReports: true,
    securityAlerts: true,
    weeklyDigest: false,
  });

  // 密码修改状态
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileSave = () => {
    // 模拟保存个人信息
    toast.success('个人信息已更新');
  };

  const handleNotificationSave = () => {
    // 模拟保存通知设置
    toast.success('通知设置已更新');
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('两次输入的新密码不一致');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('新密码长度至少为6位');
      return;
    }
    // 模拟密码修改
    toast.success('密码修改成功');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">账户设置</h1>
            <p className="text-gray-600">管理您的账户信息和偏好设置</p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>个人信息</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center space-x-2">
                <Bell className="h-4 w-4" />
                <span>通知设置</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>安全设置</span>
              </TabsTrigger>
              <TabsTrigger value="billing" className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4" />
                <span>计费信息</span>
              </TabsTrigger>
            </TabsList>

            {/* 个人信息 */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>个人信息</CardTitle>
                  <CardDescription>
                    更新您的个人资料和联系信息
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">姓名</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">邮箱地址</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">公司名称</Label>
                      <Input
                        id="company"
                        value={profileData.company}
                        onChange={(e) => setProfileData(prev => ({ ...prev, company: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">联系电话</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleProfileSave}>
                      <Save className="mr-2 h-4 w-4" />
                      保存更改
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 通知设置 */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>通知设置</CardTitle>
                  <CardDescription>
                    选择您希望接收的通知类型
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>邮件通知</Label>
                        <p className="text-sm text-gray-500">接收重要事件的邮件通知</p>
                      </div>
                      <Switch
                        checked={notificationSettings.emailNotifications}
                        onCheckedChange={(checked) => 
                          setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>额度提醒</Label>
                        <p className="text-sm text-gray-500">当邮件额度不足时发送提醒</p>
                      </div>
                      <Switch
                        checked={notificationSettings.quotaAlerts}
                        onCheckedChange={(checked) => 
                          setNotificationSettings(prev => ({ ...prev, quotaAlerts: checked }))
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>活动报告</Label>
                        <p className="text-sm text-gray-500">接收邮件活动的数据报告</p>
                      </div>
                      <Switch
                        checked={notificationSettings.campaignReports}
                        onCheckedChange={(checked) => 
                          setNotificationSettings(prev => ({ ...prev, campaignReports: checked }))
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>安全警报</Label>
                        <p className="text-sm text-gray-500">账户安全相关的重要通知</p>
                      </div>
                      <Switch
                        checked={notificationSettings.securityAlerts}
                        onCheckedChange={(checked) => 
                          setNotificationSettings(prev => ({ ...prev, securityAlerts: checked }))
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>周报摘要</Label>
                        <p className="text-sm text-gray-500">每周发送数据摘要报告</p>
                      </div>
                      <Switch
                        checked={notificationSettings.weeklyDigest}
                        onCheckedChange={(checked) => 
                          setNotificationSettings(prev => ({ ...prev, weeklyDigest: checked }))
                        }
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button onClick={handleNotificationSave}>
                      <Save className="mr-2 h-4 w-4" />
                      保存设置
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 安全设置 */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>安全设置</CardTitle>
                  <CardDescription>
                    管理您的密码和安全选项
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">当前密码</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">新密码</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showNewPassword ? 'text' : 'password'}
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">确认新密码</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      onClick={handlePasswordChange}
                      disabled={!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      修改密码
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 计费信息 */}
            <TabsContent value="billing">
              <Card>
                <CardHeader>
                  <CardTitle>计费信息</CardTitle>
                  <CardDescription>
                    查看您的套餐和使用情况
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>当前套餐</Label>
                      <div className="p-4 border rounded-lg">
                        <h3 className="font-medium">免费套餐</h3>
                        <p className="text-sm text-gray-500">100封邮件/月</p>
                        <p className="text-sm text-green-600 mt-2">免费</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>使用情况</Label>
                      <div className="p-4 border rounded-lg">
                        <h3 className="font-medium">本月已使用</h3>
                        <p className="text-sm text-gray-500">23 / 100 封邮件</p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '23%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">升级到专业版</h4>
                    <p className="text-sm text-blue-800 mb-3">
                      获得更多邮件额度、高级分析功能和优先支持
                    </p>
                    <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white">
                      联系销售
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
