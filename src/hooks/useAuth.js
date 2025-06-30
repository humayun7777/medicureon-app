// src/hooks/useAuth.js
import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { 
  PublicClientApplication,
  InteractionRequiredAuthError,
  BrowserAuthError
} from '@azure/msal-browser';
import { msalConfig, loginRequest } from '../config/authConfig';
import { Capacitor } from '@capacitor/core';

// Create MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

// Create auth context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [msalInitialized, setMsalInitialized] = useState(false);

  // Check for bypass auth (dev only)
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      const bypassAuth = localStorage.getItem('bypassAuth');
      const mockUser = localStorage.getItem('mockUser');
      
      if (bypassAuth === 'true' && mockUser) {
        console.log('[Auth] Using bypass authentication');
        try {
          const parsedUser = JSON.parse(mockUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
          setIsLoading(false);
          setMsalInitialized(true);
          
          // Clear bypass flag after use
          localStorage.removeItem('bypassAuth');
        } catch (err) {
          console.error('[Auth] Error parsing mock user:', err);
        }
      }
    }
  }, []);


  const initializeMsal = useCallback(async () => {
  try {
    // Check if already initialized via bypass
    if (msalInitialized && isAuthenticated) {
      console.log('[Auth] Already initialized via bypass');
      return;
    }
    
    console.log('[Auth] Initializing MSAL...');
    
    // Initialize MSAL
    await msalInstance.initialize();
    console.log('[Auth] MSAL initialized successfully');
    setMsalInitialized(true);
    
    // Handle redirect promise inline
    try {
      console.log('[Auth] Handling redirect promise...');
      
      // Skip redirect handling if already authenticated via bypass
      if (isAuthenticated && user) {
        console.log('[Auth] Already authenticated via bypass');
        setIsLoading(false);
        return;
      }
      
      // Handle the redirect response
      const response = await msalInstance.handleRedirectPromise();
      console.log('[Auth] Redirect response:', response);
      
      if (response && response.account) {
        // User just logged in via redirect
        console.log('[Auth] Login successful via redirect');
        setUser(response.account);
        setIsAuthenticated(true);
        
        // Clear any hash fragments from the URL
        if (window.location.hash) {
          window.history.replaceState(null, '', window.location.pathname);
        }
      } else {
        // No redirect response, check for existing session
        console.log('[Auth] No redirect response, checking existing accounts...');
        const accounts = msalInstance.getAllAccounts();
        console.log('[Auth] Found accounts:', accounts.length);
        
        if (accounts.length > 0) {
          // User is already logged in
          const account = accounts[0];
          setUser(account);
          setIsAuthenticated(true);
          console.log('[Auth] User already authenticated:', account.username);
        } else {
          console.log('[Auth] No authenticated user found');
          setIsAuthenticated(false);
        }
      }
    } catch (error) {
      console.error('[Auth] Error handling redirect:', error);
      // Don't set error for common redirect handling issues
      if (!error.message.includes('interaction_in_progress')) {
        setError(`Authentication error: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
    
  } catch (error) {
    console.error('[Auth] Error initializing MSAL:', error);
    setError(`MSAL initialization failed: ${error.message}`);
    setIsLoading(false);
  }
}, [msalInitialized, isAuthenticated, user]); // Added user to dependencies

  useEffect(() => {
    initializeMsal();
  }, [initializeMsal]);

  const handleLogin = async () => {
    if (!msalInitialized) {
      setError('MSAL not initialized yet');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Check if already logged in
      const accounts = msalInstance.getAllAccounts();
      if (accounts.length > 0) {
        console.log('[Auth] User already logged in');
        setUser(accounts[0]);
        setIsAuthenticated(true);
        setIsLoading(false);
        return accounts[0];
      }
      
      console.log('[Auth] Initiating login popup...');
      const response = await msalInstance.loginPopup(loginRequest);
      
      console.log('[Auth] Login successful:', response);
      setUser(response.account);
      setIsAuthenticated(true);
      
      return response;
    } catch (error) {
      console.error('[Auth] Login error:', error);
      if (error instanceof BrowserAuthError) {
        setError('Login was cancelled or failed. Please try again.');
      } else {
        setError(`Login failed: ${error.message}`);
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginRedirect = async () => {
    if (!msalInitialized) {
      console.error('[Auth] MSAL not initialized yet');
      return;
    }

    try {
      setError(null);
      
      // Check if already logged in
      const accounts = msalInstance.getAllAccounts();
      if (accounts.length > 0) {
        console.log('[Auth] User already logged in, no redirect needed');
        setUser(accounts[0]);
        setIsAuthenticated(true);
        return;
      }
      
      console.log('[Auth] Initiating login redirect...');
      await msalInstance.loginRedirect(loginRequest);
      
    } catch (error) {
      console.error('[Auth] Login redirect error:', error);
      
      if (error.errorCode === 'interaction_in_progress') {
        console.log('[Auth] Interaction already in progress');
        // Don't show error for this
      } else {
        setError(`Login redirect failed: ${error.message}`);
      }
    }
  };

  const handleLogout = async () => {
    if (!msalInitialized) {
      return;
    }

    try {
      setIsLoading(true);
      
      // Clear bypass auth if present
      localStorage.removeItem('bypassAuth');
      localStorage.removeItem('mockUser');
      
      const logoutRequest = {
        account: user,
        postLogoutRedirectUri: msalConfig.auth.postLogoutRedirectUri,
      };
      
      console.log('[Auth] Logging out...');
      await msalInstance.logoutRedirect(logoutRequest);
    } catch (error) {
      console.error('[Auth] Logout error:', error);
      setError(`Logout failed: ${error.message}`);
      setIsLoading(false);
    }
  };

  const getAccessToken = async (scopes = loginRequest.scopes) => {
    // For bypass auth, return mock token
    if (user && user.localAccountId === 'test-user-123') {
      return 'mock-access-token';
    }
    
    if (!msalInitialized || !user) {
      throw new Error('User not authenticated');
    }

    try {
      const response = await msalInstance.acquireTokenSilent({
        scopes,
        account: user,
      });
      return response.accessToken;
    } catch (error) {
      if (error instanceof InteractionRequiredAuthError) {
        const response = await msalInstance.acquireTokenPopup({
          scopes,
          account: user,
        });
        return response.accessToken;
      }
      throw error;
    }
  };

  const getUserInfo = () => {
    if (!user) return null;
    
    // Log all claims to see what's available
    console.log('[Auth] ID Token Claims:', user.idTokenClaims);
    
    return {
      id: user.localAccountId || user.homeAccountId,
      name: user.name || user.idTokenClaims?.name,
      email: user.username || user.idTokenClaims?.email || user.idTokenClaims?.emails?.[0],
      firstName: user.idTokenClaims?.given_name,
      lastName: user.idTokenClaims?.family_name,
      displayName: user.idTokenClaims?.name || user.name,
      // External ID specific claims
      oid: user.idTokenClaims?.oid,
      sub: user.idTokenClaims?.sub,
      // Add any custom claims from your External ID
      customClaims: user.idTokenClaims,
      // Profile picture URL if available
      profilePictureUrl: user.idTokenClaims?.picture
    };
  };

  const value = {
    user,
    userInfo: getUserInfo(),
    isAuthenticated,
    isLoading,
    error,
    msalInitialized,
    login: handleLogin,
    loginRedirect: handleLoginRedirect,
    logout: handleLogout,
    getAccessToken,
    clearError: () => setError(null),
    msalInstance,
    msalConfig, // Export msalConfig for native auth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { msalInstance };