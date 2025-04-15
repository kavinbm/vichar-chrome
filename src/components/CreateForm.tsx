
import React, { useEffect, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';

interface CreateFormProps {
  promptTitle: string;
  promptText: string;
  promptAuthor: string;
  setPromptText: (text: string) => void;
  handleSavePrompt: (e: React.FormEvent) => void;
  handleCancelEdit: () => void;
  highlightedView: string;
}

const CreateForm: React.FC<CreateFormProps> = ({
  promptTitle,
  promptText,
  promptAuthor,
  setPromptText,
  handleSavePrompt,
  handleCancelEdit,
  highlightedView
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Create a display element for the highlighted text view
  const HighlightedTextDisplay = () => {
    return (
      <div 
        className="highlighted-text-display" 
        dangerouslySetInnerHTML={{ __html: highlightedView }}
      />
    );
  };

  return (
    <div id="create-container" className="tab-content active">
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
};

export default CreateForm;
