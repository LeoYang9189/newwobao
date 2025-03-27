import React from 'react';
import { Button, Input, Card, Upload, Modal, Spin, message } from 'antd';
import { SendOutlined, RightOutlined, ShoppingOutlined, DollarOutlined, GlobalOutlined, QuestionCircleOutlined, FileSearchOutlined, PaperClipOutlined, LoadingOutlined, DeleteOutlined } from '@ant-design/icons';
import Image from 'next/image';
import type { UploadFile } from 'antd/es/upload/interface';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  isThinking?: boolean;
  files?: UploadFile[];
}

interface TopicCard {
  title: string;
  items: { title: string; time?: string }[];
  gradient: string;
}

const topicCards: TopicCard[] = [
  {
    title: "热门话题",
    items: [
      { title: "AI沃宝全新升级了什么？" },
      { title: "如何开启AI沃宝对话" },
      { title: "AI沃宝有什么更新计划" },
    ],
    gradient: "from-[#FFE4E1] to-[#E6E6FA]"
  },
  {
    title: "AI沃宝使用反馈",
    items: [
      { title: "✨ 许愿新功能" },
      { title: "🎯 吐槽产品经理" },
    ],
    gradient: "from-[#E0FFFF] to-[#98FB98]"
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

interface Props {
  onReset: (resetFn: () => void) => void;
}

const ChatComponent: React.FC<Props> = ({ onReset }) => {
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
    
    // 如果是第一条消息，清除欢迎语
    const currentMessages = messages.length === 1 ? [] : messages;
    
    setMessages([...currentMessages, newMessage, thinkingMessage]);
    setInputValue('');
    setFileList([]);
    setIsGenerating(true);
    
    // 模拟 AI 回复
    const timeoutId = setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: '这是一个模拟的 AI 回复消息。',
        role: 'assistant',
      };
      setMessages(prev => prev.filter(msg => !msg.isThinking).concat(aiResponse));
      setIsGenerating(false);
    }, 1000);

    return () => clearTimeout(timeoutId);
  };

  const handleStopGeneration = () => {
    setMessages(prev => prev.filter(msg => !msg.isThinking));
    setIsGenerating(false);
  };

  const handleUpload = (file: File) => {
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error('文件必须小于10MB！');
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  const handleRemove = (file: UploadFile) => {
    const newFileList = fileList.filter(item => item.uid !== file.uid);
    setFileList(newFileList);
  };

  const customRequest = ({ file, onSuccess }: any) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  const handleChange = (info: any) => {
    const { file, fileList: newFileList } = info;
    setFileList(newFileList);
  };

  const handleSkillClick = (button: typeof navButtons[0]) => {
    setActiveSkill(button);
  };

  const handleClearSkill = () => {
    setActiveSkill(null);
  };

  const showTopicCards = messages.length === 1;

  // 添加重置函数
  const resetChat = React.useCallback(() => {
    setMessages([
      {
        id: '1',
        content: '👋 你好，我是 AI 沃宝\n\n基于Cargoware 云物流平台设计的智能助手方案，我可以帮你操作订单、查询运价、跟踪订单等，快和我对话试试吧！',
        role: 'assistant'
      }
    ]);
    setInputValue('');
    setFileList([]);
    setIsGenerating(false);
    setActiveSkill(null);
  }, []);

  // 在组件挂载时，将重置函数传递给父组件
  React.useEffect(() => {
    if (onReset) {
      onReset(resetChat);
    }
  }, [onReset, resetChat]);

  return (
    <div className="flex flex-col h-[calc(100vh-32px)] max-w-4xl mx-auto bg-white rounded-xl shadow-sm">
      <div className="flex-1 overflow-auto p-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-6`}
          >
            <div className={`flex ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-4 max-w-[85%]`}>
              {message.role === 'assistant' && (
                <div className="w-10 h-10 relative flex-shrink-0">
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

        {showTopicCards && (
          <div className="grid grid-cols-2 gap-6 mt-8 px-4">
            {topicCards.map((card, index) => (
              <div 
                key={index} 
                className={`rounded-xl p-6 backdrop-blur-sm bg-opacity-90 bg-gradient-to-br ${card.gradient} hover:shadow-lg transition-all duration-300 relative`}
                style={{
                  backgroundImage: `
                    linear-gradient(to bottom right, var(--tw-gradient-from), var(--tw-gradient-to)),
                    radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.15) 1px, transparent 0)
                  `,
                  backgroundSize: '100% 100%, 10px 10px'
                }}
              >
                <h3 className="text-lg font-medium mb-4 text-gray-800 relative z-10">{card.title}</h3>
                {card.title === "AI沃宝使用反馈" ? (
                  <div className="grid grid-cols-2 gap-3 relative z-10">
                    {card.items.map((item, itemIndex) => (
                      <div 
                        key={itemIndex}
                        className="bg-white bg-opacity-70 backdrop-blur-sm rounded-lg p-4 cursor-pointer hover:bg-opacity-90 hover:shadow-md hover:scale-105 transition-all duration-300 text-center"
                      >
                        <span className="text-sm font-medium text-gray-700 hover:text-gray-900">{item.title}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {card.items.map((item, itemIndex) => (
                      <div 
                        key={itemIndex}
                        className="bg-white bg-opacity-60 backdrop-blur-sm rounded-lg p-3 cursor-pointer hover:bg-opacity-90 hover:shadow-sm transition-all duration-300 group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">{item.title}</span>
                          <RightOutlined className="text-xs text-gray-400 group-hover:text-gray-600 transform group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="border-t">
        <div className="max-w-4xl mx-auto">
          <div className="px-4 py-3">
            <div className="flex items-center gap-6 overflow-x-auto">
              <span className="text-sm text-gray-500 flex-shrink-0">常用技能：</span>
              {navButtons.map((button, index) => (
                <button
                  key={index}
                  className="flex items-center gap-2 py-1.5 px-3 text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 whitespace-nowrap border border-gray-200 rounded-md hover:border-gray-300"
                  onClick={() => handleSkillClick(button)}
                >
                  {button.icon}
                  <span>{button.text}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="px-4">
            {fileList.length > 0 && (
              <div className="mb-3">
                <div className="flex flex-wrap gap-2">
                  {fileList.map(file => (
                    <div
                      key={file.uid}
                      className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-lg text-sm text-gray-600 group border border-gray-200"
                    >
                      <PaperClipOutlined className="text-gray-400" />
                      <span className="max-w-[160px] truncate">{file.name}</span>
                      <button
                        onClick={() => handleRemove(file)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity ml-1"
                      >
                        <DeleteOutlined className="text-gray-400 hover:text-red-500 transition-colors" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex items-center gap-3 py-2">
              <div className="flex-1 relative">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onPressEnter={handleSend}
                  placeholder="输入消息..."
                  size="large"
                  className={`${activeSkill ? 'pl-[120px]' : ''} [&_.ant-input]:z-0`}
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
                onClick={isGenerating ? handleStopGeneration : handleSend}
                size="large"
                className="min-w-[88px]"
              >
                {isGenerating ? '停止生成' : '发送'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent; 