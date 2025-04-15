import React, { useState, useEffect, useRef } from 'react';
import './PopupPreview.css';
import { dummyPrompts } from '../data/dummyData';
import { Settings, MessageSquare } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { processTextForHighlighting } from '../utils/textHighlighter';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const [highlightedView, setHighlightedView] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load prompts on mount
  useEffect(() => {
    loadPrompts();
  }, []);

  // Update highlighted view when prompt text changes
  useEffect(() => {
    setHighlightedView(processTextForHighlighting(promptText));
  }, [promptText]);

  // Filter prompts when search query or selected category changes
  useEffect(() => {
    if (allPrompts.length === 0) return;
    
    let filtered = [...allPrompts];
    
    // Filter by search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered
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
    }
    
    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(prompt => 
        prompt.author.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    
    setFilteredPrompts(filtered);
  }, [searchQuery, selectedCategory, allPrompts]);

  const loadPrompts = () => {
    chromeStorageMock.local.get(['promptpal_data'], (result) => {
      const data = result.promptpal_data || { prompts: [] };
      setAllPrompts(data.prompts);
      setFilteredPrompts(data.prompts);
    });
  };

  // Get unique categories (authors)
  const getCategories = () => {
    const categories = allPrompts
      .map(prompt => prompt.author)
      .filter((author, index, self) => 
        author && self.indexOf(author) === index
      )
      .sort();
    return categories;
  };

  // Function to highlight user input placeholders in square brackets
  const highlightUserInputs = (text: string) => {
    if (!text) return '';
    
    // Find all instances of text in square brackets
    return text.replace(/\[([^\]]+)\]/g, '<span class="user-input-highlight">[$1]</span>');
  };

  const handleCopyPrompt = (id: string) => {
    const prompt = allPrompts.find(p => p.id === id);
    if (prompt) {
      navigator.clipboard.writeText(prompt.text)
        .then(() => showToast('Copied to clipboard!', 'success'))
        .catch(() => showToast('Failed to copy to clipboard', 'error'));
    }
  };

  const handleUsePrompt = (id: string) => {
    const prompt = allPrompts.find(p => p.id === id);
    if (prompt) {
      setPromptTitle(prompt.title);
      setPromptText(prompt.text);
      setPromptAuthor(prompt.author || '');
      setEditingPromptId(id);
      setCurrentTab('create');
    }
  };

  const handleSavePrompt = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Just copy to clipboard instead of saving
    navigator.clipboard.writeText(promptText)
      .then(() => showToast('Copied to clipboard!', 'success'))
      .catch(() => showToast('Failed to copy to clipboard', 'error'));
  };

  const handleCancelEdit = () => {
    setPromptTitle('');
    setPromptText('');
    setPromptAuthor('');
    setEditingPromptId(null);
    setCurrentTab('prompts');
  };

  const handleSubmitFeedback = () => {
    if (feedbackText.trim()) {
      showToast('Feedback submitted. Thank you!', 'success');
      setFeedbackText('');
    } else {
      showToast('Please enter your feedback', 'error');
    }
  };

  const handleCategoryClick = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory('');
    } else {
      setSelectedCategory(category);
    }
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

  // Create a display element for the highlighted text view
  const HighlightedTextDisplay = () => {
    return (
      <div 
        className="highlighted-text-display" 
        dangerouslySetInnerHTML={{ __html: highlightedView }}
      />
    );
  };

  // Categories section component
  const CategoriesSection = () => {
    const categories = getCategories();
    
    if (categories.length === 0) return null;
    
    return (
      <div className="categories-container">
        {categories.map((category, index) => (
          <div 
            key={index} 
            className={`category-tag ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </div>
        ))}
      </div>
    );
  };

  const renderPromptsTab = () => (
    <div id="prompts-container" className={`tab-content ${currentTab === 'prompts' ? 'active' : ''}`}>
      <ScrollArea className="h-full">
        <div id="prompts-list" className="prompts-list">
          {filteredPrompts.length === 0 ? (
            <div className="empty-state">
              <p>No prompts found. Create your first prompt!</p>
              <button className="button primary" onClick={() => setCurrentTab('create')}>Use Prompt</button>
            </div>
          ) : (
            filteredPrompts.map(prompt => (
              <div className="prompt-item" key={prompt.id} data-id={prompt.id} onClick={() => handleUsePrompt(prompt.id)}>
                <div className="prompt-header">
                  <div className="prompt-title">{prompt.title}</div>
                  <div className="prompt-actions">
                    <button className="action-button edit" onClick={(e) => { e.stopPropagation(); handleUsePrompt(prompt.id); }}>
                      Use
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
      </ScrollArea>
    </div>
  );

  const renderCreateTab = () => (
    <div id="create-container" className={`tab-content ${currentTab === 'create' ? 'active' : ''}`}>
      <form id="prompt-form" onSubmit={handleSavePrompt}>
        <div className="form-group">
          <div className="static-field prompt-title">
            {promptTitle || 'Enter a descriptive prompt name'}
          </div>
          {promptAuthor && <div className="static-field prompt-author">By {promptAuthor}</div>}
        </div>

        <div className="form-group flex-grow">
          <label htmlFor="prompt-text" className="prompt-label">Prompt</label>
          <div className="textarea-container">
            <Textarea 
              id="prompt-text" 
              placeholder="Enter your prompt text here..." 
              required
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              className="prompt-textarea"
              ref={textareaRef}
            />
            <HighlightedTextDisplay />
          </div>
          <div className="textarea-controls">
            <span className="markdown-hint">
              Supports markdown formatting. Highlight <span style={{ backgroundColor: 'var(--light-purple-highlight)' }}>[your input]</span> for user interaction points
            </span>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" id="cancel-prompt" className="button secondary" onClick={handleCancelEdit}>
            Cancel
          </button>
          <button type="submit" id="save-prompt" className="button primary">
            Copy
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

  // Fixed Feedback button and popover component
  const FeedbackButton = () => (
    <Popover>
      <PopoverTrigger asChild>
        <button className="action-button" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <MessageSquare size={16} />
          <span>Feedback</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="feedback-container">
          <h3 className="text-sm font-medium mb-2">Share your feedback</h3>
          <textarea 
            className="feedback-textarea"
            placeholder="How can we improve Wisp?"
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
          />
          <div className="feedback-actions">
            <button 
              className="button secondary"
              onClick={() => setFeedbackText('')}
            >
              Cancel
            </button>
            <button 
              className="button primary"
              onClick={handleSubmitFeedback}
            >
              Submit
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );

  const renderTopActions = () => (
    <div className="top-actions" style={{ display: 'flex', gap: '12px', marginLeft: 'auto' }}>
      <FeedbackButton />
      
      <button 
        className="action-button settings"
        onClick={() => setCurrentTab('settings')}
        style={{ display: 'flex', alignItems: 'center', padding: '4px' }}
      >
        <Settings size={20} />
      </button>
    </div>
  );

  return (
    <div className="container">
      <header>
        <div className="logo">
          <img src="/public/lovable-uploads/bd0c46f8-2219-40b1-bc34-2e40e5d7de31.png" alt="Wisp Logo" />
          <h1>Wisp</h1>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div className="tabs">
            <button 
              id="tab-prompts" 
              className={`tab-button ${currentTab === 'prompts' ? 'active' : ''}`}
              onClick={() => setCurrentTab('prompts')}
            >
              Quick Access
            </button>
            <button 
              id="tab-create" 
              className={`tab-button ${currentTab === 'create' ? 'active' : ''}`}
              onClick={() => setCurrentTab('create')}
            >
              Use
            </button>
          </div>
          {renderTopActions()}
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

      {currentTab === 'prompts' && <CategoriesSection />}
      {currentTab === 'prompts' && renderPromptsTab()}
      {currentTab === 'create' && renderCreateTab()}
      {currentTab === 'settings' && renderSettingsTab()}

      <div id="toast" className="toast">
        <div className="toast-content">
          <span id="toast-message"></span>
        </div>
      </div>
    </div>
  );
};

export default PopupPreview;
