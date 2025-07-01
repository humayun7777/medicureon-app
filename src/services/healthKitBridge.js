// src/services/healthKitBridge.js
import { Capacitor } from '@capacitor/core';
import { CapacitorHealthKitWeb } from './capacitorHealthKit.web';

class HealthKitBridge {
  constructor() {
    this.webInstance = new CapacitorHealthKitWeb();
  }

  async requestAuthorization(options) {
    if (Capacitor.isNativePlatform()) {
      const plugin = window.Capacitor?.Plugins?.CapacitorHealthKit;
      if (plugin) {
        return await plugin.requestAuthorization(options);
      } else {
        throw new Error('Native HealthKit plugin not available');
      }
    } else {
      return await this.webInstance.requestAuthorization(options);
    }
  }

  async querySteps(options) {
    if (Capacitor.isNativePlatform()) {
      const plugin = window.Capacitor?.Plugins?.CapacitorHealthKit;
      if (plugin) {
        return await plugin.querySteps(options);
      }
    }
    return await this.webInstance.querySteps(options);
  }

  async isAvailable() {
    if (Capacitor.isNativePlatform()) {
      const plugin = window.Capacitor?.Plugins?.CapacitorHealthKit;
      return plugin ? await plugin.isAvailable() : { available: false };
    }
    return await this.webInstance.isAvailable();
  }
}

const healthKitBridgeInstance = new HealthKitBridge();
export default healthKitBridgeInstance;