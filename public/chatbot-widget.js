
(function() {
    'use strict';
    
    // Prevent multiple instances
    if (window.ChatbotWidget) {
        return;
    }
    
    // CSS styles
    const styles = `
        .chatbot-widget * {
            box-sizing: border-box;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .chatbot-toggle {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 50%;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            transition: all 0.3s ease;
            animation: pulse 2s infinite;
        }
        
        .chatbot-toggle:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 25px rgba(102, 126, 234, 0.6);
        }
        
        .chatbot-toggle svg {
            width: 28px;
            height: 28px;
            fill: white;
        }
        
        @keyframes pulse {
            0% { box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4); }
            50% { box-shadow: 0 4px 20px rgba(102, 126, 234, 0.6); }
            100% { box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4); }
        }
        
        .chatbot-popup {
            position: fixed;
            bottom: 90px;
            right: 20px;
            width: 350px;
            height: 500px;
            background: white;
            border-radius: 16px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
            z-index: 9998;
            display: none;
            flex-direction: column;
            overflow: hidden;
            border: 1px solid rgba(0, 0, 0, 0.1);
        }
        
        .chatbot-popup.show {
            display: flex;
            animation: slideUp 0.3s ease-out;
        }
        
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(20px) scale(0.95);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
        
        .chatbot-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 16px 20px;
            font-weight: 600;
            font-size: 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .chatbot-close {
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            transition: background-color 0.2s;
        }
        
        .chatbot-close:hover {
            background-color: rgba(255, 255, 255, 0.2);
        }
        
        .chatbot-messages {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 12px;
            background: #fafafa;
        }
        
        .chatbot-messages::-webkit-scrollbar {
            width: 6px;
        }
        
        .chatbot-messages::-webkit-scrollbar-track {
            background: #f1f1f1;
        }
        
        .chatbot-messages::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 3px;
        }
        
        .message {
            max-width: 85%;
            padding: 12px 16px;
            border-radius: 18px;
            font-size: 14px;
            line-height: 1.4;
            word-wrap: break-word;
        }
        
        .message.user {
            align-self: flex-end;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-bottom-right-radius: 6px;
        }
        
        .message.bot {
            align-self: flex-start;
            background: white;
            color: #333;
            border: 1px solid #e0e0e0;
            border-bottom-left-radius: 6px;
        }
        
        .message-warning {
            font-size: 11px;
            color: #f59e0b;
            margin-top: 4px;
            display: flex;
            align-items: center;
            gap: 4px;
        }
        
        .chatbot-input-area {
            padding: 16px 20px;
            background: white;
            border-top: 1px solid #e0e0e0;
            display: flex;
            gap: 12px;
            align-items: center;
        }
        
        .chatbot-input {
            flex: 1;
            border: 1px solid #e0e0e0;
            border-radius: 20px;
            padding: 12px 16px;
            font-size: 14px;
            outline: none;
            transition: border-color 0.2s;
        }
        
        .chatbot-input:focus {
            border-color: #667eea;
        }
        
        .chatbot-send {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.2s;
        }
        
        .chatbot-send:hover {
            transform: scale(1.05);
        }
        
        .chatbot-send:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }
        
        .chatbot-send svg {
            width: 16px;
            height: 16px;
            fill: white;
        }
        
        .loading-spinner {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 2px solid #f3f3f3;
            border-top: 2px solid #667eea;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .typing-indicator {
            align-self: flex-start;
            padding: 12px 16px;
            border-radius: 18px;
            background: white;
            border: 1px solid #e0e0e0;
            border-bottom-left-radius: 6px;
            display: flex;
            align-items: center;
            gap: 8px;
            max-width: 85%;
        }
        
        .typing-dots {
            display: flex;
            gap: 4px;
        }
        
        .typing-dot {
            width: 6px;
            height: 6px;
            background: #999;
            border-radius: 50%;
            animation: typing 1.4s infinite;
        }
        
        .typing-dot:nth-child(2) {
            animation-delay: 0.2s;
        }
        
        .typing-dot:nth-child(3) {
            animation-delay: 0.4s;
        }
        
        @keyframes typing {
            0%, 60%, 100% {
                transform: translateY(0);
                opacity: 0.4;
            }
            30% {
                transform: translateY(-10px);
                opacity: 1;
            }
        }
        
        /* Mobile responsive */
        @media (max-width: 480px) {
            .chatbot-popup {
                width: calc(100vw - 40px);
                height: 70vh;
                bottom: 90px;
                right: 20px;
                left: 20px;
            }
            
            .chatbot-toggle {
                bottom: 16px;
                right: 16px;
            }
        }
    `;
    
    // Add styles to document
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
    
    // HTML template
    const createChatbotHTML = () => {
        return `
            <button class="chatbot-toggle" id="chatbot-toggle">
                <svg viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 2.98.97 4.29L1 23l6.71-1.97C9.02 21.64 10.46 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm-1 17h-2v-2h2v2zm2.07-7.75l-.9.92C11.45 12.9 11 13.5 11 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H6c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
                </svg>
            </button>
            
            <div class="chatbot-popup" id="chatbot-popup">
                <div class="chatbot-header">
                    <span>Ask AI 🤖</span>
                    <button class="chatbot-close" id="chatbot-close">×</button>
                </div>
                
                <div class="chatbot-messages" id="chatbot-messages">
                    <div class="message bot">
                        Hi! I'm here to help you. Ask me anything about this website or any topic you'd like to know about.
                    </div>
                </div>
                
                <div class="chatbot-input-area">
                    <input type="text" class="chatbot-input" id="chatbot-input" placeholder="Type your question..." />
                    <button class="chatbot-send" id="chatbot-send">
                        <svg viewBox="0 0 24 24">
                            <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    };
    
    // ChatBot Widget Class
    class ChatbotWidget {
        constructor() {
            this.isOpen = false;
            this.isLoading = false;
            this.init();
        }
        
        init() {
            // Create container
            this.container = document.createElement('div');
            this.container.className = 'chatbot-widget';
            this.container.innerHTML = createChatbotHTML();
            document.body.appendChild(this.container);
            
            // Get elements
            this.toggle = document.getElementById('chatbot-toggle');
            this.popup = document.getElementById('chatbot-popup');
            this.close = document.getElementById('chatbot-close');
            this.messages = document.getElementById('chatbot-messages');
            this.input = document.getElementById('chatbot-input');
            this.sendBtn = document.getElementById('chatbot-send');
            
            // Bind events
            this.bindEvents();
        }
        
        bindEvents() {
            this.toggle.addEventListener('click', () => this.toggleChat());
            this.close.addEventListener('click', () => this.closeChat());
            this.sendBtn.addEventListener('click', () => this.sendMessage());
            this.input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
            
            // Close on outside click
            document.addEventListener('click', (e) => {
                if (this.isOpen && !this.container.contains(e.target)) {
                    this.closeChat();
                }
            });
        }
        
        toggleChat() {
            if (this.isOpen) {
                this.closeChat();
            } else {
                this.openChat();
            }
        }
        
        openChat() {
            this.isOpen = true;
            this.popup.classList.add('show');
            this.input.focus();
        }
        
        closeChat() {
            this.isOpen = false;
            this.popup.classList.remove('show');
        }
        
        addMessage(content, type = 'user', warning = null) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${type}`;
            messageDiv.textContent = content;
            
            if (warning) {
                const warningDiv = document.createElement('div');
                warningDiv.className = 'message-warning';
                warningDiv.textContent = warning;
                messageDiv.appendChild(warningDiv);
            }
            
            this.messages.appendChild(messageDiv);
            this.scrollToBottom();
        }
        
        addTypingIndicator() {
            const typingDiv = document.createElement('div');
            typingDiv.className = 'typing-indicator';
            typingDiv.id = 'typing-indicator';
            typingDiv.innerHTML = `
                <div class="typing-dots">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
                <span>AI is typing...</span>
            `;
            this.messages.appendChild(typingDiv);
            this.scrollToBottom();
        }
        
        removeTypingIndicator() {
            const typingIndicator = document.getElementById('typing-indicator');
            if (typingIndicator) {
                typingIndicator.remove();
            }
        }
        
        scrollToBottom() {
            this.messages.scrollTop = this.messages.scrollHeight;
        }
        
        async sendMessage() {
            const question = this.input.value.trim();
            if (!question || this.isLoading) return;
            
            this.isLoading = true;
            this.sendBtn.disabled = true;
            
            // Add user message
            this.addMessage(question, 'user');
            this.input.value = '';
            
            // Add typing indicator
            this.addTypingIndicator();
            
            try {
                const response = await fetch('http://127.0.0.1:8000/ask-question', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        question: question,
                        collection_name: 'baapcompany'
                    })
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                
                // Remove typing indicator
                this.removeTypingIndicator();
                
                // Log debug info if available
                if (data.debug_info && data.debug_info.message) {
                    console.log('Chatbot Debug Info:', data.debug_info.message);
                }
                
                // Add bot response
                const warning = data.context_used === false ? '⚠️ This answer may not use site-specific knowledge.' : null;
                this.addMessage(data.answer, 'bot', warning);
                
            } catch (error) {
                console.error('Chatbot API Error:', error);
                this.removeTypingIndicator();
                this.addMessage('Sorry, I encountered an error while processing your request. Please try again later.', 'bot');
            }
            
            this.isLoading = false;
            this.sendBtn.disabled = false;
            this.input.focus();
        }
    }
    
    // Initialize when DOM is ready
    function initChatbot() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                window.ChatbotWidget = new ChatbotWidget();
            });
        } else {
            window.ChatbotWidget = new ChatbotWidget();
        }
    }
    
    // Start initialization
    initChatbot();
})();
