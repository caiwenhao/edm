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

// DNS记录验证状态
export type DnsRecordStatus = 'pending' | 'verified' | 'failed';

// DNS记录类型
export interface DnsRecord {
  type: 'TXT' | 'MX' | 'CNAME';
  host: string;
  value: string;
  status: DnsRecordStatus;
  description?: string;
}

// 域名类型
export interface Domain {
  id: string;
  domain: string;
  status: DomainStatus;
  createdAt: string;
  verifiedAt?: string;
  dnsRecords: {
    // 1. 所有权验证
    ownership: DnsRecord;
    // 2. SPF验证
    spf: DnsRecord;
    // 3. DKIM验证
    dkim: DnsRecord;
    // 4. DMARC验证
    dmarc: DnsRecord;
    // 5. MX验证
    mx: DnsRecord;
  };
  // 关联的发信邮箱列表
  senderEmails?: SenderEmail[];
}

// 发信邮箱状态
export type SenderEmailStatus = 'active' | 'inactive' | 'pending';

// 发信邮箱类型
export interface SenderEmail {
  id: string;
  domainId: string;
  emailAddress: string; // 完整的发信邮箱地址，如 'service@mycompany.com'
  emailPrefix: string;   // 邮箱前缀，如 'service'
  status: SenderEmailStatus;
  createdAt: string;
  lastUsed?: string;
  // SMTP信息对用户隐藏，仅后端存储
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

// 活动创建方式
export type CampaignCreationType = 'manual' | 'api_auto';

// 活动类型
export interface Campaign {
  id: string;
  name: string;
  createdAt: string;
  stats: EmailStats;
  lastActivity?: string;
  creationType: CampaignCreationType;
  isDeleted?: boolean;
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

// 活动创建请求类型
export interface CreateCampaignRequest {
  name: string;
}

// 活动更新请求类型
export interface UpdateCampaignRequest {
  name: string;
}
