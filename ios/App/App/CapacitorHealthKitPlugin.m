#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

CAP_PLUGIN(CapacitorHealthKitPlugin, "CapacitorHealthKit",
           CAP_PLUGIN_METHOD(requestAuthorization, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(querySteps, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(queryHeartRate, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(queryCalories, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(queryDistance, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(isAvailable, CAPPluginReturnPromise);
)