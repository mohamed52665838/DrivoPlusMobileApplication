import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { useTheme } from "@/app/ThemeProvider";
import { CameraView, CameraType, useCameraPermissions, Camera } from 'expo-camera';
import { AppThemedView } from "@/components/ui/AppThemedView";
import { AppTextTheme } from "@/components/ui/TextThemed";
import { useEffect, useRef, useState, useTransition } from "react";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Entypo from '@expo/vector-icons/Entypo';
import { useFocusEffect } from "expo-router";
import { useTranslation } from "react-i18next";

import AntDesign from '@expo/vector-icons/AntDesign';

import * as ImageManipulator from "expo-image-manipulator";
import { sortRoutes } from "expo-router/build/sortRoutes";
import {Audio} from 'expo-av'
import {ipAdress, webSocketPort} from '@/constants/Network.config'


const soundMp =  require('@/assets/sound/metal-pipe-230698.mp3')


export default function Damage() {
  const { theme } = useTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraRef, setCameraRef] = useState<CameraView | null>(null);
  const [facing, setFacing] = useState<CameraType>("back");
  const [latestUri, setLatestUri] = useState<string | undefined>();
  const [isRecording, setIsRecording] = useState(false);
  const [isDriverATS, setIsDriverATS] = useState(false)
  const [playSound, setPlaySound] = useState(false)
  const soundRef = useRef<Audio.Sound | null>()

  const { t } = useTranslation();
  const ws = useRef<WebSocket>();

  useEffect(() => {

    (async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          soundMp,
          { shouldPlay: false , isLooping: true}
        );
        soundRef.current = sound;
      } catch (error) {
        console.error("Error loading sound:", error);
      }
    })();

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const playSoundF = async () => {
    if (!soundRef.current) return;
      await soundRef.current.playAsync();
  };

  const pauseSound = async () => {
    if (!soundRef.current) return;
      await soundRef.current.pauseAsync();
  };

  useEffect(() => {
    (() => {
      if (isRecording) {
        ws.current = new WebSocket(`ws://${ipAdress}:${webSocketPort}`);
        ws.current.onopen = (event) => {
          console.log(`websocket opend ${event}`);
        };
        ws.current.onmessage = async (eventMessage) => {
          console.log(`websocket message ${eventMessage.data}`);
          if(!isDriverATS)
            setIsDriverATS(true)
            await playSoundF()
        };

        ws.current.onerror = (eventError) => {
          console.log(`websocket error ${eventError}`);
        };

        ws.current.onclose = (closeEvent) => {
          console.log(
            `websocket closed ${closeEvent} code ${closeEvent.code} reason ${closeEvent.reason}`
          );
        };
      } else {
        ws.current?.close();
        ws.current = undefined;
      }

      Camera.requestCameraPermissionsAsync().then(
        (value) => {
          if (value.granted) {
            console.log("granted");
          } else if (value.expires) {
            console.log("expaired");
          } else if (value.canAskAgain) {
          }
        },
        (error) => {
          console.log(error);
        }
      );
    })();
    return () => {
      ws.current?.close();
      console.log("component unmounted");
    };
  }, [isRecording]);

  const pictureTaker = async () => {
      const pic = await cameraRef?.takePictureAsync({shutterSound: false, base64: true, quality: 1})
      if(pic === undefined)
        throw new Error('Take Picture: Error Occure While Taking the pic')

      const scaledPhoto = await ImageManipulator.manipulateAsync(
        pic.uri,
        [
          {
            resize: {
              width: 128,
              height: 128,
            },
          },
        ],
        { compress: 1, format: ImageManipulator.SaveFormat.PNG, base64: true }
      );
      if(scaledPhoto === undefined)
        throw new Error('Normalize Picture: Error Occure While Normalizing the pic');
      return scaledPhoto;
  }



  useEffect(() => {
    const cleaner = setInterval(() => {
        if(isRecording)
          pictureTaker().then( async (normalizedImage) => {
            if(ws.current) {
              ws.current.send(normalizedImage.base64 ?? '')
            }
          }
          ).catch(console.warn)
    }, 200);

    return () => clearInterval(cleaner)
  }, [isRecording]);


  


  // if (!permission) {
  //   return (
  //     <AppThemedView>
  //       <AppTextTheme>Camera not permited!</AppTextTheme>
  //     </AppThemedView>
  //   );
  // }

  // if (!permission?.granted) {
  //   // Camera permissions are not granted yet.
  //   return (
  //     <View style={styles.container}>
  //       <Text style={styles.message}>
  //         We need your permission to show the camera
  //       </Text>
  //       <Button onPress={requestPermission}>grant permission </Button>
  //     </View>
  //   );
  // }
  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const onPictureTaken = () => {
    cameraRef
      ?.takePictureAsync({ scale: 0.1 })
      .then(async (imageCapturedUri) => {
        if (imageCapturedUri === undefined)
          throw Error("Caputre Image: Image Undefined");
        console.log(imageCapturedUri.width);
        console.log(imageCapturedUri.height);
        setLatestUri(imageCapturedUri.uri);
        return imageCapturedUri;
      })
      .then(async (data) => {
        // scale the size of image
        const scaledPhoto = await ImageManipulator.manipulateAsync(
          data.uri,
          [
            {
              resize: {
                width: 128,
                height: 128,
              },
            },
          ],
          { compress: 1, format: ImageManipulator.SaveFormat.PNG }
        );
        if (scaledPhoto === undefined)
          throw Error("Scaling Image: Error Occure While Scaling The Image");
        return scaledPhoto;
      })
      .then(async (imageAfterScaled) => {
        console.log(imageAfterScaled.width);
        console.log(imageAfterScaled.height);
        console.log(imageAfterScaled.uri);
        setTimeout(() => {
          setLatestUri(imageAfterScaled.uri);
        }, 1000);
      })
      .catch((error) => {
        console.log(`we've problem in capturing image ${error}`);
      });
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.background,
      }}
    >
      <View style={styles.container}>
        <CameraView
          flash="off"
          animateShutter={false}
          ratio="4:3"
          style={styles.camera}
          facing={facing}
          ref={(ref) => setCameraRef(ref)}
          onCameraReady={() => {}}
        >
          <View style={{ flex: 1, justifyContent: "space-between" }}>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity onPress={() => setIsRecording(false)}>
                <MaterialIcons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
              {isDriverATS && (
                <TouchableOpacity onPress={async () => {
                  setIsDriverATS(false)
                  await pauseSound() 
                }
              }>
                  <Text style={{ color: "red" }}>Your're About To Sleep</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity onPress={toggleCameraFacing}>
                <MaterialIcons
                  name="flip-camera-android"
                  size={24}
                  color="white"
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                alignContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              <TouchableOpacity
                onPress={() => setIsRecording((value) => !value)}
              >
                <AntDesign
                  name={isRecording ? "pausecircleo" : "playcircleo"}
                  size={64}
                  color="white"
                />
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
    padding: 12
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});