import React, { useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X, FileText, User, Sparkles, Pencil, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreateFormProps {
  promptTitle: string;
  promptText: string;
  promptAuthor: string;
  setPromptText: (text: string) => void;
  handleSavePrompt: (e: React.FormEvent) => void;
  handleCancelEdit: () => void;
  highlightedView: string;
  setCurrentTab: (tab: string) => void;
}

const CreateForm: React.FC<CreateFormProps> = ({
  promptTitle,
  promptText,
  promptAuthor,
  setPromptText,
  handleSavePrompt,
  handleCancelEdit,
  highlightedView,
  setCurrentTab
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div id="create-container" className="tab-content active">
      <div className="border-b border-border p-3">
        <Button
          variant="ghost"
          className="flex items-center gap-1 text-purple-500 hover:text-purple-700 hover:bg-purple-50"
          onClick={() => setCurrentTab('prompts')}
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Quick Access</span>
        </Button>
      </div>
      <Card className="shadow-sm border-2 animate-fade-in m-3">
        <CardHeader className="pb-2 space-y-2">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <span>{promptTitle || 'Enter a descriptive prompt name'}</span>
              </CardTitle>
              {promptAuthor && (
                <div className="static-field prompt-author flex items-center text-sm text-muted-foreground">
                  <User className="h-4 w-4 mr-1" />
                  <span>By {promptAuthor}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span className="text-xs text-muted-foreground">Premium Prompt</span>
            </div>
          </div>
        </CardHeader>

        <form id="prompt-form" onSubmit={handleSavePrompt}>
          <CardContent className="space-y-4 pt-2">
            <div className="form-group flex-grow space-y-2">
              <label htmlFor="prompt-text" className="prompt-label text-sm font-medium flex items-center gap-1">
                <Pencil className="h-4 w-4" />
                Prompt
              </label>
              <div className="textarea-container">
                <Textarea 
                  id="prompt-text" 
                  placeholder="Enter your prompt text here..." 
                  required
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  className="prompt-textarea min-h-[200px] resize-y font-mono text-sm"
                  ref={textareaRef}
                />
              </div>
              <div className="textarea-controls">
                <span className="markdown-hint text-xs text-muted-foreground italic">
                  Supports markdown formatting. Highlight <span className="bg-purple-100 dark:bg-purple-900 px-1 rounded">[your input]</span> for user interaction points
                </span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end space-x-2 pt-2 border-t">
            <Button 
              type="button" 
              variant="outline"
              onClick={handleCancelEdit}
              className="flex items-center gap-1"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button 
              type="submit" 
              className={cn(
                "flex items-center gap-1",
                "bg-[#9b87f5] hover:bg-[#8E69AB] text-white" // Purple background with hover state
              )}
            >
              <Check className="h-4 w-4" />
              Copy
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default CreateForm;
