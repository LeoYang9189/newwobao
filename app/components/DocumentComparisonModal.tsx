import React from 'react';
import { Modal } from 'antd';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const DocumentComparisonModal: React.FC<Props> = ({ visible, onClose }) => {
  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width="90vw"
      style={{ top: 20 }}
      className="document-comparison-modal"
    >
      <div className="flex h-[80vh] gap-4">
        {/* 文件预览 */}
        <div className="flex-1 bg-gray-50 rounded-lg p-4 overflow-auto">
          <h2 className="text-lg font-bold mb-4">文件预览</h2>
          <div className="bg-white h-full rounded-lg border border-gray-200">
            {/* 这里将放置PDF预览组件 */}
          </div>
        </div>

        {/* 识别结果 */}
        <div className="flex-1 bg-gray-50 rounded-lg p-4 overflow-auto">
          <h2 className="text-lg font-bold mb-4">识别结果</h2>
          <div className="space-y-4">
            {/* 这里将显示OCR识别结果 */}
          </div>
        </div>

        {/* 系统数据 */}
        <div className="flex-1 bg-gray-50 rounded-lg p-4 overflow-auto">
          <h2 className="text-lg font-bold mb-4">系统数据</h2>
          <div className="space-y-4">
            {/* 这里将显示系统中的数据 */}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DocumentComparisonModal; 