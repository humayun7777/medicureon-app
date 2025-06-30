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
  const [appReady, setAppReady] = useState(false);
  const [debugInfo, setDebugInfo] = useState('Starting app...');

  // Simple initialization for native platforms
  useEffect(() => {
    console.log('[App] Starting initialization...');
    setDebugInfo('Checking platform...');
    
    if (Capacitor.isNativePlatform()) {
      console.log('[App] Native platform detected');
      setDebugInfo('Native platform detected');
      
      // Initialize native auth service
      nativeAuthService.initialize();
      
      // Simple auth setup with delay
      setTimeout(() => {
        console.log('[App] Setting up mock user...');
        setDebugInfo('Setting up user account...');
        
        // Create mock user
        const mockUser = {
          localAccountId: 'test-user-123',
          homeAccountId: 'test-user-123',
          name: 'Test User',
          username: 'test@medicureon.com',
          email: 'test@medicureon.com',
          displayName: 'Test User',
          idTokenClaims: {
            name: 'Test User',
            email: 'test@medicureon.com',
            given_name: 'Test',
            family_name: 'User',
            oid: 'test-oid-123',
            sub: 'test-sub-123'
          }
        };
        
        // Store auth data
        localStorage.setItem('bypassAuth', 'true');
        localStorage.setItem('mockUser', JSON.stringify(mockUser));
        localStorage.setItem('currentUser', JSON.stringify(mockUser));
        
        // Set user info for the app
        setUserInfo({
          displayName: mockUser.name,
          email: mockUser.email,
          firstName: 'Test',
          profilePictureUrl: null,
          subscriptionType: null
        });
        
        setDebugInfo('User account ready');
        
        // Initialize device manager
        setTimeout(() => {
          console.log('[App] Initializing device manager...');
          setDebugInfo('Initializing health devices...');
          
          deviceManager.initialize(mockUser.localAccountId, mockUser);
          
          setDebugInfo('App ready!');
          setAppReady(true);
          
          // Initialize Apple Health after a delay
          if (Capacitor.getPlatform() === 'ios') {
            setTimeout(() => {
              console.log('[App] Checking Apple Health status...');
              const connectionStatus = deviceManager.getDeviceConnectionStatus('apple');
              console.log('[App] Apple Health status:', connectionStatus);
            }, 3000);
          }
          
        }, 1000);
        
      }, 2000);
      
    } else {
      // Web platform - use existing MSAL auth
      console.log('[App] Web platform - using MSAL');
      setDebugInfo('Web platform - waiting for MSAL...');
      
      if (msalInitialized && !isLoading) {
        if (isAuthenticated && user) {
          setUserInfo({
            displayName: user.name || user.displayName,
            email: user.username || user.email,
            firstName: user.name?.split(' ')[0] || 'User',
            profilePictureUrl: null,
            subscriptionType: null
          });
          setAppReady(true);
          setDebugInfo('Web auth complete');
        } else if (!error) {
          setDebugInfo('Starting web login...');
          loginRedirect();
        }
      }
    }
  }, [msalInitialized, isLoading, isAuthenticated, user, error, loginRedirect]);

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
      ? appReady 
      : isAuthenticated;
      
    if (isAuth) {
      handleNavigate('landing');
    } else {
      window.location.href = '/';
    }
  };

  // Expose services to window for debugging
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      window.deviceManager = deviceManager;
      window.nativeAuthService = nativeAuthService;
      window.appDebug = {
        platform: Capacitor.getPlatform(),
        isNative: Capacitor.isNativePlatform(),
        appReady,
        userInfo,
        debugInfo
      };
    }
  }, [appReady, userInfo, debugInfo]);

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
  const shouldShowLoading = Capacitor.isNativePlatform() 
    ? !appReady 
    : (!msalInitialized || isLoading || (!isAuthenticated && !error));

  if (shouldShowLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md p-6 mx-auto text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-blue-600 rounded-full animate-spin"></div>
          <h2 className="mb-2 text-xl font-semibold text-gray-900">Loading MediCureOn</h2>
          <p className="mb-4 text-gray-600">
            {Capacitor.isNativePlatform() ? 'Initializing app...' : 'Please wait while we authenticate you...'}
          </p>
          
          {/* Debug information - visible on screen */}
          <div className="p-3 mt-4 text-sm border border-blue-200 rounded-lg bg-blue-50">
            <div className="mb-2 font-semibold text-blue-800">Status:</div>
            <div className="text-blue-700">{debugInfo}</div>
            <div className="mt-2 text-xs text-blue-600">
              Platform: {Capacitor.getPlatform()} | Native: {String(Capacitor.isNativePlatform())}
            </div>
          </div>
          
          {/* Emergency reload button */}
          <button 
            onClick={() => {
              console.log('[App] Emergency reload triggered');
              window.location.reload();
            }}
            className="px-4 py-2 mt-4 text-white transition bg-gray-600 rounded hover:bg-gray-700"
          >
            Restart App
          </button>
        </div>
      </div>
    );
  }

  // Show error state
  const authError = Capacitor.isNativePlatform() ? null : error;
  
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

  // Check if user is authenticated (platform-specific)
  const userAuthenticated = Capacitor.isNativePlatform() 
    ? appReady && userInfo
    : isAuthenticated && user;

  // Show app content only if authenticated
  if (userAuthenticated) {
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

  // Fallback loading state
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="p-6 text-center">
        <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-blue-600 rounded-full animate-spin"></div>
        <h2 className="mb-2 text-xl font-semibold text-gray-900">
          Preparing MediCureOn...
        </h2>
        <p className="mb-4 text-gray-600">
          Almost ready!
        </p>
        
        {/* Debug info */}
        <div className="p-3 mt-4 text-sm bg-gray-100 rounded">
          <div>Debug: {debugInfo}</div>
          <div>Platform: {Capacitor.getPlatform()}</div>
          <div>App Ready: {String(appReady)}</div>
          <div>User Info: {userInfo ? 'Set' : 'Not set'}</div>
        </div>
      </div>
    </div>
  );
}

export default App;