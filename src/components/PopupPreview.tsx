
import React, { useState, useEffect } from 'react';
import './PopupPreview.css';
import './CreateForm.css';
import { dummyPrompts } from '../data/dummyData';
import { processTextForHighlighting } from '../utils/textHighlighter';
import Header from './Header';
import SearchBar from './SearchBar';
import CategoriesSection from './CategoriesSection';
import PromptsList from './PromptsList';
import CreateForm from './CreateForm';
import SettingsPanel from './SettingsPanel';
import Toast from './Toast';

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

  return (
    <div className="container flex flex-col h-full bg-background">
      <Header 
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        feedbackText={feedbackText}
        setFeedbackText={setFeedbackText}
        handleSubmitFeedback={handleSubmitFeedback}
      />

      {currentTab === 'prompts' && (
        <>
          <SearchBar 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
            promptCount={filteredPrompts.length} 
          />
          <CategoriesSection 
            categories={getCategories()} 
            selectedCategory={selectedCategory} 
            onCategoryClick={handleCategoryClick} 
          />
          <div className="flex-1 overflow-auto">
            <PromptsList 
              prompts={filteredPrompts} 
              onUsePrompt={handleUsePrompt} 
              truncateText={truncateText}
              formatDate={formatDate}
            />
          </div>
        </>
      )}
      
      {currentTab === 'create' && (
        <div className="flex-1 overflow-auto">
          <CreateForm 
            promptTitle={promptTitle}
            promptText={promptText}
            promptAuthor={promptAuthor}
            setPromptText={setPromptText}
            handleSavePrompt={handleSavePrompt}
            handleCancelEdit={handleCancelEdit}
            highlightedView={highlightedView}
          />
        </div>
      )}
      
      {currentTab === 'settings' && (
        <div className="flex-1 overflow-auto">
          <SettingsPanel promptCount={allPrompts.length} />
        </div>
      )}

      <Toast id="toast" />
    </div>
  );
};

export default PopupPreview;
