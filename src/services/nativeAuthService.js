// nativeAuthService.js
// Enterprise-grade native authentication handler for MediCureOn

import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import { App } from '@capacitor/app';

class NativeAuthService {
  constructor() {
    this.authConfig = {
      clientId: "6e193dab-52c6-4dd6-95dd-abfb09d15d06",
      authority: "https://medicureoniam.ciamlogin.com/36c237cc-ca3b-425e-aed5-437c41c4b892",
      redirectUri: "msauth.com.medicureon.app://auth",
      scope: "openid profile email"
    };
    
    this.isAuthenticating = false;
    this.authListenerRegistered = false;
  }

  // Initialize the service
  async initialize() {
    if (Capacitor.isNativePlatform() && !this.authListenerRegistered) {
      this.registerAuthListener();
      this.authListenerRegistered = true;
    }
  }

  // Register deep link listener
  registerAuthListener() {
    App.removeAllListeners('appUrlOpen');
    
    App.addListener('appUrlOpen', async (event) => {
      console.log('App opened with URL:', event.url);
      
      if (event.url.includes('msauth.com.medicureon.app://auth')) {
        console.log('Auth callback received');
        
        // Close the browser
        try {
          await Browser.close();
        } catch (error) {
          console.log('Browser close error (might be already closed):', error);
        }
        
        // Parse the auth response
        const authResponse = this.parseAuthResponse(event.url);
        
        if (authResponse.code) {
          // Exchange code for token
          await this.exchangeCodeForToken(authResponse.code);
        } else if (authResponse.error) {
          console.error('Auth error:', authResponse.error);
          this.handleAuthError(authResponse.error);
        }
      }
    });
  }

  // Initiate native login
  async login() {
    if (this.isAuthenticating) {
      console.log('Authentication already in progress');
      return;
    }

    this.isAuthenticating = true;

    try {
      // Construct the auth URL
      const authUrl = this.constructAuthUrl();
      
      console.log('Opening auth URL:', authUrl);
      
      // Open in-app browser
      await Browser.open({
        url: authUrl,
        windowName: '_self',
        presentationStyle: 'popover',
        toolbarColor: '#02276F'
      });
      
      // The appUrlOpen listener will handle the callback
      
    } catch (error) {
      console.error('Login error:', error);
      this.isAuthenticating = false;
      throw error;
    }
  }

  // Construct the authorization URL
  constructAuthUrl() {
    const params = new URLSearchParams({
      client_id: this.authConfig.clientId,
      redirect_uri: this.authConfig.redirectUri,
      response_type: 'code',
      scope: this.authConfig.scope,
      response_mode: 'query',
      prompt: 'select_account',
      code_challenge_method: 'S256',
      code_challenge: this.generateCodeChallenge()
    });

    return `${this.authConfig.authority}/oauth2/v2.0/authorize?${params.toString()}`;
  }

  // Generate PKCE code challenge
  generateCodeChallenge() {
    // For production, implement proper PKCE
    // This is a simplified version
    const verifier = this.generateRandomString(128);
    localStorage.setItem('auth_code_verifier', verifier);
    // In production, hash this with SHA256
    return verifier;
  }

  generateRandomString(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Parse the auth response from the URL
  parseAuthResponse(url) {
    const urlParts = url.split('?');
    if (urlParts.length < 2) return {};
    
    const params = new URLSearchParams(urlParts[1]);
    return {
      code: params.get('code'),
      state: params.get('state'),
      error: params.get('error'),
      error_description: params.get('error_description')
    };
  }

  // Exchange authorization code for tokens
  async exchangeCodeForToken(code) {
    try {
      const codeVerifier = localStorage.getItem('auth_code_verifier');
      
      const response = await fetch(`${this.authConfig.authority}/oauth2/v2.0/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          client_id: this.authConfig.clientId,
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: this.authConfig.redirectUri,
          code_verifier: codeVerifier
        })
      });

      if (!response.ok) {
        throw new Error('Token exchange failed');
      }

      const tokens = await response.json();
      
      // Store tokens securely
      await this.storeTokens(tokens);
      
      // Notify the app
      window.dispatchEvent(new CustomEvent('authCompleted', { 
        detail: { tokens, success: true } 
      }));
      
      this.isAuthenticating = false;
      
      // Reload the app to process the new auth state
      window.location.reload();
      
    } catch (error) {
      console.error('Token exchange error:', error);
      this.handleAuthError(error.message);
    }
  }

  // Store tokens securely
  async storeTokens(tokens) {
    // For production, use secure storage
    // This is a simplified version
    localStorage.setItem('auth_tokens', JSON.stringify(tokens));
    localStorage.setItem('auth_token_timestamp', Date.now().toString());
  }

  // Handle auth errors
  handleAuthError(error) {
    this.isAuthenticating = false;
    
    window.dispatchEvent(new CustomEvent('authCompleted', { 
      detail: { error, success: false } 
    }));
    
    // Clear any stored verifiers
    localStorage.removeItem('auth_code_verifier');
  }

  // Logout
  async logout() {
    // Clear stored tokens
    localStorage.removeItem('auth_tokens');
    localStorage.removeItem('auth_token_timestamp');
    localStorage.removeItem('auth_code_verifier');
    
    // Construct logout URL
    const logoutUrl = `${this.authConfig.authority}/oauth2/v2.0/logout`;
    
    // Open logout URL
    await Browser.open({ url: logoutUrl });
  }

  // Check if user is authenticated
  isAuthenticated() {
    const tokens = localStorage.getItem('auth_tokens');
    const timestamp = localStorage.getItem('auth_token_timestamp');
    
    if (!tokens || !timestamp) return false;
    
    // Check if tokens are expired (simplified check)
    const tokenAge = Date.now() - parseInt(timestamp);
    const oneHour = 60 * 60 * 1000;
    
    return tokenAge < oneHour;
  }

  // Get current user info from token
  getCurrentUser() {
    const tokens = localStorage.getItem('auth_tokens');
    if (!tokens) return null;
    
    try {
      const { id_token } = JSON.parse(tokens);
      // Decode JWT (simplified - use proper JWT library in production)
      const payload = JSON.parse(atob(id_token.split('.')[1]));
      
      return {
        localAccountId: payload.sub,
        name: payload.name,
        email: payload.email || payload.preferred_username,
        displayName: payload.name
      };
    } catch (error) {
      console.error('Error parsing user info:', error);
      return null;
    }
  }
}

const nativeAuthService = new NativeAuthService();
export default nativeAuthService;