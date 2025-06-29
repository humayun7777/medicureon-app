// appleHealthKitService.js
// Apple HealthKit integration extending BaseDeviceService

import { Capacitor, registerPlugin } from '@capacitor/core';
import BaseDeviceService from './baseDeviceService';

// Try to register the HealthKit plugin
let HealthKitPlugin = null;
try {
  HealthKitPlugin = registerPlugin('CapacitorHealthkit');
} catch (error) {
  console.log('HealthKit plugin not registered:', error);
}

class AppleHealthKitService extends BaseDeviceService {
  constructor() {
    super('apple-health', 'Apple Health');
    this.healthPlugin = HealthKitPlugin;
    this.mockInterval = null;
  }

  // Override initialize to handle web platform
  async initialize(userId, userProfile = null) {
    console.log('Initializing Apple HealthKit Service...');
    this.userId = userId;
    
    // Check platform
    const platform = Capacitor.getPlatform();
    console.log('Platform:', platform);
    
    if (platform === 'web') {
      console.log('Running in browser - using mock mode');
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
    
    // For native platforms, continue with original implementation
    return this.initializeNative(userId, userProfile);
  }

  // Original native initialization
  async initializeNative(userId, userProfile = null) {
    // Set base properties
    this.isNative = true;
    this.platform = Capacitor.getPlatform();
    this.userId = userId;
    this.userProfile = userProfile;

    try {
      // Check availability
      const availability = await this.checkAvailability();
      if (!availability.available) {
        return {
          success: false,
          message: availability.message || 'Device not available'
        };
      }

      // Request permissions
      const permissions = await this.requestPermissions();
      if (!permissions.success) {
        return {
          success: false,
          message: permissions.message || 'Permissions not granted'
        };
      }

      // Mark as initialized
      this.isInitialized = true;
      this.isConnected = true;
      this.deviceId = await this.getDeviceId();

      // Start automatic sync
      this.startBackgroundSync();

      return {
        success: true,
        deviceId: this.deviceId
      };
    } catch (error) {
      console.error('Initialization failed:', error);
      return {
        success: false,
        message: error.message || 'Failed to initialize device'
      };
    }
  }

  // Mock data sync for web testing
  async startMockDataSync() {
    console.log('Starting mock data sync...');
    
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
    
    // Generate realistic mock data
    const currentHour = now.getHours();
    const baseSteps = Math.floor(currentHour * 400); // ~400 steps per hour
    const variability = Math.floor(Math.random() * 200) - 100;
    
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
            value: baseSteps + variability,
            unit: 'count',
            timestamp: now.toISOString(),
            metadata: {
              device: 'Mock iPhone',
              source: 'Mock Apple Health'
            }
          }],
          latest: {
            value: baseSteps + variability,
            unit: 'count',
            timestamp: now.toISOString()
          },
          aggregates: {
            total: baseSteps + variability,
            avg: Math.floor((baseSteps + variability) / currentHour) || 0
          }
        },
        heartRate: {
          values: [{
            value: Math.floor(Math.random() * 20) + 70, // 70-90 bpm
            unit: 'count/min',
            timestamp: now.toISOString(),
            metadata: {
              device: 'Mock Apple Watch',
              source: 'Mock Apple Health'
            }
          }],
          latest: {
            value: Math.floor(Math.random() * 20) + 70,
            unit: 'count/min',
            timestamp: now.toISOString()
          },
          aggregates: {
            min: 65,
            max: 95,
            avg: 78
          }
        },
        activeCalories: {
          values: [{
            value: Math.floor(baseSteps * 0.04), // ~0.04 cal per step
            unit: 'kcal',
            timestamp: now.toISOString(),
            metadata: {
              device: 'Mock iPhone',
              source: 'Mock Apple Health'
            }
          }],
          latest: {
            value: Math.floor(baseSteps * 0.04),
            unit: 'kcal',
            timestamp: now.toISOString()
          },
          aggregates: {
            total: Math.floor(baseSteps * 0.04)
          }
        },
        distance: {
          values: [{
            value: parseFloat((baseSteps * 0.0008).toFixed(2)), // ~0.8m per step
            unit: 'km',
            timestamp: now.toISOString(),
            metadata: {
              device: 'Mock iPhone',
              source: 'Mock Apple Health'
            }
          }],
          latest: {
            value: parseFloat((baseSteps * 0.0008).toFixed(2)),
            unit: 'km',
            timestamp: now.toISOString()
          },
          aggregates: {
            total: parseFloat((baseSteps * 0.0008).toFixed(2))
          }
        },
        restingHeartRate: {
          values: [{
            value: Math.floor(Math.random() * 10) + 60, // 60-70 bpm
            unit: 'count/min',
            timestamp: now.toISOString(),
            metadata: {
              device: 'Mock Apple Watch',
              source: 'Mock Apple Health'
            }
          }],
          latest: {
            value: Math.floor(Math.random() * 10) + 60,
            unit: 'count/min',
            timestamp: now.toISOString()
          }
        }
      }
    };
    
    // Send to device manager
    if (window.deviceManager) {
      console.log('Sending mock health data:', mockHealthData);
      try {
        await window.deviceManager.sendDeviceData(mockHealthData);
        console.log('Mock data sent successfully');
      } catch (error) {
        console.error('Error sending mock data:', error);
      }
    } else {
      console.error('DeviceManager not found on window object');
    }
  }

  // Check if HealthKit is available
  async checkAvailability() {
    // Web platform
    if (!this.isNative) {
      return {
        available: false,
        message: 'Please use the MediCureOn mobile app to connect Apple Health',
        requiresApp: true
      };
    }

    // Only iOS supports HealthKit
    if (this.platform !== 'ios') {
      return {
        available: false,
        message: 'Apple Health is only available on iOS devices'
      };
    }

    // Check if plugin is loaded
    if (!this.healthPlugin) {
      // Try to load @perfood/capacitor-healthkit
      try {
        const { CapacitorHealthkit } = await import('@perfood/capacitor-healthkit');
        this.healthPlugin = CapacitorHealthkit;
      } catch (error) {
        console.error('Failed to load HealthKit plugin:', error);
        return {
          available: false,
          message: 'HealthKit plugin not installed. Please update the app.'
        };
      }
    }

    // Check HealthKit availability
    try {
      if (this.healthPlugin.isAvailable) {
        const result = await this.healthPlugin.isAvailable();
        return {
          available: result && result.available,
          message: result && !result.available ? 'HealthKit not available on this device' : null
        };
      }
      // If method doesn't exist, assume available on iOS
      return { available: true };
    } catch (error) {
      console.error('Error checking HealthKit availability:', error);
      return { available: true }; // Assume available and let permissions fail if not
    }
  }

  // Request HealthKit permissions
  async requestPermissions() {
    const permissions = [
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
    ];

    try {
      const result = await this.healthPlugin.requestAuthorization({
        read: permissions,
        write: []
      });

      console.log('HealthKit permission result:', result);
      return { 
        success: true,
        permissions: permissions 
      };
    } catch (error) {
      console.error('Permission request failed:', error);
      return { 
        success: false,
        message: 'Failed to get HealthKit permissions'
      };
    }
  }

  // Fetch health data from HealthKit
  async fetchHealthData(startDate, endDate) {
    // If in mock mode, return mock data
    if (this.platform === 'web') {
      return this.generateMockHealthData(startDate, endDate);
    }

    const healthData = {
      metadata: {
        deviceId: await this.getDeviceId(),
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
      // Steps
      const steps = await this.queryQuantityData('stepCount', startDate, endDate, 'count');
      if (steps) healthData.metrics.steps = steps;

      // Heart Rate
      const heartRate = await this.queryQuantityData('heartRate', startDate, endDate, 'count/min');
      if (heartRate) healthData.metrics.heartRate = heartRate;

      // Continue with other metrics...
      // (Rest of the original implementation)

    } catch (error) {
      console.error('Error fetching health data:', error);
    }

    return healthData;
  }

  // Generate mock health data for testing
  generateMockHealthData(startDate, endDate) {
    const now = new Date();
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
            value: Math.floor(Math.random() * 5000) + 3000,
            unit: 'count',
            timestamp: now.toISOString()
          }],
          latest: {
            value: Math.floor(Math.random() * 5000) + 3000,
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

  // Query quantity data (original implementation)
  async queryQuantityData(quantityType, startDate, endDate, unit) {
    try {
      console.log(`Querying ${quantityType} from ${startDate} to ${endDate}`);
      
      const result = await this.healthPlugin.queryQuantity({
        quantityType: quantityType,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        limit: 100
      });

      console.log(`Query result for ${quantityType}:`, result);
      
      if (result && result.data && result.data.length > 0) {
        return this.processHealthSamples(result.data, unit, quantityType);
      }
    } catch (error) {
      console.error(`Error querying ${quantityType}:`, error);
    }
    return null;
  }

  // Cleanup on disconnect
  async disconnect() {
    // Clear mock interval if running
    if (this.mockInterval) {
      clearInterval(this.mockInterval);
      this.mockInterval = null;
    }
    
    // Call parent disconnect
    return super.disconnect();
  }

  // Query sleep data
  async querySleepData(startDate, endDate) {
    try {
      const result = await this.healthPlugin.queryCategorySamples({
        categoryType: 'sleepAnalysis',
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        limit: 100
      });

      if (result && result.data && result.data.length > 0) {
        return this.processSleepData(result.data);
      }
    } catch (error) {
      console.error('Error querying sleep data:', error);
    }
    return null;
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

  // Override value extraction for Apple Health specific format
  extractValue(sample, metricType) {
    return parseFloat(sample.quantity || sample.value || 0);
  }

  extractTimestamp(sample) {
    return sample.startDate || sample.date || new Date().toISOString();
  }

  extractMetadata(sample) {
    return {
      uuid: sample.uuid || sample.id,
      device: sample.device || sample.sourceName || 'Apple Health',
      startDate: sample.startDate,
      endDate: sample.endDate
    };
  }

  // Enable background delivery for real-time updates
  async enableBackgroundDelivery() {
    if (!this.healthPlugin || !this.healthPlugin.enableBackgroundDelivery) {
      console.log('Background delivery not supported');
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
}

// Export singleton instance
const appleHealthKitService = new AppleHealthKitService();
export default appleHealthKitService;