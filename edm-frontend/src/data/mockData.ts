import { User, ApiKey, Domain, Campaign, DashboardData, AccountQuota } from '@/types';

// Mock用户数据
export const mockUser: User = {
  id: '1',
  email: 'liming@mycompany.com',
  name: '李明',
  createdAt: '2024-06-20T10:00:00Z',
  emailVerified: true,
};

// Mock账户额度
export const mockQuota: AccountQuota = {
  total: 100,
  used: 23,
  remaining: 77,
  percentage: 23,
};

// Mock API密钥数据
export const mockApiKeys: ApiKey[] = [
  {
    id: '1',
    name: '生产环境密钥',
    key: 'edm_live_sk_1234567890abcdef1234567890abcdef',
    createdAt: '2024-06-20T10:30:00Z',
    lastUsed: '2024-06-24T15:20:00Z',
    isActive: true,
  },
  {
    id: '2',
    name: '测试环境密钥',
    key: 'edm_test_sk_abcdef1234567890abcdef1234567890',
    createdAt: '2024-06-21T09:15:00Z',
    lastUsed: '2024-06-23T11:45:00Z',
    isActive: true,
  },
  {
    id: '3',
    name: '开发环境密钥',
    key: 'edm_dev_sk_9876543210fedcba9876543210fedcba',
    createdAt: '2024-06-22T14:20:00Z',
    isActive: false,
  },
];

// Mock域名数据
export const mockDomains: Domain[] = [
  {
    id: '1',
    domain: 'service.mycompany.com',
    status: 'verified',
    createdAt: '2024-06-20T11:00:00Z',
    verifiedAt: '2024-06-20T11:30:00Z',
    dnsRecords: {
      spf: 'v=spf1 include:_spf.edm-gateway.com ~all',
      dkim: 'k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC...',
      cname: 'mail.service.mycompany.com CNAME edm-gateway.com',
    },
  },
  {
    id: '2',
    domain: 'noreply.mycompany.com',
    status: 'pending',
    createdAt: '2024-06-23T16:00:00Z',
    dnsRecords: {
      spf: 'v=spf1 include:_spf.edm-gateway.com ~all',
      dkim: 'k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQD...',
      cname: 'mail.noreply.mycompany.com CNAME edm-gateway.com',
    },
  },
];

// Mock活动数据
export const mockCampaigns: Campaign[] = [
  {
    id: 'q3_promo_event',
    name: 'Q3促销活动',
    createdAt: '2024-06-20T12:00:00Z',
    lastActivity: '2024-06-24T18:30:00Z',
    stats: {
      sent: 1250,
      delivered: 1198,
      opened: 456,
      clicked: 89,
      deliveryRate: 95.8,
      openRate: 38.1,
      clickRate: 19.5,
    },
  },
  {
    id: 'welcome_series',
    name: '新用户欢迎系列',
    createdAt: '2024-06-21T09:00:00Z',
    lastActivity: '2024-06-24T14:15:00Z',
    stats: {
      sent: 890,
      delivered: 867,
      opened: 523,
      clicked: 156,
      deliveryRate: 97.4,
      openRate: 60.3,
      clickRate: 29.8,
    },
  },
  {
    id: 'product_update',
    name: '产品更新通知',
    createdAt: '2024-06-22T15:30:00Z',
    lastActivity: '2024-06-23T10:20:00Z',
    stats: {
      sent: 2100,
      delivered: 2058,
      opened: 1234,
      clicked: 234,
      deliveryRate: 98.0,
      openRate: 60.0,
      clickRate: 19.0,
    },
  },
  {
    id: 'test_run',
    name: '测试发送',
    createdAt: '2024-06-24T10:00:00Z',
    lastActivity: '2024-06-24T10:05:00Z',
    stats: {
      sent: 5,
      delivered: 5,
      opened: 3,
      clicked: 1,
      deliveryRate: 100.0,
      openRate: 60.0,
      clickRate: 33.3,
    },
  },
];

// Mock图表数据
export const mockChartData = [
  { date: '2024-06-18', sent: 450, delivered: 432, opened: 198, clicked: 45 },
  { date: '2024-06-19', sent: 680, delivered: 651, opened: 289, clicked: 67 },
  { date: '2024-06-20', sent: 1250, delivered: 1198, opened: 456, clicked: 89 },
  { date: '2024-06-21', sent: 890, delivered: 867, opened: 523, clicked: 156 },
  { date: '2024-06-22', sent: 2100, delivered: 2058, opened: 1234, clicked: 234 },
  { date: '2024-06-23', sent: 756, delivered: 728, opened: 334, clicked: 78 },
  { date: '2024-06-24', sent: 234, delivered: 229, opened: 145, clicked: 34 },
];

// Mock仪表盘数据
export const mockDashboardData: DashboardData = {
  quota: mockQuota,
  totalStats: {
    sent: 6360,
    delivered: 6163,
    opened: 3179,
    clicked: 703,
    deliveryRate: 96.9,
    openRate: 51.6,
    clickRate: 22.1,
  },
  recentCampaigns: mockCampaigns.slice(0, 3),
  chartData: mockChartData,
};

// 生成新的API密钥
export const generateApiKey = (name: string): ApiKey => {
  const keyPrefix = 'edm_live_sk_';
  const randomKey = Math.random().toString(36).substring(2, 34);
  
  return {
    id: Date.now().toString(),
    name,
    key: keyPrefix + randomKey,
    createdAt: new Date().toISOString(),
    isActive: true,
  };
};

// 生成新的域名记录
export const generateDomainRecords = (domain: string) => {
  const randomSelector = Math.random().toString(36).substring(2, 10);
  
  return {
    spf: 'v=spf1 include:_spf.edm-gateway.com ~all',
    dkim: `k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC${randomSelector}...`,
    cname: `mail.${domain} CNAME edm-gateway.com`,
  };
};
