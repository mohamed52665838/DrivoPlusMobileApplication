import { useEffect } from 'react';
import {
  NativeEventEmitter,
  NativeModules,
  Platform,
  PermissionsAndroid,
  Alert,
} from 'react-native';

export default function DetectionCall() {
  useEffect(() => {
    const eventEmitter = new NativeEventEmitter(NativeModules.CallDetection);

    const listener = eventEmitter.addListener('CALL_RECEIVED', () => {
      Alert.alert('Appel entrant détecté !');
    });

    const requestPermissionAndStart = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
          {
            title: 'Permission nécessaire',
            message: 'L\'application a besoin d\'accès au téléphone pour détecter les appels entrants.',
            buttonNeutral: 'Plus tard',
            buttonNegative: 'Annuler',
            buttonPositive: 'OK',
          }
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          NativeModules.CallDetection.startListening(); // Lance l'écoute
        } else {
          Alert.alert('Permission refusée', 'Impossible de détecter les appels sans permission.');
        }
      }
    };

    requestPermissionAndStart();

    return () => {
      listener.remove(); // Nettoie l'écouteur à la destruction du composant
    };
  }, []);

  return null; // Ce composant n'affiche rien visuellement
}
