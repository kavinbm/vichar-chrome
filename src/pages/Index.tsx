
import React from 'react';
import PopupPreview from '@/components/PopupPreview';
import { TooltipProvider } from '@/components/ui/tooltip';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700">Wisp Chrome Extension Preview</h1>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-[380px] w-full">
        <TooltipProvider>
          <PopupPreview />
        </TooltipProvider>
      </div>
      <p className="mt-6 text-gray-600 max-w-[500px] text-center">
        This is a preview of the Wisp Chrome extension. You can interact with it just like the real extension.
      </p>
    </div>
  );
};

export default Index;
