import {
  ApiResponse,
  DashboardData,
  ApiKey,
  Domain,
  Campaign,
  SendEmailRequest,
  BatchSendEmailRequest
} from '@/types';
import {
  mockDashboardData,
  mockApiKeys,
  mockDomains,
  mockCampaigns,
  generateApiKey,
  generateDomainRecords
} from '@/data/mockData';

// 模拟API延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 模拟API响应包装器
const mockApiResponse = <T>(data: T, success = true): ApiResponse<T> => ({
  success,
  data: success ? data : undefined,
  error: success ? undefined : 'API Error',
  message: success ? 'Success' : 'Something went wrong',
});

// 仪表盘API
export const dashboardApi = {
  getDashboardData: async (): Promise<ApiResponse<DashboardData>> => {
    await delay(800);
    return mockApiResponse(mockDashboardData);
  },
};

// API密钥管理API
export const apiKeysApi = {
  getApiKeys: async (): Promise<ApiResponse<ApiKey[]>> => {
    await delay(500);
    const keys = JSON.parse(localStorage.getItem('edm_api_keys') || JSON.stringify(mockApiKeys));
    return mockApiResponse(keys);
  },

  createApiKey: async (name: string): Promise<ApiResponse<ApiKey>> => {
    await delay(1000);
    const newKey = generateApiKey(name);
    const existingKeys = JSON.parse(localStorage.getItem('edm_api_keys') || JSON.stringify(mockApiKeys));
    const updatedKeys = [...existingKeys, newKey];
    localStorage.setItem('edm_api_keys', JSON.stringify(updatedKeys));
    return mockApiResponse(newKey);
  },

  deleteApiKey: async (keyId: string): Promise<ApiResponse<boolean>> => {
    await delay(500);
    const existingKeys = JSON.parse(localStorage.getItem('edm_api_keys') || JSON.stringify(mockApiKeys));
    const updatedKeys = existingKeys.filter((key: ApiKey) => key.id !== keyId);
    localStorage.setItem('edm_api_keys', JSON.stringify(updatedKeys));
    return mockApiResponse(true);
  },

  toggleApiKey: async (keyId: string): Promise<ApiResponse<boolean>> => {
    await delay(300);
    const existingKeys = JSON.parse(localStorage.getItem('edm_api_keys') || JSON.stringify(mockApiKeys));
    const updatedKeys = existingKeys.map((key: ApiKey) =>
      key.id === keyId ? { ...key, isActive: !key.isActive } : key
    );
    localStorage.setItem('edm_api_keys', JSON.stringify(updatedKeys));
    return mockApiResponse(true);
  },
};

// 域名管理API
export const domainsApi = {
  getDomains: async (): Promise<ApiResponse<Domain[]>> => {
    await delay(600);
    const domains = JSON.parse(localStorage.getItem('edm_domains') || JSON.stringify(mockDomains));
    return mockApiResponse(domains);
  },

  addDomain: async (domainName: string): Promise<ApiResponse<Domain>> => {
    await delay(1200);
    const newDomain: Domain = {
      id: Date.now().toString(),
      domain: domainName,
      status: 'pending',
      createdAt: new Date().toISOString(),
      dnsRecords: generateDomainRecords(domainName),
    };

    const existingDomains = JSON.parse(localStorage.getItem('edm_domains') || JSON.stringify(mockDomains));
    const updatedDomains = [...existingDomains, newDomain];
    localStorage.setItem('edm_domains', JSON.stringify(updatedDomains));
    return mockApiResponse(newDomain);
  },

  verifyDomain: async (domainId: string): Promise<ApiResponse<Domain>> => {
    await delay(2000); // 模拟DNS验证时间
    const existingDomains = JSON.parse(localStorage.getItem('edm_domains') || JSON.stringify(mockDomains));
    const updatedDomains = existingDomains.map((domain: Domain) =>
      domain.id === domainId
        ? {
            ...domain,
            status: Math.random() > 0.3 ? 'verified' : 'failed', // 70%成功率
            verifiedAt: domain.status === 'verified' ? new Date().toISOString() : undefined
          }
        : domain
    );
    localStorage.setItem('edm_domains', JSON.stringify(updatedDomains));
    const updatedDomain = updatedDomains.find((d: Domain) => d.id === domainId);
    return mockApiResponse(updatedDomain);
  },

  deleteDomain: async (domainId: string): Promise<ApiResponse<boolean>> => {
    await delay(400);
    const existingDomains = JSON.parse(localStorage.getItem('edm_domains') || JSON.stringify(mockDomains));
    const updatedDomains = existingDomains.filter((domain: Domain) => domain.id !== domainId);
    localStorage.setItem('edm_domains', JSON.stringify(updatedDomains));
    return mockApiResponse(true);
  },
};

// 活动报告API
export const campaignsApi = {
  getCampaigns: async (): Promise<ApiResponse<Campaign[]>> => {
    await delay(700);
    return mockApiResponse(mockCampaigns);
  },

  getCampaign: async (campaignId: string): Promise<ApiResponse<Campaign | null>> => {
    await delay(400);
    const campaign = mockCampaigns.find(c => c.id === campaignId);
    return mockApiResponse(campaign || null);
  },
};

// 邮件发送API
export const emailApi = {
  sendEmail: async (request: SendEmailRequest): Promise<ApiResponse<{ messageId: string }>> => {
    await delay(1500);

    // 模拟API密钥验证
    const authHeader = 'Bearer edm_live_sk_1234567890abcdef1234567890abcdef'; // 模拟
    if (!authHeader) {
      return mockApiResponse({ messageId: '' }, false);
    }

    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    return mockApiResponse({ messageId });
  },

  sendBatchEmail: async (request: BatchSendEmailRequest): Promise<ApiResponse<{ messageIds: string[] }>> => {
    await delay(2000);

    const messageIds = request.emails.map(() =>
      `msg_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
    );

    return mockApiResponse({ messageIds });
  },
};
