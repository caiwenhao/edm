import {
  ApiResponse,
  DashboardData,
  ApiKey,
  Domain,
  Campaign,
  SendEmailRequest,
  BatchSendEmailRequest,
  SenderEmail,
  CreateCampaignRequest,
  UpdateCampaignRequest
} from '@/types';
import {
  mockDashboardData,
  mockApiKeys,
  mockDomains,
  mockCampaigns,
  mockSenderEmails,
  generateApiKey,
  generateDomainRecords,
  generateSenderEmail,
  generateCampaign
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
    const senderEmails = JSON.parse(localStorage.getItem('edm_sender_emails') || JSON.stringify(mockSenderEmails));

    // 为每个域名关联其发信邮箱
    const domainsWithEmails = domains.map((domain: Domain) => ({
      ...domain,
      senderEmails: senderEmails.filter((email: SenderEmail) => email.domainId === domain.id)
    }));

    return mockApiResponse(domainsWithEmails);
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

    // 同时删除该域名下的所有发信邮箱
    const existingSenderEmails = JSON.parse(localStorage.getItem('edm_sender_emails') || JSON.stringify(mockSenderEmails));
    const updatedSenderEmails = existingSenderEmails.filter((email: SenderEmail) => email.domainId !== domainId);
    localStorage.setItem('edm_sender_emails', JSON.stringify(updatedSenderEmails));

    return mockApiResponse(true);
  },

  // 发信邮箱管理
  addSenderEmail: async (domainId: string, emailPrefix: string): Promise<ApiResponse<SenderEmail>> => {
    await delay(1500); // 模拟调用阿里云API的时间

    const existingDomains = JSON.parse(localStorage.getItem('edm_domains') || JSON.stringify(mockDomains));
    const domain = existingDomains.find((d: Domain) => d.id === domainId);

    if (!domain) {
      return mockApiResponse(null as any, false);
    }

    if (domain.status !== 'verified') {
      return mockApiResponse(null as any, false);
    }

    const newSenderEmail = generateSenderEmail(domainId, domain.domain, emailPrefix);
    const existingSenderEmails = JSON.parse(localStorage.getItem('edm_sender_emails') || JSON.stringify(mockSenderEmails));

    // 检查是否已存在相同的发信邮箱
    const emailExists = existingSenderEmails.some((email: SenderEmail) =>
      email.emailAddress === newSenderEmail.emailAddress
    );

    if (emailExists) {
      return mockApiResponse(null as any, false);
    }

    const updatedSenderEmails = [...existingSenderEmails, newSenderEmail];
    localStorage.setItem('edm_sender_emails', JSON.stringify(updatedSenderEmails));

    return mockApiResponse(newSenderEmail);
  },

  deleteSenderEmail: async (emailId: string): Promise<ApiResponse<boolean>> => {
    await delay(500);
    const existingSenderEmails = JSON.parse(localStorage.getItem('edm_sender_emails') || JSON.stringify(mockSenderEmails));
    const updatedSenderEmails = existingSenderEmails.filter((email: SenderEmail) => email.id !== emailId);
    localStorage.setItem('edm_sender_emails', JSON.stringify(updatedSenderEmails));
    return mockApiResponse(true);
  },
};

// 活动报告API
export const campaignsApi = {
  getCampaigns: async (): Promise<ApiResponse<Campaign[]>> => {
    await delay(700);
    // 初始化localStorage中的活动数据（如果不存在）
    if (!localStorage.getItem('edm_campaigns')) {
      localStorage.setItem('edm_campaigns', JSON.stringify(mockCampaigns));
    }
    const campaigns = JSON.parse(localStorage.getItem('edm_campaigns') || JSON.stringify(mockCampaigns));
    // 过滤掉已删除的活动
    const activeCampaigns = campaigns.filter((c: Campaign) => !c.isDeleted);
    return mockApiResponse(activeCampaigns);
  },

  getCampaign: async (campaignId: string): Promise<ApiResponse<Campaign | null>> => {
    await delay(400);
    const campaigns = JSON.parse(localStorage.getItem('edm_campaigns') || JSON.stringify(mockCampaigns));
    const campaign = campaigns.find((c: Campaign) => c.id === campaignId && !c.isDeleted);
    return mockApiResponse(campaign || null);
  },

  createCampaign: async (request: CreateCampaignRequest): Promise<ApiResponse<Campaign>> => {
    await delay(800);
    const newCampaign = generateCampaign(request.name);
    const existingCampaigns = JSON.parse(localStorage.getItem('edm_campaigns') || JSON.stringify(mockCampaigns));
    const updatedCampaigns = [...existingCampaigns, newCampaign];
    localStorage.setItem('edm_campaigns', JSON.stringify(updatedCampaigns));
    return mockApiResponse(newCampaign);
  },

  updateCampaign: async (campaignId: string, request: UpdateCampaignRequest): Promise<ApiResponse<Campaign>> => {
    await delay(600);
    const existingCampaigns = JSON.parse(localStorage.getItem('edm_campaigns') || JSON.stringify(mockCampaigns));
    const campaignIndex = existingCampaigns.findIndex((c: Campaign) => c.id === campaignId && !c.isDeleted);

    if (campaignIndex === -1) {
      return mockApiResponse(null as any, false);
    }

    // 只允许更新手动创建的活动
    if (existingCampaigns[campaignIndex].creationType !== 'manual') {
      return mockApiResponse(null as any, false);
    }

    existingCampaigns[campaignIndex] = {
      ...existingCampaigns[campaignIndex],
      name: request.name,
    };

    localStorage.setItem('edm_campaigns', JSON.stringify(existingCampaigns));
    return mockApiResponse(existingCampaigns[campaignIndex]);
  },

  deleteCampaign: async (campaignId: string): Promise<ApiResponse<boolean>> => {
    await delay(500);
    const existingCampaigns = JSON.parse(localStorage.getItem('edm_campaigns') || JSON.stringify(mockCampaigns));
    const campaignIndex = existingCampaigns.findIndex((c: Campaign) => c.id === campaignId && !c.isDeleted);

    if (campaignIndex === -1) {
      return mockApiResponse(false, false);
    }

    // 只允许删除手动创建的活动
    if (existingCampaigns[campaignIndex].creationType !== 'manual') {
      return mockApiResponse(false, false);
    }

    // 软删除：标记为已删除而不是真正删除
    existingCampaigns[campaignIndex].isDeleted = true;
    localStorage.setItem('edm_campaigns', JSON.stringify(existingCampaigns));
    return mockApiResponse(true);
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
