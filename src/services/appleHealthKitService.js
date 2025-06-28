// appleHealthKitService.js
// Automated Apple HealthKit integration using Capacitor with regional data routing

import { Capacitor } from '@capacitor/core';
import iomtApiService from './iomtApiService';

class AppleHealthKitService {
  constructor() {
    this.isNative = Capacitor.isNativePlatform();
    this.healthPlugin = null;
    this.syncInterval = null;
    this.lastSyncTime = null;
    this.userId = null;
    this.userProfile = null;
    this.isConnected = false;
    this.syncInProgress = false;
  }

  // Initialize and request permissions
  async initialize(userId, userProfile = null) {
    this.userId = userId;
    this.userProfile = userProfile;
    
    if (!this.isNative) {
      console.log('Running in web mode - HealthKit not available');
      return { 
        success: false, 
        message: 'Please use the MediCureOn mobile app to connect Apple Health' 
      };
    }

    // Only works on iOS
    if (Capacitor.getPlatform() !== 'ios') {
      return {
        success: false,
        message: 'Apple Health is only available on iOS devices'
      };
    }

    try {
      // Dynamically import the health plugin
      const { CapacitorHealthkit } = await import('capacitor-health');
      this.healthPlugin = CapacitorHealthkit;

      // Request HealthKit permissions
      const permissions = await this.requestHealthKitPermissions();
      
      if (permissions.granted) {
        this.isConnected = true;
        
        // Save connection status
        await this.saveConnectionStatus(true);
        
        // Start automatic sync
        await this.startAutomaticSync();
        
        return { 
          success: true, 
          message: 'Apple Health connected successfully' 
        };
      } else {
        return { 
          success: false, 
          message: 'Health permissions denied' 
        };
      }
    } catch (error) {
      console.error('HealthKit initialization failed:', error);
      return { 
        success: false, 
        message: error.message 
      };
    }
  }

  // Request all necessary HealthKit permissions
  async requestHealthKitPermissions() {
    const readPermissions = [
      'HKQuantityTypeIdentifierStepCount',
      'HKQuantityTypeIdentifierDistanceWalkingRunning',
      'HKQuantityTypeIdentifierActiveEnergyBurned',
      'HKQuantityTypeIdentifierBasalEnergyBurned',
      'HKQuantityTypeIdentifierHeartRate',
      'HKQuantityTypeIdentifierRestingHeartRate',
      'HKQuantityTypeIdentifierHeartRateVariabilitySDNN',
      'HKQuantityTypeIdentifierBodyMass',
      'HKQuantityTypeIdentifierBodyFatPercentage',
      'HKQuantityTypeIdentifierBodyMassIndex',
      'HKQuantityTypeIdentifierOxygenSaturation',
      'HKQuantityTypeIdentifierBloodPressureSystolic',
      'HKQuantityTypeIdentifierBloodPressureDiastolic',
      'HKQuantityTypeIdentifierBloodGlucose',
      'HKQuantityTypeIdentifierBodyTemperature',
      'HKCategoryTypeIdentifierSleepAnalysis',
      'HKQuantityTypeIdentifierDietaryWater',
      'HKQuantityTypeIdentifierDietaryEnergyConsumed',
      'HKQuantityTypeIdentifierDietaryProtein',
      'HKQuantityTypeIdentifierDietaryCarbohydrates',
      'HKQuantityTypeIdentifierDietaryFatTotal',
      'HKQuantityTypeIdentifierDietaryFiber'
    ];

    try {
      const result = await this.healthPlugin.requestAuthorization({
        all: readPermissions,
        read: readPermissions,
        write: [] // We only read data
      });

      return { granted: true }; // Simplified for now
    } catch (error) {
      console.error('Permission request failed:', error);
      throw error;
    }
  }

  // Start automatic background sync
  async startAutomaticSync() {
    // Initial sync - get last 30 days of data
    await this.performInitialSync();
    
    // Set up periodic sync every 5 minutes for active data
    this.syncInterval = setInterval(async () => {
      if (!this.syncInProgress) {
        await this.syncRecentData();
      }
    }, 5 * 60 * 1000); // 5 minutes

    // Register for background updates (iOS specific)
    if (this.healthPlugin.isAvailable) {
      try {
        // Enable background delivery for critical metrics
        await this.healthPlugin.enableBackgroundDelivery({
          dataTypes: ['HKQuantityTypeIdentifierStepCount', 'HKQuantityTypeIdentifierHeartRate']
        });
      } catch (error) {
        console.error('Background delivery setup failed:', error);
      }
    }
  }

  // Perform initial sync (last 30 days)
  async performInitialSync() {
    console.log('Starting initial health data sync...');
    this.syncInProgress = true;
    
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);

      // Fetch all health data for the period
      const healthData = await this.fetchComprehensiveHealthData(startDate, endDate);
      
      // Send to backend with proper regional routing
      if (healthData && Object.keys(healthData.metrics).length > 0) {
        await this.sendToBackend(healthData, 'initial');
        this.lastSyncTime = new Date();
        console.log('Initial sync completed successfully');
      }
    } catch (error) {
      console.error('Initial sync failed:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  // Sync recent data (since last sync)
  async syncRecentData() {
    if (!this.lastSyncTime) {
      await this.performInitialSync();
      return;
    }

    console.log('Syncing recent health data...');
    this.syncInProgress = true;
    
    try {
      const endDate = new Date();
      const startDate = new Date(this.lastSyncTime);

      const healthData = await this.fetchComprehensiveHealthData(startDate, endDate);
      
      if (healthData && Object.keys(healthData.metrics).length > 0) {
        await this.sendToBackend(healthData, 'periodic');
        this.lastSyncTime = new Date();
        
        // Update local storage for immediate UI updates
        this.updateLocalHealthMetrics(healthData);
      }
    } catch (error) {
      console.error('Recent sync failed:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  // Fetch comprehensive health data from HealthKit
  async fetchComprehensiveHealthData(startDate, endDate) {
    const healthData = {
      metadata: {
        deviceId: await this.getDeviceId(),
        deviceType: 'apple-health',
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
      const steps = await this.queryHealthData('HKQuantityTypeIdentifierStepCount', startDate, endDate, 'count');
      if (steps) healthData.metrics.steps = steps;

      // Heart Rate
      const heartRate = await this.queryHealthData('HKQuantityTypeIdentifierHeartRate', startDate, endDate, 'count/min');
      if (heartRate) healthData.metrics.heartRate = heartRate;

      // Active Calories
      const activeCalories = await this.queryHealthData('HKQuantityTypeIdentifierActiveEnergyBurned', startDate, endDate, 'kcal');
      if (activeCalories) healthData.metrics.activeCalories = activeCalories;

      // Distance
      const distance = await this.queryHealthData('HKQuantityTypeIdentifierDistanceWalkingRunning', startDate, endDate, 'm');
      if (distance) healthData.metrics.distance = distance;

      // Weight
      const weight = await this.queryHealthData('HKQuantityTypeIdentifierBodyMass', startDate, endDate, 'kg');
      if (weight) healthData.metrics.weight = weight;

      // Blood Pressure
      const systolic = await this.queryHealthData('HKQuantityTypeIdentifierBloodPressureSystolic', startDate, endDate, 'mmHg');
      if (systolic) healthData.metrics.bloodPressureSystolic = systolic;

      const diastolic = await this.queryHealthData('HKQuantityTypeIdentifierBloodPressureDiastolic', startDate, endDate, 'mmHg');
      if (diastolic) healthData.metrics.bloodPressureDiastolic = diastolic;

      // Blood Glucose
      const glucose = await this.queryHealthData('HKQuantityTypeIdentifierBloodGlucose', startDate, endDate, 'mg/dL');
      if (glucose) healthData.metrics.bloodGlucose = glucose;

      // Sleep
      const sleep = await this.querySleepData(startDate, endDate);
      if (sleep) healthData.metrics.sleep = sleep;

      // Water intake
      const water = await this.queryHealthData('HKQuantityTypeIdentifierDietaryWater', startDate, endDate, 'ml');
      if (water) healthData.metrics.water = water;

    } catch (error) {
      console.error('Error fetching health data:', error);
    }

    return healthData;
  }

  // Query specific health data type
  async queryHealthData(dataType, startDate, endDate, unit) {
    try {
      const result = await this.healthPlugin.queryQuantity({
        sampleName: dataType,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        unit: unit
      });

      if (result && result.resultCount > 0) {
        return this.processHealthSamples(result.results, unit);
      }
    } catch (error) {
      console.error(`Error querying ${dataType}:`, error);
    }
    return null;
  }

  // Query sleep data
  async querySleepData(startDate, endDate) {
    try {
      const result = await this.healthPlugin.queryCategorySamples({
        sampleName: 'HKCategoryTypeIdentifierSleepAnalysis',
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      });

      if (result && result.resultCount > 0) {
        return this.processSleepData(result.results);
      }
    } catch (error) {
      console.error('Error querying sleep data:', error);
    }
    return null;
  }

  // Process health samples into our format
  processHealthSamples(samples, unit) {
    const processed = {
      values: [],
      latest: null,
      aggregates: {}
    };

    // Convert samples to our format
    samples.forEach(sample => {
      const value = {
        value: parseFloat(sample.quantity),
        unit: unit,
        timestamp: sample.startDate,
        source: sample.sourceName || 'Apple Health',
        metadata: {
          uuid: sample.UUID,
          device: sample.device || 'Unknown'
        }
      };
      
      processed.values.push(value);
    });

    // Sort by timestamp (newest first)
    processed.values.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Set latest value
    if (processed.values.length > 0) {
      processed.latest = processed.values[0];
      
      // Calculate aggregates
      const values = processed.values.map(v => v.value);
      processed.aggregates = {
        min: Math.min(...values),
        max: Math.max(...values),
        avg: values.reduce((a, b) => a + b, 0) / values.length,
        sum: values.reduce((a, b) => a + b, 0),
        count: values.length
      };
    }

    return processed;
  }

  // Process sleep data
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
        type: sample.value // Sleep stage if available
      });
    });

    // Convert to hours and calculate latest
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

  // Send data to backend with regional routing
  async sendToBackend(healthData, syncType = 'periodic') {
    try {
      // Get user's country from profile or localStorage
      const country = this.getUserCountry();
      
      const deviceData = {
        deviceId: healthData.metadata.deviceId,
        deviceType: 'apple-health',
        timestamp: new Date().toISOString(),
        syncType: syncType,
        dataVersion: '1.0',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        batteryLevel: await this.getBatteryLevel(),
        firmwareVersion: await this.getOSVersion(),
        metrics: healthData.metrics
      };

      // Send to backend with country for regional routing
      const result = await iomtApiService.saveIomtData(this.userId, deviceData, country);
      
      console.log(`Health data synced successfully to ${result.savedTo?.region || 'default'} region`);
      return result;
    } catch (error) {
      console.error('Backend sync failed:', error);
      throw error;
    }
  }

  // Update local storage for immediate UI updates
  updateLocalHealthMetrics(healthData) {
    try {
      // Update today's metrics in localStorage for immediate display
      if (healthData.metrics.steps?.latest) {
        localStorage.setItem('todaySteps', healthData.metrics.steps.latest.value.toString());
      }
      
      if (healthData.metrics.activeCalories?.latest) {
        localStorage.setItem('todayCalories', healthData.metrics.activeCalories.latest.value.toString());
      }
      
      if (healthData.metrics.heartRate?.latest) {
        localStorage.setItem('currentHeartRate', healthData.metrics.heartRate.latest.value.toString());
      }
      
      if (healthData.metrics.water?.latest) {
        const glasses = Math.round(healthData.metrics.water.latest.value / 250); // 250ml per glass
        localStorage.setItem('todayWater', glasses.toString());
      }
      
      if (healthData.metrics.sleep?.latest) {
        localStorage.setItem('lastNightSleep', healthData.metrics.sleep.latest.value.toString());
      }

      // Trigger custom event for UI update
      window.dispatchEvent(new CustomEvent('healthDataUpdated', {
        detail: { metrics: healthData.metrics }
      }));
    } catch (error) {
      console.error('Error updating local metrics:', error);
    }
  }

  // Get user's country for regional data routing
  getUserCountry() {
    // Priority order:
    // 1. From current user profile (if passed during initialization)
    // 2. From stored profile data
    // 3. From localStorage
    // 4. Default to United States
    
    if (this.userProfile?.generalInfo?.country) {
      return this.userProfile.generalInfo.country;
    }
    
    try {
      const storedProfile = localStorage.getItem('userProfile');
      if (storedProfile) {
        const profile = JSON.parse(storedProfile);
        if (profile.generalInfo?.country) {
          return profile.generalInfo.country;
        }
      }
    } catch (error) {
      console.error('Error parsing stored profile:', error);
    }
    
    return localStorage.getItem('userCountry') || 'United States';
  }

  // Get device information
  async getDeviceId() {
    try {
      if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Device) {
        const info = await window.Capacitor.Plugins.Device.getInfo();
        return info.identifier || info.uuid || 'apple-health-unknown';
      }
    } catch (error) {
      console.error('Error getting device ID:', error);
    }
    return 'apple-health-' + Date.now();
  }

  async getBatteryLevel() {
    try {
      if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Device) {
        const battery = await window.Capacitor.Plugins.Device.getBatteryInfo();
        return Math.round((battery.batteryLevel || 1) * 100);
      }
    } catch (error) {
      console.error('Error getting battery level:', error);
    }
    return 100;
  }

  async getOSVersion() {
    try {
      if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Device) {
        const info = await window.Capacitor.Plugins.Device.getInfo();
        return `${info.platform} ${info.osVersion}`;
      }
    } catch (error) {
      console.error('Error getting OS version:', error);
    }
    return 'iOS';
  }

  // Check connection status
  isHealthKitConnected() {
    return this.isConnected;
  }

  // Get connection status from storage
  getConnectionStatus() {
    try {
      const status = localStorage.getItem('appleHealthConnection');
      return status ? JSON.parse(status) : { connected: false };
    } catch (error) {
      return { connected: false };
    }
  }

  // Save connection status
  async saveConnectionStatus(connected) {
    const status = {
      connected,
      deviceType: 'apple-health',
      lastSync: this.lastSyncTime?.toISOString() || null,
      userId: this.userId,
      platform: Capacitor.getPlatform()
    };
    localStorage.setItem('appleHealthConnection', JSON.stringify(status));
  }

  // Disconnect from HealthKit
  async disconnect() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
    
    this.isConnected = false;
    this.lastSyncTime = null;
    
    await this.saveConnectionStatus(false);
    
    return { success: true, message: 'Disconnected from Apple Health' };
  }

  // Get sync status
  getSyncStatus() {
    return {
      connected: this.isConnected,
      lastSync: this.lastSyncTime,
      platform: Capacitor.getPlatform(),
      syncInProgress: this.syncInProgress
    };
  }

  // Get latest health metrics for display
  async getLatestMetrics() {
    try {
      // First check localStorage for immediate display
      const cachedMetrics = {
        steps: parseInt(localStorage.getItem('todaySteps') || '0'),
        calories: parseInt(localStorage.getItem('todayCalories') || '0'),
        heartRate: parseInt(localStorage.getItem('currentHeartRate') || '0'),
        water: parseInt(localStorage.getItem('todayWater') || '0'),
        sleep: parseFloat(localStorage.getItem('lastNightSleep') || '0')
      };

      // If connected, fetch fresh data
      if (this.isConnected && !this.syncInProgress) {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setHours(0, 0, 0, 0); // Start of today

        const freshData = await this.fetchComprehensiveHealthData(startDate, endDate);
        if (freshData) {
          this.updateLocalHealthMetrics(freshData);
          
          // Return fresh metrics
          return {
            steps: freshData.metrics.steps?.latest?.value || cachedMetrics.steps,
            calories: freshData.metrics.activeCalories?.latest?.value || cachedMetrics.calories,
            heartRate: freshData.metrics.heartRate?.latest?.value || cachedMetrics.heartRate,
            water: freshData.metrics.water ? Math.round(freshData.metrics.water.latest.value / 250) : cachedMetrics.water,
            sleep: freshData.metrics.sleep?.latest?.value || cachedMetrics.sleep
          };
        }
      }

      return cachedMetrics;
    } catch (error) {
      console.error('Error getting latest metrics:', error);
      return {
        steps: 0,
        calories: 0,
        heartRate: 0,
        water: 0,
        sleep: 0
      };
    }
  }
}

// Export singleton instance
const appleHealthKitService = new AppleHealthKitService();
export default appleHealthKitService;