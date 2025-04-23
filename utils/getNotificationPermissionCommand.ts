import { PermissionsAndroid } from "react-native";

export const notificationPermissionAndroid = async () => {
  const isNotificationPermitted = await PermissionsAndroid.check(
    "android.permission.POST_NOTIFICATIONS",
  );

  if (!isNotificationPermitted) {
    const result = await PermissionsAndroid.request(
      "android.permission.POST_NOTIFICATIONS",
    );
    if (result === "denied") {
      notificationPermissionAndroid();
    } else if (result === "never_ask_again") {
      return false;
    }
  }
  return true;
};
