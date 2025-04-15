
import React from 'react';
import { Settings, MessageSquare } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  feedbackText: string;
  setFeedbackText: (text: string) => void;
  handleSubmitFeedback: () => void;
}

const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  feedbackText,
  setFeedbackText,
  handleSubmitFeedback
}) => {
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
    <header>
      <div className="logo">
        <img 
          src="/public/lovable-uploads/bd0c46f8-2219-40b1-bc34-2e40e5d7de31.png" 
          alt="Wisp Logo" 
          className="logo-image"
        />
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
  );
};

export default Header;
