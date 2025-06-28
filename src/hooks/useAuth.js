// src/hooks/useAuth.js
import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { 
  PublicClientApplication,
  InteractionRequiredAuthError,
  BrowserAuthError
} from '@azure/msal-browser';
import { msalConfig, loginRequest } from '../config/authConfig';

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

  const handleRedirectPromise = async () => {
    try {
      console.log('Handling redirect promise...');
      
      // Handle the redirect response
      const response = await msalInstance.handleRedirectPromise();
      console.log('Redirect response:', response);
      
      if (response && response.account) {
        // User just logged in via redirect
        console.log('Login successful via redirect');
        setUser(response.account);
        setIsAuthenticated(true);
        
        // Clear any hash fragments from the URL
        if (window.location.hash) {
          window.history.replaceState(null, '', window.location.pathname);
        }
      } else {
        // No redirect response, check for existing session
        console.log('No redirect response, checking existing accounts...');
        const accounts = msalInstance.getAllAccounts();
        console.log('Found accounts:', accounts.length);
        
        if (accounts.length > 0) {
          // User is already logged in
          const account = accounts[0];
          setUser(account);
          setIsAuthenticated(true);
          console.log('User already authenticated:', account.username);
        } else {
          console.log('No authenticated user found');
          setIsAuthenticated(false);
        }
      }
    } catch (error) {
      console.error('Error handling redirect:', error);
      // Don't set error for common redirect handling issues
      if (!error.message.includes('interaction_in_progress')) {
        setError(`Authentication error: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const initializeMsal = useCallback(async () => {
    try {
      console.log('Initializing MSAL...');
      
      // Initialize MSAL
      await msalInstance.initialize();
      console.log('MSAL initialized successfully');
      setMsalInitialized(true);
      
      // Handle redirect after initialization
      await handleRedirectPromise();
    } catch (error) {
      console.error('Error initializing MSAL:', error);
      setError(`MSAL initialization failed: ${error.message}`);
      setIsLoading(false);
    }
  }, []); // Empty dependency array since handleRedirectPromise is defined inside

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
        console.log('User already logged in');
        setUser(accounts[0]);
        setIsAuthenticated(true);
        setIsLoading(false);
        return accounts[0];
      }
      
      console.log('Initiating login popup...');
      const response = await msalInstance.loginPopup(loginRequest);
      
      console.log('Login successful:', response);
      setUser(response.account);
      setIsAuthenticated(true);
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
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
      console.error('MSAL not initialized yet');
      return;
    }

    try {
      setError(null);
      
      // Check if already logged in
      const accounts = msalInstance.getAllAccounts();
      if (accounts.length > 0) {
        console.log('User already logged in, no redirect needed');
        setUser(accounts[0]);
        setIsAuthenticated(true);
        return;
      }
      
      console.log('Initiating login redirect...');
      await msalInstance.loginRedirect(loginRequest);
      
    } catch (error) {
      console.error('Login redirect error:', error);
      
      if (error.errorCode === 'interaction_in_progress') {
        console.log('Interaction already in progress');
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
      
      const logoutRequest = {
        account: user,
        postLogoutRedirectUri: msalConfig.auth.postLogoutRedirectUri,
      };
      
      console.log('Logging out...');
      await msalInstance.logoutRedirect(logoutRequest);
    } catch (error) {
      console.error('Logout error:', error);
      setError(`Logout failed: ${error.message}`);
      setIsLoading(false);
    }
  };

  const getAccessToken = async (scopes = loginRequest.scopes) => {
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
    console.log('ID Token Claims:', user.idTokenClaims);
    
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