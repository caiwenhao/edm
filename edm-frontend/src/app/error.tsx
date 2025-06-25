'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home, Mail } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 记录错误到监控服务
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          {/* Error Illustration */}
          <div className="mb-6">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <Mail className="h-8 w-8 text-gray-400 mx-auto" />
          </div>
          
          {/* Error Message */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            出现了一些问题
          </h1>
          <p className="text-gray-600 mb-6">
            应用程序遇到了意外错误。我们已经记录了这个问题，请稍后重试。
          </p>
          
          {/* Error Details (Development) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
              <h3 className="text-sm font-medium text-red-800 mb-2">错误详情:</h3>
              <p className="text-xs text-red-700 font-mono break-all">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-red-600 mt-2">
                  错误ID: {error.digest}
                </p>
              )}
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="space-y-3">
            <Button onClick={reset} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              重试
            </Button>
            
            <Button variant="outline" asChild className="w-full">
              <a href="/dashboard">
                <Home className="mr-2 h-4 w-4" />
                返回首页
              </a>
            </Button>
          </div>
          
          {/* Help Information */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-3">
              如果问题持续存在，请联系技术支持
            </p>
            <div className="flex justify-center space-x-4 text-sm">
              <a 
                href="/help" 
                className="text-blue-600 hover:text-blue-800"
              >
                帮助中心
              </a>
              <a 
                href="mailto:support@edm-gateway.com" 
                className="text-blue-600 hover:text-blue-800"
              >
                邮件支持
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
