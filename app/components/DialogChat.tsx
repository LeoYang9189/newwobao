import React, { useEffect, useState } from 'react';
import { Button, Input, Upload, Modal, Spin, message, Select, Popover } from 'antd';
import { 
  SendOutlined, 
  RightOutlined, 
  PaperClipOutlined, 
  LoadingOutlined, 
  DeleteOutlined,
  CloseOutlined,
  ExpandOutlined,
  CompressOutlined,
  CheckOutlined,
  ShoppingOutlined,
  DollarOutlined,
  GlobalOutlined,
  QuestionCircleOutlined,
  FileSearchOutlined,
  PlusCircleOutlined,
  StarOutlined,
  CustomerServiceOutlined,
  PhoneOutlined,
  MailOutlined
} from '@ant-design/icons';
import Image from 'next/image';
import type { UploadFile, UploadProps, RcFile } from 'antd/es/upload/interface';
import { useRouter } from 'next/navigation';
import Draggable, { DraggableEventHandler } from 'react-draggable';

const { TextArea } = Input;

const quickQuestions = [
  '给我查一下我创建的ETD在这周的海运出口订单有哪些',
  '给我查一下 Shanghai 到 Bangkok 的整箱运价',
  '给我查一下SHSE123456的跟踪状态'
];

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  isThinking?: boolean;
  files?: UploadFile[];
}

interface TopicCard {
  title: string;
  items: { title: string }[];
  gradient: string;
  isQuickQuestion?: boolean;
}

interface DialogChatProps {
  onClose: () => void;
  visible: boolean;
  onModeChange: () => void;
  isFullscreen: boolean;
  position?: { x: number; y: number };
  onPositionChange?: (position: { x: number; y: number }) => void;
}

const DialogChat: React.FC<DialogChatProps> = ({ 
  onClose, 
  visible, 
  onModeChange, 
  isFullscreen,
  position = { x: 0, y: 0 },
  onPositionChange
}) => {
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: '1',
      content: '👋 你好，我是 AI 沃宝\n\n基于Cargoware 云物流平台设计的智能助手方案，我可以帮你操作订单、查询运价、跟踪订单等，快和我对话试试吧！',
      role: 'assistant'
    }
  ]);
  const [inputValue, setInputValue] = React.useState('');
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [fileList, setFileList] = React.useState<UploadFile[]>([]);
  const [activeSkill, setActiveSkill] = React.useState<{
    icon: React.ReactNode;
    text: string;
  } | null>(null);
  const [popoverVisible, setPopoverVisible] = React.useState(false);
  const [currentMode, setCurrentMode] = React.useState<'fullscreen' | 'dialog'>(isFullscreen ? 'fullscreen' : 'dialog');
  const [wishModalVisible, setWishModalVisible] = React.useState(false);
  const [selectedModules, setSelectedModules] = React.useState<string[]>([]);
  const [wishDescription, setWishDescription] = React.useState('');
  const [complaintModalVisible, setComplaintModalVisible] = React.useState(false);
  const [complaintModules, setComplaintModules] = React.useState<string[]>([]);
  const [complaintDescription, setComplaintDescription] = React.useState('');
  const [contactModalVisible, setContactModalVisible] = React.useState(false);
  const [windowSize, setWindowSize] = React.useState({ width: 800, height: 600 });

  useEffect(() => {
    setMounted(true);
    // 获取窗口尺寸
    const updateSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // 计算对话框的初始位置
  const getInitialPosition = () => {
    if (!mounted) return { left: 0, top: 0 };
    const modalWidth = 800;
    const modalHeight = windowSize.height * 0.85;
    return {
      left: Math.max(0, (windowSize.width - modalWidth) / 2),
      top: Math.max(0, windowSize.height * 0.05)
    };
  };

  const topicCards: TopicCard[] = [
    {
      title: "热门话题",
      items: [
        { title: "AI沃宝全新升级了什么？" },
        { title: "如何开启AI沃宝对话" },
        { title: "AI沃宝有什么更新计划" },
      ],
      gradient: "from-[#fad0c4] via-[#ffd1ff] to-[#fad0c4]"
    },
    {
      title: "AI沃宝使用反馈",
      items: [
        { title: "✨ 许愿新功能" },
        { title: "🎯 吐槽产品经理" },
        { title: "💬 联系客服了解更多" },
      ],
      gradient: "from-[#96fbc4] via-[#f9f586] to-[#96fbc4]"
    },
    {
      title: "你可以这样问",
      items: quickQuestions.map(q => ({ title: q })),
      gradient: "from-[#84fab0] via-[#8fd3f4] to-[#84fab0]",
      isQuickQuestion: true
    }
  ];

  const navButtons = [
    {
      icon: <ShoppingOutlined className="text-blue-500" />,
      text: '订单操作'
    },
    {
      icon: <DollarOutlined className="text-green-500" />,
      text: '智能运价'
    },
    {
      icon: <GlobalOutlined className="text-purple-500" />,
      text: '订单跟踪'
    },
    {
      icon: <QuestionCircleOutlined className="text-orange-500" />,
      text: 'Cargoware FAQ'
    },
    {
      icon: <FileSearchOutlined className="text-cyan-500" />,
      text: '文件识别'
    }
  ];

  const moduleOptions = [
    { label: '订单操作', value: 'order_operation' },
    { label: '智能运价', value: 'smart_rate' },
    { label: '订单跟踪', value: 'order_tracking' },
    { label: 'Cargoware FAQ', value: 'cargoware_faq' },
    { label: '文件识别', value: 'file_recognition' },
    { label: '其他', value: 'others' }
  ];

  const handleSend = () => {
    if ((!inputValue.trim() && fileList.length === 0) || isGenerating) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      files: fileList.length > 0 ? [...fileList] : undefined
    };
    
    const thinkingMessage: Message = {
      id: 'thinking',
      content: '',
      role: 'assistant',
      isThinking: true
    };
    
    setMessages(prev => [...prev, newMessage, thinkingMessage]);
    setInputValue('');
    setFileList([]);
    setIsGenerating(true);
    
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: '这是一个模拟的 AI 回复消息。',
        role: 'assistant',
      };
      setMessages(prev => prev.filter(msg => !msg.isThinking).concat(aiResponse));
      setIsGenerating(false);
    }, 1000);
  };

  const handleUpload = (file: RcFile) => {
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error('文件必须小于10MB！');
      return false;
    }
    return true;
  };

  const handleRemove = (file: UploadFile) => {
    const newFileList = fileList.filter(item => item.uid !== file.uid);
    setFileList(newFileList);
  };

  const customRequest: UploadProps['customRequest'] = ({ 
    file, 
    onSuccess 
  }) => {
    setTimeout(() => {
      onSuccess?.(null);
    }, 0);
  };

  const handleChange: UploadProps['onChange'] = (info) => {
    setFileList(info.fileList);
  };

  const handleModeChange = (mode: 'fullscreen' | 'dialog') => {
    setCurrentMode(mode);
    setPopoverVisible(false);
    if (mode === 'fullscreen') {
      router.push('/');
    }
    onModeChange();
  };

  const handleSkillClick = (skill: { icon: React.ReactNode; text: string }) => {
    setActiveSkill(skill);
    setInputValue(`请帮我${skill.text}`);
  };

  const handleClearSkill = () => {
    setActiveSkill(null);
    setInputValue('');
  };

  const handleNewChat = () => {
    setMessages([{
      id: '1',
      content: '👋 你好，我是 AI 沃宝\n\n基于Cargoware 云物流平台设计的智能助手方案，我可以帮你操作订单、查询运价、跟踪订单等，快和我对话试试吧！',
      role: 'assistant'
    }]);
    setInputValue('');
    setFileList([]);
    setActiveSkill(null);
  };

  const handleWishButtonClick = () => {
    setWishModalVisible(true);
  };

  const handleComplaintButtonClick = () => {
    setComplaintModalVisible(true);
  };

  const handleContactButtonClick = () => {
    setContactModalVisible(true);
  };

  const handleWishSubmit = () => {
    if (!selectedModules.length) {
      message.warning('请选择至少一个功能模块');
      return;
    }
    if (!wishDescription.trim()) {
      message.warning('请填写需求描述');
      return;
    }
    
    message.success('感谢您的建议，我们会认真考虑！');
    setWishModalVisible(false);
    setSelectedModules([]);
    setWishDescription('');
  };

  const handleComplaintSubmit = () => {
    if (!complaintModules.length) {
      message.warning('请选择至少一个功能模块');
      return;
    }
    if (!complaintDescription.trim()) {
      message.warning('请填写吐槽内容');
      return;
    }
    
    message.success('感谢您的反馈，我们会认真改进！');
    setComplaintModalVisible(false);
    setComplaintModules([]);
    setComplaintDescription('');
  };

  const handleTopicClick = (title: string) => {
    if (title === "✨ 许愿新功能") {
      handleWishButtonClick();
    } else if (title === "🎯 吐槽产品经理") {
      handleComplaintButtonClick();
    } else if (title === "💬 联系客服了解更多") {
      handleContactButtonClick();
    } else if (title.startsWith("AI沃宝")) {
      window.open(`/docs?topic=${encodeURIComponent(title)}`, '_blank');
    } else {
      setInputValue(title);
    }
  };

  const modeContent = (
    <div className="w-48 py-1">
      {[
        { key: 'fullscreen', label: '全屏模式', icon: <ExpandOutlined className="text-purple-500" /> },
        { key: 'dialog', label: '对话框模式', icon: <CompressOutlined className="text-purple-500" /> }
      ].map(mode => (
        <button
          key={mode.key}
          className="w-full flex items-center px-4 py-2.5 text-sm text-gray-600 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200"
          onClick={() => handleModeChange(mode.key as 'fullscreen' | 'dialog')}
        >
          <div className="flex items-center gap-2 flex-1">
            {mode.icon}
            <span>{mode.label}</span>
          </div>
          {currentMode === mode.key && (
            <CheckOutlined className="text-purple-500" />
          )}
        </button>
      ))}
    </div>
  );

  const handleDragStop: DraggableEventHandler = (e, data) => {
    onPositionChange?.({ x: data.x, y: data.y });
  };

  // 在客户端渲染之前返回null
  if (!mounted) {
    return null;
  }

  const initialPosition = getInitialPosition();

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      className="chat-dialog-modal"
      style={{ 
        margin: 0,
        padding: 0,
        height: '85vh',
        top: initialPosition.top,
        left: initialPosition.left
      }}
      mask={false}
      maskClosable={false}
      closeIcon={null}
      keyboard={false}
      modalRender={modal => (
        <Draggable
          handle=".modal-drag-handle"
          defaultPosition={{ x: 0, y: 0 }}
          bounds="parent"
        >
          {modal}
        </Draggable>
      )}
    >
      <div className="flex flex-col h-[85vh]">  {/* 同步修改内容区域高度 */}
        {/* 头部 */}
        <div className="flex items-center justify-between px-6 py-4 border-b modal-drag-handle cursor-move">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 relative flex-shrink-0">
              <Image
                src="/logo.png"
                alt="AI 沃宝"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-lg font-medium">AI 沃宝</span>
          </div>
          <div className="flex items-center gap-4">
            <Button
              type="default"
              icon={<PlusCircleOutlined className="text-blue-500" />}
              onClick={handleNewChat}
              className="flex items-center hover:bg-blue-50 border-blue-200 hover:border-blue-300 text-blue-600 shadow-sm transition-all duration-200"
            >
              <span className="ml-1">开启新对话</span>
            </Button>
            <Popover
              content={modeContent}
              trigger="click"
              placement="bottom"
              open={popoverVisible}
              onOpenChange={setPopoverVisible}
            >
              <Button 
                type="default"
                icon={isFullscreen ? <CompressOutlined className="text-purple-500" /> : <ExpandOutlined className="text-purple-500" />}
                className="flex items-center hover:bg-purple-50 border-purple-200 hover:border-purple-300 text-purple-600 shadow-sm transition-all duration-200"
              >
                <span className="ml-1">切换助手模式</span>
              </Button>
            </Popover>
            <Button 
              type="text" 
              icon={<CloseOutlined />} 
              onClick={onClose}
              className="hover:bg-gray-100"
            />
          </div>
        </div>

        {/* 消息区域 */}
        <div className="flex-1 overflow-auto p-6">
          {messages.length === 1 && (
            <div className="grid grid-cols-3 gap-4 mb-6">
              {topicCards.map((card, index) => (
                <div
                  key={index}
                  className={`rounded-xl p-4 bg-gradient-to-r ${card.gradient} relative overflow-hidden`}
                >
                  <div className="relative z-10">
                    <h3 className="text-lg font-medium mb-3 text-gray-800">{card.title}</h3>
                    <div className="space-y-2">
                      {card.items.map((item, itemIndex) => (
                        <Popover
                          key={itemIndex}
                          content={<div className="max-w-[300px] text-sm">{item.title}</div>}
                          placement="top"
                          trigger={card.isQuickQuestion ? "hover" : []}
                        >
                          <div
                            className="bg-white bg-opacity-70 backdrop-blur-sm rounded-lg p-3 cursor-pointer hover:bg-opacity-90 hover:shadow-md transition-all duration-300"
                            onClick={() => handleTopicClick(item.title)}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-700 truncate flex-1 pr-2">{item.title}</span>
                              <RightOutlined className="text-xs text-gray-400 flex-shrink-0" />
                            </div>
                          </div>
                        </Popover>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-6`}
            >
              <div className={`flex ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-4 max-w-[85%]`}>
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 relative flex-shrink-0">
                    <Image
                      src="/logo.png"
                      alt="AI 沃宝"
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
                <div
                  className={`p-4 rounded-2xl ${
                    message.role === 'user'
                      ? 'message-bubble user text-white'
                      : 'message-bubble bg-white'
                  }`}
                >
                  {message.isThinking ? (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">正在思考中</span>
                      <Spin 
                        indicator={
                          <LoadingOutlined 
                            style={{ fontSize: 18, color: '#666' }} 
                            spin 
                          />
                        }
                      />
                    </div>
                  ) : (
                    <div>
                      <div className="text-[15px] leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </div>
                      {message.files && message.files.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {message.files.map(file => (
                            <div
                              key={file.uid}
                              className="flex items-center gap-2 bg-black/5 px-3 py-1.5 rounded-lg text-sm"
                            >
                              <PaperClipOutlined className="text-gray-400" />
                              <span className="truncate">{file.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 常用技能 */}
        <div className="border-t">
          <div className="px-6 py-3">
            <div className="flex items-center gap-6 overflow-x-auto pb-2">
              <span className="text-sm text-gray-500 flex-shrink-0">常用技能：</span>
              {navButtons.map((button, index) => (
                <button
                  key={index}
                  className="flex items-center gap-2 py-1.5 px-4 text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 whitespace-nowrap border border-gray-200 rounded-md hover:border-gray-300"
                  onClick={() => handleSkillClick(button)}
                >
                  {button.icon}
                  <span>{button.text}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 输入区域 */}
        <div className="border-t p-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onPressEnter={handleSend}
                placeholder="输入消息..."
                size="large"
                className={`${activeSkill ? 'pl-[120px]' : ''}`}
                disabled={isGenerating}
                suffix={
                  <Upload
                    fileList={fileList}
                    customRequest={customRequest}
                    beforeUpload={handleUpload}
                    onChange={handleChange}
                    showUploadList={false}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                    disabled={isGenerating}
                    multiple
                  >
                    <PaperClipOutlined className={`text-lg ${isGenerating ? 'text-gray-300' : 'text-gray-400 hover:text-gray-600 cursor-pointer'}`} />
                  </Upload>
                }
              />
              {activeSkill && (
                <div 
                  className="absolute left-0 top-0 bottom-0 flex items-center pl-3 cursor-pointer z-10"
                  onClick={handleClearSkill}
                >
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                    {activeSkill.icon}
                    <span className="text-sm">{activeSkill.text}</span>
                  </div>
                </div>
              )}
            </div>
            <Button
              type="primary"
              icon={isGenerating ? <LoadingOutlined /> : <SendOutlined />}
              onClick={handleSend}
              size="large"
              className="min-w-[100px]"
            >
              {isGenerating ? '停止生成' : '发送'}
            </Button>
          </div>
        </div>
      </div>

      {/* 添加模态框 */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-lg">
            <StarOutlined className="text-yellow-400 text-xl" />
            <span>许愿新功能</span>
          </div>
        }
        open={wishModalVisible}
        onCancel={() => setWishModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setWishModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={handleWishSubmit}>
            提交
          </Button>
        ]}
        width={600}
        className="wish-modal"
      >
        <div className="space-y-6 py-4">
          <div>
            <div className="text-sm text-gray-700 mb-2">功能模块</div>
            <Select
              mode="multiple"
              placeholder="请选择功能模块（可多选）"
              options={moduleOptions}
              value={selectedModules}
              onChange={setSelectedModules}
              className="w-full"
              maxTagCount={3}
            />
          </div>
          
          <div>
            <div className="text-sm text-gray-700 mb-2">需求描述</div>
            <TextArea
              placeholder="请详细描述您的功能需求..."
              value={wishDescription}
              onChange={(e) => setWishDescription(e.target.value)}
              rows={4}
              className="w-full"
            />
          </div>

          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">租户ID</span>
              <span className="text-sm text-gray-800 font-medium">9695</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">账号</span>
              <span className="text-sm text-gray-800 font-medium">sample@sample.com</span>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        title={
          <div className="flex items-center gap-2 text-lg">
            <StarOutlined className="text-red-400 text-xl" />
            <span>吐槽产品经理</span>
          </div>
        }
        open={complaintModalVisible}
        onCancel={() => setComplaintModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setComplaintModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={handleComplaintSubmit}>
            提交
          </Button>
        ]}
        width={600}
        className="wish-modal"
      >
        <div className="space-y-6 py-4">
          <div>
            <div className="text-sm text-gray-700 mb-2">功能模块</div>
            <Select
              mode="multiple"
              placeholder="请选择功能模块（可多选）"
              options={moduleOptions}
              value={complaintModules}
              onChange={setComplaintModules}
              className="w-full"
              maxTagCount={3}
            />
          </div>
          
          <div>
            <div className="text-sm text-gray-700 mb-2">请尽情吐槽</div>
            <TextArea
              placeholder="请详细描述您的意见和建议..."
              value={complaintDescription}
              onChange={(e) => setComplaintDescription(e.target.value)}
              rows={4}
              className="w-full"
            />
          </div>

          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">租户ID</span>
              <span className="text-sm text-gray-800 font-medium">9695</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">账号</span>
              <span className="text-sm text-gray-800 font-medium">sample@sample.com</span>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        title={
          <div className="flex items-center gap-2 text-lg">
            <CustomerServiceOutlined className="text-blue-400 text-xl" />
            <span>联系客服</span>
          </div>
        }
        open={contactModalVisible}
        onCancel={() => setContactModalVisible(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setContactModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={500}
        className="wish-modal"
      >
        <div className="space-y-6 py-4">
          <div className="text-center text-gray-800 mb-6">
            您可以通过以下方式和我们直接联系：
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-3">
              <PhoneOutlined className="text-blue-500 text-xl" />
              <div>
                <div className="text-sm text-gray-600">客服电话</div>
                <div className="text-base font-medium text-gray-800">400-665-9211</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <MailOutlined className="text-blue-500 text-xl" />
              <div>
                <div className="text-sm text-gray-600">邮箱</div>
                <div className="text-base font-medium text-gray-800">leoyang@walltechsystem.com</div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </Modal>
  );
};

export default DialogChat; 