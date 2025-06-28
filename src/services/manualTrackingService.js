// src/services/manualTrackingService.js
import { apiConfig } from '../config/apiConfig';

class ManualTrackingService {
  constructor() {
    this.trackingData = this.loadFromLocalStorage();
  }

  // Load data from localStorage
  loadFromLocalStorage() {
    const stored = localStorage.getItem('manualHealthTracking');
    if (stored) {
      return JSON.parse(stored);
    }
    
    const today = new Date().toISOString().split('T')[0];
    return {
      [today]: {
        water: 0,
        meals: [],
        mood: null,
        notes: ''
      }
    };
  }

  // Save to localStorage
  saveToLocalStorage() {
    localStorage.setItem('manualHealthTracking', JSON.stringify(this.trackingData));
  }

  // Get today's data
  getTodayData() {
    const today = new Date().toISOString().split('T')[0];
    if (!this.trackingData[today]) {
      this.trackingData[today] = {
        water: 0,
        meals: [],
        mood: null,
        notes: ''
      };
    }
    return this.trackingData[today];
  }

  // Track water intake (in glasses)
  async trackWater(glasses = 1) {
    const today = this.getTodayData();
    today.water += glasses;
    this.saveToLocalStorage();
    
    // Also save to backend
    await this.syncToBackend('water', today.water);
    
    // Emit event for UI updates
    window.dispatchEvent(new CustomEvent('manualHealthUpdate', {
      detail: { type: 'water', value: today.water }
    }));
    
    return today.water;
  }

  // Track meal/calories
  async trackMeal(mealData) {
    const today = this.getTodayData();
    today.meals.push({
      time: new Date().toISOString(),
      type: mealData.type, // breakfast, lunch, dinner, snack
      calories: mealData.calories,
      description: mealData.description
    });
    
    this.saveToLocalStorage();
    
    const totalCalories = today.meals.reduce((sum, meal) => sum + meal.calories, 0);
    await this.syncToBackend('calories', totalCalories);
    
    window.dispatchEvent(new CustomEvent('manualHealthUpdate', {
      detail: { type: 'calories', value: totalCalories }
    }));
    
    return totalCalories;
  }

  // Track mood/stress
  async trackMood(moodLevel) {
    const today = this.getTodayData();
    today.mood = {
      level: moodLevel, // 1-5 scale
      time: new Date().toISOString()
    };
    
    this.saveToLocalStorage();
    await this.syncToBackend('mood', moodLevel);
    
    return today.mood;
  }

  // Get water intake for today
  getWaterIntake() {
    return this.getTodayData().water;
  }

  // Get total calories for today
  getTotalCalories() {
    const today = this.getTodayData();
    return today.meals.reduce((sum, meal) => sum + meal.calories, 0);
  }

  // Sync to backend as IoMT data
  async syncToBackend(metric, value) {
    try {
      const { user } = JSON.parse(localStorage.getItem('medicureon_auth') || '{}');
      if (!user) return;
      
      const userId = user.localAccountId || user.username;
      
      // Format as IoMT data
      const deviceData = {
        deviceId: 'manual-tracking',
        deviceType: 'manual-input',
        deviceModel: 'Web App',
        osVersion: navigator.userAgent,
        batteryLevel: 100,
        dataVersion: '1.0',
        syncType: 'manual',
        metrics: {
          [metric]: {
            latest: {
              value: value,
              unit: metric === 'water' ? 'glasses' : metric === 'calories' ? 'kcal' : 'level',
              timestamp: new Date().toISOString(),
              source: 'Manual Entry'
            },
            values: [{
              value: value,
              unit: metric === 'water' ? 'glasses' : metric === 'calories' ? 'kcal' : 'level',
              timestamp: new Date().toISOString(),
              source: 'Manual Entry'
            }]
          }
        }
      };
      
      // Use iomtApiService to save
      const iomtApiService = (await import('./iomtApiService')).default;
      await iomtApiService.saveIomtData(userId, deviceData);
      
    } catch (error) {
      console.error('Error syncing manual tracking to backend:', error);
    }
  }

  // Get weekly summary
  getWeeklySummary() {
    const summary = {
      water: [],
      calories: [],
      mood: []
    };
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayData = this.trackingData[dateStr] || { water: 0, meals: [], mood: null };
      
      summary.water.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        value: dayData.water
      });
      
      summary.calories.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        value: dayData.meals.reduce((sum, meal) => sum + meal.calories, 0)
      });
      
      if (dayData.mood) {
        summary.mood.push({
          date: date.toLocaleDateString('en-US', { weekday: 'short' }),
          value: dayData.mood.level
        });
      }
    }
    
    return summary;
  }
}

// Export singleton instance
const manualTrackingService = new ManualTrackingService();
export default manualTrackingService;