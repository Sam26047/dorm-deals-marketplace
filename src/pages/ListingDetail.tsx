
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { listingService, formatPrice, formatDate, bidService } from '@/services/data.service';
import { Listing, Bid } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';
import { MessageCircle, User, Tag, Clock, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const ListingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [bidMessage, setBidMessage] = useState('');
  const [submittingBid, setSubmittingBid] = useState(false);
  const [bids, setBids] = useState<Bid[]>([]);
  const [showBidForm, setShowBidForm] = useState(false);
  
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const isOwner = listing && currentUser && listing.sellerId === currentUser.id;
  
  // Fetch listing details
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        if (!id) return;
        
        const listingData = await listingService.getById(id);
        if (listingData) {
          setListing(listingData);
          
          // If current user is the owner, fetch bids for this listing
          if (currentUser && listingData.sellerId === currentUser.id) {
            const bidsData = await bidService.getByListingId(id);
            setBids(bidsData);
          }
        } else {
          setError('Listing not found');
        }
      } catch (err) {
        console.error('Error fetching listing:', err);
        setError('Failed to load listing. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id, currentUser]);

  // Handle bid submission
  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please log in to place a bid');
      navigate('/login');
      return;
    }
    
    if (!currentUser || !listing) return;
    
    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid bid amount');
      return;
    }
    
    try {
      setSubmittingBid(true);
      
      await bidService.create({
        listingId: listing.id,
        buyerId: currentUser.id,
        buyerName: currentUser.name,
        buyerAvatar: currentUser.avatar,
        amount,
        message: bidMessage
      });
      
      toast.success('Your bid has been submitted successfully!');
      setShowBidForm(false);
      setBidAmount('');
      setBidMessage('');
    } catch (err) {
      console.error('Error submitting bid:', err);
      toast.error('Failed to submit bid. Please try again.');
    } finally {
      setSubmittingBid(false);
    }
  };

  // Start a conversation with the seller
  const handleContactSeller = () => {
    if (!isAuthenticated) {
      toast.error('Please log in to contact the seller');
      navigate('/login');
      return;
    }
    
    if (isOwner) {
      toast.info("This is your listing. You can't message yourself.");
      return;
    }
    
    // Navigate to messages with the seller ID
    navigate(`/messages?with=${listing?.sellerId}`);
  };

  // Accept a bid
  const handleAcceptBid = async (bidId: string) => {
    try {
      await bidService.updateStatus(bidId, 'accepted');
      toast.success('Bid accepted! Contact the buyer to arrange the exchange.');
      
      // Update bids list
      const updatedBids = bids.map(bid => 
        bid.id === bidId 
          ? { ...bid, status: 'accepted' as const } 
          : { ...bid, status: 'rejected' as const }
      );
      
      setBids(updatedBids);
    } catch (err) {
      console.error('Error accepting bid:', err);
      toast.error('Failed to accept bid. Please try again.');
    }
  };

  // Reject a bid
  const handleRejectBid = async (bidId: string) => {
    try {
      await bidService.updateStatus(bidId, 'rejected');
      toast.success('Bid rejected.');
      
      // Update bids list
      const updatedBids = bids.map(bid => 
        bid.id === bidId 
          ? { ...bid, status: 'rejected' as const } 
          : bid
      );
      
      setBids(updatedBids);
    } catch (err) {
      console.error('Error rejecting bid:', err);
      toast.error('Failed to reject bid. Please try again.');
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

  if (error || !listing) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Error</h2>
            <p>{error || 'Listing not found'}</p>
            <Link to="/listings" className="mt-4 inline-flex items-center text-primary hover:underline">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to listings
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl flex-grow">
        <div className="mb-6">
          <Link to="/listings" className="text-primary hover:underline inline-flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to listings
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image Section */}
            <div className="h-80 md:h-auto bg-gray-100 flex items-center justify-center">
              <img
                src={listing.imageUrl || '/placeholder.svg'}
                alt={listing.title}
                className="w-full h-full object-contain md:object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.svg';
                }}
              />
            </div>
            
            {/* Details Section */}
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h1 className="text-2xl font-bold mb-2">{listing.title}</h1>
                <span className="text-2xl font-bold text-primary">{formatPrice(listing.price)}</span>
              </div>
              
              <div className="flex items-center space-x-2 mb-4">
                <Tag className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600 capitalize">{listing.category.replace('_', ' ')}</span>
                <span className="mx-2 text-gray-400">•</span>
                <span className="text-gray-600 capitalize">Condition: {listing.condition.replace('_', ' ')}</span>
              </div>
              
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-line">{listing.description}</p>
              </div>
              
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <p className="font-medium">{listing.sellerName}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>Listed on {formatDate(listing.createdAt)}</span>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              {!isOwner ? (
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => setShowBidForm(!showBidForm)}
                    className="btn-primary flex-1"
                  >
                    {showBidForm ? 'Cancel' : 'Place Bid'}
                  </button>
                  <button
                    onClick={handleContactSeller}
                    className="btn-secondary flex-1 flex justify-center items-center"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact Seller
                  </button>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md">
                  <p className="font-medium">This is your listing</p>
                  <p className="text-sm">You can view and manage bids below.</p>
                </div>
              )}
              
              {/* Bid Form */}
              {showBidForm && !isOwner && (
                <form onSubmit={handleBidSubmit} className="mt-6 p-4 border border-gray-200 rounded-md bg-gray-50">
                  <h3 className="font-semibold mb-3">Make an Offer</h3>
                  
                  <div className="mb-4">
                    <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Offer ($)
                    </label>
                    <input
                      type="number"
                      id="bidAmount"
                      min="1"
                      step="0.01"
                      placeholder="Enter amount"
                      className="input-field"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="bidMessage" className="block text-sm font-medium text-gray-700 mb-1">
                      Message (Optional)
                    </label>
                    <textarea
                      id="bidMessage"
                      placeholder="e.g., I can pick up tomorrow on campus"
                      rows={3}
                      className="input-field"
                      value={bidMessage}
                      onChange={(e) => setBidMessage(e.target.value)}
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={submittingBid}
                    className="w-full btn-primary"
                  >
                    {submittingBid ? <LoadingSpinner size="small" /> : 'Submit Offer'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
        
        {/* Bids Section (for owners only) */}
        {isOwner && bids.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Bids ({bids.length})</h2>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {bids.map((bid) => (
                  <li key={bid.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                          <User className="h-5 w-5 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium">{bid.buyerName}</p>
                          <p className="text-gray-500 text-sm">
                            Offered {formatPrice(bid.amount)} • {formatDate(bid.createdAt)}
                          </p>
                        </div>
                      </div>
                      
                      {bid.status === 'pending' ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleAcceptBid(bid.id)}
                            className="px-3 py-1 bg-green-100 text-green-800 rounded-md text-sm hover:bg-green-200 transition-colors"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleRejectBid(bid.id)}
                            className="px-3 py-1 bg-red-100 text-red-800 rounded-md text-sm hover:bg-red-200 transition-colors"
                          >
                            Decline
                          </button>
                        </div>
                      ) : (
                        <span
                          className={`px-3 py-1 rounded-md text-sm ${
                            bid.status === 'accepted'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {bid.status === 'accepted' ? 'Accepted' : 'Declined'}
                        </span>
                      )}
                    </div>
                    
                    {bid.message && (
                      <div className="mt-2 ml-13 pl-12">
                        <p className="text-gray-700 text-sm border-l-2 border-gray-200 pl-3">
                          "{bid.message}"
                        </p>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default ListingDetail;
