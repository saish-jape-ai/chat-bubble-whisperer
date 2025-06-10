
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User, Clock, Linkedin, Mail, Phone, Globe, Settings, Palette } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
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
      dots: ['bg-emerald-400', 'bg-teal-400', 'bg-green-400']
    },
    ocean: {
      primary: 'from-blue-500 via-cyan-500 to-teal-600',
      secondary: 'from-blue-50 to-cyan-50',
      button: 'bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700',
      userBubble: 'bg-gradient-to-br from-blue-500 to-cyan-600 border-blue-200',
      accent: 'text-blue-600',
      dots: ['bg-blue-400', 'bg-cyan-400', 'bg-teal-400']
    },
    sunset: {
      primary: 'from-orange-500 via-pink-500 to-purple-600',
      secondary: 'from-orange-50 to-pink-50',
      button: 'bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700',
      userBubble: 'bg-gradient-to-br from-orange-500 to-pink-600 border-orange-200',
      accent: 'text-orange-600',
      dots: ['bg-orange-400', 'bg-pink-400', 'bg-purple-400']
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

      const botMessage: Message = {
        id: messages.length + 2,
        text: data.answer,
        isUser: false,
        timestamp: new Date()
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

  const socialLinks = [
    { icon: Linkedin, url: '#', label: 'LinkedIn' },
    { icon: Mail, url: 'mailto:contact@example.com', label: 'Email' },
    { icon: Phone, url: 'tel:+1234567890', label: 'Phone' },
    { icon: Globe, url: '#', label: 'Website' }
  ];

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
        <div className="fixed bottom-6 right-6 w-[450px] h-[650px] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 flex flex-col overflow-hidden">
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
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <p className="text-sm font-medium text-gray-700 mb-2">Choose Theme:</p>
              <div className="flex space-x-2">
                {Object.keys(themes).map((themeName) => (
                  <button
                    key={themeName}
                    onClick={() => setTheme(themeName)}
                    className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors ${
                      theme === themeName 
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' 
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    {themeName}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Social Links Bar */}
          <div className="flex justify-center space-x-4 p-3 bg-gray-50 border-b border-gray-100">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-8 h-8 ${currentTheme.button} rounded-full flex items-center justify-center transition-all transform hover:scale-110 shadow-md`}
                title={link.label}
              >
                <link.icon className="w-4 h-4 text-white" />
              </a>
            ))}
          </div>

          {/* Messages */}
          <div className={`flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b ${currentTheme.secondary}`}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
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
                  {/* Sender Label with Time */}
                  <div className={`flex items-center space-x-2 mb-1 ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <span className={`text-xs font-medium ${currentTheme.accent}`}>
                      {message.isUser ? 'You' : 'AI'}
                    </span>
                    <div className="flex items-center text-xs text-gray-400">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatTime(message.timestamp)}
                    </div>
                  </div>

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
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-start space-x-3">
                <div className={`w-8 h-8 bg-gradient-to-br ${currentTheme.primary} rounded-full flex items-center justify-center`}>
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`text-xs font-medium ${currentTheme.accent}`}>AI</span>
                    <div className="flex items-center text-xs text-gray-400">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatTime(new Date())}
                    </div>
                  </div>
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
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm font-medium placeholder-gray-400 shadow-sm"
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
            <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
              <span>Press Enter to send</span>
              <span>{inputValue.length}/500</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
