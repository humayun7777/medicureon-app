// =============================================
// MSAL Configuration for MediCureOn
// Microsoft Entra External ID Configuration
// =============================================

import { LogLevel } from '@azure/msal-browser';

export const msalConfig = {
  auth: {
    clientId: "6e193dab-52c6-4dd6-95dd-abfb09d15d06",
    // Temporarily use the direct URL until SSL is ready
    authority: "https://medicureoniam.ciamlogin.com/36c237cc-ca3b-425e-aed5-437c41c4b892/",
    knownAuthorities: ["medicureoniam.ciamlogin.com", "login.medicureon.com", "login.microsoftonline.com"],
    redirectUri: process.env.REACT_APP_AUTH_REDIRECT_URI || "http://localhost:3000/",
    postLogoutRedirectUri: process.env.REACT_APP_AUTH_REDIRECT_URI || "http://localhost:3000/",
    navigateToLoginRequestUrl: true,
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
  },
};

// Login request configuration
export const loginRequest = {
  scopes: ["openid", "profile", "email"],
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