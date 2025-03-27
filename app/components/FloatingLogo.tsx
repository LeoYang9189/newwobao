import React from 'react';
import Image from 'next/image';
import { CloseOutlined } from '@ant-design/icons';
import Draggable, { DraggableEventHandler } from 'react-draggable';

interface FloatingLogoProps {
  onClick: () => void;
  onClose: () => void;
  position: { x: number; y: number };
  onPositionChange: (position: { x: number; y: number }) => void;
}

const FloatingLogo: React.FC<FloatingLogoProps> = ({
  onClick,
  onClose,
  position,
  onPositionChange
}) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleStop: DraggableEventHandler = (e, data) => {
    onPositionChange({ x: data.x, y: data.y });
  };

  if (!mounted) {
    return null;
  }

  return (
    <Draggable
      defaultPosition={position}
      onStop={handleStop}
      bounds="parent"
    >
      <div className="fixed cursor-move" style={{ 
        zIndex: 1000
      }}>
        <div className="relative group">
          <div 
            className="w-12 h-12 relative"
            onClick={onClick}
          >
            <Image
              src="/logo.png"
              alt="AI 沃宝"
              fill
              className="object-contain"
              priority
            />
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="absolute -top-2 -right-2 w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-200"
          >
            <CloseOutlined className="text-xs text-gray-600" />
          </button>
        </div>
      </div>
    </Draggable>
  );
};

export default FloatingLogo; 