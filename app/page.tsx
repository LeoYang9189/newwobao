'use client';

import MainLayout from './components/Layout';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // 确保在客户端运行
    if (typeof window !== 'undefined') {
      // 如果在根路径，重定向到主页
      if (window.location.pathname === '/') {
        router.push('/');
      }
    }
  }, [router]);

  return (
    <ConfigProvider locale={zhCN}>
      <MainLayout />
    </ConfigProvider>
  );
} 