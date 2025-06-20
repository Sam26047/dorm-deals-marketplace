
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Listing, Category } from '@/types';
import { listingService } from '@/services/data.service';
import ListingCard from '@/components/ListingCard';
import FilterSidebar from '@/components/FilterSidebar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';

const Listings = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | ''>('');
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  
  const location = useLocation();
  const navigate = useNavigate();

  // Parse URL query params and apply filters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    const searchParam = params.get('search');
    const minPriceParam = params.get('minPrice');
    const maxPriceParam = params.get('maxPrice');
    
    // Update state from URL params
    setSelectedCategory(categoryParam as Category || '');
    setSearchQuery(searchParam || '');
    setMinPrice(minPriceParam && !isNaN(Number(minPriceParam)) ? Number(minPriceParam) : '');
    setMaxPrice(maxPriceParam && !isNaN(Number(maxPriceParam)) ? Number(maxPriceParam) : '');
    
    // Apply filters with the URL parameters
    filterListingsWithParams(
      searchParam || '',
      categoryParam as Category || '',
      minPriceParam && !isNaN(Number(minPriceParam)) ? Number(minPriceParam) : undefined,
      maxPriceParam && !isNaN(Number(maxPriceParam)) ? Number(maxPriceParam) : undefined
    );
  }, [location.search]);

  // Fetch listings on component mount
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const data = await listingService.getAll();
        setListings(data);
        // Don't set filteredListings here - let the URL params effect handle it
      } catch (err) {
        console.error('Error fetching listings:', err);
        setError('Failed to load listings. Please try again later.');
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  // Filter listings with specific parameters
  const filterListingsWithParams = async (
    search: string,
    category: Category | '',
    minPriceValue?: number,
    maxPriceValue?: number
  ) => {
    try {
      setLoading(true);
      const filtered = await listingService.search(
        search,
        category || undefined,
        minPriceValue,
        maxPriceValue
      );
      setFilteredListings(filtered);
    } catch (err) {
      console.error('Error filtering listings:', err);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters based on current state
  const applyFilters = () => {
    const filters = new URLSearchParams();
    
    if (selectedCategory) {
      filters.set('category', selectedCategory);
    }
    
    if (searchQuery) {
      filters.set('search', searchQuery);
    }
    
    if (minPrice !== '') {
      filters.set('minPrice', String(minPrice));
    }
    
    if (maxPrice !== '') {
      filters.set('maxPrice', String(maxPrice));
    }
    
    navigate({
      pathname: '/listings',
      search: filters.toString()
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    navigate('/listings');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        <h1 className="text-3xl font-bold mb-8">Browse Listings</h1>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filter Sidebar */}
          <div className="w-full md:w-64">
            <FilterSidebar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              minPrice={minPrice}
              setMinPrice={setMinPrice}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              onApplyFilters={applyFilters}
              onClearFilters={clearFilters}
            />
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <LoadingSpinner size="large" />
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            ) : filteredListings.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-medium text-gray-700 mb-2">No listings found</h3>
                <p className="text-gray-500">
                  Try adjusting your filters or search for something else.
                </p>
              </div>
            ) : (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-gray-600">
                    {filteredListings.length} {filteredListings.length === 1 ? 'listing' : 'listings'} found
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredListings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Listings;
