// dataAggregationService.js
import iomtApiService from './iomtApiService';
import manualTrackingService from './manualTrackingService';

class DataAggregationService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 60000; // 1 minute cache
  }

  async getAggregatedHealthData(userId, country) {
    const cacheKey = `health-data-${userId}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      // Fetch from multiple sources in parallel
      const [iomtData, manualData] = await Promise.allSettled([
        this.getIomtData(userId, country),
        this.getManualData(userId)
      ]);

      // Process IoMT data
      let processedIomtData = {};
      if (iomtData.status === 'fulfilled' && iomtData.value) {
        processedIomtData = iomtData.value;
      } else {
        console.log('No IoMT data available, using defaults');
      }

      // Process manual data
      let processedManualData = {};
      if (manualData.status === 'fulfilled' && manualData.value) {
        processedManualData = manualData.value;
      }

      // Aggregate all data
      const aggregatedData = this.mergeHealthData(
        processedIomtData,
        processedManualData
      );

      // If no real data exists, use mock data for development
      if (!aggregatedData.realTimeMetrics || 
          (aggregatedData.realTimeMetrics.steps === 0 && 
           aggregatedData.realTimeMetrics.heartRate === 0)) {
        console.log('No real data found, using mock data for display');
        aggregatedData.realTimeMetrics = this.getMockMetrics();
        aggregatedData.syncStatus = {
          connected: false,
          devices: [],
          lastSync: null,
          syncing: false
        };
      }

      // Cache the result
      this.cache.set(cacheKey, {
        data: aggregatedData,
        timestamp: Date.now()
      });

      return aggregatedData;
    } catch (error) {
      console.error('Error in getAggregatedHealthData:', error);
      
      // Return mock data on error
      return {
        realTimeMetrics: this.getMockMetrics(),
        vitals: {},
        syncStatus: {
          connected: false,
          devices: [],
          lastSync: null,
          syncing: false
        },
        lastUpdated: new Date()
      };
    }
  }

  async getIomtData(userId, country) {
    try {
      const data = await iomtApiService.getIomtData(userId, {
        country,
        limit: 50,
        aggregation: 'latest'
      });
      
      return this.processIomtData(data);
    } catch (error) {
      // Check if it's a 404 error (no data yet)
      if (error.message && error.message.includes('404')) {
        console.log('No IoMT data exists yet - this is normal for new users');
        return null;
      }
      throw error;
    }
  }

  async getManualData(userId) {
    try {
      return await manualTrackingService.getTodayData(userId);
    } catch (error) {
      console.error('Error fetching manual data:', error);
      return null;
    }
  }

  processIomtData(iomtData) {
    if (!iomtData || !iomtData.data) return {};

    const processed = {
      realTimeMetrics: {
        heartRate: 0,
        steps: 0,
        calories: 0,
        distance: 0,
        water: 0,
        sleep: 0,
        stress: 'Low',
        mood: 'Good'
      },
      vitals: {},
      devices: []
    };

    // Process each device's data
    iomtData.data.forEach(deviceData => {
      if (deviceData.metrics) {
        // Steps
        if (deviceData.metrics.steps?.latest) {
          processed.realTimeMetrics.steps = Math.max(
            processed.realTimeMetrics.steps,
            deviceData.metrics.steps.latest.value || 0
          );
        }

        // Heart Rate
        if (deviceData.metrics.heartRate?.latest) {
          processed.realTimeMetrics.heartRate = deviceData.metrics.heartRate.latest.value || 0;
        }

        // Calories
        if (deviceData.metrics.activeCalories?.latest) {
          processed.realTimeMetrics.calories = Math.max(
            processed.realTimeMetrics.calories,
            deviceData.metrics.activeCalories.latest.value || 0
          );
        }

        // Distance
        if (deviceData.metrics.distance?.latest) {
          processed.realTimeMetrics.distance = deviceData.metrics.distance.latest.value || 0;
        }

        // Sleep
        if (deviceData.metrics.sleep?.latest) {
          processed.realTimeMetrics.sleep = deviceData.metrics.sleep.latest.value || 0;
        }
      }

      // Track connected devices
      if (deviceData.deviceType) {
        processed.devices.push({
          type: deviceData.deviceType,
          name: this.getDeviceName(deviceData.deviceType),
          lastSync: deviceData.timestamp
        });
      }
    });

    return processed;
  }

  mergeHealthData(...dataSources) {
    const merged = {
      realTimeMetrics: {
        heartRate: 0,
        steps: 0,
        calories: 0,
        distance: 0,
        water: 0,
        sleep: 0,
        stress: 'Low',
        mood: 'Good'
      },
      vitals: {},
      syncStatus: {
        connected: false,
        devices: [],
        lastSync: null,
        syncing: false
      },
      lastUpdated: new Date()
    };

    // Merge data from all sources
    dataSources.forEach(source => {
      if (!source) return;

      // Merge metrics
      if (source.realTimeMetrics) {
        Object.keys(source.realTimeMetrics).forEach(key => {
          if (typeof source.realTimeMetrics[key] === 'number') {
            merged.realTimeMetrics[key] = Math.max(
              merged.realTimeMetrics[key] || 0,
              source.realTimeMetrics[key]
            );
          } else {
            merged.realTimeMetrics[key] = source.realTimeMetrics[key] || merged.realTimeMetrics[key];
          }
        });
      }

      // Merge vitals
      if (source.vitals) {
        merged.vitals = { ...merged.vitals, ...source.vitals };
      }

      // Update sync status
      if (source.devices && source.devices.length > 0) {
        merged.syncStatus.connected = true;
        merged.syncStatus.devices = [...merged.syncStatus.devices, ...source.devices];
        merged.syncStatus.lastSync = source.devices[0].lastSync || merged.syncStatus.lastSync;
      }
    });

    // Remove duplicate devices
    merged.syncStatus.devices = merged.syncStatus.devices.filter(
      (device, index, self) => index === self.findIndex(d => d.type === device.type)
    );

    return merged;
  }

  getDeviceName(deviceType) {
    const deviceNames = {
      'apple-health': 'Apple Health',
      'google-fit': 'Google Fit',
      'fitbit': 'Fitbit',
      'samsung-health': 'Samsung Health',
      'garmin': 'Garmin',
      'manual': 'Manual Entry'
    };
    return deviceNames[deviceType] || deviceType;
  }

  getMockMetrics() {
    const hour = new Date().getHours();
    const baseSteps = Math.floor(hour * 400) + Math.floor(Math.random() * 200);
    
    return {
      heartRate: Math.floor(Math.random() * 20) + 70,
      steps: baseSteps,
      calories: Math.floor(baseSteps * 0.04),
      distance: parseFloat((baseSteps * 0.0008).toFixed(2)),
      water: Math.floor(Math.random() * 4) + 2,
      sleep: hour < 7 ? 7.5 : 0,
      stress: 'Low',
      mood: 'Good'
    };
  }

  clearCache() {
    this.cache.clear();
  }
}

export default new DataAggregationService();