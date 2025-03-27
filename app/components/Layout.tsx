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
  PlusCircleOutlined
} from '@ant-design/icons';
import Image from 'next/image';
import ChatComponent from './Chat';

const { Sider, Content } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

// 模拟历史对话数据
const historyChats = [
  { id: '1', title: '解释数学含义', icon: <MessageOutlined /> },
  { id: '2', title: 'ASC 公司介绍', icon: <MessageOutlined /> },
  { id: '3', title: '王芽', icon: <MessageOutlined /> },
  { id: '4', title: '攻击型领导：锻炼你的抗压能力', icon: <MessageOutlined /> },
  { id: '5', title: '手机版对话', icon: <MessageOutlined /> },
];

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = React.useState(false);
  const [currentMode, setCurrentMode] = React.useState<'fullscreen' | 'dialog'>('fullscreen');
  const [popoverVisible, setPopoverVisible] = React.useState(false);
  const [resetChatFn, setResetChatFn] = React.useState<(() => void) | null>(null);

  const handleModeChange = (mode: 'fullscreen' | 'dialog') => {
    setCurrentMode(mode);
    setPopoverVisible(false);
  };

  const handleReset = () => {
    if (resetChatFn) {
      resetChatFn();
    }
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
              onClick={handleReset}
              className="w-full h-10 flex items-center justify-center gap-2 bg-[#EBF5FF] hover:bg-[#E0EDFF] text-[#1677ff] rounded-lg transition-colors"
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
          <ChatComponent onReset={setResetChatFn} />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout; 