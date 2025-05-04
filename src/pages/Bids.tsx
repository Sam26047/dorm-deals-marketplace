
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { bidService, listingService, formatPrice, formatDate } from '@/services/data.service';
import { Bid, Listing } from '@/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Tag, MessageCircle, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const Bids = () => {
  const [receivedBids, setReceivedBids] = useState<Array<Bid & { listing?: Listing }>>([]);
  const [sentBids, setSentBids] = useState<Array<Bid & { listing?: Listing }>>([]);
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please log in to view your bids');
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Fetch bids and associated listings
  useEffect(() => {
    const fetchBids = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        
        // Get all listings by this seller
        const userListings = await listingService.getBySellerId(currentUser.id);
        
        // Get all bids for these listings
        const bidsPromises = userListings.map(listing => bidService.getByListingId(listing.id));
        const bidsArrays = await Promise.all(bidsPromises);
        
        // Flatten array of arrays and add listing details to each bid
        const receivedBidsWithListing = bidsArrays.flat().map(bid => {
          const listing = userListings.find(l => l.id === bid.listingId);
          return { ...bid, listing };
        });
        
        // Get bids made by the current user
        const userBids = await bidService.getByBuyerId(currentUser.id);
        
        // Fetch listing details for each bid
        const sentBidsWithListing = await Promise.all(
          userBids.map(async bid => {
            try {
              const listing = await listingService.getById(bid.listingId);
              return { ...bid, listing };
            } catch (e) {
              console.error(`Failed to fetch listing for bid ${bid.id}:`, e);
              return bid;
            }
          })
        );
        
        setReceivedBids(receivedBidsWithListing);
        setSentBids(sentBidsWithListing);
      } catch (err) {
        console.error('Error fetching bids:', err);
        setError('Failed to load your bids. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBids();
  }, [currentUser]);

  // Handle bid acceptance
  const handleAcceptBid = async (bid: Bid) => {
    try {
      await bidService.updateStatus(bid.id, 'accepted');
      
      // Update local state
      setReceivedBids(receivedBids.map(b => 
        b.id === bid.id 
          ? { ...b, status: 'accepted' as const } 
          // If other bids are for the same listing, reject them
          : b.listingId === bid.listingId
            ? { ...b, status: 'rejected' as const }
            : b
      ));
      
      toast.success('Bid accepted. Contact the buyer to arrange the exchange.');
    } catch (err) {
      console.error('Error accepting bid:', err);
      toast.error('Failed to accept bid. Please try again.');
    }
  };

  // Handle bid rejection
  const handleRejectBid = async (bid: Bid) => {
    try {
      await bidService.updateStatus(bid.id, 'rejected');
      
      // Update local state
      setReceivedBids(receivedBids.map(b => 
        b.id === bid.id ? { ...b, status: 'rejected' as const } : b
      ));
      
      toast.success('Bid rejected.');
    } catch (err) {
      console.error('Error rejecting bid:', err);
      toast.error('Failed to reject bid. Please try again.');
    }
  };

  // Start conversation with buyer
  const handleContactBuyer = (bid: Bid) => {
    navigate(`/messages?with=${bid.buyerId}`);
  };

  // Start conversation with seller
  const handleContactSeller = (bid: Bid) => {
    if (bid.listing) {
      navigate(`/messages?with=${bid.listing.sellerId}`);
    } else {
      toast.error('Cannot contact seller. Listing information is missing.');
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
        <h1 className="text-2xl font-bold mb-6">My Bids</h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        {/* Tabs */}
        <div className="flex border-b mb-6">
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === 'received'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('received')}
          >
            Bids Received ({receivedBids.length})
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === 'sent'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('sent')}
          >
            Bids Sent ({sentBids.length})
          </button>
        </div>
        
        {/* Received Bids */}
        {activeTab === 'received' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {receivedBids.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-600">You haven't received any bids yet.</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {receivedBids.map((bid) => (
                  <li key={bid.id} className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center">
                      {/* Listing Info */}
                      <div className="flex items-center mb-4 md:mb-0 md:flex-1">
                        {bid.listing && (
                          <div className="h-16 w-16 bg-gray-200 rounded overflow-hidden flex-shrink-0 mr-4">
                            <img
                              src={bid.listing.imageUrl || '/placeholder.svg'}
                              alt={bid.listing.title}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/placeholder.svg';
                              }}
                            />
                          </div>
                        )}
                        
                        <div>
                          {bid.listing ? (
                            <Link to={`/listing/${bid.listingId}`} className="font-medium hover:text-primary">
                              {bid.listing.title}
                            </Link>
                          ) : (
                            <span className="font-medium">Unknown listing</span>
                          )}
                          <div className="text-sm text-gray-500">
                            Bid from <span className="font-medium">{bid.buyerName}</span>
                          </div>
                          <div className="flex items-center mt-1">
                            <span className="text-lg font-semibold text-primary">
                              {formatPrice(bid.amount)}
                            </span>
                            <span className="mx-2 text-gray-400">•</span>
                            <span className="text-sm text-gray-500">{formatDate(bid.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Bid Status & Actions */}
                      <div className="flex items-center justify-between md:justify-end md:space-x-3">
                        {/* Status Badge */}
                        {bid.status !== 'pending' && (
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center ${
                              bid.status === 'accepted'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {bid.status === 'accepted' ? 'Accepted' : 'Declined'}
                          </span>
                        )}
                        
                        {/* Actions */}
                        {bid.status === 'pending' ? (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleAcceptBid(bid)}
                              className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition-colors"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleRejectBid(bid)}
                              className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition-colors"
                            >
                              Decline
                            </button>
                          </div>
                        ) : bid.status === 'accepted' ? (
                          <button
                            onClick={() => handleContactBuyer(bid)}
                            className="inline-flex items-center px-3 py-1 bg-primary text-white rounded-md text-sm hover:bg-primary/90 transition-colors"
                          >
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Contact
                          </button>
                        ) : null}
                        
                        {/* View Listing */}
                        <Link
                          to={`/listing/${bid.listingId}`}
                          className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-800 rounded-md text-sm hover:bg-gray-200 transition-colors"
                        >
                          <ArrowRight className="h-4 w-4 mr-1" />
                          View
                        </Link>
                      </div>
                    </div>
                    
                    {/* Bid Message */}
                    {bid.message && (
                      <div className="mt-2 pl-20 md:pl-24">
                        <p className="text-gray-700 text-sm border-l-2 border-gray-200 pl-3">
                          "{bid.message}"
                        </p>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        
        {/* Sent Bids */}
        {activeTab === 'sent' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {sentBids.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-600">You haven't sent any bids yet.</p>
                <Link to="/listings" className="mt-4 inline-block text-primary hover:underline">
                  Browse listings
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {sentBids.map((bid) => (
                  <li key={bid.id} className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center">
                      {/* Listing Info */}
                      <div className="flex items-center mb-4 md:mb-0 md:flex-1">
                        {bid.listing && (
                          <div className="h-16 w-16 bg-gray-200 rounded overflow-hidden flex-shrink-0 mr-4">
                            <img
                              src={bid.listing.imageUrl || '/placeholder.svg'}
                              alt={bid.listing.title}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/placeholder.svg';
                              }}
                            />
                          </div>
                        )}
                        
                        <div>
                          {bid.listing ? (
                            <>
                              <Link to={`/listing/${bid.listingId}`} className="font-medium hover:text-primary">
                                {bid.listing.title}
                              </Link>
                              <div className="text-sm text-gray-500">
                                Listed by <span className="font-medium">{bid.listing.sellerName}</span>
                              </div>
                            </>
                          ) : (
                            <span className="font-medium">Unknown listing</span>
                          )}
                          <div className="flex items-center mt-1">
                            <span className="text-lg font-semibold text-primary">
                              {formatPrice(bid.amount)}
                            </span>
                            <span className="mx-2 text-gray-400">•</span>
                            <span className="text-sm text-gray-500">{formatDate(bid.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Bid Status & Actions */}
                      <div className="flex items-center justify-between md:justify-end md:space-x-3">
                        {/* Status Badge */}
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center ${
                            bid.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : bid.status === 'accepted'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {bid.status === 'pending'
                            ? 'Pending'
                            : bid.status === 'accepted'
                            ? 'Accepted'
                            : 'Declined'}
                        </span>
                        
                        {/* Actions */}
                        {bid.status === 'accepted' && (
                          <button
                            onClick={() => handleContactSeller(bid)}
                            className="inline-flex items-center px-3 py-1 bg-primary text-white rounded-md text-sm hover:bg-primary/90 transition-colors"
                          >
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Contact
                          </button>
                        )}
                        
                        {/* View Listing */}
                        <Link
                          to={`/listing/${bid.listingId}`}
                          className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-800 rounded-md text-sm hover:bg-gray-200 transition-colors"
                        >
                          <ArrowRight className="h-4 w-4 mr-1" />
                          View
                        </Link>
                      </div>
                    </div>
                    
                    {/* Bid Message */}
                    {bid.message && (
                      <div className="mt-2 pl-20 md:pl-24">
                        <p className="text-gray-700 text-sm border-l-2 border-gray-200 pl-3">
                          "{bid.message}"
                        </p>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Bids;
