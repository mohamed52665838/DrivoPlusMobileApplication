import {
  requestAccessibilityService,
  checkAccessibilityPermission,
  startSuperTracking,
} from "react-native-background-service-tracking";

export const startBackgroundTrackingCommand = async (
  onServiceStarted: () => void,
) => {
  // REQUEST ACCESSIBILITY PERMISSION
  await requestAccessibilityService();

  // WAIT SOME TIME BEFORE CHECK THE ACCESSIBILITY PERMISSION
  await new Promise((rev) => setTimeout(() => rev(true), 200));

  // CHECK ACCESSIBILITY PERMISSION
  const isAccessibilityPermissionGained = await checkAccessibilityPermission();

  if (!isAccessibilityPermissionGained) {
    startBackgroundTrackingCommand(onServiceStarted);
  }
  // AFTER GAIN THE PERMISSION WE START GAIN THE SERVICE SAFELY
  await startSuperTracking();
  // EXECUTE ON SERVICE STARTED FUNCTION
  onServiceStarted();
};
