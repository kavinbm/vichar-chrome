
import React from 'react';
import { ToastProvider, Toast as ShadcnToast } from '@/components/ui/toast';
import { Check, AlertCircle } from 'lucide-react';

interface ToastProps {
  id: string;
}

const Toast: React.FC<ToastProps> = ({ id }) => {
  return (
    <div id={id} className="toast fixed bottom-4 right-4 z-50 transition-all duration-300 opacity-0 translate-y-2">
      <div className="toast-content bg-background border rounded-md shadow-md p-3 flex items-center gap-2 min-w-[200px]">
        <span id="toast-icon" className="flex-shrink-0">
          <Check className="h-4 w-4 text-green-500 hidden" data-success />
          <AlertCircle className="h-4 w-4 text-red-500 hidden" data-error />
        </span>
        <span id="toast-message" className="text-sm"></span>
      </div>
    </div>
  );
};

export default Toast;
