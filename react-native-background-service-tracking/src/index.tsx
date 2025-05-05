import BackgroundServiceTracking from './NativeBackgroundServiceTracking';

export function checkAccessibilityPermission(): Promise<boolean> {
  return BackgroundServiceTracking.checkPermissionForService();
}

export function requestAccessibilityService(): Promise<boolean> {
  return BackgroundServiceTracking.getPermissionToUseService();
}

export function startSuperTracking(): Promise<boolean> {
  return BackgroundServiceTracking.startTrackingService();
}

export function stopSuperTracking(): Promise<boolean> {
  return BackgroundServiceTracking.stopTrackingService();
}

export const value = 0;
export const superTrackingServiceStatus =
  BackgroundServiceTracking.isServiceRunning;

export const superTrackingServiceSettingsEnabled =
  BackgroundServiceTracking.isGlobalSettingsEnabled;

// export function superTrackingServiceStatus(): EventEmitter<boolean> {
//   return BackgroundServiceTracking.isGlobalSettingsEnabled
// }

// export function superTrackingServiceSettingsEnabled(): EventEmitter<boolean> {
//   return BackgroundServiceTracking.isGlobalSettingsEnabled
// }
