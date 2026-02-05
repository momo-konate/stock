import React from 'react';
import { LayoutDashboard } from 'lucide-react';

const CategoryFilter = ({ selectedCategory, onCategoryChange, categories }) => {
  return (
    <div className="category-filter-container">
      <div className="category-filter-chips">
        <button
          className={`category-chip ${selectedCategory === 'Toutes' ? 'active' : ''}`}
          onClick={() => onCategoryChange('Toutes')}
        >
          <LayoutDashboard size={16} /> Toutes
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => onCategoryChange(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
