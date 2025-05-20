import React, { useState, useEffect } from 'react';
import { Modal, Progress } from 'antd';

interface LogisticsKnowledge {
  term: string;
  explanation: string;
}

const logisticsKnowledge: LogisticsKnowledge[] = [
  {
    term: 'THC (Terminal Handling Charge)',
    explanation: '码头操作费，是指货物在码头装卸、搬运等操作过程中产生的费用。这是国际海运中一项重要的基础费用。'
  },
  {
    term: 'FOB (Free On Board)',
    explanation: '离岸价，指卖方将货物装上指定船只并承担相关费用和风险，装船后的费用和风险由买方承担。'
  },
  {
    term: 'CIF (Cost, Insurance and Freight)',
    explanation: '到岸价，包括货物价格、运费和保险费。卖方需要在装运港安排货物运输并支付相关费用。'
  },
  {
    term: 'B/L (Bill of Lading)',
    explanation: '提单，是承运人签发的货物收据，也是物权凭证。它是国际贸易中最重要的单据之一。'
  },
  {
    term: 'FCL (Full Container Load)',
    explanation: '整箱装运，指一个集装箱全部装载同一托运人的货物，由托运人自行装箱。'
  },
  {
    term: 'LCL (Less than Container Load)',
    explanation: '拼箱运输，指多个托运人的货物共同装在同一个集装箱中运输。'
  },
  {
    term: 'ETA (Estimated Time of Arrival)',
    explanation: '预计到达时间，船舶或货物预计抵达目的地的时间。这是物流跟踪中的重要信息。'
  },
  {
    term: 'ETD (Estimated Time of Departure)',
    explanation: '预计离港时间，船舶预计从始发港出发的时间。对于规划物流时间很重要。'
  },
  {
    term: 'D/O (Delivery Order)',
    explanation: '提货单，是收货人凭以提取货物的凭证。通常需要向船公司提供已签发的提单。'
  },
  {
    term: 'BAF (Bunker Adjustment Factor)',
    explanation: '燃油附加费，是船公司根据国际燃油价格的波动而调整的附加费用。'
  }
];

interface Props {
  visible: boolean;
  onComplete: () => void;
}

const FileRecognitionModal: React.FC<Props> = ({ visible, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentKnowledge, setCurrentKnowledge] = useState<LogisticsKnowledge>(logisticsKnowledge[0]);
  const [shipPosition, setShipPosition] = useState(0);
  
  useEffect(() => {
    if (!visible) {
      setProgress(0);
      setShipPosition(0);
      return;
    }

    // 进度条动画
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            onComplete();
          }, 500);
          return 100;
        }
        return prev + 5;
      });
    }, 1000);

    // 船只动画
    const shipInterval = setInterval(() => {
      setShipPosition(prev => (prev + 1) % 3);
    }, 500);

    // 知识点轮播
    const knowledgeInterval = setInterval(() => {
      setCurrentKnowledge(prev => {
        const currentIndex = logisticsKnowledge.findIndex(k => k.term === prev.term);
        const nextIndex = (currentIndex + 1) % logisticsKnowledge.length;
        return logisticsKnowledge[nextIndex];
      });
    }, 5000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(shipInterval);
      clearInterval(knowledgeInterval);
    };
  }, [visible, onComplete]);

  // 生成波浪动画效果
  const getWaveEmoji = () => {
    const waves = ['🌊', '🌊 ', ' 🌊'];
    return waves.map((wave, index) => (
      <span 
        key={index} 
        className="inline-block"
        style={{
          animation: 'wave 2s infinite',
          animationDelay: `${index * 0.3}s`
        }}
      >
        {wave}
      </span>
    ));
  };

  return (
    <Modal
      open={visible}
      footer={null}
      closable={false}
      width={600}
      className="recognition-modal"
      maskClosable={false}
      centered
    >
      <div className="flex flex-col items-center p-8">
        {/* 船只动画 */}
        <div className="relative w-full h-24 mb-8 overflow-hidden">
          <style jsx>{`
            @keyframes float {
              0% { transform: translateY(0px); }
              50% { transform: translateY(-10px); }
              100% { transform: translateY(0px); }
            }
            @keyframes wave {
              0% { transform: translateX(0) translateY(0); }
              50% { transform: translateX(-10px) translateY(-5px); }
              100% { transform: translateX(0) translateY(0); }
            }
            .ship-container {
              animation: float 3s ease-in-out infinite;
            }
          `}</style>
          <div className="flex items-center justify-center w-full h-full">
            <div className="ship-container text-4xl">
              {/* 船只 emoji */}
              🚢
            </div>
            <div className="absolute bottom-0 w-full text-center">
              {/* 波浪动画 */}
              {getWaveEmoji()}
            </div>
          </div>
        </div>

        {/* 进度条 */}
        <Progress
          percent={progress}
          status="active"
          strokeColor={{
            '0%': '#108ee9',
            '100%': '#87d068',
          }}
          className="w-full mb-8"
        />

        {/* 提示文字 */}
        <div className="text-lg font-medium mb-6 text-center">
          正在奋力识别中，等待过程太无聊？看看下面的物流小知识吧！
        </div>

        {/* 知识卡片 */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg w-full">
          <div className="animate-fade-in">
            <h3 className="text-lg font-bold text-blue-800 mb-2">
              {currentKnowledge.term}
            </h3>
            <p className="text-gray-600">
              {currentKnowledge.explanation}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default FileRecognitionModal; 