import React from 'react';
import { Layout, Button, Popover } from 'antd';
import { 
  MenuFoldOutlined, 
  MenuUnfoldOutlined,
  PlusOutlined,
  MessageOutlined,
  SyncOutlined,
  EllipsisOutlined,
  RightOutlined,
  CheckOutlined,
  PlusCircleOutlined,
  DollarOutlined,
  GlobalOutlined,
  FileSearchOutlined
} from '@ant-design/icons';
import Image from 'next/image';
import ChatComponent from './Chat';
import { useRouter } from 'next/navigation';

const { Sider, Content } = Layout;

// 模拟历史对话数据
const historyChats = [
  { id: '1', title: '示例历史对话AA', icon: <MessageOutlined /> },
  { id: '2', title: '示例历史对话BB', icon: <MessageOutlined /> },
  { id: '3', title: '示例历史对话CC', icon: <MessageOutlined /> },
  { id: '4', title: '示例历史对话DD', icon: <MessageOutlined /> },
  { id: '5', title: '示例历史对话EE', icon: <MessageOutlined /> },
];

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = React.useState(false);
  const [currentMode, setCurrentMode] = React.useState<'fullscreen' | 'dialog'>('fullscreen');
  const [popoverVisible, setPopoverVisible] = React.useState(false);
  const [demoScene, setDemoScene] = React.useState<string | null>(null);
  const router = useRouter();

  // 预设的演示场景数据
  const demoScenes = {
    orderInfo: {
      messages: [
        {
          id: '2',
          content: 'ETD是3月份的订单有哪些',
          role: 'user' as const
        },
        {
          id: '3',
          content: `为您找到以下10票订单，详情如下：

| 订单号 | 船名 | 航次 | 起运港 | 卸货港 | ETD |
|---------|---------|---------|---------|---------|---------|
| [WB24030001](javascript:void(0)) | EVER GOLDEN | 125E | 深圳 | 鹿特丹 | 2024-03-05 |
| [WB24030015](javascript:void(0)) | MSC ISABELLA | 238W | 宁波 | 汉堡 | 2024-03-08 |
| [WB24030023](javascript:void(0)) | OOCL HAMBURG | 156N | 上海 | 安特卫普 | 2024-03-10 |
| [WB24030042](javascript:void(0)) | MAERSK SEMARANG | 789E | 青岛 | 费利克斯托 | 2024-03-12 |
| [WB24030056](javascript:void(0)) | CMA CGM MARCO POLO | 445N | 厦门 | 瓦伦西亚 | 2024-03-15 |
| [WB24030078](javascript:void(0)) | COSCO SHIPPING ROSE | 667E | 广州 | 热那亚 | 2024-03-18 |
| [WB24030089](javascript:void(0)) | ONE OLYMPUS | 334W | 天津 | 巴塞罗那 | 2024-03-22 |
| [WB24030095](javascript:void(0)) | HAPAG LLOYD ATHENS | 556N | 深圳 | 马赛 | 2024-03-25 |
| [WB24030108](javascript:void(0)) | YANG MING WORLD | 678E | 宁波 | 比雷埃夫斯 | 2024-03-28 |
| [WB24030120](javascript:void(0)) | HMM ROTTERDAM | 890W | 上海 | 科佩尔 | 2024-03-30 |

💡 温馨提示：
• 点击订单号可查看详细信息
• 可输入更多筛选条件进行精确查询
• 我可以帮助你对这些订单进行复制修改删除等操作，请告诉我你的需求`,
          role: 'assistant' as const
        },
        {
          id: '4',
          content: '这些都退关',
          role: 'user' as const
        },
        {
          id: '5',
          content: `好的，以下10票订单将会退关：

| 订单号 | 船名 | 航次 | 起运港 | 卸货港 | ETD |
|---------|---------|---------|---------|---------|---------|
| [WB24030001](javascript:void(0)) | EVER GOLDEN | 125E | 深圳 | 鹿特丹 | 2024-03-05 |
| [WB24030015](javascript:void(0)) | MSC ISABELLA | 238W | 宁波 | 汉堡 | 2024-03-08 |
| [WB24030023](javascript:void(0)) | OOCL HAMBURG | 156N | 上海 | 安特卫普 | 2024-03-10 |
| [WB24030042](javascript:void(0)) | MAERSK SEMARANG | 789E | 青岛 | 费利克斯托 | 2024-03-12 |
| [WB24030056](javascript:void(0)) | CMA CGM MARCO POLO | 445N | 厦门 | 瓦伦西亚 | 2024-03-15 |
| [WB24030078](javascript:void(0)) | COSCO SHIPPING ROSE | 667E | 广州 | 热那亚 | 2024-03-18 |
| [WB24030089](javascript:void(0)) | ONE OLYMPUS | 334W | 天津 | 巴塞罗那 | 2024-03-22 |
| [WB24030095](javascript:void(0)) | HAPAG LLOYD ATHENS | 556N | 深圳 | 马赛 | 2024-03-25 |
| [WB24030108](javascript:void(0)) | YANG MING WORLD | 678E | 宁波 | 比雷埃夫斯 | 2024-03-28 |
| [WB24030120](javascript:void(0)) | HMM ROTTERDAM | 890W | 上海 | 科佩尔 | 2024-03-30 |

💡 请确认是否要对以上订单进行退关操作：
• 点击 【[确认](javascript:void(0))】 开始批量退关
• 点击【 [取消](javascript:void(0))】 可以重新选择
• 如果只需要退关部分订单，请告诉我具体的订单号`,
          role: 'assistant' as const
        }
      ]
    },
    rateQuery: {
      messages: [
        {
          id: '1',
          content: '查询从深圳到纽约的空运价格',
          role: 'user' as const
        },
        {
          id: '2',
          content: `已为您查询到以下运价信息：

📦 深圳 (SZX) → 纽约 (JFK)
===================================
✈️ 空运价格：
• 普货：¥38/kg
• 敏感货：¥45/kg
• 电池：¥52/kg

⏱️ 时效：
• 标准：5-7个工作日
• 快速：3-4个工作日

📝 附加说明：
• 燃油附加费：¥5/kg
• 安检费：¥2/kg
• 最小计重：100kg
• 以上报价含操作费，不含目的地清关费用
• 有效期：2024-03-31

💡 温馨提示：
• 敏感货物和电池需提前报备
• 建议提前3天预约舱位
• 实际价格可能因货物属性有所调整`,
          role: 'assistant' as const
        }
      ]
    },
    trackOrder: {
      messages: [
        {
          id: '1',
          content: '跟踪订单 WB123456789 的物流状态',
          role: 'user' as const
        },
        {
          id: '2',
          content: `📦 订单 WB123456789 的物流跟踪信息：

🚚 当前状态：运输中
=====================================
📍 物流轨迹：

2024-03-27 16:30 [深圳]
• 货物已从深圳仓库发出
• 预计2小时内到达深圳机场

2024-03-27 14:20 [深圳]
• 包裹已打包完成
• 等待提货

2024-03-27 11:45 [深圳]
• 货物已入库
• 正在进行包装和分拣

2024-03-27 10:30 [深圳]
• 已收到发货申请
• 系统已确认订单信息

⏱️ 预计到达：
• 目的地：上海浦东新区
• 预计送达时间：2024-03-30

📱 温馨提示：
• 可随时输入订单号查询最新状态
• 如需修改收货信息请提前24小时告知
• 如有疑问可直接询问客服`,
          role: 'assistant' as const
        }
      ]
    },
    fileRecognition: {
      messages: [
        {
          id: '1',
          content: '请帮我识别这份提单文件',
          role: 'user' as const,
          files: [
            {
              uid: '1',
              name: 'bill_of_lading.pdf',
              status: 'done',
              url: '#'
            }
          ]
        },
        {
          id: '2',
          content: `📄 已完成文件识别，解析结果如下：

📋 提单基本信息
=====================================
提单号：MBLHKG123456
船公司：COSCO Shipping
起运港：Hong Kong (HKG)
目的港：Los Angeles (LAX)
船名/航次：COSCO SHIPPING PISCES V.045E

📦 货物信息
=====================================
品名：Electronic Components
数量：150 Cartons
毛重：2,500 KGS
体积：12.5 CBM
装箱方式：FCL
集装箱号：CSLU1234567 (1×40HQ)

👥 相关方信息
=====================================
发货人：ABC Electronics Limited
收货人：XYZ Trading Corp.
通知方：XYZ Trading Corp.

📝 备注事项
=====================================
• 运费条款：PREPAID
• 签发日期：2024-03-25
• 货物已装船
• 正本提单份数：3/3

💡 温馨提示：
• 文件已自动存档
• 相关数据已同步至系统
• 如需修改信息请及时告知`,
          role: 'assistant' as const
        }
      ]
    }
  };

  const handleModeChange = (mode: 'fullscreen' | 'dialog') => {
    setCurrentMode(mode);
    setPopoverVisible(false);
    if (mode === 'dialog') {
      router.push('/dialog');
    }
  };

  const handleDemoClick = (scene: string) => {
    setDemoScene(scene);
  };

  const modeContent = (
    <div className="w-48 py-1">
      {[
        { key: 'fullscreen', label: '全屏模式' },
        { key: 'dialog', label: '对话框模式' }
      ].map(mode => (
        <button
          key={mode.key}
          className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
          onClick={() => handleModeChange(mode.key as 'fullscreen' | 'dialog')}
        >
          <span>{mode.label}</span>
          {currentMode === mode.key && (
            <CheckOutlined className="text-blue-500" />
          )}
        </button>
      ))}
    </div>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 添加演示按钮区域 */}
      <div 
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          background: 'white',
          padding: '15px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      >
        <div className="text-sm font-medium text-gray-500 mb-2">演示场景</div>
        <Button 
          type="primary"
          onClick={() => handleDemoClick('orderInfo')}
          icon={<MessageOutlined />}
          className="w-full mb-2"
        >
          演示回复订单信息
        </Button>
        <Button 
          type="primary"
          onClick={() => handleDemoClick('rateQuery')}
          icon={<DollarOutlined />}
          className="w-full mb-2"
        >
          演示运价查询
        </Button>
        <Button 
          type="primary"
          onClick={() => handleDemoClick('trackOrder')}
          icon={<GlobalOutlined />}
          className="w-full mb-2"
        >
          演示跟踪订单
        </Button>
        <Button 
          type="primary"
          onClick={() => handleDemoClick('fileRecognition')}
          icon={<FileSearchOutlined />}
          className="w-full"
        >
          演示文件识别
        </Button>
      </div>

      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        theme="light"
        width={280}
        collapsedWidth={80}
        style={{
          borderRight: '1px solid #f0f0f0',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          background: '#fff',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* 顶部Logo区域 */}
          <div className="p-4 flex-shrink-0">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 relative flex-shrink-0">
                <Image
                  src="/logo.png"
                  alt="AI 沃宝"
                  fill
                  className="object-contain"
                />
              </div>
              {!collapsed && (
                <span className="text-xl font-semibold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent whitespace-nowrap">
                  AI 沃宝
                </span>
              )}
            </div>
            
            {/* 新对话按钮 */}
            <button
              onClick={() => setDemoScene(null)}
              className="w-full h-10 flex items-center justify-center gap-2 bg-[#EBF5FF] hover:bg-[#E0EDFF] text-[#1677ff] rounded-lg transition-colors cursor-pointer"
            >
              <PlusCircleOutlined />
              {!collapsed && <span>开启新对话</span>}
            </button>
          </div>

          {/* 历史对话列表 */}
          <div className="flex-1 overflow-y-auto px-2">
            <div className="text-sm text-gray-500 px-2 py-3">
              {!collapsed && '历史对话'}
            </div>
            <div className="space-y-1">
              {historyChats.map(chat => (
                <Button
                  key={chat.id}
                  type="text"
                  className="w-full !flex items-center justify-start gap-2 px-3 h-10 hover:bg-gray-100 rounded-lg"
                >
                  {chat.icon}
                  {!collapsed && (
                    <span className="truncate flex-1 text-left">{chat.title}</span>
                  )}
                </Button>
              ))}
            </div>
            {!collapsed && (
              <Button
                type="text"
                className="w-full !flex items-center justify-start gap-2 px-3 text-gray-500 mt-2"
              >
                <EllipsisOutlined />
                <span>查看全部</span>
              </Button>
            )}
          </div>

          {/* 底部按钮区域 */}
          <div className="mt-auto px-2 py-3 border-t border-gray-100">
            <Popover
              content={modeContent}
              trigger="click"
              placement="rightTop"
              open={popoverVisible}
              onOpenChange={setPopoverVisible}
              overlayClassName="assistant-mode-popover"
            >
              <button
                className="w-full flex items-center justify-between gap-2 p-3 text-sm text-gray-600 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white shadow-sm">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.5 19.5v-15m0 15c0 1.1.4 2 2.5 2 2.1 0 2.5-.9 2.5-2v-15c0-1.1-.4-2-2.5-2-2.1 0-2.5.9-2.5 2m5 7.5h3m-3-4h3m-3 8h3m-11-4h3m-3-4h3m-3 8h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="font-medium">切换助手模式</span>
                    <span className="text-xs text-gray-400">当前：{currentMode === 'fullscreen' ? '全屏模式' : '对话框模式'}</span>
                  </div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <RightOutlined className="text-gray-400" />
                </div>
              </button>
            </Popover>
          </div>
        </div>

        {/* 折叠按钮 */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-4 top-7 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center cursor-pointer hover:shadow-lg transition-shadow border border-gray-100"
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </button>
      </Sider>
      <Layout 
        style={{ 
          marginLeft: collapsed ? 80 : 280, 
          transition: 'margin-left 0.2s',
          background: '#fafafa',
        }}
      >
        <Content className="p-4">
          <ChatComponent 
            initialMessages={demoScene ? demoScenes[demoScene as keyof typeof demoScenes].messages : undefined}
            onReset={() => setDemoScene(null)}
          />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout; 