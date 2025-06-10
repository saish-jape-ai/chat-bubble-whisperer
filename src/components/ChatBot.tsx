import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User, Settings, Palette, Mail, Linkedin, Phone, Globe } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
  buttons?: boolean;
  buttonType?: string[];
  buttonData?: string[];
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm here to help you. Ask me anything about this website or any topic you'd like to know about.",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState('greenish'); // Default to greenish theme
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const themes = {
    greenish: {
      primary: 'from-emerald-500 via-teal-500 to-green-600',
      secondary: 'from-emerald-50 to-teal-50',
      button: 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700',
      userBubble: 'bg-gradient-to-br from-emerald-500 to-teal-600 border-emerald-200',
      accent: 'text-emerald-600',
      dots: ['bg-emerald-400', 'bg-teal-400', 'bg-green-400'],
      focusRing: 'focus:ring-emerald-500 focus:border-emerald-500',
      themeButton: 'bg-gradient-to-r from-emerald-500 to-teal-600'
    },
    ocean: {
      primary: 'from-blue-500 via-cyan-500 to-teal-600',
      secondary: 'from-blue-50 to-cyan-50',
      button: 'bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700',
      userBubble: 'bg-gradient-to-br from-blue-500 to-cyan-600 border-blue-200',
      accent: 'text-blue-600',
      dots: ['bg-blue-400', 'bg-cyan-400', 'bg-teal-400'],
      focusRing: 'focus:ring-blue-500 focus:border-blue-500',
      themeButton: 'bg-gradient-to-r from-blue-500 to-cyan-600'
    },
    sunset: {
      primary: 'from-orange-500 via-pink-500 to-purple-600',
      secondary: 'from-orange-50 to-pink-50',
      button: 'bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700',
      userBubble: 'bg-gradient-to-br from-orange-500 to-pink-600 border-orange-200',
      accent: 'text-orange-600',
      dots: ['bg-orange-400', 'bg-pink-400', 'bg-purple-400'],
      focusRing: 'focus:ring-orange-500 focus:border-orange-500',
      themeButton: 'bg-gradient-to-r from-orange-500 to-pink-600'
    },
    royal: {
      primary: 'from-purple-500 via-indigo-500 to-blue-600',
      secondary: 'from-purple-50 to-indigo-50',
      button: 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700',
      userBubble: 'bg-gradient-to-br from-purple-500 to-indigo-600 border-purple-200',
      accent: 'text-purple-600',
      dots: ['bg-purple-400', 'bg-indigo-400', 'bg-blue-400'],
      focusRing: 'focus:ring-purple-500 focus:border-purple-500',
      themeButton: 'bg-gradient-to-r from-purple-500 to-indigo-600'
    },
    crimson: {
      primary: 'from-red-500 via-rose-500 to-pink-600',
      secondary: 'from-red-50 to-rose-50',
      button: 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700',
      userBubble: 'bg-gradient-to-br from-red-500 to-rose-600 border-red-200',
      accent: 'text-red-600',
      dots: ['bg-red-400', 'bg-rose-400', 'bg-pink-400'],
      focusRing: 'focus:ring-red-500 focus:border-red-500',
      themeButton: 'bg-gradient-to-r from-red-500 to-rose-600'
    },
    forest: {
      primary: 'from-green-600 via-emerald-600 to-teal-700',
      secondary: 'from-green-50 to-emerald-50',
      button: 'bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800',
      userBubble: 'bg-gradient-to-br from-green-600 to-emerald-700 border-green-200',
      accent: 'text-green-700',
      dots: ['bg-green-500', 'bg-emerald-500', 'bg-teal-500'],
      focusRing: 'focus:ring-green-600 focus:border-green-600',
      themeButton: 'bg-gradient-to-r from-green-600 to-emerald-700'
    },
    slate: {
      primary: 'from-slate-500 via-gray-500 to-zinc-600',
      secondary: 'from-slate-50 to-gray-50',
      button: 'bg-gradient-to-r from-slate-500 to-gray-600 hover:from-slate-600 hover:to-gray-700',
      userBubble: 'bg-gradient-to-br from-slate-500 to-gray-600 border-slate-200',
      accent: 'text-slate-600',
      dots: ['bg-slate-400', 'bg-gray-400', 'bg-zinc-400'],
      focusRing: 'focus:ring-slate-500 focus:border-slate-500',
      themeButton: 'bg-gradient-to-r from-slate-500 to-gray-600'
    },
    amber: {
      primary: 'from-amber-500 via-yellow-500 to-orange-600',
      secondary: 'from-amber-50 to-yellow-50',
      button: 'bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700',
      userBubble: 'bg-gradient-to-br from-amber-500 to-yellow-600 border-amber-200',
      accent: 'text-amber-600',
      dots: ['bg-amber-400', 'bg-yellow-400', 'bg-orange-400'],
      focusRing: 'focus:ring-amber-500 focus:border-amber-500',
      themeButton: 'bg-gradient-to-r from-amber-500 to-yellow-600'
    },
    midnight: {
      primary: 'from-gray-800 via-slate-800 to-zinc-900',
      secondary: 'from-gray-50 to-slate-50',
      button: 'bg-gradient-to-r from-gray-800 to-slate-900 hover:from-gray-900 hover:to-slate-900',
      userBubble: 'bg-gradient-to-br from-gray-800 to-slate-900 border-gray-200',
      accent: 'text-gray-700',
      dots: ['bg-gray-600', 'bg-slate-600', 'bg-zinc-600'],
      focusRing: 'focus:ring-gray-800 focus:border-gray-800',
      themeButton: 'bg-gradient-to-r from-gray-800 to-slate-900'
    },
    lavender: {
      primary: 'from-violet-400 via-purple-400 to-indigo-500',
      secondary: 'from-violet-50 to-purple-50',
      button: 'bg-gradient-to-r from-violet-400 to-purple-500 hover:from-violet-500 hover:to-purple-600',
      userBubble: 'bg-gradient-to-br from-violet-400 to-purple-500 border-violet-200',
      accent: 'text-violet-600',
      dots: ['bg-violet-400', 'bg-purple-400', 'bg-indigo-400'],
      focusRing: 'focus:ring-violet-400 focus:border-violet-400',
      themeButton: 'bg-gradient-to-r from-violet-400 to-purple-500'
    },
    mint: {
      primary: 'from-green-300 via-emerald-400 to-teal-500',
      secondary: 'from-green-50 to-emerald-50',
      button: 'bg-gradient-to-r from-green-300 to-emerald-500 hover:from-green-400 hover:to-emerald-600',
      userBubble: 'bg-gradient-to-br from-green-300 to-emerald-500 border-green-200',
      accent: 'text-green-600',
      dots: ['bg-green-300', 'bg-emerald-300', 'bg-teal-300'],
      focusRing: 'focus:ring-green-300 focus:border-green-300',
      themeButton: 'bg-gradient-to-r from-green-300 to-emerald-500'
    },
    coral: {
      primary: 'from-pink-400 via-rose-400 to-red-500',
      secondary: 'from-pink-50 to-rose-50',
      button: 'bg-gradient-to-r from-pink-400 to-rose-500 hover:from-pink-500 hover:to-rose-600',
      userBubble: 'bg-gradient-to-br from-pink-400 to-rose-500 border-pink-200',
      accent: 'text-pink-600',
      dots: ['bg-pink-400', 'bg-rose-400', 'bg-red-400'],
      focusRing: 'focus:ring-pink-400 focus:border-pink-400',
      themeButton: 'bg-gradient-to-r from-pink-400 to-rose-500'
    },
    neon: {
      primary: 'from-lime-400 via-green-400 to-emerald-500',
      secondary: 'from-lime-50 to-green-50',
      button: 'bg-gradient-to-r from-lime-400 to-green-500 hover:from-lime-500 hover:to-green-600',
      userBubble: 'bg-gradient-to-br from-lime-400 to-green-500 border-lime-200',
      accent: 'text-lime-600',
      dots: ['bg-lime-400', 'bg-green-400', 'bg-emerald-400'],
      focusRing: 'focus:ring-lime-400 focus:border-lime-400',
      themeButton: 'bg-gradient-to-r from-lime-400 to-green-500'
    },
    tropical: {
      primary: 'from-cyan-400 via-turquoise-400 to-blue-500',
      secondary: 'from-cyan-50 to-blue-50',
      button: 'bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600',
      userBubble: 'bg-gradient-to-br from-cyan-400 to-blue-500 border-cyan-200',
      accent: 'text-cyan-600',
      dots: ['bg-cyan-400', 'bg-blue-400', 'bg-teal-400'],
      focusRing: 'focus:ring-cyan-400 focus:border-cyan-400',
      themeButton: 'bg-gradient-to-r from-cyan-400 to-blue-500'
    },
    galaxy: {
      primary: 'from-indigo-600 via-purple-600 to-pink-600',
      secondary: 'from-indigo-50 to-purple-50',
      button: 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700',
      userBubble: 'bg-gradient-to-br from-indigo-600 to-purple-600 border-indigo-200',
      accent: 'text-indigo-600',
      dots: ['bg-indigo-500', 'bg-purple-500', 'bg-pink-500'],
      focusRing: 'focus:ring-indigo-600 focus:border-indigo-600',
      themeButton: 'bg-gradient-to-r from-indigo-600 to-purple-600'
    },
    aurora: {
      primary: 'from-teal-400 via-blue-500 to-purple-600',
      secondary: 'from-teal-50 to-blue-50',
      button: 'bg-gradient-to-r from-teal-400 to-purple-600 hover:from-teal-500 hover:to-purple-700',
      userBubble: 'bg-gradient-to-br from-teal-400 to-purple-600 border-teal-200',
      accent: 'text-teal-600',
      dots: ['bg-teal-400', 'bg-blue-400', 'bg-purple-400'],
      focusRing: 'focus:ring-teal-400 focus:border-teal-400',
      themeButton: 'bg-gradient-to-r from-teal-400 to-purple-600'
    }
  };

  const currentTheme = themes[theme as keyof typeof themes];

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatTextWithBold = (text: string) => {
    const parts = text.split('**');
    return parts.map((part, partIndex) => {
      if (partIndex % 2 === 1) {
        return <strong key={partIndex} className="font-bold">{part}</strong>;
      }
      return part;
    });
  };

  const formatMessage = (text: string) => {
    const paragraphs = text.split('\n\n');
    
    return paragraphs.map((paragraph, pIndex) => {
      const lines = paragraph.split('\n');
      
      return (
        <div key={pIndex} className={pIndex > 0 ? 'mt-3' : ''}>
          {lines.map((line, lIndex) => {
            if (!line.trim()) return null;

            const isBulletPoint = line.trim().startsWith('- ') || line.trim().startsWith('* ');
            
            if (isBulletPoint) {
              const bulletText = line.trim().substring(2);
              return (
                <div key={lIndex} className="flex items-start space-x-2 ml-4">
                  <span className={`${currentTheme.accent} font-bold mt-0.5`}>•</span>
                  <span>{formatTextWithBold(bulletText)}</span>
                </div>
              );
            }

            const numberedMatch = line.trim().match(/^(\d+)\.\s*(.+)/);
            if (numberedMatch) {
              const [, number, content] = numberedMatch;
              return (
                <div key={lIndex} className="flex items-start space-x-2 ml-4">
                  <span className={`${currentTheme.accent} font-semibold min-w-[20px] mt-0.5`}>{number}.</span>
                  <span>{formatTextWithBold(content)}</span>
                </div>
              );
            }

            return (
              <div key={lIndex} className={lIndex > 0 ? 'mt-1' : ''}>
                {formatTextWithBold(line)}
              </div>
            );
          })}
        </div>
      );
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getButtonIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'linkedin':
        return <Linkedin className="w-4 h-4" />;
      case 'phone':
        return <Phone className="w-4 h-4" />;
      case 'website':
      case 'url':
        return <Globe className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  const handleButtonClick = (type: string, data: string) => {
    switch (type.toLowerCase()) {
      case 'email':
        window.open(`mailto:${data}`, '_blank');
        break;
      case 'linkedin':
        window.open(data, '_blank');
        break;
      case 'phone':
        window.open(`tel:${data}`, '_blank');
        break;
      case 'website':
      case 'url':
        window.open(data, '_blank');
        break;
      default:
        window.open(data, '_blank');
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/ask-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          question: inputValue,
          collection_name: 'baapcompany'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      let botResponse = data.answer;
      let buttons = false;
      let buttonType = null;
      let buttonData = null;

      // Clean up the response to extract JSON if present
      const cleanResponse = botResponse.replace(/✅ Example Output:\s*/g, '')
                                     .replace(/OR \(.*?\):\s*/g, '')
                                     .trim();

      // Try to find and parse JSON in the response
      const jsonMatches = cleanResponse.match(/\{[\s\S]*?\}/g);
      
      if (jsonMatches && jsonMatches.length > 0) {
        try {
          // Use the first valid JSON found
          for (const jsonMatch of jsonMatches) {
            try {
              const parsedData = JSON.parse(jsonMatch);
              if (parsedData.response) {
                botResponse = parsedData.response;
                buttons = parsedData.buttons || false;
                buttonType = parsedData.button_type || null;
                buttonData = parsedData.button_data || null;
                break;
              }
            } catch (e) {
              continue;
            }
          }
        } catch (parseError) {
          console.log('Could not parse JSON from response');
        }
      }

      const botMessage: Message = {
        id: messages.length + 2,
        text: botResponse,
        isUser: false,
        timestamp: new Date(),
        buttons,
        buttonType,
        buttonData
      };

      setMessages(prev => [...prev, botMessage]);

      if (data.debug_info?.message) {
        console.log('Chatbot Debug Info:', data.debug_info.message);
      }

      if (data.context_used === false) {
        const warningMessage: Message = {
          id: messages.length + 3,
          text: "⚠️ This answer may not use site-specific knowledge.",
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, warningMessage]);
      }

    } catch (error) {
      console.error('Chatbot API Error:', error);
      const errorMessage: Message = {
        id: messages.length + 2,
        text: "Sorry, I encountered an error while processing your request. Please try again later.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br ${currentTheme.primary} rounded-full shadow-2xl hover:shadow-emerald-500/25 transform hover:scale-110 transition-all duration-300 flex items-center justify-center z-50 ${isOpen ? 'hidden' : 'block'} ring-2 ring-white/20`}
      >
        <MessageCircle className="w-7 h-7 text-white" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[420px] h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 flex flex-col overflow-hidden">
          {/* Enhanced Header */}
          <div className={`bg-gradient-to-r ${currentTheme.primary} text-white p-5 flex justify-between items-center`}>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">AI Assistant 🤖</h3>
                <p className="text-xs text-white/80">Always here to help</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="hover:bg-white/20 rounded-full p-2 transition-colors"
              >
                <Palette className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 rounded-full p-2 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Theme Selector */}
          {showSettings && (
            <div className="p-4 border-b border-gray-100 bg-gray-50 max-h-32 overflow-y-auto">
              <p className="text-sm font-medium text-gray-700 mb-2">Choose Theme:</p>
              <div className="grid grid-cols-3 gap-2">
                {Object.keys(themes).map((themeName) => {
                  const themeData = themes[themeName as keyof typeof themes];
                  return (
                    <button
                      key={themeName}
                      onClick={() => setTheme(themeName)}
                      className={`px-2 py-1 rounded-full text-xs font-medium capitalize transition-colors text-white ${
                        theme === themeName 
                          ? `${themeData.themeButton} ring-2 ring-gray-400` 
                          : `${themeData.themeButton} opacity-70 hover:opacity-100`
                      }`}
                    >
                      {themeName}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className={`flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b ${currentTheme.secondary}`}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex flex-col space-y-1 ${message.isUser ? 'items-end' : 'items-start'}`}
              >
                <div className={`flex items-start space-x-3 ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.isUser 
                      ? currentTheme.userBubble.replace('bg-gradient-to-br', 'bg-gradient-to-br')
                      : `bg-gradient-to-br ${currentTheme.primary}`
                  }`}>
                    {message.isUser ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>

                  <div className={`flex flex-col max-w-[85%] ${message.isUser ? 'items-end' : 'items-start'}`}>
                    {/* Sender Label */}
                    <span className={`text-xs font-medium ${currentTheme.accent} mb-1`}>
                      {message.isUser ? 'You' : 'AI'}
                    </span>

                    {/* Message Bubble */}
                    <div
                      className={`px-4 py-3 rounded-2xl shadow-sm border ${
                        message.isUser
                          ? `${currentTheme.userBubble} text-white`
                          : 'bg-white text-gray-800 border-gray-200 shadow-md'
                      }`}
                    >
                      <div className="text-sm leading-relaxed font-medium">
                        {message.isUser ? message.text : formatMessage(message.text)}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {!message.isUser && message.buttons && message.buttonType && message.buttonData && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {message.buttonType.map((type, index) => (
                          <button
                            key={index}
                            onClick={() => handleButtonClick(type, message.buttonData![index])}
                            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentTheme.button} text-white hover:scale-105 transform`}
                          >
                            {getButtonIcon(type)}
                            <span className="capitalize">{type}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Time below message */}
                <div className={`text-xs text-gray-400 ${message.isUser ? 'mr-11' : 'ml-11'}`}>
                  {formatTime(message.timestamp)}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex flex-col space-y-1 items-start">
                <div className="flex items-start space-x-3">
                  <div className={`w-8 h-8 bg-gradient-to-br ${currentTheme.primary} rounded-full flex items-center justify-center`}>
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-xs font-medium ${currentTheme.accent} mb-1`}>AI</span>
                    <div className="bg-white border border-gray-200 shadow-md px-4 py-3 rounded-2xl">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className={`w-2 h-2 ${currentTheme.dots[0]} rounded-full animate-bounce`}></div>
                          <div className={`w-2 h-2 ${currentTheme.dots[1]} rounded-full animate-bounce`} style={{ animationDelay: '0.1s' }}></div>
                          <div className={`w-2 h-2 ${currentTheme.dots[2]} rounded-full animate-bounce`} style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-sm text-gray-500 font-medium">AI is typing...</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-400 ml-11">
                  {formatTime(new Date())}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Enhanced Input */}
          <div className="p-5 border-t border-gray-100 bg-white">
            <div className="flex space-x-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your question..."
                className={`flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 ${currentTheme.focusRing} text-sm font-medium placeholder-gray-400 shadow-sm`}
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !inputValue.trim()}
                className={`${currentTheme.button} text-white p-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:scale-105`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
