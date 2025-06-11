
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { UploadSection } from './UploadSection';
import { ProcessProgress } from './ProcessProgress';
import { ChatbotCustomizer } from './ChatbotCustomizer';
import { LogOut, Bot, Sparkles, Zap } from 'lucide-react';

type DashboardStep = 'upload' | 'processing' | 'customize' | 'complete';

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [currentStep, setCurrentStep] = useState<DashboardStep>('upload');
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const [collectionName, setCollectionName] = useState<string>('');

  const handleProcessStart = (taskId: string) => {
    setCurrentTaskId(taskId);
    setCollectionName(taskId);
    setCurrentStep('processing');
  };

  const handleProcessComplete = () => {
    setCurrentStep('customize');
  };

  const handleCustomizationComplete = () => {
    setCurrentStep('complete');
  };

  const resetProcess = () => {
    setCurrentStep('upload');
    setCurrentTaskId(null);
    setCollectionName('');
  };

  const getStepNumber = (step: DashboardStep): number => {
    switch (step) {
      case 'upload': return 1;
      case 'processing': return 2;
      case 'customize': return 3;
      case 'complete': return 4;
      default: return 1;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-400/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-400/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Bot className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ChatBot Builder
                </h1>
                <p className="text-sm text-gray-600">Professional Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-sm text-gray-600">Welcome back,</p>
                <p className="font-semibold text-gray-900">{user?.username}</p>
              </div>
              <Button 
                onClick={logout} 
                variant="outline" 
                className="flex items-center gap-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center mb-12">
          {['Upload Content', 'Processing', 'Customize', 'Deploy'].map((label, index) => {
            const stepNum = index + 1;
            const isActive = stepNum === getStepNumber(currentStep);
            const isCompleted = stepNum < getStepNumber(currentStep);
            
            return (
              <div key={label} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 border-transparent text-white scale-110' 
                    : isCompleted 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  {isCompleted ? '✓' : stepNum}
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className={`text-sm font-medium ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                    {label}
                  </p>
                </div>
                {index < 3 && (
                  <div className={`w-16 h-0.5 mx-4 transition-colors ${
                    stepNum < getStepNumber(currentStep) ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="relative z-10">
          {currentStep === 'upload' && (
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <Sparkles className="w-16 h-16 mx-auto mb-4 text-blue-500" />
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Upload Your Content</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Start by uploading a PDF document or entering a website URL to scrape content for your chatbot
                </p>
              </div>
              <UploadSection onProcessStart={handleProcessStart} />
            </div>
          )}

          {currentStep === 'processing' && currentTaskId && (
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <Zap className="w-16 h-16 mx-auto mb-4 text-yellow-500 animate-pulse" />
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Processing Your Content</h2>
                <p className="text-gray-600">
                  We're analyzing and preparing your content. This may take a few minutes.
                </p>
              </div>
              <ProcessProgress taskId={currentTaskId} onComplete={handleProcessComplete} />
            </div>
          )}

          {currentStep === 'customize' && collectionName && (
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <Bot className="w-16 h-16 mx-auto mb-4 text-purple-500" />
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Customize Your Chatbot</h2>
                <p className="text-gray-600">
                  Personalize your chatbot's appearance and behavior
                </p>
              </div>
              <ChatbotCustomizer 
                collectionName={collectionName} 
                onComplete={handleCustomizationComplete}
              />
            </div>
          )}

          {currentStep === 'complete' && (
            <div className="animate-fade-in text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Bot className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">🎉 Chatbot Ready!</h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Your chatbot has been successfully created and is ready to be deployed on your website.
              </p>
              <Button 
                onClick={resetProcess}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 px-8 py-3 text-lg"
              >
                Create Another Chatbot
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
