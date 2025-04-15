
import React from 'react';
import { Tag } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CategoriesSectionProps {
  categories: string[];
  selectedCategory: string;
  onCategoryClick: (category: string) => void;
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({ 
  categories, 
  selectedCategory, 
  onCategoryClick 
}) => {
  if (categories.length === 0) return null;
  
  return (
    <div className="border-b border-border px-4 py-3">
      <div className="flex items-center gap-2 mb-2">
        <Tag size={14} className="text-muted-foreground" />
        <h3 className="text-xs font-medium text-muted-foreground">Authors</h3>
      </div>
      
      <ScrollArea className="pb-1" orientation="horizontal">
        <div className="flex gap-2 pb-1">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryClick(category)}
              className={`
                rounded-full border px-3 py-1 text-xs font-medium transition-colors
                ${selectedCategory === category 
                  ? 'border-primary bg-primary text-primary-foreground' 
                  : 'border-border bg-background hover:bg-secondary/50 text-foreground'}
              `}
            >
              {category}
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default CategoriesSection;
