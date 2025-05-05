import { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Button,
  Text,
  PermissionsAndroid,
} from 'react-native';
import {
  checkAccessibilityPermission,
  requestAccessibilityService,
  startSuperTracking,
  stopSuperTracking,
  superTrackingServiceSettingsEnabled,
  superTrackingServiceStatus,
} from 'react-native-background-service-tracking';

export default function App() {
  const [isAccessibiltyPermitted, setIsAccessibilityPermitted] =
    useState(false);
  const [isServiceRunning, setIsServiceRunning] = useState(false);

  useEffect(() => {
    (async () => {
      checkAccessibilityPermission().then((value) => {
        setIsAccessibilityPermitted(value);
        if (value) {
          console.log('Permission enabled');
        } else {
          console.log('Permission Disabled');
        }
      });
    })();
  }, []);

  const accessibilityCallback = () => {
    requestAccessibilityService().then((_) => {
      setIsAccessibilityPermitted(true);
      setTimeout(() => {
        checkAccessibilityPermission().then((value) => {
          setIsAccessibilityPermitted(value);
        });
      }, 1000);
    });
  };

  const startSuperTrackingService = () => {
    startSuperTracking().then((value) => {
      if (value) {
        console.log('Tracking service started');
      }
    });
  };

  const stopSuperTrackingService = () => {
    stopSuperTracking().then((value) => {
      if (value) {
        console.log('Tracking service stoped');
      }
    });
  };

  useEffect(() => {
    const subscriber = superTrackingServiceStatus((isServiceRunning) => {
      setIsServiceRunning(isServiceRunning);
    });
    return () => subscriber.remove();
  }, []);

  useEffect(() => {
    const subscriber = superTrackingServiceSettingsEnabled(
      (isGlobalSettingsEnabled) => {
        console.log(`global settings enabled ${isGlobalSettingsEnabled}`);
      }
    );
    return () => subscriber.remove();
  }, []);

  useEffect(() => {
    const notificationPermission = async () => {
      const gotNotificationPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      if (!gotNotificationPermission) {
        const permissionRequestResult = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        if (permissionRequestResult === PermissionsAndroid.RESULTS.DENIED) {
          notificationPermission();
        }
      }
    };
    notificationPermission();
  }, []);

  return (
    <View style={styles.container}>
      <Button
        title="Enable Super Safe!"
        onPress={accessibilityCallback}
        disabled={isAccessibiltyPermitted}
      />
      <View style={{ marginVertical: 8, gap: 8 }}>
        <Button
          title="Start Tracking"
          onPress={startSuperTrackingService}
          disabled={isServiceRunning}
        />
        <Button
          title="Stop Tracking"
          onPress={stopSuperTrackingService}
          disabled={!isServiceRunning}
        />
      </View>
      <Text>{isServiceRunning ? 'Service Running' : 'Service Stopped'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
