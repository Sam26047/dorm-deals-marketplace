
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { listingService } from '@/services/data.service';
import { Listing } from '@/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Edit, Trash2, Tag, Clock, Plus, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { formatPrice, formatDate } from '@/services/data.service';

const MyListings = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please log in to view your listings');
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Fetch user's listings
  useEffect(() => {
    const fetchListings = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        const data = await listingService.getBySellerId(currentUser.id);
        setListings(data);
      } catch (err) {
        console.error('Error fetching listings:', err);
        setError('Failed to load your listings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [currentUser]);

  // Handle listing deletion
  const handleDeleteListing = async (id: string) => {
    try {
      setDeletingId(id);
      await listingService.delete(id);
      
      // Update listings state
      setListings(listings.filter(listing => listing.id !== id));
      toast.success('Listing deleted successfully');
    } catch (err) {
      console.error('Error deleting listing:', err);
      toast.error('Failed to delete listing. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-16 flex justify-center">
          <LoadingSpinner size="large" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Listings</h1>
          <Link to="/new-listing" className="btn-primary flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            New Listing
          </Link>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        {listings.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="flex flex-col items-center">
              <Tag className="h-16 w-16 text-gray-300 mb-4" />
              <h2 className="text-xl font-semibold mb-2">No listings yet</h2>
              <p className="text-gray-600 mb-6">
                You haven't posted any listings yet. Create your first listing to start selling!
              </p>
              <Link to="/new-listing" className="btn-primary flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Create Listing
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {listings.map((listing) => (
                <li key={listing.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    {/* Listing Image */}
                    <div className="h-24 w-24 bg-gray-200 rounded overflow-hidden flex-shrink-0 mr-4">
                      <img
                        src={listing.imageUrl || '/placeholder.svg'}
                        alt={listing.title}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                        }}
                      />
                    </div>
                    
                    {/* Listing Details */}
                    <div className="flex-1">
                      <Link to={`/listing/${listing.id}`} className="hover:text-primary">
                        <h3 className="font-semibold text-lg">{listing.title}</h3>
                      </Link>
                      <p className="text-primary font-medium">{formatPrice(listing.price)}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Tag className="h-3 w-3 mr-1" />
                        <span className="capitalize mr-4">{listing.category.replace('_', ' ')}</span>
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{formatDate(listing.createdAt)}</span>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex space-x-2">
                      {/* Edit Button */}
                      <button
                        onClick={() => navigate(`/edit-listing/${listing.id}`)}
                        className="p-2 text-gray-600 hover:text-primary transition-colors"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      
                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteListing(listing.id)}
                        disabled={deletingId === listing.id}
                        className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                      >
                        {deletingId === listing.id ? (
                          <LoadingSpinner size="small" />
                        ) : (
                          <Trash2 className="h-5 w-5" />
                        )}
                      </button>
                      
                      {/* View Button */}
                      <Link
                        to={`/listing/${listing.id}`}
                        className="p-2 text-gray-600 hover:text-primary transition-colors"
                      >
                        <ArrowRight className="h-5 w-5" />
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default MyListings;
