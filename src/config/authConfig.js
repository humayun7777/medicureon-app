// =============================================
// MSAL Configuration for MediCureOn
// Microsoft Entra External ID Configuration
// =============================================

import { LogLevel } from '@azure/msal-browser';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';

// Function to determine redirect URI based on platform
const getRedirectUri = () => {
  const platform = Capacitor.getPlatform();
  
  if (platform === 'ios' || platform === 'android') {
    return "msauth.com.medicureon.app://auth";
  } else if (platform === 'web' && window.location.hostname === 'localhost') {
    return "http://localhost:3000/";
  } else {
    return window.location.origin + "/";
  }
};

// Handle app URL for authentication redirect on mobile
if (Capacitor.isNativePlatform()) {
  App.addListener('appUrlOpen', (event) => {
    console.log('App opened with URL:', event.url);
    // Handle the authentication callback
    if (event.url.includes('msauth.com.medicureon.app://auth')) {
      // The MSAL library should handle this automatically
      console.log('Authentication callback received');
    }
  });
}

export const msalConfig = {
  auth: {
    clientId: "6e193dab-52c6-4dd6-95dd-abfb09d15d06",
    authority: "https://medicureoniam.ciamlogin.com/36c237cc-ca3b-425e-aed5-437c41c4b892/",
    knownAuthorities: ["medicureoniam.ciamlogin.com", "login.medicureon.com", "login.microsoftonline.com"],
    redirectUri: getRedirectUri(),
    postLogoutRedirectUri: getRedirectUri(),
    navigateToLoginRequestUrl: false, // Changed to false for mobile
    validateAuthority: false,
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error('MSAL Error:', message);
            return;
          case LogLevel.Info:
            console.info('MSAL Info:', message);
            return;
          case LogLevel.Verbose:
            console.debug('MSAL Verbose:', message);
            return;
          case LogLevel.Warning:
            console.warn('MSAL Warning:', message);
            return;
          default:
            return;
        }
      },
      logLevel: process.env.NODE_ENV === 'development' ? LogLevel.Verbose : LogLevel.Info,
    },
    allowNativeBroker: false,
    windowHashTimeout: 60000,
    iframeHashTimeout: 6000,
    loadFrameTimeout: 6000,
    // Add this for mobile
    redirectNavigationTimeout: 10000,
  },
};

// Login request configuration
export const loginRequest = {
  scopes: ["openid", "profile", "email"],
  prompt: "select_account", // Add this to avoid token issues
};

// External ID specific configuration
export const externalIdConfig = {
  tenantId: "36c237cc-ca3b-425e-aed5-437c41c4b892",
  tenantName: "medicureoniam",
  domain: "medicureoniam.ciamlogin.com",
  customDomain: "login.medicureon.com",
  
  customAttributes: {
    // Example: extension_appId_customAttribute
  }
};

// API configuration for calling your backend
export const apiConfig = {
  b2cScopes: ["https://medicureoniam.onmicrosoft.com/api/access_as_user"],
  apiEndpoint: process.env.REACT_APP_API_URL || "http://localhost:7071/api"
};

// Helper function to get access token
export const getAccessToken = async (msalInstance, account) => {
  const request = {
    scopes: apiConfig.b2cScopes,
    account: account
  };
  
  try {
    const response = await msalInstance.acquireTokenSilent(request);
    return response.accessToken;
  } catch (error) {
    if (error.name === "InteractionRequiredAuthError") {
      const response = await msalInstance.acquireTokenPopup(request);
      return response.accessToken;
    }
    throw error;
  }
};

// Debug logging for platform detection
console.log('MSAL Config - Platform:', Capacitor.getPlatform());
console.log('MSAL Config - Is Native:', Capacitor.isNativePlatform());
console.log('MSAL Config - Redirect URI:', getRedirectUri());