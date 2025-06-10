
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X, User, Search, ShoppingCart, Tag, MessageCircle, Plus, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    closeMenu();
  };

  return (
    <nav className="bg-white shadow-md py-4 px-6 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-xl md:text-2xl font-bold text-primary flex items-center">
          <ShoppingCart className="mr-2" />
          Campus Marketplace
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/listings" className="text-gray-700 hover:text-primary font-medium flex items-center">
            <Tag className="mr-1 h-4 w-4" />
            Browse
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/my-listings" className="text-gray-700 hover:text-primary font-medium flex items-center">
                <ShoppingCart className="mr-1 h-4 w-4" />
                My Listings
              </Link>
              <Link to="/new-listing" className="text-gray-700 hover:text-primary font-medium flex items-center">
                <Plus className="mr-1 h-4 w-4" />
                Create Listing
              </Link>
              <Link to="/bids" className="text-gray-700 hover:text-primary font-medium flex items-center">
                <Tag className="mr-1 h-4 w-4" />
                Bids
              </Link>
              <Link to="/messages" className="text-gray-700 hover:text-primary font-medium flex items-center">
                <MessageCircle className="mr-1 h-4 w-4" />
                Messages
              </Link>
              
              {/* Replace hover dropdown with DropdownMenu component */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center text-gray-700 hover:text-primary font-medium">
                  <User className="mr-1 h-4 w-4" />
                  {currentUser?.name}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={handleLogout} className="flex items-center cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-primary font-medium">
                Login
              </Link>
              <Link to="/signup" className="btn-primary">
                Sign Up
              </Link>
            </>
          )}
        </div>
        
        {/* Mobile menu button */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-gray-700">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-md z-50">
          <div className="flex flex-col space-y-4 p-4">
            <Link to="/listings" className="text-gray-700 hover:text-primary font-medium py-2 flex items-center" onClick={closeMenu}>
              <Tag className="mr-2 h-4 w-4" />
              Browse
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/my-listings" className="text-gray-700 hover:text-primary font-medium py-2 flex items-center" onClick={closeMenu}>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  My Listings
                </Link>
                <Link to="/new-listing" className="text-gray-700 hover:text-primary font-medium py-2 flex items-center" onClick={closeMenu}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Listing
                </Link>
                <Link to="/bids" className="text-gray-700 hover:text-primary font-medium py-2 flex items-center" onClick={closeMenu}>
                  <Tag className="mr-2 h-4 w-4" />
                  Bids
                </Link>
                <Link to="/messages" className="text-gray-700 hover:text-primary font-medium py-2 flex items-center" onClick={closeMenu}>
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Messages
                </Link>
                <hr className="my-2" />
                <div className="flex items-center justify-between py-2">
                  <span className="font-medium">{currentUser?.name}</span>
                  <button
                    onClick={handleLogout}
                    className="text-red-500 hover:text-red-700 font-medium flex items-center"
                  >
                    <LogOut className="mr-1 h-4 w-4" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary font-medium py-2" onClick={closeMenu}>
                  Login
                </Link>
                <Link to="/signup" className="btn-primary text-center" onClick={closeMenu}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
