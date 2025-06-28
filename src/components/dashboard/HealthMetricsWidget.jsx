// src/components/dashboard/HealthMetricsWidget.jsx
import React, { useState, useEffect } from 'react';
import { Activity, Heart, Zap, TrendingUp, RefreshCw, Smartphone } from 'lucide-react';
import iomtApiService from '../../services/iomtApiService';
import appleHealthKitService from '../../services/appleHealthKitService';
import { useAuth } from '../../hooks/useAuth';

const HealthMetricsWidget = () => {
  const { user } = useAuth();
  const userId = user?.localAccountId || user?.username || user?.idTokenClaims?.oid;
  
  const [metrics, setMetrics] = useState({
    steps: { current: 0, goal: 10000, trend: 0 },
    heartRate: { current: 0, avg: 0, min: 0, max: 0 },
    calories: { burned: 0, consumed: 0, budget: 2000 },
    distance: { value: 0, unit: 'km' }
  });
  
  const [connectionStatus, setConnectionStatus] = useState({
    connected: false,
    lastSync: null,
    syncing: false
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch latest metrics from backend
  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get data from backend
      const response = await iomtApiService.getIomtData(userId, {
        deviceType: 'apple-health',
        limit: 1,
        aggregation: 'daily'
      });
      
      if (response.success && response.data.length > 0) {
        const latestData = response.data[0];
        updateMetricsFromBackend(latestData);
      } else {
        // No data yet, try to get from local service
        const localData = await appleHealthKitService.getLatestMetrics();
        if (localData) {
          updateMetricsFromLocal(localData);
        }
      }
      
      // Update connection status
      const status = appleHealthKitService.getConnectionStatus();
      setConnectionStatus({
        connected: status.connected,
        lastSync: status.lastSync,
        syncing: false
      });
      
    } catch (err) {
      console.error('Error fetching metrics:', err);
      setError('Unable to load health metrics');
    } finally {
      setLoading(false);
    }
  };

  // Update metrics from backend data
  const updateMetricsFromBackend = (data) => {
    if (!data.metrics) return;
    
    const { metrics: backendMetrics } = data;
    
    setMetrics(prev => ({
      steps: {
        current: backendMetrics.steps?.latest?.value || prev.steps.current,
        goal: 10000,
        trend: calculateTrend(backendMetrics.steps?.values)
      },
      heartRate: {
        current: backendMetrics.heartRate?.latest?.value || prev.heartRate.current,
        avg: backendMetrics.heartRate?.aggregates?.avg || prev.heartRate.avg,
        min: backendMetrics.heartRate?.aggregates?.min || prev.heartRate.min,
        max: backendMetrics.heartRate?.aggregates?.max || prev.heartRate.max
      },
      calories: {
        burned: backendMetrics.activeCalories?.latest?.value || prev.calories.burned,
        consumed: prev.calories.consumed, // This would come from nutrition tracking
        budget: 2000
      },
      distance: {
        value: (backendMetrics.distance?.latest?.value / 1000).toFixed(2) || prev.distance.value,
        unit: 'km'
      }
    }));
  };

  // Update metrics from local data
  const updateMetricsFromLocal = (localData) => {
    setMetrics(prev => ({
      steps: {
        current: localData.steps?.value || prev.steps.current,
        goal: 10000,
        trend: 0
      },
      heartRate: {
        current: localData.heartRate?.value || prev.heartRate.current,
        avg: localData.heartRate?.value || prev.heartRate.avg,
        min: localData.heartRate?.value || prev.heartRate.min,
        max: localData.heartRate?.value || prev.heartRate.max
      },
      calories: {
        burned: localData.calories?.value || prev.calories.burned,
        consumed: prev.calories.consumed,
        budget: 2000
      },
      distance: {
        value: (localData.distance?.value / 1000).toFixed(2) || prev.distance.value,
        unit: 'km'
      }
    }));
  };

  // Calculate trend from historical values
  const calculateTrend = (values) => {
    if (!values || values.length < 2) return 0;
    const recent = values.slice(-7); // Last 7 values
    const avg = recent.reduce((sum, v) => sum + v.value, 0) / recent.length;
    const current = values[values.length - 1].value;
    return ((current - avg) / avg * 100).toFixed(1);
  };

  // Setup real-time updates
  useEffect(() => {
    // Initial fetch
    fetchMetrics();
    
    // Set up periodic refresh (every minute)
    const interval = setInterval(fetchMetrics, 60000);
    
    // Listen for real-time updates
    const handleHealthUpdate = (event) => {
      const { metric, value } = event.detail;
      setMetrics(prev => {
        const updated = { ...prev };
        
        switch (metric) {
          case 'heartRate':
            updated.heartRate.current = value;
            break;
          case 'steps':
            updated.steps.current = value;
            break;
          case 'activeCalories':
            updated.calories.burned = value;
            break;
          case 'distance':
            updated.distance.value = (value / 1000).toFixed(2);
            break;
        }
        
        return updated;
      });
    };
    
    window.addEventListener('healthDataUpdate', handleHealthUpdate);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('healthDataUpdate', handleHealthUpdate);
    };
  }, [userId]);

  // Manual sync
  const handleManualSync = async () => {
    setConnectionStatus(prev => ({ ...prev, syncing: true }));
    
    try {
      if (!connectionStatus.connected) {
        // Try to connect first
        const result = await appleHealthKitService.connectDevice();
        if (!result.success) {
          throw new Error(result.message);
        }
      }
      
      // Perform sync
      await appleHealthKitService.performFullSync();
      
      // Refresh data
      await fetchMetrics();
      
    } catch (err) {
      setError('Sync failed: ' + err.message);
    } finally {
      setConnectionStatus(prev => ({ ...prev, syncing: false }));
    }
  };

  // Format time since last sync
  const getTimeSinceSync = () => {
    if (!connectionStatus.lastSync) return 'Never';
    
    const diff = Date.now() - new Date(connectionStatus.lastSync).getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return `${Math.floor(minutes / 1440)}d ago`;
  };

  if (loading) {
    return (
      <div className="p-6 bg-white shadow-lg rounded-xl animate-pulse">
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Live Health Metrics</h3>
          <p className="text-sm text-gray-600">
            {connectionStatus.connected ? (
              <span className="flex items-center">
                <span className="w-2 h-2 mr-2 bg-green-500 rounded-full animate-pulse"></span>
                Connected • Last sync: {getTimeSinceSync()}
              </span>
            ) : (
              <span className="flex items-center text-orange-600">
                <Smartphone className="w-4 h-4 mr-1" />
                Connect your device to see live data
              </span>
            )}
          </p>
        </div>
        <button
          onClick={handleManualSync}
          disabled={connectionStatus.syncing}
          className="p-2 transition-colors rounded-lg hover:bg-gray-100 disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 text-gray-600 ${connectionStatus.syncing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {error && (
        <div className="p-3 mb-4 text-sm text-red-600 rounded-lg bg-red-50">
          {error}
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Steps */}
        <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-5 h-5 text-blue-600" />
            {metrics.steps.trend !== 0 && (
              <span className={`text-xs font-medium ${metrics.steps.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {metrics.steps.trend > 0 ? '+' : ''}{metrics.steps.trend}%
              </span>
            )}
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">
              {metrics.steps.current.toLocaleString()}
            </p>
            <p className="text-xs text-gray-600">
              of {metrics.steps.goal.toLocaleString()} steps
            </p>
            <div className="w-full h-1 overflow-hidden bg-blue-200 rounded-full">
              <div 
                className="h-full transition-all duration-500 bg-blue-600"
                style={{ width: `${Math.min(100, (metrics.steps.current / metrics.steps.goal) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Heart Rate */}
        <div className="p-4 rounded-lg bg-gradient-to-br from-red-50 to-red-100">
          <div className="flex items-center justify-between mb-2">
            <Heart className="w-5 h-5 text-red-600" />
            <div className="flex items-center space-x-1">
              <span className="text-xs text-gray-500">Avg</span>
              <span className="text-xs font-medium text-gray-700">{Math.round(metrics.heartRate.avg)}</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="flex items-baseline text-2xl font-bold text-gray-900">
              {metrics.heartRate.current}
              <span className="ml-1 text-sm font-normal text-gray-600">bpm</span>
            </p>
            <div className="flex items-center space-x-2 text-xs text-gray-600">
              <span>↓{metrics.heartRate.min}</span>
              <span>↑{metrics.heartRate.max}</span>
            </div>
          </div>
        </div>

        {/* Calories */}
        <div className="p-4 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100">
          <div className="flex items-center justify-between mb-2">
            <Zap className="w-5 h-5 text-orange-600" />
            <TrendingUp className="w-4 h-4 text-orange-600" />
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">
              {metrics.calories.burned}
            </p>
            <p className="text-xs text-gray-600">calories burned</p>
            <div className="text-xs font-medium text-orange-600">
              {metrics.calories.budget - metrics.calories.burned} remaining
            </div>
          </div>
        </div>

        {/* Distance */}
        <div className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100">
          <div className="flex items-center justify-between mb-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div className="space-y-1">
            <p className="flex items-baseline text-2xl font-bold text-gray-900">
              {metrics.distance.value}
              <span className="ml-1 text-sm font-normal text-gray-600">{metrics.distance.unit}</span>
            </p>
            <p className="text-xs text-gray-600">distance covered</p>
          </div>
        </div>
      </div>

      {/* Connection CTA */}
      {!connectionStatus.connected && (
        <div className="p-3 mt-4 rounded-lg bg-blue-50">
          <button
            onClick={() => window.location.href = '#/profile?tab=devices'}
            className="w-full text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Connect Apple Health to see your real-time data →
          </button>
        </div>
      )}
    </div>
  );
};

export default HealthMetricsWidget;