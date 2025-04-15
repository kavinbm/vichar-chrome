
import React from 'react';
import { Settings, MessageSquare } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

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
        <Button variant="ghost" size="sm" className="flex items-center gap-1 text-xs">
          <MessageSquare size={14} />
          <span>Feedback</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Share your feedback</h3>
          <textarea 
            className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            placeholder="How can we improve Wisp?"
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setFeedbackText('')}
            >
              Cancel
            </Button>
            <Button 
              size="sm"
              onClick={handleSubmitFeedback}
            >
              Submit
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );

  return (
    <header className="border-b border-border pb-3 pt-2">
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <img 
            src="/public/lovable-uploads/bd0c46f8-2219-40b1-bc34-2e40e5d7de31.png" 
            alt="Wisp Logo" 
            className="h-7 w-7 object-contain"
          />
          <h1 className="text-xl font-semibold text-primary">Wisp</h1>
        </div>
        <div className="flex items-center gap-1">
          <FeedbackButton />
          {currentTab === 'prompts' && (
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentTab('settings')}
            >
              <Settings size={16} />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
