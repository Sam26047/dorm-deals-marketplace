
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '@/components/LoadingSpinner';

const Index = () => {
  const navigate = useNavigate();
  
  // Redirect to the landing page
  useEffect(() => {
    navigate('/');
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="large" />
    </div>
  );
};

export default Index;
