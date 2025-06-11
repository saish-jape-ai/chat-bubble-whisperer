
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { UploadSection } from './UploadSection';
import { ProcessProgress } from './ProcessProgress';
import { ChatbotCustomizer } from './ChatbotCustomizer';
import { LogOut, Settings, Bot } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const [isProcessComplete, setIsProcessComplete] = useState(false);
  const [collectionName, setCollectionName] = useState<string>('');

  const handleProcessStart = (taskId: string) => {
    setCurrentTaskId(taskId);
    setIsProcessComplete(false);
    setCollectionName(taskId); // Using taskId as collection name for simplicity
  };

  const handleProcessComplete = () => {
    setIsProcessComplete(true);
    setCurrentTaskId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Bot className="w-8 h-8 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">Chatbot Dashboard</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {user?.username}</span>
              <Button onClick={logout} variant="outline" size="sm" className="flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Upload Section */}
          {!currentTaskId && !isProcessComplete && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Content</h2>
              <UploadSection onProcessStart={handleProcessStart} />
            </div>
          )}

          {/* Processing Section */}
          {currentTaskId && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Processing</h2>
              <ProcessProgress taskId={currentTaskId} onComplete={handleProcessComplete} />
            </div>
          )}

          {/* Customization Section */}
          {isProcessComplete && collectionName && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Customize & Deploy</h2>
              <ChatbotCustomizer collectionName={collectionName} />
            </div>
          )}

          {/* Reset Button */}
          {(currentTaskId || isProcessComplete) && (
            <div className="text-center">
              <Button 
                onClick={() => {
                  setCurrentTaskId(null);
                  setIsProcessComplete(false);
                  setCollectionName('');
                }}
                variant="outline"
              >
                Start New Project
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
