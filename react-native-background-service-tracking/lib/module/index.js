"use strict";

import BackgroundServiceTracking from './NativeBackgroundServiceTracking';
export function checkAccessibilityPermission() {
  return BackgroundServiceTracking.checkPermissionForService();
}
export function requestAccessibilityService() {
  return BackgroundServiceTracking.getPermissionToUseService();
}
export function startSuperTracking() {
  return BackgroundServiceTracking.startTrackingService();
}
export function stopSuperTracking() {
  return BackgroundServiceTracking.stopTrackingService();
}
export const value = 0;
export const superTrackingServiceStatus = BackgroundServiceTracking.isServiceRunning;
export const superTrackingServiceSettingsEnabled = BackgroundServiceTracking.isGlobalSettingsEnabled;

// export function superTrackingServiceStatus(): EventEmitter<boolean> {
//   return BackgroundServiceTracking.isGlobalSettingsEnabled
// }

// export function superTrackingServiceSettingsEnabled(): EventEmitter<boolean> {
//   return BackgroundServiceTracking.isGlobalSettingsEnabled
// }
//# sourceMappingURL=index.js.map