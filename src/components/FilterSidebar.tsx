
import React from 'react';
import { categories } from '@/services/data.service';
import { Category } from '@/types';
import { Search } from 'lucide-react';

interface FilterSidebarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: Category | '';
  setSelectedCategory: (category: Category | '') => void;
  minPrice: number | '';
  setMinPrice: (price: number | '') => void;
  maxPrice: number | '';
  setMaxPrice: (price: number | '') => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

const FilterSidebar = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  onApplyFilters,
  onClearFilters
}: FilterSidebarProps) => {
  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMinPrice(value === '' ? '' : Number(value));
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMaxPrice(value === '' ? '' : Number(value));
  };

  return (
    <div className="bg-white rounded-lg shadow p-5 sticky top-20">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>
      
      {/* Search */}
      <div className="mb-6">
        <label htmlFor="search" className="block text-sm font-medium mb-1 text-gray-700">
          Search
        </label>
        <div className="relative">
          <input
            type="text"
            id="search"
            placeholder="Search listings..."
            className="input-field pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>
      
      {/* Category */}
      <div className="mb-6">
        <label htmlFor="category" className="block text-sm font-medium mb-1 text-gray-700">
          Category
        </label>
        <select
          id="category"
          className="input-field"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value as Category | '')}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>
      
      {/* Price Range */}
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-2 text-gray-700">Price Range</h3>
        <div className="flex space-x-2 items-center">
          <div className="w-1/2">
            <label htmlFor="min-price" className="block text-xs text-gray-500 mb-1">
              Min Price
            </label>
            <input
              type="number"
              id="min-price"
              min="0"
              placeholder="Min $"
              className="input-field"
              value={minPrice === '' ? '' : minPrice}
              onChange={handleMinPriceChange}
            />
          </div>
          <div className="w-1/2">
            <label htmlFor="max-price" className="block text-xs text-gray-500 mb-1">
              Max Price
            </label>
            <input
              type="number"
              id="max-price"
              min="0"
              placeholder="Max $"
              className="input-field"
              value={maxPrice === '' ? '' : maxPrice}
              onChange={handleMaxPriceChange}
            />
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-col space-y-2">
        <button
          className="btn-primary"
          onClick={onApplyFilters}
        >
          Apply Filters
        </button>
        <button
          className="btn-secondary"
          onClick={onClearFilters}
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default FilterSidebar;
