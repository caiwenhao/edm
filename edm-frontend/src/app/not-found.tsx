import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, ArrowLeft, Search, Mail } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          {/* 404 Illustration */}
          <div className="mb-6">
            <div className="text-6xl font-bold text-gray-300 mb-2">404</div>
            <Mail className="h-16 w-16 text-gray-400 mx-auto" />
          </div>
          
          {/* Error Message */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            页面未找到
          </h1>
          <p className="text-gray-600 mb-6">
            抱歉，您访问的页面不存在或已被移动。
          </p>
          
          {/* Action Buttons */}
          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/dashboard">
                <Home className="mr-2 h-4 w-4" />
                返回首页
              </Link>
            </Button>
            
            <Button variant="outline" asChild className="w-full">
              <Link href="javascript:history.back()">
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回上页
              </Link>
            </Button>
          </div>
          
          {/* Help Links */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-3">需要帮助？</p>
            <div className="flex justify-center space-x-4 text-sm">
              <Link 
                href="/help" 
                className="text-blue-600 hover:text-blue-800 flex items-center"
              >
                <Search className="mr-1 h-3 w-3" />
                帮助中心
              </Link>
              <Link 
                href="/settings" 
                className="text-blue-600 hover:text-blue-800"
              >
                账户设置
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
