'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Book, 
  MessageCircle, 
  Mail, 
  ExternalLink,
  ChevronRight,
  HelpCircle,
  FileText,
  Video,
  Code
} from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

const helpCategories = [
  {
    title: '快速开始',
    description: '了解如何快速设置和使用EDM网关',
    icon: Book,
    articles: [
      { title: '创建您的第一个API密钥', time: '2分钟阅读' },
      { title: '配置发信域名', time: '5分钟阅读' },
      { title: '发送第一封邮件', time: '3分钟阅读' },
      { title: '查看邮件统计', time: '2分钟阅读' },
    ]
  },
  {
    title: 'API文档',
    description: '完整的API参考和示例代码',
    icon: Code,
    articles: [
      { title: '认证和授权', time: '5分钟阅读' },
      { title: '发送邮件API', time: '8分钟阅读' },
      { title: '批量发送API', time: '6分钟阅读' },
      { title: '错误代码参考', time: '3分钟阅读' },
    ]
  },
  {
    title: '域名配置',
    description: 'DNS设置和域名验证指南',
    icon: FileText,
    articles: [
      { title: 'SPF记录配置', time: '4分钟阅读' },
      { title: 'DKIM设置指南', time: '6分钟阅读' },
      { title: 'CNAME记录配置', time: '3分钟阅读' },
      { title: '常见DNS问题解决', time: '7分钟阅读' },
    ]
  },
  {
    title: '视频教程',
    description: '观看详细的操作演示视频',
    icon: Video,
    articles: [
      { title: '平台介绍和注册', time: '5分钟视频' },
      { title: 'API集成演示', time: '10分钟视频' },
      { title: '数据分析功能', time: '8分钟视频' },
      { title: '最佳实践分享', time: '15分钟视频' },
    ]
  },
];

const faqItems = [
  {
    question: '如何获得更多邮件额度？',
    answer: '您可以联系我们的销售团队升级到付费套餐，获得更多邮件额度和高级功能。'
  },
  {
    question: '为什么我的域名验证失败？',
    answer: 'DNS记录生效通常需要几分钟到几小时。请确保您正确配置了SPF、DKIM和CNAME记录，并等待DNS传播完成。'
  },
  {
    question: '如何提高邮件送达率？',
    answer: '确保域名验证通过、使用有效的发件人地址、避免垃圾邮件内容，并定期清理无效邮箱地址。'
  },
  {
    question: 'API调用频率有限制吗？',
    answer: '免费套餐限制为100次/分钟。付费套餐有更高的调用频率限制。'
  },
];

export default function HelpPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">帮助中心</h1>
            <p className="text-gray-600 mb-6">
              找到您需要的答案，快速解决问题
            </p>
            
            {/* Search */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="搜索帮助文档..."
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <MessageCircle className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-medium mb-2">在线客服</h3>
                <p className="text-sm text-gray-600 mb-3">
                  与我们的技术支持团队实时对话
                </p>
                <Button size="sm">开始对话</Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <Mail className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-medium mb-2">邮件支持</h3>
                <p className="text-sm text-gray-600 mb-3">
                  发送邮件给我们，24小时内回复
                </p>
                <Button size="sm" variant="outline">发送邮件</Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <Book className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                <h3 className="font-medium mb-2">开发者文档</h3>
                <p className="text-sm text-gray-600 mb-3">
                  查看完整的API文档和示例
                </p>
                <Button size="sm" variant="outline">
                  查看文档
                  <ExternalLink className="ml-2 h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Help Categories */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">帮助分类</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {helpCategories.map((category, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <category.icon className="h-6 w-6 text-blue-600" />
                      <div>
                        <CardTitle className="text-lg">{category.title}</CardTitle>
                        <CardDescription>{category.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {category.articles.map((article, articleIndex) => (
                        <div
                          key={articleIndex}
                          className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
                        >
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {article.title}
                            </p>
                            <p className="text-xs text-gray-500">{article.time}</p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">常见问题</h2>
            <div className="space-y-4">
              {faqItems.map((faq, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-3">
                      <HelpCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">
                          {faq.question}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Contact */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-medium text-blue-900 mb-2">
                还有其他问题？
              </h3>
              <p className="text-blue-800 mb-4">
                我们的技术支持团队随时为您提供帮助
              </p>
              <div className="flex justify-center space-x-3">
                <Button>
                  <MessageCircle className="mr-2 h-4 w-4" />
                  联系支持
                </Button>
                <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                  <Mail className="mr-2 h-4 w-4" />
                  发送邮件
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
