
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import PrivateRoute from "@/components/PrivateRoute";

import Landing from "@/pages/Landing";
import Listings from "@/pages/Listings";
import ListingDetail from "@/pages/ListingDetail";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import CreateListing from "@/pages/CreateListing";
import EditListing from "@/pages/EditListing";
import MyListings from "@/pages/MyListings";
import Bids from "@/pages/Bids";
import Messages from "@/pages/Messages";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/listings" element={<Listings />} />
            <Route path="/listing/:id" element={<ListingDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected Routes */}
            <Route path="/new-listing" element={
              <PrivateRoute>
                <CreateListing />
              </PrivateRoute>
            } />
            <Route path="/edit-listing/:id" element={
              <PrivateRoute>
                <EditListing />
              </PrivateRoute>
            } />
            <Route path="/my-listings" element={
              <PrivateRoute>
                <MyListings />
              </PrivateRoute>
            } />
            <Route path="/bids" element={
              <PrivateRoute>
                <Bids />
              </PrivateRoute>
            } />
            <Route path="/messages" element={
              <PrivateRoute>
                <Messages />
              </PrivateRoute>
            } />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
