// deviceManager.js
// Central manager for all IoMT device integrations

import appleHealthKitService from './appleHealthKitService';
// Future imports
// import fitbitService from './fitbitService';
// import samsungHealthService from './samsungHealthService';
// import garminService from './garminService';
// import withingsService from './withingsService';
// import ouraService from './ouraService';

class DeviceManager {
  constructor() {
    this.devices = {
      'apple': {
        service: appleHealthKitService,
        name: 'Apple Health',
        icon: '🍎',
        platforms: ['ios'],
        status: 'available'
      },
      'fitbit': {
        service: null, // fitbitService
        name: 'Fitbit',
        icon: '⌚',
        platforms: ['ios', 'android', 'web'],
        status: 'coming_soon',
        releaseDate: 'Q1 2025'
      },
      'samsung': {
        service: null, // samsungHealthService
        name: 'Samsung Health',
        icon: '📱',
        platforms: ['android'],
        status: 'coming_soon',
        releaseDate: 'Q1 2025'
      },
      'garmin': {
        service: null, // garminService
        name: 'Garmin Connect',
        icon: '🏃',
        platforms: ['ios', 'android', 'web'],
        status: 'coming_soon',
        releaseDate: 'Q2 2025'
      },
      'withings': {
        service: null, // withingsService
        name: 'Withings Health Mate',
        icon: '⚖️',
        platforms: ['ios', 'android', 'web'],
        status: 'coming_soon',
        releaseDate: 'Q2 2025'
      },
      'oura': {
        service: null, // ouraService
        name: 'Oura Ring',
        icon: '💍',
        platforms: ['ios', 'android', 'web'],
        status: 'coming_soon',
        releaseDate: 'Q3 2025'
      }
    };

    this.connectedDevices = new Set();
    this.syncInProgress = false;
    this.userId = null;
    this.userProfile = null;
  }

  // Initialize the device manager
  initialize(userId, userProfile) {
    this.userId = userId;
    this.userProfile = userProfile;
    this.loadConnectedDevices();
  }

  // Get all available devices for current platform
  getAvailableDevices() {
    const platform = this.getCurrentPlatform();
    
    return Object.entries(this.devices)
      .filter(([key, device]) => {
        // Check if device supports current platform
        return device.platforms.includes(platform) || device.platforms.includes('web');
      })
      .map(([key, device]) => ({
        key,
        ...device,
        connected: this.connectedDevices.has(key),
        canConnect: device.status === 'available' && device.service !== null
      }));
  }

  // Get current platform
  getCurrentPlatform() {
    if (typeof window !== 'undefined' && window.Capacitor) {
      return window.Capacitor.getPlatform();
    }
    return 'web';
  }

  // Connect a device
  async connectDevice(deviceKey) {
    const device = this.devices[deviceKey];
    
    if (!device || !device.service) {
      return {
        success: false,
        message: `${device?.name || 'Device'} integration not available yet`
      };
    }

    try {
      const result = await device.service.initialize(this.userId, this.userProfile);
      
      if (result.success) {
        this.connectedDevices.add(deviceKey);
        this.saveConnectedDevices();
      }
      
      return result;
    } catch (error) {
      console.error(`Error connecting ${device.name}:`, error);
      return {
        success: false,
        message: error.message || `Failed to connect ${device.name}`
      };
    }
  }

  // Disconnect a device
  async disconnectDevice(deviceKey) {
    const device = this.devices[deviceKey];
    
    if (!device || !device.service) {
      return {
        success: false,
        message: 'Device not found'
      };
    }

    try {
      const result = await device.service.disconnect();
      
      if (result.success) {
        this.connectedDevices.delete(deviceKey);
        this.saveConnectedDevices();
      }
      
      return result;
    } catch (error) {
      console.error(`Error disconnecting ${device.name}:`, error);
      return {
        success: false,
        message: error.message || `Failed to disconnect ${device.name}`
      };
    }
  }

  // Get sync status for all connected devices
  getSyncStatus() {
    const statuses = {};
    
    this.connectedDevices.forEach(deviceKey => {
      const device = this.devices[deviceKey];
      if (device && device.service) {
        statuses[deviceKey] = device.service.getSyncStatus();
      }
    });
    
    return statuses;
  }

  // Get latest metrics from all connected devices
  async getAggregatedMetrics() {
    const metrics = {
      steps: 0,
      calories: 0,
      heartRate: 0,
      water: 0,
      sleep: 0,
      devices: [],
      lastSync: null
    };

    // Get metrics from each connected device
    for (const deviceKey of this.connectedDevices) {
      const device = this.devices[deviceKey];
      if (device && device.service) {
        try {
          const deviceMetrics = await device.service.getLatestMetrics();
          
          // Aggregate metrics (taking max for activity metrics, average for vitals)
          metrics.steps = Math.max(metrics.steps, deviceMetrics.steps || 0);
          metrics.calories = Math.max(metrics.calories, deviceMetrics.calories || 0);
          metrics.water = Math.max(metrics.water, deviceMetrics.water || 0);
          metrics.sleep = Math.max(metrics.sleep, deviceMetrics.sleep || 0);
          
          // For heart rate, take the most recent non-zero value
          if (deviceMetrics.heartRate > 0) {
            metrics.heartRate = deviceMetrics.heartRate;
          }
          
          // Track which devices contributed data
          metrics.devices.push({
            key: deviceKey,
            name: device.name,
            lastSync: deviceMetrics.lastSync
          });
          
          // Update last sync time
          if (deviceMetrics.lastSync && (!metrics.lastSync || new Date(deviceMetrics.lastSync) > new Date(metrics.lastSync))) {
            metrics.lastSync = deviceMetrics.lastSync;
          }
        } catch (error) {
          console.error(`Error getting metrics from ${device.name}:`, error);
        }
      }
    }
    
    return metrics;
  }

  // Manual sync for all connected devices
  async syncAllDevices() {
    if (this.syncInProgress) {
      return {
        success: false,
        message: 'Sync already in progress'
      };
    }

    this.syncInProgress = true;
    const results = {};
    
    try {
      for (const deviceKey of this.connectedDevices) {
        const device = this.devices[deviceKey];
        if (device && device.service) {
          try {
            results[deviceKey] = await device.service.manualSync();
          } catch (error) {
            results[deviceKey] = {
              success: false,
              message: error.message
            };
          }
        }
      }
      
      return {
        success: true,
        results
      };
    } finally {
      this.syncInProgress = false;
    }
  }

  // Get device-specific metrics
  async getDeviceMetrics(deviceKey) {
    const device = this.devices[deviceKey];
    
    if (!device || !device.service) {
      throw new Error('Device not found or not connected');
    }
    
    return await device.service.getLatestMetrics();
  }

  // Check if a specific device is connected
  isDeviceConnected(deviceKey) {
    return this.connectedDevices.has(deviceKey) && 
           this.devices[deviceKey]?.service?.isDeviceConnected();
  }

  // Get connection status for a specific device
  getDeviceConnectionStatus(deviceKey) {
    const device = this.devices[deviceKey];
    
    if (!device || !device.service) {
      return { connected: false, available: false };
    }
    
    return {
      ...device.service.getConnectionStatus(),
      available: device.status === 'available'
    };
  }

  // Save connected devices to localStorage
  saveConnectedDevices() {
    localStorage.setItem('connectedDevices', JSON.stringify([...this.connectedDevices]));
  }

  // Load connected devices from localStorage
  loadConnectedDevices() {
    try {
      const saved = localStorage.getItem('connectedDevices');
      if (saved) {
        this.connectedDevices = new Set(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading connected devices:', error);
      this.connectedDevices = new Set();
    }
  }

  // Listen for health data updates
  subscribeToUpdates(callback) {
    const handler = (event) => {
      callback(event.detail);
    };
    
    window.addEventListener('healthDataUpdated', handler);
    
    // Return unsubscribe function
    return () => {
      window.removeEventListener('healthDataUpdated', handler);
    };
  }

  // Get device info
  getDeviceInfo(deviceKey) {
    return this.devices[deviceKey] || null;
  }

  // Check if any devices are connected
  hasConnectedDevices() {
    return this.connectedDevices.size > 0;
  }

  // Get list of connected device keys
  getConnectedDeviceKeys() {
    return [...this.connectedDevices];
  }

  // Future method for OAuth-based devices (Fitbit, Garmin, etc.)
  async handleOAuthCallback(deviceKey, authCode) {
    const device = this.devices[deviceKey];
    
    if (!device || !device.service || !device.service.handleOAuthCallback) {
      throw new Error('Device does not support OAuth');
    }
    
    return await device.service.handleOAuthCallback(authCode);
  }
}

// Export singleton instance
const deviceManager = new DeviceManager();
export default deviceManager;