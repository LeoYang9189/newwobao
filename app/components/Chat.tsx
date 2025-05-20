import React from 'react';
import { Button, Input, Card, Upload, Modal, Spin, message, Select } from 'antd';
import { SendOutlined, RightOutlined, ShoppingOutlined, DollarOutlined, GlobalOutlined, QuestionCircleOutlined, FileSearchOutlined, PaperClipOutlined, LoadingOutlined, DeleteOutlined, StarOutlined, CustomerServiceOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import Image from 'next/image';
import type { UploadFile } from 'antd/es/upload/interface';
import ReactMarkdown from 'react-markdown';
import { useRouter } from 'next/navigation';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  isThinking?: boolean;
  files?: UploadFile[];
  onButtonClick?: {
    [key: string]: () => void;
  };
}

interface TopicCard {
  title: string;
  items: { title: string; time?: string }[];
  gradient: string;
  isQuickQuestion?: boolean;
}

const quickQuestions = [
  '给我查一下我创建的ETD在这周的海运出口订单有哪些',
  '给我查一下 Shanghai 到 Bangkok 的整箱运价',
  '给我查一下SHSE123456的跟踪状态'
];

// 获取3个随机问题
const getRandomQuestions = () => {
  return quickQuestions;
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
    items: getRandomQuestions().map(q => ({ title: q })),
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

interface Props {
  onReset: () => void;
  initialMessages?: Message[];
  onButtonClick?: (buttonText: string, message: Message) => void;
}

const { TextArea } = Input;

const moduleOptions = [
  { label: '订单操作', value: 'order_operation' },
  { label: '智能运价', value: 'smart_rate' },
  { label: '订单跟踪', value: 'order_tracking' },
  { label: 'Cargoware FAQ', value: 'cargoware_faq' },
  { label: '文件识别', value: 'file_recognition' },
  { label: '其他', value: 'others' }
];

const ChatComponent: React.FC<Props> = ({ onReset, initialMessages, onButtonClick }) => {
  const router = useRouter();
  const [messages, setMessages] = React.useState<Message[]>(initialMessages || [
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
  const [wishModalVisible, setWishModalVisible] = React.useState(false);
  const [selectedModules, setSelectedModules] = React.useState<string[]>([]);
  const [wishDescription, setWishDescription] = React.useState('');
  const [complaintModalVisible, setComplaintModalVisible] = React.useState(false);
  const [complaintModules, setComplaintModules] = React.useState<string[]>([]);
  const [complaintDescription, setComplaintDescription] = React.useState('');
  const [contactModalVisible, setContactModalVisible] = React.useState(false);

  // 监听初始消息的变化
  React.useEffect(() => {
    if (initialMessages) {
      setMessages(initialMessages);
    }
  }, [initialMessages]);

  // 添加模拟消息事件监听
  React.useEffect(() => {
    const handleSimulateChat = (event: Event) => {
      const customEvent = event as CustomEvent;
      const mockMessages = customEvent.detail;
      console.log('Received mock messages:', mockMessages); // 添加调试日志
      
      let delay = 0;
      mockMessages.forEach((msg: { role: string; content: string }) => {
        setTimeout(() => {
          setMessages(prev => {
            console.log('Setting message:', msg); // 添加调试日志
            return [...prev, {
              id: Date.now().toString(),
              content: msg.content,
              role: msg.role as 'user' | 'assistant'
            }];
          });
        }, delay);
        
        delay += msg.role === 'user' ? 500 : 1500;
      });
    };

    window.addEventListener('simulate-chat', handleSimulateChat);
    
    return () => {
      window.removeEventListener('simulate-chat', handleSimulateChat);
    };
  }, []);

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
    console.log('Resetting chat...'); // 添加调试日志
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
    console.log('Setting reset function...'); // 添加调试日志
    if (typeof onReset === 'function') {
      onReset();
    }
  }, [onReset, resetChat]);

  // 处理快捷问题点击
  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
    handleSend();
  };

  const handleWishButtonClick = () => {
    setWishModalVisible(true);
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
    
    message.success('感谢您的反馈，我们会认真考虑您的建议！');
    setWishModalVisible(false);
    setSelectedModules([]);
    setWishDescription('');
  };

  const handleComplaintButtonClick = () => {
    setComplaintModalVisible(true);
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

  const handleContactButtonClick = () => {
    setContactModalVisible(true);
  };

  const handleTopicClick = (title: string) => {
    window.open(`/docs?topic=${encodeURIComponent(title)}`, '_blank');
  };

  const handleMessageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'A' && target.textContent) {
      const buttonText = target.textContent.replace(/[【】\[\]]/g, '');
      const messageId = target.closest('[data-message-id]')?.getAttribute('data-message-id');
      const message = messages.find(m => m.id === messageId);
      
      if (message && onButtonClick) {
        e.preventDefault();
        onButtonClick(buttonText, message);
      }
    }
  };

  return (
    <>
      <div className="flex flex-col h-[calc(100vh-32px)] max-w-6xl mx-auto bg-white rounded-xl shadow-sm">
        <div className="flex-1 overflow-auto p-6" onClick={handleMessageClick}>
          {messages.map((message) => (
            <div
              key={message.id}
              data-message-id={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-6`}
            >
              <div className={`flex ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-4 max-w-[90%]`}>
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
                      <div className="text-[15px] leading-relaxed whitespace-pre-wrap markdown-content">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
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
            <div className="flex justify-center w-full">
              <div className="w-[95%]">
                <div className="grid grid-cols-3 gap-8 mt-8">
                  {topicCards.map((card, index) => (
                    <div 
                      key={index} 
                      className={`rounded-xl p-6 backdrop-blur-sm bg-opacity-90 bg-gradient-to-br ${card.gradient} hover:shadow-lg transition-all duration-300 relative min-h-[240px] group overflow-hidden`}
                      style={{
                        backgroundImage: `
                          linear-gradient(to bottom right, var(--tw-gradient-stops)),
                          radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.15) 1px, transparent 0)
                        `,
                        backgroundSize: '100% 100%, 10px 10px'
                      }}
                    >
                      <div className="absolute inset-0 bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent" />
                      <div className="absolute inset-0 bg-white/5" />
                      <h3 className="text-lg font-medium mb-5 text-gray-800 relative z-10">{card.title}</h3>
                      {card.title === "AI沃宝使用反馈" ? (
                        <div className="space-y-3 relative z-10">
                          {card.items.map((item, itemIndex) => (
                            <div 
                              key={itemIndex}
                              className="bg-white bg-opacity-70 backdrop-blur-sm rounded-lg p-3 cursor-pointer hover:bg-opacity-90 hover:shadow-md hover:scale-105 transition-all duration-300"
                              onClick={
                                item.title === "✨ 许愿新功能" 
                                  ? handleWishButtonClick 
                                  : item.title === "🎯 吐槽产品经理"
                                  ? handleComplaintButtonClick
                                  : item.title === "💬 联系客服了解更多"
                                  ? handleContactButtonClick
                                  : undefined
                              }
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700 hover:text-gray-900 whitespace-nowrap">{item.title}</span>
                                <RightOutlined className="text-xs text-gray-400 group-hover:text-gray-600 transform group-hover:translate-x-1 transition-all flex-shrink-0" />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : card.isQuickQuestion ? (
                        <div className="space-y-3">
                          {card.items.map((item, itemIndex) => (
                            <div 
                              key={itemIndex}
                              className="bg-white bg-opacity-60 backdrop-blur-sm rounded-lg p-3.5 cursor-pointer hover:bg-opacity-90 hover:shadow-sm transition-all duration-300 group"
                              onClick={() => handleQuickQuestion(item.title)}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors flex-1 mr-3">{item.title}</span>
                                <SendOutlined className="text-xs text-gray-400 group-hover:text-gray-600 transform group-hover:translate-x-1 transition-all flex-shrink-0" />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {card.items.map((item, itemIndex) => (
                            <div 
                              key={itemIndex}
                              className="bg-white bg-opacity-60 backdrop-blur-sm rounded-lg p-3.5 cursor-pointer hover:bg-opacity-90 hover:shadow-sm transition-all duration-300 group"
                              onClick={() => handleTopicClick(item.title)}
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
              </div>
            </div>
          )}
        </div>
        <div className="border-t">
          <div className="max-w-6xl mx-auto">
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
            <div className="px-6 pb-4">
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
              <div className="flex items-center gap-3">
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
                  className="min-w-[100px]"
                >
                  {isGenerating ? '停止生成' : '发送'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

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
    </>
  );
};

export default ChatComponent; 