
import React, { useEffect, useState } from 'react';
import { Check, X, AlertCircle } from 'lucide-react';
import { cva } from 'class-variance-authority';

interface ToastProps {
  id: string;
}

const toastVariants = cva(
  "fixed bottom-4 right-4 z-50 transition-all duration-300 opacity-0 translate-y-2 max-w-sm shadow-lg",
  {
    variants: {
      variant: {
        default: "bg-background border border-border text-foreground",
        success: "bg-green-50 border border-green-200 text-green-900 dark:bg-green-950 dark:border-green-900 dark:text-green-100",
        error: "bg-red-50 border border-red-200 text-red-900 dark:bg-red-950 dark:border-red-900 dark:text-red-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Toast: React.FC<ToastProps> = ({ id }) => {
  const [variant, setVariant] = useState<'default' | 'success' | 'error'>('default');

  // Effect to handle classLists changes applied by JavaScript
  useEffect(() => {
    const toastElement = document.getElementById(id);
    
    if (toastElement) {
      const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          if (mutation.attributeName === 'class') {
            const classList = toastElement.classList;
            if (classList.contains('success')) {
              setVariant('success');
            } else if (classList.contains('error')) {
              setVariant('error');
            } else {
              setVariant('default');
            }
          }
        });
      });
      
      observer.observe(toastElement, { attributes: true });
      return () => observer.disconnect();
    }
  }, [id]);

  return (
    <div id={id} className={toastVariants({ variant })}>
      <div className="flex items-center gap-3 p-3 rounded-md">
        <div className="flex-shrink-0">
          {variant === 'success' && <Check className="h-5 w-5 text-green-600 dark:text-green-400" data-success />}
          {variant === 'error' && <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" data-error />}
        </div>
        <span id="toast-message" className="text-sm flex-1"></span>
        <button className="flex-shrink-0 rounded-full p-1 hover:bg-black/5 dark:hover:bg-white/10">
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
