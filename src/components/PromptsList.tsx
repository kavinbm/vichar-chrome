
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Prompt {
  id: string;
  title: string;
  text: string;
  author?: string;
  createdAt: string;
}

interface PromptsListProps {
  prompts: Prompt[];
  onUsePrompt: (id: string) => void;
  truncateText: (text: string, maxLength: number) => string;
  formatDate: (dateString: string) => string;
}

const PromptsList: React.FC<PromptsListProps> = ({ 
  prompts, 
  onUsePrompt, 
  truncateText, 
  formatDate 
}) => {
  return (
    <div id="prompts-container" className="tab-content active">
      <ScrollArea className="h-full">
        <div id="prompts-list" className="prompts-list">
          {prompts.length === 0 ? (
            <div className="empty-state">
              <p>No prompts found. Create your first prompt!</p>
              <button className="button primary" onClick={() => onUsePrompt('')}>Use Prompt</button>
            </div>
          ) : (
            prompts.map(prompt => (
              <div className="prompt-item" key={prompt.id} data-id={prompt.id} onClick={() => onUsePrompt(prompt.id)}>
                <div className="prompt-header">
                  <div className="prompt-title">{prompt.title}</div>
                  <div className="prompt-actions">
                    <button 
                      className="action-button edit" 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        onUsePrompt(prompt.id); 
                      }}
                    >
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
};

export default PromptsList;
