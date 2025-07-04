// =============================================
// IoMT API Service for MediCureOn
// Handles all IoMT data-related backend calls
// =============================================

import { apiConfig, getRegionFromCountry } from '../config/apiConfig';

class IomtApiService {
  // Save IoMT data from a device
  async saveIomtData(userId, deviceData, country = 'United States') {
    try {
      const url = `${apiConfig.backendUrl}${apiConfig.endpoints.iomt.save(userId)}?code=${apiConfig.functionKeys.iomtDataSave}`;
      
      // Prepare the data in the expected format
      const iomtData = {
        country: country,
        data: {
          metadata: {
            deviceId: deviceData.deviceId,
            deviceType: deviceData.deviceType, // 'apple-health', 'fitbit', etc.
            timestamp: deviceData.timestamp || new Date().toISOString(),
            timezone: deviceData.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
            dataVersion: deviceData.dataVersion || '2.0',
            syncType: deviceData.syncType || 'automatic'
          },
          metrics: deviceData.metrics, // { heartRate: {...}, steps: {...}, etc. }
          deviceContext: {
            batteryLevel: deviceData.batteryLevel,
            firmwareVersion: deviceData.firmwareVersion,
            lastSync: new Date().toISOString()
          }
        }
      };
      
      console.log('Saving IoMT data:', iomtData);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(iomtData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to save IoMT data: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('IoMT data saved successfully:', result);
      return result;
    } catch (error) {
      console.error('Error saving IoMT data:', error);
      throw error;
    }
  }

  // Get IoMT data for a user
  async getIomtData(userId, options = {}) {
  try {
    const { country = 'United States', startDate, endDate, limit = 50, aggregation = 'latest' } = options;
    
    let url = `${this.baseUrl}/iomt/${userId}?country=${encodeURIComponent(country)}&code=${this.functionKey}`;
    
    if (startDate) url += `&startDate=${startDate}`;
    if (endDate) url += `&endDate=${endDate}`;
    if (limit) url += `&limit=${limit}`;
    if (aggregation) url += `&aggregation=${aggregation}`;
    
    console.log('Fetching IoMT data from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders()
    });
    
    if (response.status === 404) {
      // This is expected for new users with no data yet
      console.log('No IoMT data found (404) - this is normal for new users');
      return { data: [] };
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch IoMT data: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('IoMT data fetched successfully:', data);
    
    return data;
  } catch (error) {
    console.error('Error fetching IoMT data:', error);
    throw error;
  }
}

  // Get aggregated data from all devices
  async getAllDeviceData(userId, options = {}) {
    // Use the same endpoint with different parameters
    return this.getIomtData(userId, {
      ...options,
      aggregation: 'by-device'
    });
  }

  // Example: Save Apple Watch data
  async saveAppleWatchData(userId, healthData, country) {
    const deviceData = {
      deviceId: healthData.deviceId || 'apple-watch-default',
      deviceType: 'apple-watch',
      metrics: {
        heartRate: {
          value: healthData.heartRate,
          unit: 'bpm',
          context: healthData.context || 'resting'
        },
        steps: {
          value: healthData.steps,
          unit: 'count',
          period: 'daily'
        },
        activeCalories: {
          value: healthData.activeCalories,
          unit: 'kcal'
        },
        // Add more metrics as needed
      },
      batteryLevel: healthData.batteryLevel || 100,
      firmwareVersion: healthData.firmwareVersion || 'watchOS 10.0'
    };
    
    return this.saveIomtData(userId, deviceData, country);
  }

  // Example: Save Fitbit data
  async saveFitbitData(userId, fitbitData, country) {
    const deviceData = {
      deviceId: fitbitData.deviceId || 'fitbit-default',
      deviceType: 'fitbit',
      metrics: {
        heartRate: {
          value: fitbitData.heartRate?.value,
          unit: 'bpm',
          context: 'average'
        },
        steps: {
          value: fitbitData.steps,
          unit: 'count',
          period: 'daily'
        },
        sleepScore: {
          value: fitbitData.sleepScore,
          unit: 'score',
          max: 100
        },
        // Add more Fitbit-specific metrics
      },
      batteryLevel: fitbitData.battery || 100,
      firmwareVersion: fitbitData.deviceVersion || 'Fitbit OS 6.0'
    };
    
    return this.saveIomtData(userId, deviceData, country);
  }

  // Get aggregated data for a specific health plan
  async getHealthPlanMetrics(userId, planType, dateRange, country) {
    // This would fetch and aggregate relevant metrics for a specific health plan
    // For example, weight loss plan would focus on steps, calories, weight trends
    const options = {
      country: country,
      startDate: dateRange.start,
      endDate: dateRange.end,
      aggregation: 'daily'
    };
    
    const data = await this.getIomtData(userId, options);
    
    // Filter and process data based on plan type
    // This is where you'd apply plan-specific logic
    return this.processDataForPlan(data, planType);
  }

  // Process data for specific health plans
  processDataForPlan(rawData, planType) {
    // This would be expanded based on your health plan requirements
    const planMetrics = {
      'weight-loss': ['steps', 'activeCalories', 'weight', 'exerciseMinutes'],
      'diabetes': ['bloodGlucose', 'steps', 'mealTiming', 'medication'],
      'heart-health': ['heartRate', 'bloodPressure', 'exerciseMinutes', 'restingHeartRate'],
      // ... other plans
    };
    
    // Filter and return only relevant metrics for the plan
    // This is a simplified example - you'd add more sophisticated processing
    return rawData;
  }
}

// Export singleton instance
const iomtApiService = new IomtApiService();
export default iomtApiService;