
import React from 'react';
import './App.css';
import PopupPreview from './components/PopupPreview';
import { TooltipProvider } from '@/components/ui/tooltip';

function App() {
  return (
    <TooltipProvider>
      <div className="app-container">
        <h1 className="app-title">Wisp Extension Preview</h1>
        <div className="extension-container">
          <PopupPreview />
        </div>
        <div className="preview-info">
          <p>This is a preview of the Wisp Chrome extension. You can try the core features here.</p>
        </div>
      </div>
    </TooltipProvider>
  );
}

export default App;
