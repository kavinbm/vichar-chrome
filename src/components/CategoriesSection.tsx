
import React from 'react';

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
    <div className="categories-container">
      {categories.map((category, index) => (
        <div 
          key={index} 
          className={`category-tag ${selectedCategory === category ? 'active' : ''}`}
          onClick={() => onCategoryClick(category)}
        >
          {category}
        </div>
      ))}
    </div>
  );
};

export default CategoriesSection;
