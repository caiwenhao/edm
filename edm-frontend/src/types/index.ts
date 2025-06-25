// 用户相关类型
export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
  emailVerified: boolean;
}

// 账户额度类型
export interface AccountQuota {
  total: number;
  used: number;
  remaining: number;
  percentage: number;
}

// API密钥类型
export interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed?: string;
  isActive: boolean;
}

// 域名验证状态
export type DomainStatus = 'pending' | 'verifying' | 'verified' | 'failed';

// 域名类型
export interface Domain {
  id: string;
  domain: string;
  status: DomainStatus;
  createdAt: string;
  verifiedAt?: string;
  dnsRecords: {
    spf: string;
    dkim: string;
    cname: string;
  };
}

// 邮件发送统计
export interface EmailStats {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
}

// 活动类型
export interface Campaign {
  id: string;
  name: string;
  createdAt: string;
  stats: EmailStats;
  lastActivity?: string;
}

// 仪表盘数据类型
export interface DashboardData {
  quota: AccountQuota;
  totalStats: EmailStats;
  recentCampaigns: Campaign[];
  chartData: {
    date: string;
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
  }[];
}

// API响应类型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 表格排序类型
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  key: string;
  direction: SortDirection;
}

// 通用分页类型
export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// 邮件发送请求类型
export interface SendEmailRequest {
  to: string[];
  subject: string;
  html: string;
  from: string;
  campaign_id?: string;
}

// 批量邮件发送请求类型
export interface BatchSendEmailRequest {
  emails: SendEmailRequest[];
  campaign_id?: string;
}
