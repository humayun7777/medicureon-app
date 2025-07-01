// appleHealthKitService.js
// Updated to use our custom HealthKit bridge - no more plugin conflicts!

import { Capacitor } from '@capacitor/core';
import CapacitorHealthKit from './healthKitBridge';
import BaseDeviceService from './baseDeviceService';


class AppleHealthKitService extends BaseDeviceService {
  constructor() {
    super('apple-health', 'Apple Health');
    this.mockInterval = null;
    this.isPluginInitialized = false;
  }

  // Override initialize to handle all platforms correctly
  async initialize(userId, userProfile = null) {
    console.log('🏥 Initializing Apple HealthKit Service...');
    console.log('👤 UserId:', userId);
    console.log('📱 Platform:', Capacitor.getPlatform());
    console.log('🔧 Is Native:', Capacitor.isNativePlatform());
    
    this.userId = userId;
    this.userProfile = userProfile;
    
    const platform = Capacitor.getPlatform();
    
    // iOS Native Platform
    if (Capacitor.isNativePlatform() && platform === 'ios') {
      console.log('🍎 Detected iOS native platform, initializing HealthKit...');
      
      try {
        // Check HealthKit availability using our custom plugin
        const availability = await CapacitorHealthKit.isAvailable();
        if (!availability.available) {
          return {
            success: false,
            message: 'HealthKit is not available on this device',
            step: 'availability_check'
          };
        }
        
        // Request permissions using our custom plugin
        const permissions = await CapacitorHealthKit.requestAuthorization({
          permissions: ['steps', 'heartRate', 'calories', 'distance']
        });
        
        if (!permissions.granted) {
          return {
            success: false,
            message: 'HealthKit permissions were denied',
            step: 'permission_request'
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
          message: 'Apple Health connected successfully! 🎉',
          deviceId: this.deviceId
        };
        
      } catch (error) {
        console.error('❌ Error initializing HealthKit:', error);
        return {
          success: false,
          message: `Failed to initialize Apple Health: ${error.message}`,
          step: 'general_error',
          error: error.toString()
        };
      }
    }
    
    // Web Platform - Mock Mode
    if (platform === 'web') {
      console.log('🌐 Running on web platform - activating mock mode');
      
      this.isInitialized = true;
      this.isConnected = true;
      this.platform = 'web';
      this.isNative = false;
      
      // Start mock data sync for testing
      await this.startMockDataSync();
      
      return {
        success: true,
        message: 'Mock mode activated for web testing 🧪',
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

  // Perform initial sync after connection
  async performInitialSync() {
    if (!this.isConnected) {
      console.log('⚠️ Cannot sync - not connected to HealthKit');
      return;
    }

    console.log('🔄 Performing initial HealthKit sync...');

    try {
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const options = {
        startDate: yesterday.toISOString(),
        endDate: now.toISOString()
      };

      // Fetch health data using our custom plugin
      const [steps, heartRate, calories, distance] = await Promise.all([
        CapacitorHealthKit.querySteps(options).catch(err => {
          console.warn('Steps query failed:', err);
          return { value: 0, unit: 'count' };
        }),
        CapacitorHealthKit.queryHeartRate(options).catch(err => {
          console.warn('Heart rate query failed:', err);
          return { value: 0, unit: 'bpm' };
        }),
        CapacitorHealthKit.queryCalories(options).catch(err => {
          console.warn('Calories query failed:', err);
          return { value: 0, unit: 'kcal' };
        }),
        CapacitorHealthKit.queryDistance(options).catch(err => {
          console.warn('Distance query failed:', err);
          return { value: 0, unit: 'm' };
        })
      ]);

      const healthData = {
        metadata: {
          deviceId: this.deviceId,
          deviceType: 'apple-health',
          timestamp: now.toISOString(),
          syncPeriod: {
            start: yesterday.toISOString(),
            end: now.toISOString()
          }
        },
        metrics: {
          steps: {
            values: [{
              value: steps.value,
              unit: steps.unit,
              timestamp: now.toISOString(),
              metadata: {
                device: 'iPhone',
                source: 'Apple Health'
              }
            }],
            latest: {
              value: steps.value,
              unit: steps.unit,
              timestamp: now.toISOString()
            },
            aggregates: {
              total: steps.value,
              avg: steps.value
            }
          },
          heartRate: {
            values: [{
              value: heartRate.value,
              unit: heartRate.unit,
              timestamp: now.toISOString()
            }],
            latest: {
              value: heartRate.value,
              unit: heartRate.unit,
              timestamp: now.toISOString()
            }
          },
          activeCalories: {
            values: [{
              value: calories.value,
              unit: calories.unit,
              timestamp: now.toISOString()
            }],
            latest: {
              value: calories.value,
              unit: calories.unit,
              timestamp: now.toISOString()
            }
          },
          distance: {
            values: [{
              value: distance.value,
              unit: distance.unit,
              timestamp: now.toISOString()
            }],
            latest: {
              value: distance.value,
              unit: distance.unit,
              timestamp: now.toISOString()
            }
          }
        }
      };

      // Send to backend
      await this.sendToBackend(healthData, 'initial_sync');
      
      console.log('✅ Initial sync completed successfully');
      
    } catch (error) {
      console.error('❌ Initial sync failed:', error);
    }
  }

  // Start background sync
  startBackgroundSync() {
    console.log('🔄 Starting background sync for Apple Health');
    
    // Clear any existing interval
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
    
    // Set up periodic sync (every 5 minutes)
    this.syncInterval = setInterval(() => {
      if (this.isConnected && !this.syncInProgress) {
        this.performInitialSync(); // Reuse the same sync logic
      }
    }, this.syncFrequency || 300000); // 5 minutes
  }

  // Mock data generation for web testing
  async startMockDataSync() {
    console.log('🧪 Starting mock data sync for web testing...');
    
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
            unit: 'bpm',
            timestamp: now.toISOString()
          }],
          latest: {
            value: Math.floor(Math.random() * 20) + 70,
            unit: 'bpm',
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
      console.log('✅ Mock data sent successfully');
    } catch (error) {
      console.error('❌ Error sending mock data:', error);
    }
  }

  // Cleanup on disconnect
  async disconnect() {
    console.log('🔌 Disconnecting Apple Health...');
    
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