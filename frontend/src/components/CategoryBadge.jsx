import React from 'react';

const CATEGORY_COLORS = {
  'Boissons': '#3498db',
  'Alimentaire': '#2ecc71',
  'Cosmétiques': '#e91e63',
  'Hygiène': '#9b59b6',
  'Électronique': '#f39c12',
  'Vêtements': '#1abc9c',
  'Fournitures': '#34495e',
  'Autre': '#95a5a6'
};

const CategoryBadge = ({ category }) => {
  const getCategoryColor = (name) => {
    if (CATEGORY_COLORS[name]) return CATEGORY_COLORS[name];
    
    // Hash based color for dynamic categories
    let hash = 0;
    for (let i = 0; i < (name || '').length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${Math.abs(hash) % 360}, 65%, 45%)`;
    return color;
  };

  const color = getCategoryColor(category);
  
  return (
    <span 
      className="category-badge" 
      style={{ 
        backgroundColor: color,
        color: 'white',
        padding: '2px 10px',
        borderRadius: '20px',
        fontSize: '0.75rem',
        fontWeight: '600',
        display: 'inline-block',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}
    >
      {category || 'Autre'}
    </span>
  );
};

export default CategoryBadge;
