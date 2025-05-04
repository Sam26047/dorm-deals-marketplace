
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, BookOpen, Laptop, Sofa, Tag } from 'lucide-react';
import Footer from '@/components/Footer';

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-teal-600 text-white py-20 px-6">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Buy & Sell on Your Campus
            </h1>
            <p className="text-xl mb-8 text-white/90">
              The easiest way to buy and sell used items on your college campus. 
              From textbooks to furniture, find everything you need at a fraction of the price.
            </p>
            <div className="flex space-x-4">
              <Link to="/signup" className="btn-accent py-3 px-8 text-base font-medium">
                Get Started
              </Link>
              <Link to="/listings" className="border-2 border-white text-white py-3 px-8 rounded-md hover:bg-white hover:text-primary transition-colors text-base font-medium">
                Browse Listings
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 md:pl-10">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                alt="Students trading items"
                className="w-full h-64 md:h-80 object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Tag className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">List Your Items</h3>
              <p className="text-gray-600">
                Take a few photos, set your price, and list your item in minutes.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Connect With Buyers</h3>
              <p className="text-gray-600">
                Receive bids and messages from interested buyers right on campus.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-primary">
                  <path d="M17 9l-5 5-5-5"></path>
                  <path d="M17 3l-5 5-5-5"></path>
                  <path d="M17 15l-5 5-5-5"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Close The Deal</h3>
              <p className="text-gray-600">
                Meet safely on campus to exchange items and payment. It's that simple!
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Categories */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Browse By Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Textbooks */}
            <Link to="/listings?category=textbooks" className="group">
              <div className="bg-white rounded-lg shadow-md overflow-hidden card-hover">
                <div className="h-32 bg-blue-500 flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-white" />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-medium text-lg group-hover:text-primary transition-colors">Textbooks</h3>
                </div>
              </div>
            </Link>
            
            {/* Electronics */}
            <Link to="/listings?category=electronics" className="group">
              <div className="bg-white rounded-lg shadow-md overflow-hidden card-hover">
                <div className="h-32 bg-purple-500 flex items-center justify-center">
                  <Laptop className="h-12 w-12 text-white" />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-medium text-lg group-hover:text-primary transition-colors">Electronics</h3>
                </div>
              </div>
            </Link>
            
            {/* Furniture */}
            <Link to="/listings?category=furniture" className="group">
              <div className="bg-white rounded-lg shadow-md overflow-hidden card-hover">
                <div className="h-32 bg-amber-500 flex items-center justify-center">
                  <Sofa className="h-12 w-12 text-white" />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-medium text-lg group-hover:text-primary transition-colors">Furniture</h3>
                </div>
              </div>
            </Link>
            
            {/* More Categories */}
            <Link to="/listings" className="group">
              <div className="bg-white rounded-lg shadow-md overflow-hidden card-hover">
                <div className="h-32 bg-primary flex items-center justify-center">
                  <Tag className="h-12 w-12 text-white" />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-medium text-lg group-hover:text-primary transition-colors">All Categories</h3>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
      
      {/* CTA Banner */}
      <section className="bg-accent py-16 px-6 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Buying and Selling?</h2>
          <p className="text-xl mb-8 text-white/90">
            Join thousands of students who are saving money by buying and selling within their campus community.
          </p>
          <Link to="/signup" className="btn-primary bg-white text-accent hover:bg-gray-100 py-3 px-8 text-lg font-medium">
            Sign Up Now
          </Link>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Landing;
