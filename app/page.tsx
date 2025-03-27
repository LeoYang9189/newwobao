'use client';

import MainLayout from './components/Layout';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';

export default function Home() {
  return (
    <ConfigProvider locale={zhCN}>
      <MainLayout />
    </ConfigProvider>
  );
} 