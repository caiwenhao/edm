'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/components/providers/AuthProvider';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('liming@mycompany.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast.success('登录成功！');
        router.push('/dashboard');
      } else {
        toast.error('邮箱或密码错误，请重试');
      }
    } catch (error) {
      toast.error('登录失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and title */}
        <div className="text-center">
          <div className="flex justify-center">
            <Mail className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            EDM智能投递网关
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            登录您的账户以开始使用
          </p>
        </div>

        {/* Login form */}
        <Card>
          <CardHeader>
            <CardTitle>登录</CardTitle>
            <CardDescription>
              输入您的邮箱和密码来访问您的账户
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">邮箱地址</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">密码</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="输入您的密码"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <Link href="/forgot-password" className="text-blue-600 hover:text-blue-500">
                    忘记密码？
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? '登录中...' : '登录'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                还没有账户？{' '}
                <Link href="/register" className="text-blue-600 hover:text-blue-500 font-medium">
                  立即注册
                </Link>
              </p>
            </div>

            {/* Demo credentials */}
            <div className="mt-4 p-3 bg-blue-50 rounded-md">
              <p className="text-xs text-blue-800 font-medium">演示账户信息：</p>
              <p className="text-xs text-blue-700">邮箱: liming@mycompany.com</p>
              <p className="text-xs text-blue-700">密码: password123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
