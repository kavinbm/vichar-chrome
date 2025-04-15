import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { PlusCircle, Clock, User } from 'lucide-react';
import { cn } from '@/lib/utils';

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
      <ScrollArea className="h-full pr-4">
        <div id="prompts-list" className="prompts-list space-y-4 py-4">
          {prompts.length === 0 ? (
            <div className="empty-state bg-muted/50 rounded-lg p-8 text-center">
              <p className="text-muted-foreground mb-4">No prompts found. Create your first prompt!</p>
              <button 
                className="button primary inline-flex items-center space-x-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md px-4 py-2 transition-colors"
                onClick={() => onUsePrompt('')}
              >
                <PlusCircle className="h-4 w-4" />
                <span>Use Prompt</span>
              </button>
            </div>
          ) : (
            prompts.map(prompt => (
              <Card 
                key={prompt.id} 
                data-id={prompt.id}
                className="prompt-item border-2 hover:border-primary/50 transition-all duration-300 cursor-pointer hover:shadow-md animate-fade-in"
                onClick={() => onUsePrompt(prompt.id)}
              >
                <CardHeader className="pb-2 pt-4">
                  <div className="flex justify-between items-start">
                    <h3 className="prompt-title font-semibold text-lg text-left">{prompt.title}</h3>
                    <div className="prompt-actions">
                      <button 
                        className={cn(
                          "action-button edit rounded-md px-3 py-1 text-sm transition-colors",
                          "bg-[#9b87f5] text-white hover:bg-[#8E69AB]"
                        )}
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          onUsePrompt(prompt.id); 
                        }}
                      >
                        Use
                      </button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 pb-3">
                  <p className="prompt-preview text-muted-foreground text-sm leading-relaxed text-left">{truncateText(prompt.text, 100)}</p>
                </CardContent>
                <CardFooter className="pt-0 pb-3 text-xs text-muted-foreground flex justify-between items-center border-t border-border/30 mt-1 pt-2">
                  {prompt.author && (
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{prompt.author}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 ml-auto">
                    <Clock className="h-3 w-3" />
                    <span>{formatDate(prompt.createdAt)}</span>
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default PromptsList;
