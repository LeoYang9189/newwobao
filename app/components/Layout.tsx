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
        },
        {
          id: '6',
          content: '确认',
          role: 'user' as const
        },
        {
          id: '7',
          content: `好的，以下订单已删除：

1. WB24030001
2. WB24030015
3. WB24030023
4. WB24030042
5. WB24030056
6. WB24030078
7. WB24030089
8. WB24030095
9. WB24030108
10. WB24030120`,
          role: 'assistant' as const
        },
        {
          id: '8',
          content: 'SE2503262075NBO 复制出5票',
          role: 'user' as const
        },
        {
          id: '9',
          content: `✅ 已为您复制订单 SE2503262075NBO
复制数量：5票

════════════════════════════════════════════
📋 默认复制内容
════════════════════════════════════════════
• 基础信息
• 船公司信息
• 船名/航次
• ETD
• 箱型箱量
• 件数/毛重/体积

════════════════════════════════════════════
💡 可选复制内容
════════════════════════════════════════════
请确认是否需要同时复制以下信息：
• 订舱信息
• 预配信息
• MBL信息
• HBL信息
• 费用信息

原订单信息：
════════════════════════════════════════════
船公司：兴亚船务有限公司
船名：AAA
航次：hh
ETD：2025-02-05
箱型箱量：9*40GOH
件毛体：800Packages/23863.16Kgs/86.0CBM

复制后的订单信息：
════════════════════════════════════════════
船公司：兴亚船务有限公司
船名：AAA
航次：hh
ETD：2025-02-05
箱型箱量：9*40GOH
件毛体：800Packages/23863.16Kgs/86.0CBM`,
          role: 'assistant' as const
        },
        {
          id: '10',
          content: '船名改成BBB',
          role: 'user' as const
        },
        {
          id: '11',
          content: `原订单信息：
════════════════════════════════════════════
船公司：兴亚船务有限公司
船名：AAA
航次：hh
ETD：2025-02-05
箱型箱量：9*40GOH
件毛体：800Packages/23863.16Kgs/86.0CBM

复制后的订单信息：
════════════════════════════════════════════
船公司：兴亚船务有限公司
船名：BBB
航次：hh
ETD：2025-02-05
箱型箱量：9*40GOH
件毛体：800Packages/23863.16Kgs/86.0CBM

✅ 已成功修改

复制后的订单号如下：
════════════════════════════════════════════
| 订单号 | 船名 | 航次 | 起运港 | 卸货港 | ETD |
|---------|---------|---------|---------|---------|---------|
| WB24030001 | EVER GOLDEN | 125E | 深圳 | 鹿特丹 | 2024-03-05 |
| WB24030015 | MSC ISABELLA | 238W | 宁波 | 汉堡 | 2024-03-08 |
| WB24030023 | OOCL HAMBURG | 156N | 上海 | 安特卫普 | 2024-03-10 |
| WB24030042 | MAERSK SEMARANG | 789E | 青岛 | 费利克斯托 | 2024-03-12 |
| WB24030056 | CMA CGM MARCO POLO | 445N | 厦门 | 瓦伦西亚 | 2024-03-15 |`,
          role: 'assistant' as const
        },
        {
          id: '12',
          content: 'SE2503262075NBO 件毛体 改为 100/200/300',
          role: 'user' as const
        },
        {
          id: '13',
          content: `系统已为您找到以下待更新的订单：

════════════════════════════════════════════
| 订单号 | 船名 | 航次 | 起运港 | 卸货港 | ETD |
|---------|---------|---------|---------|---------|---------|
| SE2503262075NBO | EVER GOLDEN | 125E | 深圳 | 鹿特丹 | 2024-03-05 |

💡 请确认是否要更新以上1个订单的信息：
• 点击【[确认](javascript:void(0))】执行更新
• 点击【[取消](javascript:void(0))】取消操作`,
          role: 'assistant' as const
        },
        {
          id: '14',
          content: '确认',
          role: 'user' as const
        },
        {
          id: '15',
          content: `✅ 订单更新成功（共1条）：SE2503262075NBO

════════════════════════════════════════════
📋 修改详情
════════════════════════════════════════════
修改项目：件毛体
原数据：11/22/33
修改后数据：100/200/300`,
          role: 'assistant' as const
        }
      ]
    },
    rateQuery: {
      messages: [
        {
          id: '1',
          content: '查询上海到洛杉矶价格',
          role: 'user' as const
        },
        {
          id: '2',
          content: '系统支持整箱、拼箱、空运的查询哦，请问你需要查询哪个业务类型呢？',
          role: 'assistant' as const
        },
        {
          id: '3',
          content: '整箱',
          role: 'user' as const
        },
        {
          id: '4',
          content: `为您查到5条运价，其中：

📊 最便宜运价
════════════════════════════════════════════
• 20GP：100 USD
• 40GP：200 USD
• 40HQ：200 USD
• 船公司：MSK-马士基
• 舱位状态：紧张
• 有效期：2025年3月2日~2025年4月30日
• 航程：50天

⚡ 最快运价
════════════════════════════════════════════
• 20GP：100 USD
• 40GP：200 USD
• 40HQ：200 USD
• 船公司：MSK-马士基
• 舱位状态：紧张
• 有效期：2025年3月2日~2025年4月30日
• 航程：10天

📝 其他运价
════════════════════════════════════════════
1. ONE-海洋网联 (运价编号：ONESH20240301)
   • 20GP：120 USD
   • 40GP：240 USD
   • 40HQ：240 USD
   • 舱位状态：充足
   • 有效期：2025年3月5日~2025年4月15日
   • 航程：15天

2. COSCO-中远海运 (运价编号：COSCN20240315)
   • 20GP：150 USD
   • 40GP：280 USD
   • 40HQ：280 USD
   • 舱位状态：一般
   • 有效期：2025年3月10日~2025年4月20日
   • 航程：20天

3. EMC-长荣海运 (运价编号：EMCSH20240308)
   • 20GP：130 USD
   • 40GP：250 USD
   • 40HQ：250 USD
   • 舱位状态：充足
   • 有效期：2025年3月8日~2025年4月25日
   • 航程：18天

4. YML-阳明海运 (运价编号：YMLSH20240320)
   • 20GP：140 USD
   • 40GP：270 USD
   • 40HQ：270 USD
   • 舱位状态：紧张
   • 有效期：2025年3月15日~2025年4月30日
   • 航程：25天

5. HMM-韩国海运 (运价编号：HMMSH20240312)
   • 20GP：110 USD
   • 40GP：220 USD
   • 40HQ：220 USD
   • 舱位状态：一般
   • 有效期：2025年3月12日~2025年4月28日
   • 航程：22天

💡 温馨提示：
1. 您可以继续查询其他港口运价
2. 或者告诉我您心仪哪条运价，以及对应的箱型箱量，我会为您【[生成报价文案](javascript:void(0))】`,
          role: 'assistant' as const
        },
        {
          id: '5',
          content: '看看空运吧',
          role: 'user' as const
        },
        {
          id: '6',
          content: `为您查到5条运价，其中：

📊 最便宜运价
════════════════════════════════════════════
运价编号：DHLSH20240301
• +45kg：3.2 USD/kg
• +100kg：3.5 USD/kg
• +300kg：3.3 USD/kg
• +600kg：6.2 USD/kg
• +1000kg：1.2 USD/kg
• 航空公司：德莎
• 有效期：2025年3月2日~2025年4月30日

📝 其他运价
════════════════════════════════════════════
1. 联邦快递 (运价编号：FEDSH20240305)
   • +45kg：3.5 USD/kg
   • +100kg：3.8 USD/kg
   • +300kg：3.6 USD/kg
   • +600kg：6.5 USD/kg
   • +1000kg：1.5 USD/kg
   • 有效期：2025年3月5日~2025年4月15日

2. 卢森堡航空 (运价编号：CVGSH20240310)
   • +45kg：3.8 USD/kg
   • +100kg：4.0 USD/kg
   • +300kg：3.9 USD/kg
   • +600kg：6.8 USD/kg
   • +1000kg：1.8 USD/kg
   • 有效期：2025年3月10日~2025年4月20日

3. 阿联酋航空 (运价编号：EMISH20240308)
   • +45kg：3.3 USD/kg
   • +100kg：3.6 USD/kg
   • +300kg：3.4 USD/kg
   • +600kg：6.3 USD/kg
   • +1000kg：1.3 USD/kg
   • 有效期：2025年3月8日~2025年4月25日

4. 土耳其航空 (运价编号：TKSH20240315)
   • +45kg：3.6 USD/kg
   • +100kg：3.9 USD/kg
   • +300kg：3.7 USD/kg
   • +600kg：6.6 USD/kg
   • +1000kg：1.6 USD/kg
   • 有效期：2025年3月15日~2025年4月30日

5. 韩亚航空 (运价编号：OZSH20240312)
   • +45kg：3.4 USD/kg
   • +100kg：3.7 USD/kg
   • +300kg：3.5 USD/kg
   • +600kg：6.4 USD/kg
   • +1000kg：1.4 USD/kg
   • 有效期：2025年3月12日~2025年4月28日

💡 温馨提示：
1. 您可以继续查询其他港口运价
2. 或者告诉我您心仪哪条运价，以及对应的重量体积，我会为您【[生成报价文案](javascript:void(0))】`,
          role: 'assistant' as const
        },
        {
          id: '7',
          content: '生成报价文案：运价5,20KG 20CBM',
          role: 'user' as const
        },
        {
          id: '8',
          content: `📄 为您生成的报价文案如下：

起运港：上海
目的港：洛杉矶
重量：20KG
体积：20CBM
运价：3.4 USD/kg
总价：68 USD
航空公司：韩亚航空
运价编号：OZSH20240312
有效期：2025年3月12日~2025年4月28日

💡 温馨提示：
您可以【[复制内容](javascript:void(0))】，快速报价`,
          role: 'assistant' as const
        }
      ]
    },
    rateQueryWithPage: {
      messages: [
        {
          id: '1',
          content: '查询上海到洛杉矶价格',
          role: 'user' as const
        },
        {
          id: '2',
          content: `我看到您正在浏览运价查询页面，已为您查到5条运价，其中：

📊 最便宜运价
════════════════════════════════════════════
• 20GP：100 USD
• 40GP：200 USD
• 40HQ：200 USD
• 船公司：MSK-马士基
• 舱位状态：紧张
• 有效期：2025年3月2日~2025年4月30日
• 航程：50天

⚡ 最快运价
════════════════════════════════════════════
• 20GP：100 USD
• 40GP：200 USD
• 40HQ：200 USD
• 船公司：MSK-马士基
• 舱位状态：紧张
• 有效期：2025年3月2日~2025年4月30日
• 航程：10天

📝 其他运价
════════════════════════════════════════════
1. ONE-海洋网联 (运价编号：ONESH20240301)
   • 20GP：120 USD
   • 40GP：240 USD
   • 40HQ：240 USD
   • 舱位状态：充足
   • 有效期：2025年3月5日~2025年4月15日
   • 航程：15天

2. COSCO-中远海运 (运价编号：COSCN20240315)
   • 20GP：150 USD
   • 40GP：280 USD
   • 40HQ：280 USD
   • 舱位状态：一般
   • 有效期：2025年3月10日~2025年4月20日
   • 航程：20天

3. EMC-长荣海运 (运价编号：EMCSH20240308)
   • 20GP：130 USD
   • 40GP：250 USD
   • 40HQ：250 USD
   • 舱位状态：充足
   • 有效期：2025年3月8日~2025年4月25日
   • 航程：18天

4. YML-阳明海运 (运价编号：YMLSH20240320)
   • 20GP：140 USD
   • 40GP：270 USD
   • 40HQ：270 USD
   • 舱位状态：紧张
   • 有效期：2025年3月15日~2025年4月30日
   • 航程：25天

5. HMM-韩国海运 (运价编号：HMMSH20240312)
   • 20GP：110 USD
   • 40GP：220 USD
   • 40HQ：220 USD
   • 舱位状态：一般
   • 有效期：2025年3月12日~2025年4月28日
   • 航程：22天

💡 温馨提示：
1. 您可以继续查询其他港口运价
2. 或者告诉我您心仪哪条运价，以及对应的箱型箱量，我会为您【[生成报价文案](javascript:void(0))】`,
          role: 'assistant' as const
        },
        {
          id: '3',
          content: '看看空运吧',
          role: 'user' as const
        },
        {
          id: '4',
          content: `我看到您切换到了空运查询，已为您查到5条运价，其中：

📊 最便宜运价
════════════════════════════════════════════
运价编号：DHLSH20240301
• +45kg：3.2 USD/kg
• +100kg：3.5 USD/kg
• +300kg：3.3 USD/kg
• +600kg：6.2 USD/kg
• +1000kg：1.2 USD/kg
• 航空公司：德莎
• 有效期：2025年3月2日~2025年4月30日

📝 其他运价
════════════════════════════════════════════
1. 联邦快递 (运价编号：FEDSH20240305)
   • +45kg：3.5 USD/kg
   • +100kg：3.8 USD/kg
   • +300kg：3.6 USD/kg
   • +600kg：6.5 USD/kg
   • +1000kg：1.5 USD/kg
   • 有效期：2025年3月5日~2025年4月15日

2. 卢森堡航空 (运价编号：CVGSH20240310)
   • +45kg：3.8 USD/kg
   • +100kg：4.0 USD/kg
   • +300kg：3.9 USD/kg
   • +600kg：6.8 USD/kg
   • +1000kg：1.8 USD/kg
   • 有效期：2025年3月10日~2025年4月20日

3. 阿联酋航空 (运价编号：EMISH20240308)
   • +45kg：3.3 USD/kg
   • +100kg：3.6 USD/kg
   • +300kg：3.4 USD/kg
   • +600kg：6.3 USD/kg
   • +1000kg：1.3 USD/kg
   • 有效期：2025年3月8日~2025年4月25日

4. 土耳其航空 (运价编号：TKSH20240315)
   • +45kg：3.6 USD/kg
   • +100kg：3.9 USD/kg
   • +300kg：3.7 USD/kg
   • +600kg：6.6 USD/kg
   • +1000kg：1.6 USD/kg
   • 有效期：2025年3月15日~2025年4月30日

5. 韩亚航空 (运价编号：OZSH20240312)
   • +45kg：3.4 USD/kg
   • +100kg：3.7 USD/kg
   • +300kg：3.5 USD/kg
   • +600kg：6.4 USD/kg
   • +1000kg：1.4 USD/kg
   • 有效期：2025年3月12日~2025年4月28日

💡 温馨提示：
1. 您可以继续查询其他港口运价
2. 或者告诉我您心仪哪条运价，以及对应的重量体积，我会为您【[生成报价文案](javascript:void(0))】`,
          role: 'assistant' as const
        },
        {
          id: '5',
          content: '生成报价文案：运价5,20KG 20CBM',
          role: 'user' as const
        },
        {
          id: '6',
          content: `📄 为您生成的报价文案如下：

起运港：上海
目的港：洛杉矶
重量：20KG
体积：20CBM
运价：3.4 USD/kg
总价：68 USD
航空公司：韩亚航空
运价编号：OZSH20240312
有效期：2025年3月12日~2025年4月28日

💡 温馨提示：
您可以【[复制内容](javascript:void(0))】，快速报价`,
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
          content: `📦 订单 WB123456789 的物流跟踪信息

════════════════════════════════════════════
📍 基础信息
════════════════════════════════════════════
• 起运港：上海
• 卸货港：新加坡
• 目的港：吉隆坡

════════════════════════════════════════════
⏱️ 物流时间线
════════════════════════════════════════════
1. 提空箱 (0/1) • 待操作
2. 预计开港 • 2025-03-23 09:50:00 • 待操作
3. 港区截单 • 2025-03-19 12:00:00 • 待操作
4. 重箱进场 (1/1) • 2025-03-20 14:30:00 • 已完成
5. 海关放行 (1/1) • 2025-03-21 09:15:00 • 已完成
6. 码头放行 (1/1) • 2025-03-21 11:20:00 • 已完成
7. 实际靠泊 • 计划：2025-03-28 22:30:00 • 待操作
8. 配载 (0/1) • 待操作
9. 实际开船 • 计划：2025-03-29 11:30:00 • 待操作
10. 卸船 (0/1) • 待操作
11. 提重 (0/1) • 待操作
12. 还箱 (0/1) • 待操作

════════════════════════════════════════════
📋 集装箱详情
════════════════════════════════════════════
| 字段 | 值 |
|------|-----|
| 码头 | 上海港外高桥码头 |
| 出口船名船次 | COSCO SHIPPING PISCES V.045E |
| 箱号 | CSLU1234567 |
| 持箱人 | COSCO SHIPPING |
| 箱型 | 40HQ |
| 装货港 | 上海 |
| 箱种 | 普通箱 |
| 卸货港 | 新加坡 |
| 箱状态 | 已放行 |
| 目的港 | 吉隆坡 |
| 铅封号 | 1234567 |
| 进场时间 | 2025-03-20 14:30:00 |
| 进场方式 | 公路运输 |
| 海关放行 | 已放行 |
| 海放说明 | 正常放行 |
| 收到海放时间 | 2025-03-21 09:15:00 |
| 出场时间 | 2025-03-21 11:20:00 |
| 出场方式 | 公路运输 |
| 码头放行 | 已放行 |
| 码头配载 | 待配载 |

════════════════════════════════════════════
💡 温馨提示：
• 如您希望只查看SOP状态变化，请点击【[SOP跟踪](javascript:void(0))】`,
          role: 'assistant' as const
        },
        {
          id: '3',
          content: 'SOP跟踪',
          role: 'user' as const
        },
        {
          id: '4',
          content: `🔄 订单 WB123456789 的 SOP 状态跟踪

⏱️ 更新时间：2024-03-24 12:16

📋 节点状态概览
════════════════════════════════════════════

✅ 新增委托    已操作    2025-03-24 12:16
❌ 接受通知    未发送    --:--
✅ 订舱        已订舱    2025-03-24 12:16
❌ 货物进仓    未入库    --:--
❌ 开港        未开始    --:--
❌ 配载        未开始    --:--
❌ 离泊        未开始    --:--
❌ 报关单证    未收到    --:--
❌ 待报关      未发送    --:--
❌ 待提单签发  未确认    --:--
✅ 业务提交    提交      2025-03-24 12:17
✅ 业务审核    审核      2025-03-24 12:16

💡 状态说明：
✅ - 已完成
❌ - 未完成/未开始
⏳ - 进行中

════════════════════════════════════════════
💡 温馨提示：
如需要查看详细的码头数据，请点击【[数据跟踪](javascript:void(0))】`,
          role: 'assistant' as const
        }
      ]
    },
    trackOrderNoService: {
      messages: [
        {
          id: '1',
          content: '跟踪订单 WB123456789 的物流状态',
          role: 'user' as const
        },
        {
          id: '2',
          content: `🔄 订单 WB123456789 的 SOP 状态跟踪

⏱️ 更新时间：2024-03-24 12:16

📋 节点状态概览
════════════════════════════════════════════

✅ 新增委托    已操作    2025-03-24 12:16
❌ 接受通知    未发送    --:--
✅ 订舱        已订舱    2025-03-24 12:16
❌ 货物进仓    未入库    --:--
❌ 开港        未开始    --:--
❌ 配载        未开始    --:--
❌ 离泊        未开始    --:--
❌ 报关单证    未收到    --:--
❌ 待报关      未发送    --:--
❌ 待提单签发  未确认    --:--
✅ 业务提交    提交      2025-03-24 12:17
✅ 业务审核    审核      2025-03-24 12:16

💡 状态说明：
✅ - 已完成
❌ - 未完成/未开始
⏳ - 进行中

════════════════════════════════════════════
💡 温馨提示：
您尚未采购数据跟踪服务，只能追踪SOP状态
您可以【[联系客服](javascript:void(0))】申请开通对应服务`,
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
• 地址：Unit 1201-1202, 12/F, Technology Park, 18 Science Street, Kowloon, Hong Kong
• 电话：+852 2345 6789
• 邮箱：shipping@abcelectronics.com
• 联系人：John Chen

收货人：XYZ Trading Corp.
• 地址：2500 Marina Boulevard, Suite 300, Los Angeles, CA 90007, USA
• 电话：+1 213 555 0123
• 邮箱：receiving@xyztrading.com
• 联系人：Sarah Johnson

通知方：XYZ Trading Corp.
• 地址：2500 Marina Boulevard, Suite 300, Los Angeles, CA 90007, USA
• 电话：+1 213 555 0123
• 邮箱：notify@xyztrading.com
• 联系人：Mike Williams

📝 备注事项
=====================================
• 运费条款：PREPAID
• 签发日期：2024-03-25
• 货物已装船
• 正本提单份数：3/3

💡 温馨提示：
您可以继续上传文件开始一票新的识别，或【[导出当前信息](javascript:void(0))】`,
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

  const demoContent = (
    <div className="space-y-2">
      <button
        onClick={() => handleDemoClick('orderInfo')}
        className="side-menu-item w-full flex items-center justify-between"
      >
        <span>演示订单管理</span>
        <RightOutlined />
      </button>
      <button
        onClick={() => handleDemoClick('rateQuery')}
        className="side-menu-item w-full flex items-center justify-between"
      >
        <span>演示运价查询--未感知页面</span>
        <RightOutlined />
      </button>
      <button
        onClick={() => handleDemoClick('rateQueryWithPage')}
        className="side-menu-item w-full flex items-center justify-between"
      >
        <span>演示运价查询--感知到页面</span>
        <RightOutlined />
      </button>
      <button
        onClick={() => handleDemoClick('trackOrder')}
        className="side-menu-item w-full flex items-center justify-between"
      >
        <span>演示跟踪--带数据服务</span>
        <RightOutlined />
      </button>
      <button
        onClick={() => handleDemoClick('trackOrderNoService')}
        className="side-menu-item w-full flex items-center justify-between"
      >
        <span>演示跟踪--未购买数据服务</span>
        <RightOutlined />
      </button>
      <button
        onClick={() => handleDemoClick('fileRecognition')}
        className="side-menu-item w-full flex items-center justify-between"
      >
        <span>演示文件识别</span>
        <RightOutlined />
      </button>
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
        {demoContent}
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