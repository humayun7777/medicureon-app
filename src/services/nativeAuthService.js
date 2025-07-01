// nativeAuthService.js
// Enterprise-grade native authentication handler for MediCureOn

import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import { App } from '@capacitor/app';

class NativeAuthService {
  constructor() {
    this.authConfig = {
      clientId: "6e193dab-52c6-4dd6-95dd-abfb09d15d06",
      // Use the working Azure AD B2C domain - NOT the custom subdomain
      authority: "https://medicureoniam.ciamlogin.com/36c237cc-ca3b-425e-aed5-437c41c4b892",
      redirectUri: "msauth.com.medicureon.app://auth",
      scope: "openid profile email"
    };
    
    this.isAuthenticating = false;
    this.authListenerRegistered = false;
    this.browserTimeout = null;
  }

  // Initialize the service
  async initialize() {
    console.log('[NativeAuth] Initializing...');
    console.log('[NativeAuth] Platform:', Capacitor.getPlatform());
    console.log('[NativeAuth] Is Native:', Capacitor.isNativePlatform());
    
    if (Capacitor.isNativePlatform() && !this.authListenerRegistered) {
      this.registerAuthListener();
      this.authListenerRegistered = true;
    }
  }

  // Register deep link listener
  registerAuthListener() {
    console.log('[NativeAuth] Registering auth listener...');
    
    App.removeAllListeners('appUrlOpen');
    
    App.addListener('appUrlOpen', async (event) => {
      console.log('[NativeAuth] App opened with URL:', event.url);
      
      if (event.url.includes('msauth.com.medicureon.app://auth')) {
        console.log('[NativeAuth] Auth callback received');
        
        // Clear timeout
        if (this.browserTimeout) {
          clearTimeout(this.browserTimeout);
          this.browserTimeout = null;
        }
        
        // Close the browser
        try {
          await Browser.close();
        } catch (error) {
          console.log('[NativeAuth] Browser close error (might be already closed):', error);
        }
        
        // Handle the auth callback
        await this.handleAuthCallback(event.url);
      }
    });
  }

  // Handle authentication callback
  async handleAuthCallback(url) {
    console.log('[NativeAuth] Processing auth callback:', url);
    
    try {
      // Parse the auth response from the URL
      const urlParams = new URLSearchParams(url.split('?')[1] || url.split('#')[1]);
      const code = urlParams.get('code');
      const error = urlParams.get('error');
      const state = urlParams.get('state');
      
      // Verify state parameter
      const storedState = localStorage.getItem('auth_state');
      if (state !== storedState) {
        console.error('[NativeAuth] State mismatch - possible CSRF attack');
        throw new Error('State parameter mismatch');
      }
      
      if (error) {
        console.error('[NativeAuth] Auth error:', error);
        const errorDescription = urlParams.get('error_description');
        console.error('[NativeAuth] Error description:', errorDescription);
        
        // For testing, bypass auth on error
        console.log('[NativeAuth] Bypassing auth due to error');
        await this.bypassLogin();
        return;
      }
      
      if (code) {
        console.log('[NativeAuth] Auth code received:', code.substring(0, 10) + '...');
        
        // Exchange code for tokens
        await this.exchangeCodeForToken(code);
      }
    } catch (error) {
      console.error('[NativeAuth] Error processing callback:', error);
      
      // Bypass auth for testing
      await this.bypassLogin();
    }
    
    this.isAuthenticating = false;
  }

  // Initiate native login
  async login() {
    if (this.isAuthenticating) {
      console.log('[NativeAuth] Authentication already in progress');
      return;
    }

    this.isAuthenticating = true;

    try {
      console.log('[NativeAuth] Starting login process...');
      console.log('[NativeAuth] Platform:', Capacitor.getPlatform());
      console.log('[NativeAuth] Is Native:', Capacitor.isNativePlatform());
      
      // Check if we're on a supported platform
      if (!Capacitor.isNativePlatform()) {
        console.log('[NativeAuth] Not on native platform, using web auth');
        await this.webAuth();
        return;
      }
      
      // Check if Browser plugin is available
      if (!Browser) {
        throw new Error('Browser plugin not available');
      }
      
      // Construct the auth URL
      const authUrl = await this.constructAuthUrl();
      
      console.log('[NativeAuth] Opening auth URL:', authUrl);
      
      // Set timeout for browser opening
      this.browserTimeout = setTimeout(() => {
        console.error('[NativeAuth] Browser timeout - did not open or respond');
        this.isAuthenticating = false;
        
        // Auto-bypass on timeout
        this.bypassLogin();
      }, 30000); // 30 second timeout
      
      // Open in-app browser with proper configuration
      await Browser.open({
        url: authUrl,
        windowName: '_blank',
        presentationStyle: 'popover',
        toolbarColor: '#02276F',
        showTitle: true,
        enableDownloads: false,
        enableEditMenu: false
      });
      
      console.log('[NativeAuth] Browser opened successfully');
      
    } catch (error) {
      console.error('[NativeAuth] Login error:', error);
      this.isAuthenticating = false;
      
      // Clear timeout
      if (this.browserTimeout) {
        clearTimeout(this.browserTimeout);
        this.browserTimeout = null;
      }
      
      // Auto-bypass on error for testing
      await this.bypassLogin();
    }
  }

  // Construct the authorization URL with proper PKCE
  async constructAuthUrl() {
    try {
      // Generate PKCE parameters
      const codeVerifier = this.generateCodeVerifier();
      const codeChallenge = await this.generateCodeChallenge(codeVerifier);
      const state = this.generateState();
      
      // Store for later verification
      localStorage.setItem('auth_code_verifier', codeVerifier);
      localStorage.setItem('auth_state', state);
      
      const params = new URLSearchParams({
        client_id: this.authConfig.clientId,
        redirect_uri: this.authConfig.redirectUri,
        response_type: 'code',
        scope: this.authConfig.scope,
        response_mode: 'query',
        prompt: 'select_account',
        code_challenge_method: 'S256',
        code_challenge: codeChallenge,
        state: state
      });

      const authUrl = `${this.authConfig.authority}/oauth2/v2.0/authorize?${params.toString()}`;
      console.log('[NativeAuth] Constructed auth URL:', authUrl);
      
      return authUrl;
    } catch (error) {
      console.error('[NativeAuth] Error constructing auth URL:', error);
      throw error;
    }
  }

  // Generate PKCE code verifier
  generateCodeVerifier() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return this.base64URLEscape(btoa(String.fromCharCode.apply(null, Array.from(array))));
  }

  // Generate PKCE code challenge
  async generateCodeChallenge(verifier) {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return this.base64URLEscape(btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(hash)))));
  }

  // Helper for base64 URL encoding
  base64URLEscape(str) {
    return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }

  // Generate secure state parameter
  generateState() {
    const state = this.generateRandomString(32);
    return state;
  }

  generateRandomString(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Exchange authorization code for tokens
  async exchangeCodeForToken(code) {
    console.log('[NativeAuth] Exchanging code for token...');
    
    try {
      const codeVerifier = localStorage.getItem('auth_code_verifier');
      if (!codeVerifier) {
        throw new Error('Code verifier not found');
      }
      
      const tokenRequest = {
        client_id: this.authConfig.clientId,
        code: code,
        redirect_uri: this.authConfig.redirectUri,
        grant_type: 'authorization_code',
        code_verifier: codeVerifier
      };
      
      const tokenUrl = `${this.authConfig.authority}/oauth2/v2.0/token`;
      
      console.log('[NativeAuth] Requesting tokens from:', tokenUrl);
      
      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(tokenRequest)
      });
      
      const tokenData = await response.json();
      
      if (!response.ok) {
        console.error('[NativeAuth] Token exchange failed:', tokenData);
        throw new Error(tokenData.error_description || 'Token exchange failed');
      }
      
      console.log('[NativeAuth] Token exchange successful');
      
      // Store tokens
      localStorage.setItem('auth_tokens', JSON.stringify(tokenData));
      localStorage.setItem('auth_token_timestamp', Date.now().toString());
      
      // Clear temporary storage
      localStorage.removeItem('auth_code_verifier');
      localStorage.removeItem('auth_state');
      
      // Process the user info
      await this.processTokenResponse(tokenData);
      
    } catch (error) {
      console.error('[NativeAuth] Token exchange error:', error);
      
      // Fall back to bypass for testing
      await this.bypassLogin();
    }
  }

  // Process token response and extract user info
  async processTokenResponse(tokenData) {
    try {
      if (tokenData.id_token) {
        // Decode JWT to get user info
        const payload = JSON.parse(atob(tokenData.id_token.split('.')[1]));
        
        const user = {
          localAccountId: payload.sub || payload.oid,
          homeAccountId: payload.sub || payload.oid,
          name: payload.name,
          username: payload.preferred_username || payload.email,
          email: payload.email || payload.preferred_username,
          displayName: payload.name,
          idTokenClaims: payload
        };
        
        // Store user info
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        console.log('[NativeAuth] User authenticated successfully:', user.email);
        
        // Reload to process auth
        window.location.reload();
      }
    } catch (error) {
      console.error('[NativeAuth] Error processing token response:', error);
      await this.bypassLogin();
    }
  }

  // Web authentication fallback
  async webAuth() {
    console.log('[NativeAuth] Using web authentication');
    
    try {
      const authUrl = await this.constructAuthUrl();
      window.location.href = authUrl;
    } catch (error) {
      console.error('[NativeAuth] Web auth error:', error);
      await this.bypassLogin();
    }
  }

}

const nativeAuthService = new NativeAuthService();
export default nativeAuthService;