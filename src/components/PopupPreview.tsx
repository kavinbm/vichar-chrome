
import React, { useState, useEffect } from 'react';
import './PopupPreview.css';
import { dummyPrompts } from '../data/dummyData';

// Simulate the Chrome storage API for the preview
const chromeStorageMock = {
  local: {
    get: (keys: string[], callback: (result: any) => void) => {
      const result = { promptpal_data: { prompts: dummyPrompts } };
      setTimeout(() => callback(result), 100);
    },
    set: (data: any, callback: () => void) => {
      setTimeout(() => callback(), 100);
    }
  }
};

// Make mock available globally for other components
(window as any).chrome = { storage: chromeStorageMock };

const PopupPreview: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('prompts');
  const [allPrompts, setAllPrompts] = useState<any[]>([]);
  const [filteredPrompts, setFilteredPrompts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingPromptId, setEditingPromptId] = useState<string | null>(null);
  const [promptTitle, setPromptTitle] = useState<string>('');
  const [promptText, setPromptText] = useState<string>('');
  const [promptAuthor, setPromptAuthor] = useState<string>('');

  // Load prompts on mount
  useEffect(() => {
    loadPrompts();
  }, []);

  // Filter prompts when search query changes
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPrompts(allPrompts);
    } else {
      const query = searchQuery.toLowerCase();
      const results = allPrompts
        .map(prompt => {
          const titleMatch = prompt.title.toLowerCase().includes(query);
          const contentMatch = prompt.text.toLowerCase().includes(query);
          
          let score = 0;
          if (titleMatch) score += 3;
          if (contentMatch) score += 1;
          
          return { ...prompt, score };
        })
        .filter(prompt => prompt.score > 0)
        .sort((a, b) => b.score - a.score);
      
      setFilteredPrompts(results);
    }
  }, [searchQuery, allPrompts]);

  const loadPrompts = () => {
    chromeStorageMock.local.get(['promptpal_data'], (result) => {
      const data = result.promptpal_data || { prompts: [] };
      setAllPrompts(data.prompts);
      setFilteredPrompts(data.prompts);
    });
  };

  const handleCopyPrompt = (id: string) => {
    const prompt = allPrompts.find(p => p.id === id);
    if (prompt) {
      navigator.clipboard.writeText(prompt.text)
        .then(() => showToast('Copied to clipboard!', 'success'))
        .catch(() => showToast('Failed to copy to clipboard', 'error'));
    }
  };

  const handleEditPrompt = (id: string) => {
    const prompt = allPrompts.find(p => p.id === id);
    if (prompt) {
      setPromptTitle(prompt.title);
      setPromptText(prompt.text);
      setPromptAuthor(prompt.author || '');
      setEditingPromptId(id);
      setCurrentTab('create');
    }
  };

  const handleDeletePrompt = (id: string) => {
    if (window.confirm('Are you sure you want to delete this prompt?')) {
      const updatedPrompts = allPrompts.filter(p => p.id !== id);
      setAllPrompts(updatedPrompts);
      setFilteredPrompts(updatedPrompts.filter(p => {
        if (searchQuery.trim() === '') return true;
        const query = searchQuery.toLowerCase();
        return p.title.toLowerCase().includes(query) || p.text.toLowerCase().includes(query);
      }));
      
      showToast('Prompt deleted', 'success');
    }
  };

  const handleSavePrompt = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!promptTitle.trim() || !promptText.trim()) {
      showToast('Title and prompt text are required', 'error');
      return;
    }
    
    const newPrompt = {
      id: editingPromptId || Date.now().toString(36) + Math.random().toString(36).substring(2),
      title: promptTitle,
      text: promptText,
      author: promptAuthor,
      createdAt: editingPromptId ? (allPrompts.find(p => p.id === editingPromptId)?.createdAt || new Date().toISOString()) : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    let updatedPrompts;
    if (editingPromptId) {
      updatedPrompts = allPrompts.map(p => p.id === editingPromptId ? newPrompt : p);
      showToast('Prompt updated successfully', 'success');
    } else {
      updatedPrompts = [newPrompt, ...allPrompts];
      showToast('Prompt saved successfully', 'success');
    }
    
    setAllPrompts(updatedPrompts);
    setFilteredPrompts(updatedPrompts);
    
    // Reset form
    setPromptTitle('');
    setPromptText('');
    setPromptAuthor('');
    setEditingPromptId(null);
    setCurrentTab('prompts');
  };

  const handleCancelEdit = () => {
    setPromptTitle('');
    setPromptText('');
    setPromptAuthor('');
    setEditingPromptId(null);
    setCurrentTab('prompts');
  };

  const showToast = (message: string, type: string = '') => {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    
    if (toast && toastMessage) {
      toast.className = 'toast';
      if (type) {
        toast.classList.add(type);
      }
      
      toastMessage.textContent = message;
      toast.classList.add('show');
      
      setTimeout(() => {
        toast.classList.remove('show');
      }, 3000);
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 30) {
      return date.toLocaleDateString();
    } else if (diffDays > 0) {
      return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    } else if (diffMins > 0) {
      return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
    } else {
      return 'Just now';
    }
  };

  const renderPromptsTab = () => (
    <div id="prompts-container" className={`tab-content ${currentTab === 'prompts' ? 'active' : ''}`}>
      <div id="prompts-list" className="prompts-list">
        {filteredPrompts.length === 0 ? (
          <div className="empty-state">
            <p>No prompts found. Create your first prompt!</p>
            <button className="button primary" onClick={() => setCurrentTab('create')}>Create Prompt</button>
          </div>
        ) : (
          filteredPrompts.map(prompt => (
            <div className="prompt-item" key={prompt.id} data-id={prompt.id} onClick={() => handleCopyPrompt(prompt.id)}>
              <div className="prompt-header">
                <div className="prompt-title">{prompt.title}</div>
                <div className="prompt-actions">
                  <button className="action-button copy" onClick={(e) => { e.stopPropagation(); handleCopyPrompt(prompt.id); }}>
                    Copy
                  </button>
                  <button className="action-button edit" onClick={(e) => { e.stopPropagation(); handleEditPrompt(prompt.id); }}>
                    Edit
                  </button>
                  <button className="action-button delete" onClick={(e) => { e.stopPropagation(); handleDeletePrompt(prompt.id); }}>
                    Delete
                  </button>
                </div>
              </div>
              <div className="prompt-preview">{truncateText(prompt.text, 100)}</div>
              <div className="prompt-meta">
                {prompt.author && <div>By {prompt.author}</div>}
                <div>{formatDate(prompt.createdAt)}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderCreateTab = () => (
    <div id="create-container" className={`tab-content ${currentTab === 'create' ? 'active' : ''}`}>
      <form id="prompt-form" onSubmit={handleSavePrompt}>
        <div className="form-group">
          <label htmlFor="prompt-title">Title *</label>
          <input 
            type="text" 
            id="prompt-title" 
            placeholder="Enter a descriptive title" 
            maxLength={100} 
            required
            value={promptTitle}
            onChange={(e) => setPromptTitle(e.target.value)}
          />
          <div className="char-counter">
            <span id="title-counter">{promptTitle.length}</span>/100
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="prompt-text">Prompt *</label>
          <textarea 
            id="prompt-text" 
            placeholder="Enter your prompt text here..." 
            required
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
          ></textarea>
          <div className="textarea-controls">
            <span className="markdown-hint">Supports markdown formatting</span>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="prompt-author">Author</label>
          <input 
            type="text" 
            id="prompt-author" 
            placeholder="Your name (optional)"
            value={promptAuthor}
            onChange={(e) => setPromptAuthor(e.target.value)}
          />
        </div>

        <div className="form-actions">
          <button type="button" id="cancel-prompt" className="button secondary" onClick={handleCancelEdit}>
            Cancel
          </button>
          <button type="submit" id="save-prompt" className="button primary">
            {editingPromptId ? 'Update Prompt' : 'Save Prompt'}
          </button>
        </div>
      </form>
    </div>
  );

  const renderSettingsTab = () => (
    <div id="settings-container" className={`tab-content ${currentTab === 'settings' ? 'active' : ''}`}>
      <div className="settings-group">
        <h3>Data Management</h3>
        <div className="settings-actions">
          <button id="export-data" className="button secondary">Export Prompts</button>
          <button id="import-data" className="button secondary">Import Prompts</button>
        </div>
        <div className="storage-info">
          <div className="storage-bar">
            <div id="storage-fill" className="storage-fill" style={{ width: `${(allPrompts.length / 100) * 100}%` }}></div>
          </div>
          <div className="storage-text">Using <span id="storage-used">{allPrompts.length}</span> of 100 prompts</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container">
      <header>
        <div className="logo">
          <img src="/icons/icon48.png" alt="PromptPal Logo" />
          <h1>PromptPal</h1>
        </div>
        <div className="tabs">
          <button 
            id="tab-prompts" 
            className={`tab-button ${currentTab === 'prompts' ? 'active' : ''}`}
            onClick={() => setCurrentTab('prompts')}
          >
            My Prompts
          </button>
          <button 
            id="tab-create" 
            className={`tab-button ${currentTab === 'create' ? 'active' : ''}`}
            onClick={() => setCurrentTab('create')}
          >
            Create
          </button>
          <button 
            id="tab-settings" 
            className={`tab-button ${currentTab === 'settings' ? 'active' : ''}`}
            onClick={() => setCurrentTab('settings')}
          >
            Settings
          </button>
        </div>
      </header>

      <div className="search-container">
        <input 
          type="text" 
          id="search-input" 
          placeholder="Search prompts..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="prompt-count">
          <span id="prompt-count">{filteredPrompts.length}</span> prompts
        </div>
      </div>

      {renderPromptsTab()}
      {renderCreateTab()}
      {renderSettingsTab()}

      <div className="nav-buttons">
        <button className="button secondary" onClick={() => setCurrentTab('prompts')}>
          Quick Access
        </button>
        <button className="button primary" onClick={() => { setCurrentTab('prompts'); document.getElementById('search-input')?.focus(); }}>
          Search
        </button>
      </div>

      <div id="toast" className="toast">
        <div className="toast-content">
          <span id="toast-message"></span>
        </div>
      </div>
    </div>
  );
};

export default PopupPreview;
