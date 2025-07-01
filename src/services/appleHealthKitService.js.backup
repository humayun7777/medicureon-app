// appleHealthKitService.js
// Apple HealthKit integration extending BaseDeviceService

import { Capacitor } from '@capacitor/core';
import BaseDeviceService from './baseDeviceService';

class AppleHealthKitService extends BaseDeviceService {
  constructor() {
    super('apple-health', 'Apple Health');
    this.healthPlugin = null;
    this.mockInterval = null;
    this.isPluginInitialized = false;
  }

  // Initialize the plugin when needed
  async initializePlugin() {
    if (this.isPluginInitialized) {
      return true;
    }

    const platform = Capacitor.getPlatform();
    
    if (platform === 'ios' && Capacitor.isNativePlatform()) {
      try {
        // Try to load the @perfood/capacitor-healthkit plugin
        const { CapacitorHealthkit } = await import('@perfood/capacitor-healthkit');
        this.healthPlugin = CapacitorHealthkit;
        this.isPluginInitialized = true;
        console.log('HealthKit plugin loaded successfully');
        return true;
      } catch (error) {
        console.error('Failed to load HealthKit plugin:', error);
        
        // Try alternative plugin name
        try {
          const { HealthKit } = await import('@perfood/capacitor-healthkit');
          this.healthPlugin = HealthKit;
          this.isPluginInitialized = true;
          console.log('HealthKit plugin loaded with alternative name');
          return true;
        } catch (altError) {
          console.error('Failed to load HealthKit plugin with alternative name:', altError);
          return false;
        }
      }
    }
    
    return false;
  }

  // Override initialize to handle all platforms correctly
  async initialize(userId, userProfile = null) {
    console.log('Initializing Apple HealthKit Service...');
    console.log('UserId:', userId);
    console.log('Platform:', Capacitor.getPlatform());
    console.log('Is Native:', Capacitor.isNativePlatform());
    
    this.userId = userId;
    this.userProfile = userProfile;
    
    const platform = Capacitor.getPlatform();
    
    // iOS Native Platform
    if (Capacitor.isNativePlatform() && platform === 'ios') {
      console.log('Detected iOS native platform, initializing HealthKit...');
      
      try {
        // Initialize the plugin
        const pluginLoaded = await this.initializePlugin();
        
        if (!pluginLoaded || !this.healthPlugin) {
          return {
            success: false,
            message: 'HealthKit plugin not available. Please ensure the app is properly built with HealthKit support.'
          };
        }
        
        // Check HealthKit availability
        const availability = await this.checkAvailability();
        if (!availability.available) {
          return {
            success: false,
            message: availability.message || 'HealthKit is not available on this device'
          };
        }
        
        // Request permissions
        const permissions = await this.requestPermissions();
        if (!permissions.success) {
          return {
            success: false,
            message: permissions.message || 'HealthKit permissions were denied'
          };
        }
        
        // Mark as initialized and connected
        this.isInitialized = true;
        this.isConnected = true;
        this.isNative = true;
        this.platform = platform;
        this.deviceId = await this.getDeviceId();
        
        // Save connection status
        await this.saveConnectionStatus(true);
        
        // Start background sync
        this.startBackgroundSync();
        
        // Perform initial sync
        setTimeout(() => {
          this.performInitialSync();
        }, 1000);
        
        return {
          success: true,
          message: 'Apple Health connected successfully',
          deviceId: this.deviceId
        };
        
      } catch (error) {
        console.error('Error initializing HealthKit:', error);
        return {
          success: false,
          message: `Failed to initialize Apple Health: ${error.message}`
        };
      }
    }
    
    // Web Platform - Mock Mode
    if (platform === 'web') {
      console.log('Running on web platform - activating mock mode');
      
      this.isInitialized = true;
      this.isConnected = true;
      this.platform = 'web';
      this.isNative = false;
      
      // Start mock data sync for testing
      await this.startMockDataSync();
      
      return {
        success: true,
        message: 'Mock mode activated for web testing',
        deviceId: 'mock-apple-health-web'
      };
    }
    
    // Android or other platforms
    return {
      success: false,
      message: 'Apple Health is only available on iOS devices',
      requiresApp: true
    };
  }

  // Check if HealthKit is available
  async checkAvailability() {
    if (!this.healthPlugin) {
      return {
        available: false,
        message: 'HealthKit plugin not loaded'
      };
    }

    try {
      // Check if the plugin has an isAvailable method
      if (this.healthPlugin.isAvailable) {
        const result = await this.healthPlugin.isAvailable();
        console.log('HealthKit availability check result:', result);
        
        return {
          available: result === true || (result && result.available === true),
          message: result === false ? 'HealthKit is not available on this device' : null
        };
      }
      
      // If no isAvailable method, assume it's available on iOS
      console.log('No isAvailable method, assuming HealthKit is available on iOS');
      return { available: true };
      
    } catch (error) {
      console.error('Error checking HealthKit availability:', error);
      // Don't fail completely, try to continue
      return { available: true };
    }
  }

  // Request HealthKit permissions
  async requestPermissions() {
    if (!this.healthPlugin) {
      return {
        success: false,
        message: 'HealthKit plugin not loaded'
      };
    }

    const permissions = {
      read: [
        'stepCount',
        'distanceWalkingRunning',
        'activeEnergyBurned',
        'basalEnergyBurned',
        'heartRate',
        'restingHeartRate',
        'heartRateVariabilitySDNN',
        'bodyMass',
        'height',
        'bodyFatPercentage',
        'bodyMassIndex',
        'oxygenSaturation',
        'bloodPressureSystolic',
        'bloodPressureDiastolic',
        'bloodGlucose',
        'bodyTemperature',
        'sleepAnalysis',
        'dietaryWater',
        'dietaryEnergyConsumed'
      ],
      write: [] // We're not writing data back to HealthKit
    };

    try {
      console.log('Requesting HealthKit permissions...');
      
      // Call requestAuthorization
      const result = await this.healthPlugin.requestAuthorization(permissions);
      
      console.log('HealthKit permission result:', result);
      
      // The plugin might return different response formats
      const success = result === true || 
                     result === 'granted' || 
                     (result && result.granted) ||
                     (result && result.success);
      
      return { 
        success: success !== false,
        permissions: permissions.read 
      };
      
    } catch (error) {
      console.error('Permission request failed:', error);
      return { 
        success: false,
        message: 'Failed to get HealthKit permissions: ' + error.message
      };
    }
  }

  // Start background sync
  startBackgroundSync() {
    console.log('Starting background sync for Apple Health');
    
    // Clear any existing interval
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
    
    // Set up periodic sync (every 5 minutes)
    this.syncInterval = setInterval(() => {
      if (this.isConnected && !this.syncInProgress) {
        this.syncRecentData();
      }
    }, this.syncFrequency);
    
    // Enable background delivery if supported
    this.enableBackgroundDelivery();
  }

  // Enable background delivery for real-time updates
  async enableBackgroundDelivery() {
    if (!this.healthPlugin || !this.healthPlugin.enableBackgroundDelivery) {
      console.log('Background delivery not supported by this plugin version');
      return;
    }

    try {
      await this.healthPlugin.enableBackgroundDelivery({
        dataTypes: ['stepCount', 'heartRate', 'activeEnergyBurned'],
        updateFrequency: 'hourly'
      });
      console.log('Background delivery enabled for Apple Health');
    } catch (error) {
      console.error('Failed to enable background delivery:', error);
    }
  }

  // Fetch health data from HealthKit
  async fetchHealthData(startDate, endDate) {
    // If in mock mode, return mock data
    if (this.platform === 'web') {
      return this.generateMockHealthData(startDate, endDate);
    }

    if (!this.healthPlugin || !this.isConnected) {
      console.error('Cannot fetch health data: plugin not loaded or not connected');
      return null;
    }

    const healthData = {
      metadata: {
        deviceId: this.deviceId || await this.getDeviceId(),
        deviceType: this.deviceType,
        timestamp: new Date().toISOString(),
        syncPeriod: {
          start: startDate.toISOString(),
          end: endDate.toISOString()
        }
      },
      metrics: {}
    };

    try {
      // Fetch different types of health data
      console.log('Fetching health data from', startDate, 'to', endDate);
      
      // Steps
      const steps = await this.queryQuantityData('stepCount', startDate, endDate, 'count');
      if (steps) healthData.metrics.steps = steps;

      // Heart Rate
      const heartRate = await this.queryQuantityData('heartRate', startDate, endDate, 'count/min');
      if (heartRate) healthData.metrics.heartRate = heartRate;

      // Active Calories
      const activeCalories = await this.queryQuantityData('activeEnergyBurned', startDate, endDate, 'kcal');
      if (activeCalories) healthData.metrics.activeCalories = activeCalories;

      // Distance
      const distance = await this.queryQuantityData('distanceWalkingRunning', startDate, endDate, 'km');
      if (distance) healthData.metrics.distance = distance;

      // Resting Heart Rate
      const restingHR = await this.queryQuantityData('restingHeartRate', startDate, endDate, 'count/min');
      if (restingHR) healthData.metrics.restingHeartRate = restingHR;

      // Sleep
      const sleep = await this.querySleepData(startDate, endDate);
      if (sleep) healthData.metrics.sleep = sleep;

      console.log('Fetched health data:', healthData);
      return healthData;

    } catch (error) {
      console.error('Error fetching health data:', error);
      return healthData; // Return partial data
    }
  }

  // Query quantity data from HealthKit
  async queryQuantityData(quantityType, startDate, endDate, unit) {
    if (!this.healthPlugin) return null;

    try {
      console.log(`Querying ${quantityType} from ${startDate} to ${endDate}`);
      
      const queryOptions = {
        quantityType: quantityType,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        limit: 1000
      };
      
      // Try different method names based on plugin version
      let result;
      if (this.healthPlugin.queryQuantity) {
        result = await this.healthPlugin.queryQuantity(queryOptions);
      } else if (this.healthPlugin.query) {
        result = await this.healthPlugin.query({
          ...queryOptions,
          sampleType: quantityType
        });
      } else {
        console.error(`No query method found for ${quantityType}`);
        return null;
      }

      console.log(`Query result for ${quantityType}:`, result);
      
      if (result && result.data && result.data.length > 0) {
        return this.processHealthSamples(result.data, unit, quantityType);
      } else if (result && Array.isArray(result) && result.length > 0) {
        return this.processHealthSamples(result, unit, quantityType);
      }
      
      return null;
    } catch (error) {
      console.error(`Error querying ${quantityType}:`, error);
      return null;
    }
  }

  // Query sleep data
  async querySleepData(startDate, endDate) {
    if (!this.healthPlugin) return null;

    try {
      console.log('Querying sleep data...');
      
      const queryOptions = {
        categoryType: 'sleepAnalysis',
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        limit: 100
      };
      
      let result;
      if (this.healthPlugin.queryCategorySamples) {
        result = await this.healthPlugin.queryCategorySamples(queryOptions);
      } else if (this.healthPlugin.query) {
        result = await this.healthPlugin.query({
          ...queryOptions,
          sampleType: 'sleepAnalysis'
        });
      } else {
        console.log('Sleep query not supported by this plugin version');
        return null;
      }

      if (result && result.data && result.data.length > 0) {
        return this.processSleepData(result.data);
      } else if (result && Array.isArray(result) && result.length > 0) {
        return this.processSleepData(result);
      }
      
      return null;
    } catch (error) {
      console.error('Error querying sleep data:', error);
      return null;
    }
  }

  // Process sleep data specifically
  processSleepData(sleepSamples) {
    const sleepByDay = {};
    
    sleepSamples.forEach(sample => {
      const date = new Date(sample.startDate).toISOString().split('T')[0];
      
      if (!sleepByDay[date]) {
        sleepByDay[date] = {
          totalMinutes: 0,
          sessions: []
        };
      }
      
      const duration = (new Date(sample.endDate) - new Date(sample.startDate)) / 60000; // minutes
      sleepByDay[date].totalMinutes += duration;
      sleepByDay[date].sessions.push({
        start: sample.startDate,
        end: sample.endDate,
        duration: duration,
        type: sample.value || 'unknown'
      });
    });

    const processed = {
      values: [],
      latest: null,
      aggregates: {}
    };

    Object.entries(sleepByDay).forEach(([date, data]) => {
      const hours = data.totalMinutes / 60;
      processed.values.push({
        value: parseFloat(hours.toFixed(1)),
        unit: 'hours',
        timestamp: date,
        sessions: data.sessions
      });
    });

    if (processed.values.length > 0) {
      processed.values.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      processed.latest = processed.values[0];
      
      const values = processed.values.map(v => v.value);
      processed.aggregates = {
        min: Math.min(...values),
        max: Math.max(...values),
        avg: values.reduce((a, b) => a + b, 0) / values.length
      };
    }

    return processed;
  }

  // Mock data generation for web testing
  async startMockDataSync() {
    console.log('Starting mock data sync for web testing...');
    
    // Send initial data
    await this.sendMockData();
    
    // Clear any existing interval
    if (this.mockInterval) {
      clearInterval(this.mockInterval);
    }
    
    // Send updates every 30 seconds
    this.mockInterval = setInterval(async () => {
      await this.sendMockData();
    }, 30000);
  }

  // Generate and send mock health data
  async sendMockData() {
    const now = new Date();
    const dayStart = new Date(now);
    dayStart.setHours(0, 0, 0, 0);
    
    // Generate realistic mock data based on time of day
    const currentHour = now.getHours();
    const baseSteps = Math.floor(currentHour * 400) + Math.floor(Math.random() * 200);
    
    const mockHealthData = {
      metadata: {
        deviceId: 'mock-apple-health-web',
        deviceType: 'apple-health',
        timestamp: now.toISOString(),
        syncPeriod: {
          start: dayStart.toISOString(),
          end: now.toISOString()
        }
      },
      metrics: {
        steps: {
          values: [{
            value: baseSteps,
            unit: 'count',
            timestamp: now.toISOString(),
            metadata: {
              device: 'Mock iPhone',
              source: 'Mock Apple Health'
            }
          }],
          latest: {
            value: baseSteps,
            unit: 'count',
            timestamp: now.toISOString()
          },
          aggregates: {
            total: baseSteps,
            avg: Math.floor(baseSteps / (currentHour || 1))
          }
        },
        heartRate: {
          values: [{
            value: Math.floor(Math.random() * 20) + 70,
            unit: 'count/min',
            timestamp: now.toISOString()
          }],
          latest: {
            value: Math.floor(Math.random() * 20) + 70,
            unit: 'count/min',
            timestamp: now.toISOString()
          }
        },
        activeCalories: {
          values: [{
            value: Math.floor(baseSteps * 0.04),
            unit: 'kcal',
            timestamp: now.toISOString()
          }],
          latest: {
            value: Math.floor(baseSteps * 0.04),
            unit: 'kcal',
            timestamp: now.toISOString()
          }
        },
        distance: {
          values: [{
            value: parseFloat((baseSteps * 0.0008).toFixed(2)),
            unit: 'km',
            timestamp: now.toISOString()
          }],
          latest: {
            value: parseFloat((baseSteps * 0.0008).toFixed(2)),
            unit: 'km',
            timestamp: now.toISOString()
          }
        }
      }
    };
    
    // Send to backend
    try {
      await this.sendToBackend(mockHealthData, 'mock');
      console.log('Mock data sent successfully');
    } catch (error) {
      console.error('Error sending mock data:', error);
    }
  }

  // Generate mock health data for a date range
  generateMockHealthData(startDate, endDate) {
    const now = new Date();
    const currentHour = now.getHours();
    const baseSteps = Math.floor(currentHour * 400) + Math.floor(Math.random() * 200);
    
    return {
      metadata: {
        deviceId: 'mock-apple-health-web',
        deviceType: this.deviceType,
        timestamp: now.toISOString(),
        syncPeriod: {
          start: startDate.toISOString(),
          end: endDate.toISOString()
        }
      },
      metrics: {
        steps: {
          values: [{
            value: baseSteps,
            unit: 'count',
            timestamp: now.toISOString()
          }],
          latest: {
            value: baseSteps,
            unit: 'count',
            timestamp: now.toISOString()
          }
        },
        heartRate: {
          values: [{
            value: Math.floor(Math.random() * 20) + 70,
            unit: 'count/min',
            timestamp: now.toISOString()
          }],
          latest: {
            value: Math.floor(Math.random() * 20) + 70,
            unit: 'count/min',
            timestamp: now.toISOString()
          }
        }
      }
    };
  }

  // Extract value from sample (override for Apple Health format)
  extractValue(sample, metricType) {
    return parseFloat(
      sample.quantity || 
      sample.value || 
      sample.quantityValue || 
      0
    );
  }

  extractTimestamp(sample) {
    return sample.startDate || 
           sample.date || 
           sample.timestamp || 
           new Date().toISOString();
  }

  extractMetadata(sample) {
    return {
      uuid: sample.uuid || sample.id || sample.identifier,
      device: sample.device || sample.sourceName || 'Apple Health',
      source: sample.source || sample.sourceBundleId || 'com.apple.health',
      startDate: sample.startDate,
      endDate: sample.endDate
    };
  }

  // Cleanup on disconnect
  async disconnect() {
    console.log('Disconnecting Apple Health...');
    
    // Clear any intervals
    if (this.mockInterval) {
      clearInterval(this.mockInterval);
      this.mockInterval = null;
    }
    
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
    
    // Reset state
    this.isConnected = false;
    this.isInitialized = false;
    
    // Call parent disconnect
    return super.disconnect();
  }
}

// Export singleton instance
const appleHealthKitService = new AppleHealthKitService();
export default appleHealthKitService;