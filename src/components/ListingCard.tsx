
import React from 'react';
import { Link } from 'react-router-dom';
import { Listing } from '@/types';
import { formatPrice, formatDate } from '@/services/data.service';
import { Tag } from 'lucide-react';

interface ListingCardProps {
  listing: Listing;
}

const ListingCard = ({ listing }: ListingCardProps) => {
  return (
    <Link to={`/listing/${listing.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden card-hover h-full flex flex-col">
        {/* Image */}
        <div className="h-48 overflow-hidden bg-gray-200 relative">
          <img
            src={listing.imageUrl || '/placeholder.svg'}
            alt={listing.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder.svg';
            }}
          />
          <div className="absolute bottom-0 left-0 bg-primary text-white px-3 py-1 text-sm font-medium">
            {formatPrice(listing.price)}
          </div>
          <div className="absolute top-2 right-2 bg-white/80 text-gray-800 px-2 py-1 rounded text-xs font-medium flex items-center">
            <Tag className="h-3 w-3 mr-1" />
            {listing.category.replace('_', ' ')}
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-lg mb-1 line-clamp-1">{listing.title}</h3>
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{listing.description}</p>
          
          <div className="mt-auto flex items-center justify-between text-xs text-gray-500">
            <span>By {listing.sellerName}</span>
            <span>{formatDate(listing.createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ListingCard;
