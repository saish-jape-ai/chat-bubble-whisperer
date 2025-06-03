import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User } from 'lucide-react';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    // Split by double line breaks for paragraphs
    const paragraphs = text.split('\n\n');
    
    return paragraphs.map((paragraph, pIndex) => {
      // Handle single line breaks within paragraphs
      const lines = paragraph.split('\n');
      
      return (
        <div key={pIndex} className={pIndex > 0 ? 'mt-3' : ''}>
          {lines.map((line, lIndex) => {
            // Skip empty lines
            if (!line.trim()) return null;

            // Handle bullet points (lines starting with - or *)
            const isBulletPoint = line.trim().startsWith('- ') || line.trim().startsWith('* ');
            
            if (isBulletPoint) {
              const bulletText = line.trim().substring(2); // Remove the "- " or "* "
              return (
                <div key={lIndex} className="flex items-start space-x-2 ml-4">
                  <span className="text-orange-400 font-bold mt-0.5">•</span>
                  <span>{formatTextWithBold(bulletText)}</span>
                </div>
              );
            }

            // Handle numbered lists (lines starting with numbers)
            const numberedMatch = line.trim().match(/^(\d+)\.\s*(.+)/);
            if (numberedMatch) {
              const [, number, content] = numberedMatch;
              return (
                <div key={lIndex} className="flex items-start space-x-2 ml-4">
                  <span className="text-pink-500 font-semibold min-w-[20px] mt-0.5">{number}.</span>
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

      // Log debug info if available
      if (data.debug_info?.message) {
        console.log('Chatbot Debug Info:', data.debug_info.message);
      }

      // Show context warning if needed
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
        className={`fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 rounded-full shadow-2xl hover:shadow-orange-500/25 transform hover:scale-110 transition-all duration-300 flex items-center justify-center z-50 ${isOpen ? 'hidden' : 'block'} ring-2 ring-orange-300/30`}
      >
        <MessageCircle className="w-7 h-7 text-white" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[420px] h-[580px] bg-gradient-to-b from-orange-50 to-purple-50 rounded-2xl shadow-2xl border border-orange-200 z-50 flex flex-col overflow-hidden backdrop-blur-sm">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white p-5 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-lg">Ask AI 🤖</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-orange-50 via-white to-purple-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.isUser 
                    ? 'bg-gradient-to-br from-pink-500 to-purple-600' 
                    : 'bg-gradient-to-br from-orange-500 to-pink-500'
                }`}>
                  {message.isUser ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>

                <div className={`flex flex-col max-w-[85%] ${message.isUser ? 'items-end' : 'items-start'}`}>
                  {/* Sender Label */}
                  <span className={`text-xs font-medium mb-1 ${
                    message.isUser ? 'text-pink-600' : 'text-orange-600'
                  }`}>
                    {message.isUser ? 'You' : 'AI'}
                  </span>

                  {/* Message Bubble */}
                  <div
                    className={`px-4 py-3 rounded-2xl shadow-sm border ${
                      message.isUser
                        ? 'bg-gradient-to-br from-pink-500 to-purple-600 text-white border-pink-200'
                        : 'bg-white text-gray-800 border-orange-200 shadow-md'
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
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-orange-600 mb-1">AI</span>
                  <div className="bg-white border border-orange-200 shadow-md px-4 py-3 rounded-2xl">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-sm text-gray-500 font-medium">AI is typing...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-5 border-t border-orange-200 bg-white/80 backdrop-blur-sm">
            <div className="flex space-x-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your question..."
                className="flex-1 px-4 py-3 border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm font-medium placeholder-gray-400 shadow-sm bg-white"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !inputValue.trim()}
                className="bg-gradient-to-r from-orange-500 to-pink-600 text-white p-3 rounded-xl hover:from-orange-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
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
