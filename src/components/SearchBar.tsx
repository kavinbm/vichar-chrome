
import React from 'react';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  promptCount: number;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, setSearchQuery, promptCount }) => {
  return (
    <div className="search-container">
      <input 
        type="text" 
        id="search-input" 
        placeholder="Search prompts..." 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div className="prompt-count">
        <span id="prompt-count">{promptCount}</span> prompts
      </div>
    </div>
  );
};

export default SearchBar;
