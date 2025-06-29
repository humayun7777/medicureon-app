// baseDeviceService.js
// Base class for all IoMT device integrations

import { Capacitor } from '@capacitor/core';
import iomtApiService from './iomtApiService';

export class BaseDeviceService {
  constructor(deviceType, deviceName) {
    this.deviceType = deviceType;
    this.deviceName = deviceName;
    this.isNative = Capacitor.isNativePlatform();
    this.platform = Capacitor.getPlatform();
    this.syncInterval = null;
    this.lastSyncTime = null;
    this.userId = null;
    this.userProfile = null;
    this.isConnected = false;
    this.syncInProgress = false;
    this.connectionKey = `${deviceType}Connection`;
    this.syncFrequency = 5 * 60 * 1000; // 5 minutes default
  }

  // Abstract methods to be implemented by subclasses
  async checkAvailability() {
    throw new Error('checkAvailability must be implemented by subclass');
  }

  async requestPermissions() {
    throw new Error('requestPermissions must be implemented by subclass');
  }

  async fetchHealthData(startDate, endDate) {
    throw new Error('fetchHealthData must be implemented by subclass');
  }

  // Common initialization logic
  async initialize(userId, userProfile = null) {
    this.userId = userId;
    this.userProfile = userProfile;
    
    console.log(`Initializing ${this.deviceName}...`);
    console.log('Platform:', this.platform);
    console.log('Is Native:', this.isNative);

    try {
      // Check if device/platform is supported
      const availability = await this.checkAvailability();
      if (!availability.available) {
        return {
          success: false,
          message: availability.message || `${this.deviceName} is not available`,
          requiresApp: availability.requiresApp
        };
      }

      // Request permissions
      const permissions = await this.requestPermissions();
      if (!permissions.success) {
        return {
          success: false,
          message: permissions.message || 'Permissions denied'
        };
      }

      // Mark as connected
      this.isConnected = true;
      await this.saveConnectionStatus(true);

      // Start sync
      await this.startAutomaticSync();

      return {
        success: true,
        message: `${this.deviceName} connected successfully`
      };
    } catch (error) {
      console.error(`${this.deviceName} initialization failed:`, error);
      return {
        success: false,
        message: error.message || `Failed to initialize ${this.deviceName}`
      };
    }
  }

  // Common sync logic
  async startAutomaticSync() {
    // Initial sync
    await this.performInitialSync();
    
    // Set up periodic sync
    this.syncInterval = setInterval(async () => {
      if (!this.syncInProgress) {
        await this.syncRecentData();
      }
    }, this.syncFrequency);

    console.log(`Automatic sync started for ${this.deviceName}`);
  }

  async performInitialSync() {
    console.log(`Starting initial ${this.deviceName} data sync...`);
    this.syncInProgress = true;
    
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30); // Last 30 days

      const healthData = await this.fetchHealthData(startDate, endDate);
      
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

  async syncRecentData() {
    if (!this.lastSyncTime) {
      await this.performInitialSync();
      return;
    }

    console.log(`Syncing recent ${this.deviceName} data...`);
    this.syncInProgress = true;
    
    try {
      const endDate = new Date();
      const startDate = new Date(this.lastSyncTime);

      const healthData = await this.fetchHealthData(startDate, endDate);
      
      if (healthData && Object.keys(healthData.metrics).length > 0) {
        await this.sendToBackend(healthData, 'periodic');
        this.lastSyncTime = new Date();
        this.updateLocalHealthMetrics(healthData);
      }
    } catch (error) {
      console.error('Recent sync failed:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  // Common data processing methods
  processHealthSamples(samples, unit, metricType) {
    const processed = {
      values: [],
      latest: null,
      aggregates: {}
    };

    if (!samples || samples.length === 0) return processed;

    // Convert samples to standard format
    samples.forEach(sample => {
      const value = {
        value: this.extractValue(sample, metricType),
        unit: unit,
        timestamp: this.extractTimestamp(sample),
        source: this.deviceName,
        metadata: this.extractMetadata(sample)
      };
      
      if (value.value !== null && value.value !== undefined) {
        processed.values.push(value);
      }
    });

    // Sort by timestamp (newest first)
    processed.values.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Set latest value and calculate aggregates
    if (processed.values.length > 0) {
      processed.latest = processed.values[0];
      
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

  // Helper methods to extract data (can be overridden by subclasses)
  extractValue(sample, metricType) {
    return parseFloat(
      sample.value || 
      sample.quantity || 
      sample.count || 
      sample.measurement || 
      0
    );
  }

  extractTimestamp(sample) {
    return sample.timestamp || 
           sample.startDate || 
           sample.date || 
           sample.recordedAt || 
           new Date().toISOString();
  }

  extractMetadata(sample) {
    return {
      uuid: sample.uuid || sample.id || sample.identifier,
      device: sample.device || sample.source || this.deviceType,
      raw: sample
    };
  }

  // Send data to backend
  async sendToBackend(healthData, syncType = 'periodic') {
    try {
      const country = this.getUserCountry();
      
      const deviceData = {
        deviceId: healthData.metadata.deviceId,
        deviceType: this.deviceType,
        timestamp: new Date().toISOString(),
        syncType: syncType,
        dataVersion: '2.0',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        batteryLevel: await this.getBatteryLevel(),
        firmwareVersion: await this.getOSVersion(),
        metrics: healthData.metrics
      };

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
      const updates = {};
      
      if (healthData.metrics.steps?.latest) {
        updates.todaySteps = healthData.metrics.steps.latest.value.toString();
      }
      
      if (healthData.metrics.activeCalories?.latest) {
        updates.todayCalories = healthData.metrics.activeCalories.latest.value.toString();
      }
      
      if (healthData.metrics.heartRate?.latest) {
        updates.currentHeartRate = healthData.metrics.heartRate.latest.value.toString();
      }
      
      if (healthData.metrics.water?.latest) {
        updates.todayWater = Math.round(healthData.metrics.water.latest.value / 250).toString();
      }
      
      if (healthData.metrics.sleep?.latest) {
        updates.lastNightSleep = healthData.metrics.sleep.latest.value.toString();
      }

      // Store all updates
      Object.entries(updates).forEach(([key, value]) => {
        localStorage.setItem(key, value);
      });

      // Store device-specific metrics
      localStorage.setItem(
        `${this.deviceType}_metrics`, 
        JSON.stringify({
          ...updates,
          lastSync: new Date().toISOString(),
          deviceName: this.deviceName
        })
      );

      // Trigger update event
      window.dispatchEvent(new CustomEvent('healthDataUpdated', {
        detail: { 
          metrics: healthData.metrics,
          device: this.deviceType 
        }
      }));
    } catch (error) {
      console.error('Error updating local metrics:', error);
    }
  }

  // Common utility methods
  getUserCountry() {
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

  async getDeviceId() {
    try {
      if (this.isNative && Capacitor.getPlatform() !== 'web') {
        const { Device } = await import('@capacitor/device').catch(() => ({}));
        if (Device && Device.getInfo) {
          const info = await Device.getInfo();
          return info.identifier || info.uuid || `${this.deviceType}-unknown`;
        }
      }
    } catch (error) {
      console.error('Error getting device ID:', error);
    }
    return `${this.deviceType}-${Date.now()}`;
  }

  async getBatteryLevel() {
    try {
      if (this.isNative && Capacitor.getPlatform() !== 'web') {
        const { Device } = await import('@capacitor/device').catch(() => ({}));
        if (Device && Device.getBatteryInfo) {
          const battery = await Device.getBatteryInfo();
          return Math.round((battery.batteryLevel || 1) * 100);
        }
      }
    } catch (error) {
      console.error('Error getting battery level:', error);
    }
    return 100;
  }

  async getOSVersion() {
    try {
      if (this.isNative && Capacitor.getPlatform() !== 'web') {
        const { Device } = await import('@capacitor/device').catch(() => ({}));
        if (Device && Device.getInfo) {
          const info = await Device.getInfo();
          return `${info.platform} ${info.osVersion}`;
        }
      }
    } catch (error) {
      console.error('Error getting OS version:', error);
    }
    return this.platform;
  }

  // Connection management
  isDeviceConnected() {
    return this.isConnected;
  }

  getConnectionStatus() {
    try {
      const status = localStorage.getItem(this.connectionKey);
      return status ? JSON.parse(status) : { connected: false };
    } catch (error) {
      return { connected: false };
    }
  }

  async saveConnectionStatus(connected) {
    const status = {
      connected,
      deviceType: this.deviceType,
      deviceName: this.deviceName,
      lastSync: this.lastSyncTime?.toISOString() || null,
      userId: this.userId,
      platform: this.platform
    };
    localStorage.setItem(this.connectionKey, JSON.stringify(status));
  }

  async disconnect() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
    
    this.isConnected = false;
    this.lastSyncTime = null;
    
    await this.saveConnectionStatus(false);
    
    return { 
      success: true, 
      message: `Disconnected from ${this.deviceName}` 
    };
  }

  getSyncStatus() {
    return {
      connected: this.isConnected,
      lastSync: this.lastSyncTime,
      platform: this.platform,
      syncInProgress: this.syncInProgress,
      deviceType: this.deviceType,
      deviceName: this.deviceName
    };
  }

  async manualSync() {
    console.log(`Manual sync triggered for ${this.deviceName}`);
    if (!this.isConnected) {
      throw new Error(`${this.deviceName} not connected`);
    }
    
    await this.syncRecentData();
    return { 
      success: true, 
      message: 'Manual sync completed' 
    };
  }

  // Get latest metrics
  async getLatestMetrics() {
    try {
      // First check localStorage
      const cachedMetrics = {
        steps: parseInt(localStorage.getItem('todaySteps') || '0'),
        calories: parseInt(localStorage.getItem('todayCalories') || '0'),
        heartRate: parseInt(localStorage.getItem('currentHeartRate') || '0'),
        water: parseInt(localStorage.getItem('todayWater') || '0'),
        sleep: parseFloat(localStorage.getItem('lastNightSleep') || '0')
      };

      // If connected and not syncing, fetch fresh data
      if (this.isConnected && !this.syncInProgress) {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setHours(0, 0, 0, 0);

        const freshData = await this.fetchHealthData(startDate, endDate);
        if (freshData) {
          this.updateLocalHealthMetrics(freshData);
          
          return {
            steps: freshData.metrics.steps?.latest?.value || cachedMetrics.steps,
            calories: freshData.metrics.activeCalories?.latest?.value || cachedMetrics.calories,
            heartRate: freshData.metrics.heartRate?.latest?.value || cachedMetrics.heartRate,
            water: freshData.metrics.water ? Math.round(freshData.metrics.water.latest.value / 250) : cachedMetrics.water,
            sleep: freshData.metrics.sleep?.latest?.value || cachedMetrics.sleep,
            device: this.deviceName,
            lastSync: this.lastSyncTime
          };
        }
      }

      return { ...cachedMetrics, device: this.deviceName, lastSync: this.lastSyncTime };
    } catch (error) {
      console.error('Error getting latest metrics:', error);
      return {
        steps: 0,
        calories: 0,
        heartRate: 0,
        water: 0,
        sleep: 0,
        device: this.deviceName,
        error: error.message
      };
    }
  }
}

export default BaseDeviceService;