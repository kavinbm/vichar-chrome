
import React from 'react';
import './App.css';
import PopupPreview from './components/PopupPreview';

function App() {
  return (
    <div className="app-container">
      <h1 className="app-title">PromptPal Extension Preview</h1>
      <div className="extension-container">
        <PopupPreview />
      </div>
      <div className="preview-info">
        <p>This is a preview of the PromptPal Chrome extension. You can try the core features here.</p>
      </div>
    </div>
  );
}

export default App;
