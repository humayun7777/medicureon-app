// src/App.js
import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { MediCureOnDataProvider } from './hooks/useMediCureOnData';
import LandingPage from './components/dashboard/LandingPage';
import LoadingSpinner from './components/shared/LoadingSpinner';
import AuthErrorPage from './components/auth/AuthErrorPage';
import TermsOfUsePage from './components/legal/TermsOfUsePage';
import PrivacyPolicyPage from './components/legal/PrivacyPolicyPage';
import ProfileManager from './components/profile/ProfileManager';
import HealthcarePlans from './components/plans/HealthcarePlans';
import SubscriptionPlans from './components/subscription/SubscriptionPlans';
import SubscriptionSuccess from './components/subscription/SubscriptionSuccess';
import RewardsAchievementsDashboard from './components/rewards/RewardsAchievementsDashboard';
import CommunityHub from './components/community/CommunityHub';
import WeightLossDashboard from './components/plans/dashboards/WeightLossDashboard';
import DiabetesBloodSugarDashboard from './components/plans/dashboards/DiabetesBloodSugarDashboard';
import CardiovascularHealthDashboard from './components/plans/dashboards/CardiovascularHealthDashboard';
import SleepMedicineDashboard from './components/plans/dashboards/SleepMedicineDashboard';
import StressMentalWellnessDashboard from './components/plans/dashboards/StressMentalWellnessDashboard';
import NutritionMetabolicDashboard from './components/plans/dashboards/NutritionMetabolicDashboard';
import RespiratoryPulmonaryDashboard from './components/plans/dashboards/RespiratoryPulmonaryDashboard';
import WomenReproductiveHormonalDashboard from './components/plans/dashboards/WomenReproductiveHormonalDashboard';
import PostSurgeryRecoveryDashboard from './components/plans/dashboards/PostSurgeryRecoveryDashboard';
import PreventiveIntelligenceDashboard from './components/plans/dashboards/PreventiveIntelligenceDashboard';
import './App.css';
import { Capacitor } from '@capacitor/core';
import deviceManager from './services/deviceManager';

// Main App Component wrapped with AuthProvider and MediCureOnDataProvider
function App() {
  return (
    <AuthProvider>
      <MediCureOnDataProvider>
        <AppContent />
      </MediCureOnDataProvider>
    </AuthProvider>
  );
}

// Separate component to use auth context
function AppContent() {
  const { isAuthenticated, isLoading, msalInitialized, error, user, loginRedirect, clearError } = useAuth();
  const [currentPage, setCurrentPage] = useState('landing');
  const [userInfo, setUserInfo] = useState(null);

  // Fetch user info when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      // Set user info from auth context
      setUserInfo({
        displayName: user.name || user.displayName,
        email: user.username || user.email,
        firstName: user.name?.split(' ')[0] || user.displayName?.split(' ')[0],
        profilePictureUrl: null, // Will be loaded from profile data
        subscriptionType: null // Will be loaded from subscription data
      });

      // Initialize device manager when user is authenticated
      if (user.localAccountId) {
        deviceManager.initialize(user.localAccountId, userInfo);
        
        // Auto-initialize HealthKit on iOS
        if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios') {
          setTimeout(async () => {
            console.log('Checking Apple Health connection status...');
            const connectionStatus = deviceManager.getDeviceConnectionStatus('apple');
            
            if (!connectionStatus.connected) {
              console.log('Apple Health not connected, attempting auto-connect...');
              // Try silent connection first
              try {
                const result = await deviceManager.connectDevice('apple');
                if (result.success) {
                  console.log('Apple Health connected successfully!');
                  // Dispatch event to update UI
                  window.dispatchEvent(new CustomEvent('healthDeviceConnected', { 
                    detail: { device: 'apple', status: 'connected' } 
                  }));
                } else if (result.requiresApp) {
                  console.log('Apple Health requires native app');
                } else {
                  console.log('Apple Health connection failed:', result.message);
                  // Only show prompt if it's a permissions issue
                  if (result.message && result.message.includes('permission')) {
                    const shouldConnect = window.confirm(
                      'Would you like to connect Apple Health to track your health data?'
                    );
                    
                    if (shouldConnect) {
                      const retryResult = await deviceManager.connectDevice('apple');
                      if (retryResult.success) {
                        alert('Apple Health connected successfully!');
                      }
                    }
                  }
                }
              } catch (error) {
                console.error('Error during auto-connect:', error);
              }
            } else {
              console.log('Apple Health already connected');
            }
          }, 3000); // Give app time to fully initialize
        }
      }
    }
  }, [isAuthenticated, user]);

  // Check for page routes in URL (for direct links to legal pages and subscription success)
  useEffect(() => {
    const path = window.location.pathname;
    const search = window.location.search;
    
    if (path === '/terms') {
      setCurrentPage('terms');
    } else if (path === '/privacy') {
      setCurrentPage('privacy');
    } else if (path === '/auth-error') {
      setCurrentPage('auth-error');
    } else if (path === '/subscription-success' || search.includes('session_id=')) {
      // Handle subscription success redirect from Stripe
      setCurrentPage('subscription-success');
    } else if (path.startsWith('/plan-dashboard/')) {
      // Handle plan dashboard routes
      setCurrentPage(path.substring(1)); // Remove leading /
    }
  }, []);

  // Automatically redirect to External ID login if not authenticated
  useEffect(() => {
    // Allow access to legal pages, auth error, and subscription success without authentication check
    const publicPages = ['terms', 'privacy', 'auth-error'];
    const authRequiredPages = ['landing', 'profile', 'plans', 'subscription', 'subscription-success', 'rewards', 'community'];
    
    // Check if current page requires auth (including plan dashboards)
    const requiresAuth = authRequiredPages.includes(currentPage) || currentPage.startsWith('plan-dashboard/');
    
    if (msalInitialized && !isLoading && !isAuthenticated && !error && requiresAuth) {
      console.log('User not authenticated, redirecting to Microsoft login...');
      loginRedirect();
    }
  }, [msalInitialized, isLoading, isAuthenticated, error, loginRedirect, currentPage]);

  // Log authentication state
  useEffect(() => {
    console.log('Auth State:', { 
      isAuthenticated, 
      isLoading, 
      msalInitialized,
      hasUser: !!user,
      currentPage,
      sessionId: new URLSearchParams(window.location.search).get('session_id'),
      platform: Capacitor.getPlatform(),
      isNative: Capacitor.isNativePlatform()
    });
  }, [isAuthenticated, isLoading, msalInitialized, user, currentPage]);

  // Handle navigation
  const handleNavigate = (page) => {
    setCurrentPage(page);
    // Update URL for better UX
    if (page === 'terms' || page === 'privacy' || page === 'auth-error') {
      window.history.pushState({}, '', `/${page}`);
    } else if (page === 'subscription-success') {
      // Preserve session_id in URL for subscription success
      window.history.pushState({}, '', `/subscription-success${window.location.search}`);
    } else if (page.startsWith('plan-dashboard/')) {
      // Handle plan dashboard routes
      window.history.pushState({}, '', `/${page}`);
    } else {
      window.history.pushState({}, '', '/');
    }
  };

  // Handle back navigation for legal pages
  const handleBackNavigation = () => {
    if (isAuthenticated) {
      handleNavigate('landing');
    } else {
      // If not authenticated, go to home or trigger login
      window.location.href = '/';
    }
  };

  // Expose device manager to window for debugging (remove in production)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      window.deviceManager = deviceManager;
    }
  }, []);

  // Show legal pages without authentication check
  if (currentPage === 'terms') {
    return <TermsOfUsePage onNavigate={handleNavigate} onBack={handleBackNavigation} />;
  }
  
  if (currentPage === 'privacy') {
    return <PrivacyPolicyPage onNavigate={handleNavigate} onBack={handleBackNavigation} />;
  }
  
  if (currentPage === 'auth-error') {
    return <AuthErrorPage onNavigate={handleNavigate} onBack={handleBackNavigation} />;
  }

  // Show loading while MSAL initializes or processes auth
  if (!msalInitialized || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-blue-600 rounded-full animate-spin"></div>
          <h2 className="mb-2 text-xl font-semibold text-gray-900">Loading MediCureOn</h2>
          <p className="text-gray-600">Please wait while we authenticate you...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md p-6 text-center bg-white rounded-lg shadow-lg">
          <div className="mb-4 text-red-600">
            <svg className="w-12 h-12 mx-auto mb-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="mb-2 text-xl font-semibold">Authentication Error</h2>
            <p className="mb-4 text-sm text-gray-600">{error}</p>
          </div>
          <button 
            onClick={() => {
              clearError();
              window.location.reload();
            }} 
            className="w-full px-4 py-2 text-white transition bg-blue-600 rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show app content only if authenticated
  if (isAuthenticated && user) {
    return (
      <div className="App">
        {currentPage === 'landing' && <LandingPage onNavigate={handleNavigate} />}
        
        {currentPage === 'profile' && <ProfileManager onNavigate={handleNavigate} />}
        
        {currentPage === 'plans' && <HealthcarePlans onNavigate={handleNavigate} />}
        
        {currentPage === 'subscription' && <SubscriptionPlans onNavigate={handleNavigate} />}
        
        {currentPage === 'subscription-success' && <SubscriptionSuccess onNavigate={handleNavigate} />}

        {currentPage === 'rewards' && <RewardsAchievementsDashboard onNavigate={handleNavigate} />}
        
        {currentPage === 'community' && <CommunityHub onNavigate={handleNavigate} />}
        
        {/* Plan Dashboards */}
        {currentPage === 'plan-dashboard/1' && (
          <WeightLossDashboard 
            onNavigate={handleNavigate} 
            userInfo={userInfo}
          />
        )}
        
        {currentPage === 'plan-dashboard/2' && (
          <DiabetesBloodSugarDashboard 
            onNavigate={handleNavigate} 
            userInfo={userInfo}
          />
        )}
        
        {currentPage === 'plan-dashboard/3' && (
          <CardiovascularHealthDashboard 
            onNavigate={handleNavigate} 
            userInfo={userInfo}
          />
        )}
        
        {currentPage === 'plan-dashboard/4' && (
          <SleepMedicineDashboard 
            onNavigate={handleNavigate} 
            userInfo={userInfo}
          />
        )}
        
        {currentPage === 'plan-dashboard/5' && (
          <StressMentalWellnessDashboard 
            onNavigate={handleNavigate} 
            userInfo={userInfo}
          />
        )}
        
        {currentPage === 'plan-dashboard/6' && (
          <NutritionMetabolicDashboard 
            onNavigate={handleNavigate} 
            userInfo={userInfo}
          />
        )}
        
        {currentPage === 'plan-dashboard/7' && (
          <RespiratoryPulmonaryDashboard 
            onNavigate={handleNavigate} 
            userInfo={userInfo}
          />
        )}
        
        {currentPage === 'plan-dashboard/8' && (
          <WomenReproductiveHormonalDashboard 
            onNavigate={handleNavigate} 
            userInfo={userInfo}
          />
        )}
        
        {currentPage === 'plan-dashboard/9' && (
          <PostSurgeryRecoveryDashboard 
            onNavigate={handleNavigate} 
            userInfo={userInfo}
          />
        )}
        
        {currentPage === 'plan-dashboard/10' && (
          <PreventiveIntelligenceDashboard 
            onNavigate={handleNavigate} 
            userInfo={userInfo}
          />
        )}
      </div>
    );
  }

  // If we reach here, still processing
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-blue-600 rounded-full animate-spin"></div>
        <h2 className="mb-2 text-xl font-semibold text-gray-900">Redirecting to login...</h2>
        <p className="text-gray-600">You will be redirected to Microsoft login shortly</p>
      </div>
    </div>
  );
}

export default App;