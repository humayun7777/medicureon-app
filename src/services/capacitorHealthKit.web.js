// src/services/capacitorHealthKit.web.js
import { WebPlugin } from '@capacitor/core';

export class CapacitorHealthKitWeb extends WebPlugin {
  async requestAuthorization(options) {
    console.log('Web: Simulating HealthKit authorization request', options);
    return { granted: true };
  }

  async querySteps(options) {
    console.log('Web: Simulating steps query', options);
    const randomSteps = Math.floor(Math.random() * 5000) + 2000;
    return { value: randomSteps, unit: 'count' };
  }

  async queryHeartRate(options) {
    console.log('Web: Simulating heart rate query', options);
    const randomHR = Math.floor(Math.random() * 30) + 70;
    return { value: randomHR, unit: 'bpm' };
  }

  async queryCalories(options) {
    console.log('Web: Simulating calories query', options);
    const randomCalories = Math.floor(Math.random() * 500) + 200;
    return { value: randomCalories, unit: 'kcal' };
  }

  async queryDistance(options) {
    console.log('Web: Simulating distance query', options);
    const randomDistance = Math.floor(Math.random() * 10000) + 1000;
    return { value: randomDistance, unit: 'm' };
  }

  async isAvailable() {
    console.log('Web: HealthKit not available on web');
    return { available: false };
  }
}