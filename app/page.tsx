'use client';

import MainLayout from './components/Layout';
import ChatComponent from './components/Chat';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';

export default function Home() {
  return (
    <ConfigProvider locale={zhCN}>
      <MainLayout>
        <div className="h-[calc(100vh-120px)]">
          <ChatComponent />
        </div>
      </MainLayout>
    </ConfigProvider>
  );
} 