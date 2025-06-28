// src/components/auth/ProtectedRoute.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../shared/LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, loginRedirect, error, msalInitialized, redirectAttempted } = useAuth();
  const [localRedirectAttempted, setLocalRedirectAttempted] = useState(false);

  // Handle login redirect only once and only when MSAL is initialized
  useEffect(() => {
    if (!isLoading && 
        !isAuthenticated && 
        msalInitialized && 
        !redirectAttempted && 
        !localRedirectAttempted) {
      
      console.log('ProtectedRoute: Initiating login redirect...');
      setLocalRedirectAttempted(true);
      loginRedirect();
    }
  }, [isLoading, isAuthenticated, msalInitialized, redirectAttempted, localRedirectAttempted, loginRedirect]);

  // Show loading spinner while checking auth state or MSAL is initializing
  if (isLoading || !msalInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner message="Initializing authentication..." />
      </div>
    );
  }

  // Show error if there's an authentication error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="text-red-600 mb-4">
            <h2 className="text-xl font-semibold mb-2">Authentication Error</h2>
            <p className="text-sm bg-red-50 p-3 rounded border">{error}</p>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mr-2"
          >
            Try Again
          </button>
          <button 
            onClick={() => {
              // Clear storage and reload
              sessionStorage.clear();
              localStorage.clear();
              window.location.reload();
            }} 
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Clear & Restart
          </button>
        </div>
      </div>
    );
  }

  // Show loading while redirect is being initiated
  if (!isAuthenticated && (redirectAttempted || localRedirectAttempted)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Redirecting to Login</h2>
          <p className="text-gray-600">Please wait while we redirect you to the login page...</p>
          <p className="text-xs text-gray-400 mt-2">If this takes too long, try refreshing the page</p>
        </div>
      </div>
    );
  }

  // User is authenticated, render the protected content
  return children;
};

export default ProtectedRoute;