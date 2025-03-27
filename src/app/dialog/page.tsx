'use client';

import React, { useState, useEffect } from 'react';
import DialogChat from '../components/DialogChat';
import FloatingLogo from '../components/FloatingLogo';

const DialogPage = () => {
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [logoPosition, setLogoPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
    // 初始化logo位置在右下角
    setLogoPosition({
      x: window.innerWidth - 100,
      y: window.innerHeight - 100
    });

    const handleResize = () => {
      setLogoPosition({
        x: window.innerWidth - 100,
        y: window.innerHeight - 100
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleModeChange = () => {
    window.location.href = '/';
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <DialogChat
        visible={visible}
        onClose={() => setVisible(false)}
        onModeChange={handleModeChange}
        isFullscreen={false}
      />
      <FloatingLogo
        onClick={() => setVisible(true)}
        onClose={() => window.location.href = '/'}
        position={logoPosition}
        onPositionChange={setLogoPosition}
      />
    </div>
  );
};

export default DialogPage; 