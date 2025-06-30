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
import { App as CapacitorApp } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import deviceManager from './services/deviceManager';

// Native authentication handler for mobile platforms
const nativeAuth = {
  isAuthenticating: false,
  
  async handleNativeLogin(msalConfig) {
    if (this.isAuthenticating) return;
    this.isAuthenticating = true;
    
    try {
      console.log('[NativeAuth] Starting login process...');
      console.log('[NativeAuth] Platform:', Capacitor.getPlatform());
      console.log('[NativeAuth] Is Native:', Capacitor.isNativePlatform());
      
      // Check if Browser plugin is available
      if (!Browser) {
        throw new Error('Browser plugin not available');
      }
      
      // Log MSAL config for debugging
      console.log('[NativeAuth] MSAL Config:', {
        clientId: msalConfig.auth.clientId,
        authority: msalConfig.auth.authority,
        redirectUri: msalConfig.auth.redirectUri
      });
      
      // Construct the login URL
      const params = new URLSearchParams({
        client_id: msalConfig.auth.clientId,
        redirect_uri: msalConfig.auth.redirectUri,
        response_type: 'code',
        scope: 'openid profile email',
        response_mode: 'query',
        prompt: 'select_account'
      });
      
      const loginUrl = `${msalConfig.auth.authority}/oauth2/v2.0/authorize?${params.toString()}`;
      
      console.log('[NativeAuth] Opening auth URL:', loginUrl);
      
      // Add timeout detection
      const browserTimeout = setTimeout(() => {
        console.error('[NativeAuth] Browser timeout - did not open');
        this.isAuthenticating = false;
        window.dispatchEvent(new CustomEvent('authError', { 
          detail: { error: 'Browser failed to open. Please try again.' } 
        }));
      }, 10000);
      
      // Open in-app browser
      await Browser.open({
        url: loginUrl,
        windowName: '_blank',
        presentationStyle: 'popover',
        toolbarColor: '#02276F'
      });
      
      clearTimeout(browserTimeout);
      console.log('[NativeAuth] Browser opened successfully');
      
    } catch (error) {
      console.error('[NativeAuth] Login error:', error);
      this.isAuthenticating = false;
      window.dispatchEvent(new CustomEvent('authError', { 
        detail: { error: error.message } 
      }));
    }
  },
  
  // Add bypass method for testing
  async bypassLogin() {
    console.log('[NativeAuth] Bypassing login for testing...');
    
    // Create mock user data
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
    
    // Store mock auth data
    localStorage.setItem('bypassAuth', 'true');
    localStorage.setItem('mockUser', JSON.stringify(mockUser));
    
    // Reload to process auth
    window.location.reload();
  }
};

// Handle app URL for authentication redirect on mobile
if (Capacitor.isNativePlatform()) {
  CapacitorApp.removeAllListeners('appUrlOpen');
  
  CapacitorApp.addListener('appUrlOpen', async (event) => {
    console.log('[App] App opened with URL:', event.url);
    
    if (event.url.includes('msauth.com.medicureon.app://auth')) {
      console.log('[App] Authentication callback received');
      
      // Close the browser
      try {
        await Browser.close();
      } catch (error) {
        console.log('[App] Browser might already be closed');
      }
      
      // Set flag to indicate auth callback received
      window.authCallbackReceived = true;
      nativeAuth.isAuthenticating = false;
      
      // Force reload to process the auth
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  });
}

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
  const { isAuthenticated, isLoading, msalInitialized, error, user, loginRedirect, clearError, msalInstance, msalConfig } = useAuth();
  const [currentPage, setCurrentPage] = useState('landing');
  const [userInfo, setUserInfo] = useState(null);
  const [nativeAuthAttempted, setNativeAuthAttempted] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Handle auth errors
  useEffect(() => {
    const handleAuthError = (event) => {
      console.error('[App] Auth error received:', event.detail);
      setAuthError(event.detail.error);
      setNativeAuthAttempted(false);
    };
    
    window.addEventListener('authError', handleAuthError);
    
    return () => {
      window.removeEventListener('authError', handleAuthError);
    };
  }, []);

  // Handle MSAL redirect for all platforms
  useEffect(() => {
    if (msalInstance && msalInitialized) {
      console.log('[App] Processing MSAL redirect...');
      
      msalInstance.handleRedirectPromise()
        .then((response) => {
          if (response) {
            console.log('[App] Login successful:', response);
            msalInstance.setActiveAccount(response.account);
            
            // Clear native auth flag
            setNativeAuthAttempted(false);
            window.authCallbackReceived = false;
          }
        })
        .catch((error) => {
          console.error('[App] Login error:', error);
          
          // Handle specific errors
          if (error.errorCode === 'AADSTS50011' || error.errorMessage?.includes('reply url')) {
            console.log('[App] Redirect URI mismatch - this is expected on native platforms');
            // Don't treat this as a fatal error on native platforms
            if (!Capacitor.isNativePlatform()) {
              clearError();
            }
          }
        });
    }
  }, [msalInstance, msalInitialized]);

  // Fetch user info when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      // Set user info from auth context
      setUserInfo({
        displayName: user.name || user.displayName,
        email: user.username || user.email,
        firstName: user.name?.split(' ')[0] || user.displayName?.split(' ')[0],
        profilePictureUrl: null,
        subscriptionType: null
      });

      // Initialize device manager when user is authenticated
      if (user.localAccountId || user.homeAccountId) {
        const userId = user.localAccountId || user.homeAccountId;
        deviceManager.initialize(userId, userInfo);
        
        // Auto-initialize HealthKit on iOS
        if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios') {
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
    }
  }, [isAuthenticated, user]);

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

  // Handle authentication flow
  useEffect(() => {
    const publicPages = ['terms', 'privacy', 'auth-error'];
    const authRequiredPages = ['landing', 'profile', 'plans', 'subscription', 'subscription-success', 'rewards', 'community'];
    const requiresAuth = authRequiredPages.includes(currentPage) || currentPage.startsWith('plan-dashboard/');
    
    if (msalInitialized && !isLoading && !isAuthenticated && !error && requiresAuth && !nativeAuthAttempted) {
      console.log('[App] User not authenticated, need to login...');
      console.log('[App] Platform:', Capacitor.getPlatform());
      console.log('[App] Is Native:', Capacitor.isNativePlatform());
      
      if (Capacitor.isNativePlatform()) {
        // For native platforms, use custom login flow
        console.log('[App] Using native authentication flow...');
        setNativeAuthAttempted(true);
        
        // Small delay to ensure everything is initialized
        setTimeout(async () => {
          if (msalConfig) {
            await nativeAuth.handleNativeLogin(msalConfig);
          } else {
            console.error('[App] MSAL config not available');
          }
        }, 1000);
      } else {
        // For web, use standard MSAL redirect
        console.log('[App] Using standard web authentication flow...');
        loginRedirect();
      }
    }
  }, [msalInitialized, isLoading, isAuthenticated, error, loginRedirect, currentPage, nativeAuthAttempted, msalConfig]);

  // Log authentication state
  useEffect(() => {
    console.log('[App] Auth State:', { 
      isAuthenticated, 
      isLoading, 
      msalInitialized,
      hasUser: !!user,
      currentPage,
      platform: Capacitor.getPlatform(),
      isNative: Capacitor.isNativePlatform(),
      nativeAuthAttempted
    });
  }, [isAuthenticated, isLoading, msalInitialized, user, currentPage, nativeAuthAttempted]);

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
    if (isAuthenticated) {
      handleNavigate('landing');
    } else {
      // If not authenticated, trigger login
      if (Capacitor.isNativePlatform()) {
        setNativeAuthAttempted(false); // Reset to trigger login again
      } else {
        window.location.href = '/';
      }
    }
  };

  // Expose device manager to window for debugging
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      window.deviceManager = deviceManager;
      window.nativeAuth = nativeAuth;
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
          <p className="text-gray-600">
            {Capacitor.isNativePlatform() ? 'Initializing app...' : 'Please wait while we authenticate you...'}
          </p>
        </div>
      </div>
    );
  }

  // Show error state (but not for expected native platform errors)
  if (error && !error.includes('reply url') && !error.includes('AADSTS50011')) {
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
              setNativeAuthAttempted(false);
              if (Capacitor.isNativePlatform()) {
                // Try native auth again
                setTimeout(() => {
                  nativeAuth.handleNativeLogin(msalConfig);
                }, 500);
              } else {
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
          {Capacitor.isNativePlatform() ? 'Launching authentication...' : 'Redirecting to login...'}
        </h2>
        <p className="mb-4 text-gray-600">
          {Capacitor.isNativePlatform() 
            ? 'Please complete authentication in the browser' 
            : 'You will be redirected to Microsoft login shortly'}
        </p>
        
        {authError && (
          <div className="p-3 mb-4 text-red-700 bg-red-100 rounded">
            {authError}
          </div>
        )}
        
        {/* Add retry button */}
        <button 
          onClick={() => {
            setNativeAuthAttempted(false);
            setAuthError(null);
            window.location.reload();
          }}
          className="px-4 py-2 mr-2 text-white transition bg-blue-600 rounded hover:bg-blue-700"
        >
          Retry
        </button>
        
        {/* Add bypass button for testing */}
        {Capacitor.isNativePlatform() && (
          <button 
            onClick={() => {
              nativeAuth.bypassLogin();
            }}
            className="px-4 py-2 text-white transition bg-gray-600 rounded hover:bg-gray-700"
          >
            Skip Auth (Dev Only)
          </button>
        )}
      </div>
    </div>
  );
}

export default App;