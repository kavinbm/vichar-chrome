
import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  promptCount: number;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, setSearchQuery, promptCount }) => {
  return (
    <div className="border-b border-border bg-secondary/30 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} 
            placeholder="Search prompts..."
            className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="text-xs text-muted-foreground">
          <span className="font-medium">{promptCount}</span> prompts
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
