
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { getTaskStatus } from '@/utils/api';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface ProcessState {
  status: 'active' | 'completed' | 'pending';
  message: string;
  progress: number;
}

interface ProcessStatus {
  states: {
    crawling: ProcessState;
    processing: ProcessState;
    generating_embeddings: ProcessState;
    storing: ProcessState;
    completed: ProcessState;
  };
  current_state: string;
  is_complete: boolean;
}

interface ProcessProgressProps {
  taskId: string;
  onComplete: () => void;
}

export const ProcessProgress: React.FC<ProcessProgressProps> = ({ taskId, onComplete }) => {
  const [status, setStatus] = useState<ProcessStatus | null>(null);

  useEffect(() => {
    const eventSource = getTaskStatus(taskId);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setStatus(data);
      
      if (data.is_complete) {
        onComplete();
        eventSource.close();
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => eventSource.close();
  }, [taskId, onComplete]);

  if (!status) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <Clock className="w-8 h-8 mx-auto mb-2 animate-spin" />
          <p>Initializing process...</p>
        </div>
      </Card>
    );
  }

  const steps = [
    { key: 'crawling', label: 'Crawling Data' },
    { key: 'processing', label: 'Processing Content' },
    { key: 'generating_embeddings', label: 'Generating Embeddings' },
    { key: 'storing', label: 'Storing Data' },
    { key: 'completed', label: 'Completed' },
  ];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-6">Processing Status</h3>
      
      <div className="space-y-4">
        {steps.map((step) => {
          const state = status.states[step.key as keyof typeof status.states];
          const isActive = status.current_state === step.key;
          const isCompleted = state.status === 'completed';
          
          return (
            <div key={step.key} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : isActive ? (
                    <Clock className="w-5 h-5 text-blue-500 animate-spin" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-gray-300" />
                  )}
                  <span className={`font-medium ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                    {step.label}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {state.progress}%
                </span>
              </div>
              
              <Progress value={state.progress} className="h-2" />
              
              {state.message && (
                <p className="text-sm text-gray-600">{state.message}</p>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};
