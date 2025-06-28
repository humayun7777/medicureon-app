// src/hooks/useMediCureOnData.js
import { useState, useEffect, useContext, createContext, useCallback } from 'react';
import { useAuth } from './useAuth';
import { apiConfig } from '../config/apiConfig';

// Create a context for sharing data across components
const MediCureOnDataContext = createContext({});

// Provider component that wraps your app
export const MediCureOnDataProvider = ({ children }) => {
  const { user, userInfo } = useAuth();
  
  // Shared state for all components
  const [profilePicture, setProfilePicture] = useState(null);
  const [userSubscription, setUserSubscription] = useState({ type: null, activePlans: [] });
  const [activePlans, setActivePlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  
  // Cache timestamps to prevent unnecessary refetches
  const [lastFetchTime, setLastFetchTime] = useState({
    profile: null,
    subscription: null,
    profilePicture: null
  });

  // Cache duration (5 minutes for non-critical data)
  const CACHE_DURATION = 5 * 60 * 1000;
  
  // Helper to check if cache is valid
  const isCacheValid = (lastFetch) => {
    return lastFetch && (Date.now() - lastFetch < CACHE_DURATION);
  };

  // Get user's display name (utility function)
  const getUserDisplayName = useCallback(() => {
    if (userInfo?.displayName) return userInfo.displayName;
    if (userInfo?.name) return userInfo.name;
    if (user?.name) return user.name;
    if (userInfo?.firstName) return userInfo.firstName;
    const email = userInfo?.email || user?.username || user?.idTokenClaims?.email;
    if (email) return email.split('@')[0];
    return 'User';
  }, [user, userInfo]);

  // Get greeting based on time
  const getGreeting = useCallback(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    if (hour < 21) return "Good Evening";
    return "Good Night";
  }, []);

  // Fetch profile picture with caching
  const fetchProfilePicture = useCallback(async (forceRefresh = false) => {
    if (!user?.localAccountId && !user?.username) return;
    
    // Check cache validity
    if (!forceRefresh && isCacheValid(lastFetchTime.profilePicture) && profilePicture) {
      console.log('Using cached profile picture');
      return;
    }

    try {
      const userId = user.localAccountId || user.username;
      const country = userInfo?.country || 'United States';
      
      console.log('Fetching profile picture...');
      const response = await fetch(
        `${apiConfig.backendUrl}/api/profiles/${userId}/picture?country=${encodeURIComponent(country)}&code=${apiConfig.functionKeys.profilePicture}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.currentPicture) {
          setProfilePicture(data.currentPicture);
          setLastFetchTime(prev => ({ ...prev, profilePicture: Date.now() }));
          console.log('Profile picture cached');
        }
      }
    } catch (error) {
      console.error('Error loading profile picture:', error);
    }
  }, [user, userInfo, profilePicture, lastFetchTime.profilePicture]);

  // Fetch subscription data with caching
  const fetchUserSubscription = useCallback(async (forceRefresh = false) => {
    if (!user?.localAccountId && !user?.username) {
      setIsLoading(false);
      return;
    }

    // Check cache validity
    if (!forceRefresh && isCacheValid(lastFetchTime.subscription) && userSubscription.type !== null) {
      console.log('Using cached subscription data');
      setIsLoading(false);
      return;
    }

    try {
      if (forceRefresh) {
        setIsRefreshing(true);
      } else if (!lastFetchTime.subscription) {
        setIsLoading(true);
      }

      const userId = user.localAccountId || user.username;
      const userCountry = userInfo?.country || 'United States';
      
      console.log('Fetching subscription data...');
      const response = await fetch(
        `${apiConfig.backendUrl}${apiConfig.endpoints.subscription.check(userId)}?country=${encodeURIComponent(userCountry)}&code=${apiConfig.functionKeys.checkSubscriptionStatus}`,
        {
          headers: {
            'Authorization': `Bearer ${user.idToken}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        
        if (data.hasSubscription) {
          setUserSubscription({
            type: data.subscription.type,
            status: data.subscription.status,
            currentPeriodEnd: data.subscription.currentPeriodEnd,
            productName: data.subscription.productName
          });
          setActivePlans(data.activePlans || []);
        } else {
          setUserSubscription({ type: null, activePlans: [] });
          setActivePlans([]);
        }
        setLastFetchTime(prev => ({ ...prev, subscription: Date.now() }));
        setError(null);
        console.log('Subscription data cached');
      } else {
        const errorText = await response.text();
        setError(`Failed to fetch subscription: ${response.status}`);
        console.error('Failed to fetch subscription:', response.status, errorText);
      }
    } catch (error) {
      setError('Network error while fetching subscription');
      console.error('Error fetching subscription:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [user, userInfo, userSubscription.type, lastFetchTime.subscription]);

  // Initial data load - fetch in parallel for speed
  useEffect(() => {
    if (user && userInfo) {
      console.log('Initial data load - fetching in parallel');
      Promise.all([
        fetchProfilePicture(),
        fetchUserSubscription()
      ]);
    }
  }, [user?.localAccountId, user?.username, userInfo?.country]);

  // Manual refresh all data
  const refreshAll = useCallback(async () => {
    console.log('Manual refresh triggered');
    setIsRefreshing(true);
    await Promise.all([
      fetchProfilePicture(true),
      fetchUserSubscription(true)
    ]);
  }, [fetchProfilePicture, fetchUserSubscription]);

  // Refresh specific data
  const refreshProfile = useCallback(() => fetchProfilePicture(true), [fetchProfilePicture]);
  const refreshSubscription = useCallback(() => fetchUserSubscription(true), [fetchUserSubscription]);

  // Update functions for when data changes (e.g., after profile update)
  const updateProfilePicture = useCallback((newPicture) => {
    setProfilePicture(newPicture);
    setLastFetchTime(prev => ({ ...prev, profilePicture: Date.now() }));
  }, []);

  const updateSubscription = useCallback((newSubscription) => {
    setUserSubscription(newSubscription);
    setLastFetchTime(prev => ({ ...prev, subscription: Date.now() }));
  }, []);

  const updateActivePlans = useCallback((newPlans) => {
    setActivePlans(newPlans);
    // Also update the cache timestamp since plans are part of subscription data
    setLastFetchTime(prev => ({ ...prev, subscription: Date.now() }));
  }, []);

  // Clear all cache (useful for logout or testing)
  const clearCache = useCallback(() => {
    console.log('Clearing all cache');
    setLastFetchTime({ profile: null, subscription: null, profilePicture: null });
    setProfilePicture(null);
    setUserSubscription({ type: null, activePlans: [] });
    setActivePlans([]);
  }, []);

  // Force refresh if window regains focus after being hidden for a while
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        const now = Date.now();
        const profileAge = now - (lastFetchTime.profilePicture || 0);
        const subscriptionAge = now - (lastFetchTime.subscription || 0);
        
        // If data is older than cache duration, refresh it
        if (profileAge > CACHE_DURATION || subscriptionAge > CACHE_DURATION) {
          console.log('Page visible again, data is stale, refreshing...');
          refreshAll();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [lastFetchTime, refreshAll, CACHE_DURATION]);

  const value = {
    // Data
    profilePicture,
    userSubscription,
    activePlans,
    isLoading,
    isRefreshing,
    error,
    
    // Utility functions
    getUserDisplayName,
    getGreeting,
    
    // Actions
    refreshAll,
    refreshProfile,
    refreshSubscription,
    updateProfilePicture,
    updateSubscription,
    updateActivePlans,
    clearCache,
    
    // Cache control
    isCacheValid,
    CACHE_DURATION
  };

  return (
    <MediCureOnDataContext.Provider value={value}>
      {children}
    </MediCureOnDataContext.Provider>
  );
};

// Custom hook to use the shared data
export const useMediCureOnData = () => {
  const context = useContext(MediCureOnDataContext);
  if (!context) {
    throw new Error('useMediCureOnData must be used within MediCureOnDataProvider');
  }
  return context;
};

// Export a utility to force real-time fetch for critical data
export const fetchRealTimeData = async (endpoint, options = {}) => {
  // This bypasses cache for critical health monitoring
  console.log('Fetching real-time data:', endpoint);
  return fetch(endpoint, {
    ...options,
    headers: {
      ...options.headers,
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    }
  });
};