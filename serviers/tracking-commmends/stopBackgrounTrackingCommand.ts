import {
  stopSuperTracking,
  requestAccessibilityService,
  checkAccessibilityPermission,
} from "react-native-background-service-tracking";

export const stopBackgroundServiceCommand = async (
  onAccessibilityServiceStopped: () => void,
) => {
  await requestAccessibilityService();
  await new Promise((rev) => setTimeout(() => rev(true), 200));
  const isDisabled = !(await checkAccessibilityPermission());

  if (!isDisabled) {
    stopBackgroundServiceCommand(onAccessibilityServiceStopped);
  }

  await stopSuperTracking();
  onAccessibilityServiceStopped();
};
