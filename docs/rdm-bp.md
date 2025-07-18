## **EDM智能投递网关 - MVP核心业务流程 (v1.1)**

本文档旨在阐明平台MVP阶段最关键的业务流程，为设计、开发和测试团队提供清晰、一致的执行指引。

### **流程一：新用户激活与发信身份配置流程**

*   **流程目标**: 引导一个全新的用户完成从注册、域名验证、**添加发信邮箱**，到最终成功获取API密钥的全套配置，使其账户达到“可随时发送邮件”的状态。
*   **参与者**:
    *   **用户**: 应用管理员/运营人员
    *   **系统前端**: 用户直接交互的Web界面
    *   **系统后端**: 处理业务逻辑、与数据库和云服务商交互的服务
    *   **用户邮箱服务**: 用于接收验证邮件
    *   **用户DNS服务商**: 用户配置域名解析的地方
    *   **阿里云邮件推送服务**: 底层云服务商

| 步骤 | 参与者 | 动作/事件                                                                                                                                              |
| :--- | :------- | :------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1**  | **用户**     | 在注册页面输入邮箱和密码，点击“注册”。                                                                                                                 |
| **2**  | **系统后端** | 1. 创建用户记录，状态为“待验证”。2. 自动为该账户关联100封免费额度。3. 发送验证邮件至用户邮箱。                                                 |
| **3**  | **用户**     | 打开自己的邮箱，点击验证链接，完成注册并登录。                                                                                                         |
| **4**  | **用户**     | 进入“发信身份管理”页面，点击“添加域名”，输入自己的域名（如 `mycompany.com`）。                                                                           |
| **5**  | **系统后端** | 为该域名生成专属的DNS验证记录（SPF, DKIM, DMARC, MX等）。                                                                                                |
| **6**  | **系统前端** | 向用户清晰地展示这些需要配置的DNS记录。                                                                                                                |
| **7**  | **用户**     | 前往自己的**DNS服务商**处，完成DNS记录的配置。                                                                                                           |
| **8**  | **系统后端** | 通过后台定时任务，周期性地检查该域名的DNS解析状态，当所有记录都正确配置后，自动将域名状态更新为“已验证”。                                                  |
| **9 (核心新增)** | **用户**     | 在“已验证”的域名旁边，看到“添加发信邮箱”的按钮并点击，输入邮箱前缀（如 `service`）。                                                                |
| **10 (核心新增)**| **系统后端** | **[对用户透明的操作]**1. 调用**阿里云邮件推送服务**的API，使用我们内部的某个阿里云账号，创建发信地址 `service@mycompany.com`。2. 获取阿里云返回的SMTP凭证。3. 将这些凭证信息**高强度加密**后，存入我们自己的数据库。 |
| **11 (核心新增)**| **系统前端** | 刷新列表，向用户展示已成功添加的发信邮箱 `service@mycompany.com`，状态为“正常”。                                                               |
| **12** | **用户**     | 进入“API密钥”页面，输入密钥名称，点击“创建”并复制生成的API密钥。                                                                                         |

*   **后置条件**: 用户拥有一个状态为“已激活”的账户，一个“已验证”的域名，一个或多个“正常”状态的发信邮箱，以及一个可以立即使用的API密钥。
*   **异常流程**:
    *   用户尝试在未验证的域名下添加发信邮箱，前端按钮应为禁用状态。
    *   后台调用阿里云创建发信地址失败，应向用户返回明确的错误提示。

### **流程二：API邮件发送与数据追踪流程**

*   **流程目标**: 完整展示一封邮件从API调用到成功发送，并最终追踪到打开/点击事件的全过程，强调其中的校验和自动化处理环节。
*   **参与者**:
    *   **API消费者**: 集成了我们API密钥的客户应用
    *   **系统API网关**: 接收和验证API请求的入口
    *   **系统消息队列**: 用于任务缓冲，实现异步处理
    *   **系统后台Worker**: 实际处理邮件发送和内容加工的后台进程
    *   **阿里云邮件推送服务**: 底层的邮件发送服务商
    *   **收件人**: 邮件的最终接收者

| 步骤 | 参与者 | 动作/事件 |
| :--- | :------- | :--- |
| **1**  | **API消费者** | 构造请求，调用 `POST /api/v1/send` 接口，在请求头中携带API密钥，请求体中包含`to`, `subject`, `html`, `from`, 以及可选的 `campaign_id`。 |
| **2**  | **系统API网关** | **执行前置校验**: 1. **认证**: 验证API密钥的有效性。2. **额度检查**: 确认用户账户剩余额度 > 0。3. **发信身份校验 (核心)**: 确认`from`字段中的邮箱地址，是该用户已添加并处于“正常”状态的发信邮箱。4. **参数格式校验**。 |
| **3**  | **系统API网关** | 若所有校验通过，将发送任务打包成消息，推送到**系统消息队列**中。 |
| **4**  | **系统API网关** | **立即**向**API消费者**返回 `HTTP 202 Accepted` 响应。 |
| **5**  | **系统后台Worker** | 从消息队列中消费一条发送任务。 |
| **6**  | **系统后台Worker** | **额度扣减**: 对用户账户的剩余额度执行原子性的“-1”操作。 |
| **7**  | **系统后台Worker** | **内容加工**: 自动向邮件HTML中注入追踪像素和重写链接。 |
| **8**  | **系统后台Worker** | **凭证获取**: 从数据库中解密并获取与该`from`地址匹配的SMTP凭证。 |
| **9**  | **系统后台Worker** | **智能投递**: 根据内部调度策略，使用获取到的凭证，调用**阿里云邮件推送服务**发送邮件。 |
| **10** | **收件人/系统后端** | 收件人打开/点击邮件，触发我方追踪服务器记录相应的事件，并与用户、邮件、活动ID关联。 |

*   **后置条件**: 邮件成功发送，用量被准确记录，相关的打开/点击数据被捕获并存储，可在用户后台的活动报告中查看。
*   **异常流程**:
    *   步骤2中的任何校验失败，API网关将直接返回`4xx`系列错误（如`401`未授权, `402`额度不足, `400`发信身份无效）。

### **流程三：活动管理与数据聚合流程 (混合模式)**

*   **流程目标**: 阐明运营人员和开发者如何通过“手动创建”和“API自动发现”两种方式协同管理邮件活动，并确保数据准确聚合。
*   **参与者**:
    *   **运营人员**
    *   **系统前端/后端**
    *   **API消费者 (开发者)**

#### **场景A: 运营人员预先规划活动 (手动创建)**

| 步骤 | 参与者 | 动作/事件 |
| :--- | :------- | :--- |
| **1**  | **运营人员** | 登录后台，进入“活动管理”页面，点击“创建新活动”。 |
| **2**  | **系统前端** | 弹出一个表单，要求输入“活动名称”，例如“2025年黑色星期五大促”。 |
| **3**  | **系统后端** | 接收到请求，1. 保存活动名称。 2. 生成一个唯一的、不可修改的活动ID（如 `camp_bf2025_xyz789`）。 |
| **4**  | **系统前端** | 在活动列表中展示新创建的活动，包含其“活动名称”和“活动ID”，并提供ID的“一键复制”功能。 |
| **5**  | **运营人员** | 复制活动ID，并将其提供给开发团队。 |
| **6**  | **API消费者** | 在发送黑五相关的邮件时，统一在API调用中传入该活动ID `camp_bf2025_xyz789`。 |
| **7**  | **系统后端** | 将所有使用该ID发送的邮件数据，都聚合到“2025年黑色星期五大促”这个活动下。 |

#### **场景B: 开发者直接使用活动标识 (API自动发现)**

| 步骤 | 参与者 | 动作/事件 |
| :--- | :------- | :--- |
| **1**  | **API消费者** | 在发送密码重置邮件时，开发者为了方便追踪，直接在API调用中指定了一个`campaign_id`，例如 `"password-reset-v2"`。 |
| **2**  | **系统后台Worker** | 在处理完邮件发送任务后，检查数据库中是否存在ID为 `"password-reset-v2"` 的活动。 |
| **3**  | **系统后台Worker** | 发现不存在，于是在活动表中自动创建一条新记录，其“活动ID”和“活动名称”均为 `"password-reset-v2"`，并标记其创建方式为“API自动发现”。 |
| **4**  | **运营人员** | 稍后登录后台，在“活动管理”列表中能看到这个新出现的活动，并可以查看其相关数据。如果需要，还可以编辑其“活动名称”以方便辨识（如改为“V2版密码重置邮件”）。 |

*   **后置条件**: 无论活动如何创建，所有邮件的发送数据都能根据`campaign_id`被准确地归类和统计，为运营决策提供支持。