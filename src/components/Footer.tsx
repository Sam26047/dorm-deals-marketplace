
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8 px-6">
      <div className="container mx-auto">
        <div className="flex flex-wrap justify-between">
          {/* Site Information */}
          <div className="w-full md:w-1/3 mb-8 md:mb-0">
            <h3 className="text-xl font-bold mb-4">Campus Deals</h3>
            <p className="text-gray-300 mb-4">
              The best marketplace for college students to buy and sell items within their campus community.
            </p>
          </div>

          {/* Quick Links */}
          <div className="w-full md:w-1/4 mb-8 md:mb-0">
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/listings" className="text-gray-300 hover:text-white transition-colors">
                  Browse Listings
                </Link>
              </li>
              <li>
                <Link to="/new-listing" className="text-gray-300 hover:text-white transition-colors">
                  Sell an Item
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="w-full md:w-1/4">
            <h4 className="text-lg font-semibold mb-4">Categories</h4>
            <div className="grid grid-cols-2 gap-2">
              <Link to="/listings?category=textbooks" className="text-gray-300 hover:text-white transition-colors">
                Textbooks
              </Link>
              <Link to="/listings?category=electronics" className="text-gray-300 hover:text-white transition-colors">
                Electronics
              </Link>
              <Link to="/listings?category=furniture" className="text-gray-300 hover:text-white transition-colors">
                Furniture
              </Link>
              <Link to="/listings?category=clothing" className="text-gray-300 hover:text-white transition-colors">
                Clothing
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Campus Deals. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
