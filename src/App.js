// src/App.js
import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { MediCureOnDataProvider } from './hooks/useMediCureOnData';
import LandingPage from './components/dashboard/LandingPage';
// import LoadingSpinner from './components/shared/LoadingSpinner'; // Not used in current implementation
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

// Import the native auth service
import nativeAuthService from './services/nativeAuthService';

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
  const { isAuthenticated, isLoading, msalInitialized, error, user, loginRedirect, clearError, msalInstance } = useAuth();
  const [currentPage, setCurrentPage] = useState('landing');
  const [userInfo, setUserInfo] = useState(null);
  const [nativeAuthState, setNativeAuthState] = useState({
    attempted: false,
    loading: false,
    error: null
  });

  // Initialize native auth service when app starts
  useEffect(() => {
    console.log('[App] Initializing native auth service...');
    nativeAuthService.initialize();
  }, []);

  // Handle authentication based on platform
  useEffect(() => {
    const publicPages = ['terms', 'privacy', 'auth-error'];
    const authRequiredPages = ['landing', 'profile', 'plans', 'subscription', 'subscription-success', 'rewards', 'community'];
    const requiresAuth = authRequiredPages.includes(currentPage) || currentPage.startsWith('plan-dashboard/');
    
    // Skip auth logic if on public pages
    if (publicPages.includes(currentPage)) {
      return;
    }

    console.log('[App] Auth check - Platform:', Capacitor.getPlatform(), 'Native:', Capacitor.isNativePlatform());
    
    if (Capacitor.isNativePlatform()) {
      // **NATIVE PLATFORM - Use nativeAuthService**
      console.log('[App] Using native authentication...');
      
      const nativeIsAuth = nativeAuthService.isAuthenticated();
      const nativeUser = nativeAuthService.getCurrentUser();
      
      console.log('[App] Native auth status:', { nativeIsAuth, nativeUser });
      
      if (nativeIsAuth && nativeUser) {
        // User is authenticated via native auth
        if (!userInfo) {
          setUserInfo({
            displayName: nativeUser.name || nativeUser.displayName,
            email: nativeUser.username || nativeUser.email,
            firstName: nativeUser.name?.split(' ')[0] || nativeUser.displayName?.split(' ')[0],
            profilePictureUrl: null,
            subscriptionType: null
          });

          // Initialize device manager
          const userId = nativeUser.localAccountId || nativeUser.homeAccountId || 'test-user-123';
          deviceManager.initialize(userId, userInfo);
          
          // Auto-initialize HealthKit on iOS
          if (Capacitor.getPlatform() === 'ios') {
            setTimeout(async () => {
              console.log('[App] Checking Apple Health connection status...');
              const connectionStatus = deviceManager.getDeviceConnectionStatus('apple');
              
              if (!connectionStatus.connected) {
                console.log('[App] Apple Health not connected, waiting for user action...');
              } else {
                console.log('[App] Apple Health already connected');
              }
            }, 3000);
          }
        }
      } else if (requiresAuth && !nativeAuthState.attempted && !nativeAuthState.loading) {
        // Need to authenticate
        console.log('[App] Starting native authentication...');
        
        setNativeAuthState(prev => ({ ...prev, loading: true, attempted: true }));
        
        // Use bypass for now to test the flow
        setTimeout(async () => {
          try {
            await nativeAuthService.bypassLogin();
          } catch (error) {
            console.error('[App] Native auth error:', error);
            setNativeAuthState(prev => ({ 
              ...prev, 
              loading: false, 
              error: error.message,
              attempted: false 
            }));
          }
        }, 1000);
      }
    } else {
      // **WEB PLATFORM - Use existing MSAL**
      console.log('[App] Using web authentication...');
      
      if (msalInitialized && !isLoading && !isAuthenticated && !error && requiresAuth) {
        console.log('[App] Starting web authentication...');
        loginRedirect();
      }
      
      // Handle web user info
      if (isAuthenticated && user && !userInfo) {
        setUserInfo({
          displayName: user.name || user.displayName,
          email: user.username || user.email,
          firstName: user.name?.split(' ')[0] || user.displayName?.split(' ')[0],
          profilePictureUrl: null,
          subscriptionType: null
        });

        // Initialize device manager for web
        if (user.localAccountId || user.homeAccountId) {
          const userId = user.localAccountId || user.homeAccountId;
          deviceManager.initialize(userId, userInfo);
        }
      }
    }
  }, [currentPage, isAuthenticated, user, msalInitialized, isLoading, error, loginRedirect, nativeAuthState, userInfo]);

  // Handle MSAL redirect for web platforms only
  useEffect(() => {
    if (!Capacitor.isNativePlatform() && msalInstance && msalInitialized) {
      console.log('[App] Processing MSAL redirect for web...');
      
      msalInstance.handleRedirectPromise()
        .then((response) => {
          if (response) {
            console.log('[App] Web login successful:', response);
            msalInstance.setActiveAccount(response.account);
          }
        })
        .catch((error) => {
          console.error('[App] Web login error:', error);
        });
    }
  }, [msalInstance, msalInitialized]);

  // Check for page routes in URL
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
      setCurrentPage('subscription-success');
    } else if (path.startsWith('/plan-dashboard/')) {
      setCurrentPage(path.substring(1));
    }
  }, []);

  // Handle navigation
  const handleNavigate = (page) => {
    setCurrentPage(page);
    
    // Update URL for better UX (not on mobile to avoid navigation issues)
    if (!Capacitor.isNativePlatform()) {
      if (page === 'terms' || page === 'privacy' || page === 'auth-error') {
        window.history.pushState({}, '', `/${page}`);
      } else if (page === 'subscription-success') {
        window.history.pushState({}, '', `/subscription-success${window.location.search}`);
      } else if (page.startsWith('plan-dashboard/')) {
        window.history.pushState({}, '', `/${page}`);
      } else {
        window.history.pushState({}, '', '/');
      }
    }
  };

  // Handle back navigation for legal pages
  const handleBackNavigation = () => {
    const isAuth = Capacitor.isNativePlatform() 
      ? nativeAuthService.isAuthenticated() 
      : isAuthenticated;
      
    if (isAuth) {
      handleNavigate('landing');
    } else {
      // If not authenticated, trigger login
      if (Capacitor.isNativePlatform()) {
        setNativeAuthState(prev => ({ ...prev, attempted: false })); // Reset to trigger login again
      } else {
        window.location.href = '/';
      }
    }
  };

  // Expose services to window for debugging
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      window.deviceManager = deviceManager;
      window.nativeAuthService = nativeAuthService;
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

  // Show loading while initializing
  const isAuthLoading = Capacitor.isNativePlatform() 
    ? nativeAuthState.loading 
    : (!msalInitialized || isLoading);

  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-blue-600 rounded-full animate-spin"></div>
          <h2 className="mb-2 text-xl font-semibold text-gray-900">Loading MediCureOn</h2>
          <p className="text-gray-600">
            {Capacitor.isNativePlatform() ? 'Initializing app...' : 'Please wait while we authenticate you...'}
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  const authError = Capacitor.isNativePlatform() ? nativeAuthState.error : error;
  
  if (authError && !authError.includes('reply url') && !authError.includes('AADSTS50011')) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md p-6 text-center bg-white rounded-lg shadow-lg">
          <div className="mb-4 text-red-600">
            <svg className="w-12 h-12 mx-auto mb-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="mb-2 text-xl font-semibold">Authentication Error</h2>
            <p className="mb-4 text-sm text-gray-600">{authError}</p>
          </div>
          <button 
            onClick={() => {
              if (Capacitor.isNativePlatform()) {
                setNativeAuthState({ attempted: false, loading: false, error: null });
              } else {
                clearError();
                window.location.reload();
              }
            }} 
            className="w-full px-4 py-2 text-white transition bg-blue-600 rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Check if user is authenticated (platform-specific)
  const userAuthenticated = Capacitor.isNativePlatform() 
    ? nativeAuthService.isAuthenticated() 
    : isAuthenticated;
    
  const currentUser = Capacitor.isNativePlatform() 
    ? nativeAuthService.getCurrentUser() 
    : user;

  // Show app content only if authenticated
  if (userAuthenticated && currentUser) {
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

  // If we reach here, waiting for authentication
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="p-6 text-center">
        <style>
          {`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            .animate-spin {
              animation: spin 1s linear infinite;
            }
          `}
        </style>
        <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-blue-600 rounded-full animate-spin"></div>
        <h2 className="mb-2 text-xl font-semibold text-gray-900">
          {Capacitor.isNativePlatform() ? 'Preparing your account...' : 'Redirecting to login...'}
        </h2>
        <p className="mb-4 text-gray-600">
          {Capacitor.isNativePlatform() 
            ? 'Setting up your MediCureOn experience' 
            : 'You will be redirected to Microsoft login shortly'}
        </p>
        
        {/* Add retry button */}
        <button 
          onClick={() => {
            if (Capacitor.isNativePlatform()) {
              setNativeAuthState({ attempted: false, loading: false, error: null });
            } else {
              window.location.reload();
            }
          }}
          className="px-4 py-2 mr-2 text-white transition bg-blue-600 rounded hover:bg-blue-700"
        >
          Retry
        </button>
        
        {/* Debug info for development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="p-3 mt-4 text-sm text-left bg-gray-100 rounded">
            <div><strong>Platform:</strong> {Capacitor.getPlatform()}</div>
            <div><strong>Native:</strong> {String(Capacitor.isNativePlatform())}</div>
            <div><strong>Auth State:</strong> {JSON.stringify(nativeAuthState)}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;