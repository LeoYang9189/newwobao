import React, { useRef, useEffect, useState } from 'react';
import { Modal, Button, Tooltip, Switch, message } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import Image from 'next/image';

interface FieldData {
  label: string;
  value: string;
  isDifferent?: boolean;
}

// 模拟数据
const mockFields: FieldData[] = [
  { label: '提单号码', value: 'CSHMF24106115' },
  { label: '提单形式', value: 'OCEAN BILL OF LADING' },
  { label: '运输方式', value: 'SEA WAYBILL' },
  { label: '发货人', value: 'AGICO CEMENT INTERNATIONAL ENGINEERING CO., LTD. FL 8, BUILDING 2,HUAQIANG NEW-TIMES, PINGYUAN RD, ANYANG, HENAN CHINA' },
  { label: '收货人', value: 'YAMAMA CEMENT COMPANY\nYAMAMA CEMENT COMPANY,AIRPORT ROAD, AL\nFALAH,EASTERN RING, EXIT\nP.O. BOX 293,11411 RIYADH,KINGDOM OF\nSAUDI ARABIA\nVAT NO: 300055124500003' },
  { label: '通知方', value: 'MR. ABDULAZIZ ALGHWAIRI\nABDULAZIZ.ALGHWAIRI@YAMAMACEMENT.COM\nTEL: 00966 11 4085681' },
  { label: '船公司', value: 'CSCL GLOBE' },
  { label: '航次', value: '065W' },
  { label: '装货港', value: 'SHANGHAI' },
  { label: '卸货港', value: 'DAMMAM' },
  { label: '目的港', value: 'DAMMAM' },
  { label: '启运地', value: 'NINGBO' },
  { label: '交货地', value: 'TOPSHAVN' },
  { label: '箱量', value: '1' },
  { label: '品名', value: 'WOODEN CASE' },
  { label: '毛重', value: '380,000' },
  { label: '体积', value: '1.770' },
  { label: '备注', value: 'CONSIGNEE: YCC\nSHIPPER: AGICO\nCEMENT\nCOUNTRY OF\nORIGIN: CHINA\nPO NO.: 35234\nBUCKET FOR BELT BUCKET ELEVATOR' },
];

// 模拟识别结果数据
const mockOcrFields: FieldData[] = mockFields.map(field => ({
  ...field,
  value: field.value + (Math.random() > 0.7 ? ' (OCR)' : ''),
  isDifferent: Math.random() > 0.7
}));

interface Props {
  visible: boolean;
  onClose: () => void;
}

const DocumentComparisonModal: React.FC<Props> = ({ visible, onClose }) => {
  const [fields] = useState<FieldData[]>(mockFields);
  const [ocrFields] = useState<FieldData[]>(mockOcrFields);
  const [acceptedFields, setAcceptedFields] = useState<{ [key: string]: boolean }>({});
  const [showOnlyDiff, setShowOnlyDiff] = useState(false);

  const filePreviewRef = useRef<HTMLDivElement>(null);
  const ocrResultRef = useRef<HTMLDivElement>(null);
  const systemDataRef = useRef<HTMLDivElement>(null);

  // 只同步识别结果和系统数据两列的滚动
  useEffect(() => {
    const refs = [ocrResultRef, systemDataRef];
    let isSyncing = false;
    const handleScroll = (event: Event) => {
      if (isSyncing) return;
      isSyncing = true;
      const scrolledElement = event.target as HTMLDivElement;
      const scrollTop = scrolledElement.scrollTop;
      refs.forEach(ref => {
        if (ref.current && ref.current !== scrolledElement) {
          ref.current.scrollTop = scrollTop;
        }
      });
      setTimeout(() => { isSyncing = false; }, 10);
    };
    refs.forEach(ref => {
      ref.current?.addEventListener('scroll', handleScroll);
    });
    return () => {
      refs.forEach(ref => {
        ref.current?.removeEventListener('scroll', handleScroll);
      });
    };
  }, []);

  // 过滤字段
  const filteredOcrFields = showOnlyDiff ? ocrFields.filter(f => f.isDifferent) : ocrFields;
  const filteredSysFields = showOnlyDiff ? fields.filter((_, idx) => ocrFields[idx]?.isDifferent) : fields;

  const handleAcceptField = (label: string) => {
    setAcceptedFields(prev => ({
      ...prev,
      [label]: true
    }));
  };

  const handleRejectField = (label: string) => {
    setAcceptedFields(prev => ({
      ...prev,
      [label]: false
    }));
  };

  // 批量覆盖全部
  const handleAcceptAll = () => {
    const diffLabels = ocrFields.filter(f => f.isDifferent).map(f => f.label);
    setAcceptedFields(prev => {
      const next = { ...prev };
      diffLabels.forEach(label => { next[label] = true; });
      return next;
    });
    message.success('已全部覆盖差异字段');
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width="95vw"
      style={{ top: 20, maxWidth: '1600px' }}
      className="document-comparison-modal"
    >
      {/* 右上角开关按钮，和关闭按钮分离 */}
      <div className="flex justify-end items-center mb-2 pr-12">
        <span className="mr-2 text-gray-600 text-sm">只显示差异字段</span>
        <Switch checked={showOnlyDiff} onChange={setShowOnlyDiff} />
      </div>
      <div className="flex h-[85vh] gap-4">
        {/* 文件预览 */}
        <div className="flex-1 bg-gray-50 rounded-lg p-4">
          <h2 className="text-lg font-bold mb-4 text-gray-800">文件预览</h2>
          <div 
            ref={filePreviewRef}
            className="bg-white h-[calc(100%-2rem)] rounded-lg border border-gray-200 overflow-auto p-4"
          >
            <div className="relative w-full h-full">
              <Image
                src="/images/bill-of-lading.png"
                alt="提单预览"
                width={800}
                height={1000}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>

        {/* 识别结果+系统数据 共享滚动条，grid布局 */}
        <div className="flex-[2] bg-gray-50 rounded-lg p-4 relative flex flex-col">
          <div className="flex-1 h-0 overflow-auto">
            {/* sticky 标题栏 */}
            <div className="grid grid-cols-2 gap-4 sticky top-0 z-10 bg-gray-50 pb-2" style={{background: 'inherit'}}>
              <div className="text-lg font-bold text-gray-800">识别结果</div>
              <div className="text-lg font-bold text-gray-800">系统数据</div>
            </div>
            {/* 字段对齐渲染 */}
            <div className="grid grid-cols-2 gap-4">
              {filteredOcrFields.length === 0 ? (
                <div className="col-span-2 text-center text-gray-400 py-12">无差异字段</div>
              ) : filteredOcrFields.map((ocrField, idx) => {
                // 找到系统字段索引
                const sysIdx = ocrFields.findIndex(f => f.label === ocrField.label);
                const sysField = filteredSysFields[idx] || fields[sysIdx];
                return (
                  <React.Fragment key={ocrField.label}>
                    {/* 识别结果字段 */}
                    <div className={`bg-white p-4 rounded-lg border min-h-[64px] flex flex-col justify-between ${
                      ocrField.isDifferent ? 'border-red-300' : 'border-gray-200'
                    }`}
                    style={{height: '100%'}}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500">{ocrField.label}</span>
                        {ocrField.isDifferent && !acceptedFields[ocrField.label] && (
                          <div className="flex items-center gap-2">
                            <Tooltip title="接受">
                              <Button
                                type="text"
                                icon={<CheckOutlined className="text-green-500" />}
                                onClick={() => handleAcceptField(ocrField.label)}
                              />
                            </Tooltip>
                            <Tooltip title="拒绝">
                              <Button
                                type="text"
                                icon={<CloseOutlined className="text-red-500" />}
                                onClick={() => handleRejectField(ocrField.label)}
                              />
                            </Tooltip>
                          </div>
                        )}
                      </div>
                      <div className={`text-sm whitespace-pre-wrap ${
                        ocrField.isDifferent ? 'text-red-500' : 'text-gray-800'
                      }`}>
                        {ocrField.value}
                      </div>
                    </div>
                    {/* 系统数据字段 */}
                    <div className="bg-white p-4 rounded-lg border border-gray-200 min-h-[64px] flex flex-col justify-between" style={{height: '100%'}}>
                      <div className="text-sm text-gray-500 mb-2">{sysField.label}</div>
                      <div className="text-sm text-gray-800 whitespace-pre-wrap">
                        {sysField.value}
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
          {/* 底部固定按钮区，始终在内容区内 */}
          <div className="shrink-0 bg-gray-50 pt-4 pb-2 flex justify-end gap-4 z-20" style={{borderTop: '1px solid #eee'}}>
            <Button type="primary" onClick={handleAcceptAll}>覆盖全部</Button>
            <Button onClick={onClose}>关闭</Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DocumentComparisonModal; 