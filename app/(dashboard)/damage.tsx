import { Alert, Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Dialog, Portal, Provider, Text } from "react-native-paper";
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
import { IP_ADRESS, WS_PORT } from "@/constants/Network.config";
import useCurrentUserState, { useExpoToken } from "@/zustands.stores/userStore";
import AlertComponentRecord from "@/components/AlertComponentRecord";
import log from "@/serviers/Logger.service.rn";


const soundMp =  require('@/assets/sound/metal-pipe-230698.mp3')


export default function Damage() {
  const { theme } = useTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraRef, setCameraRef] = useState<CameraView | null>(null);
  const [facing, setFacing] = useState<CameraType>("back");
  const [latestUri, setLatestUri] = useState<string | undefined>();
  const [isRecording, setIsRecording] = useState(false);
  const [isDriverATS, setIsDriverATS] = useState(false)
  const [isConnected, setIsConneected] = useState(false)
  const [connectionError, setConnnectionError] = useState<string | null>(null)
  const [background, setBackground] = useState('')  
  const expoToken = useExpoToken((state) => state.expToken)
  const user = useCurrentUserState((state) => state.userModel)
  const [isCameraPermitted, setIsCameraPermitted] = useState(false)
  const soundRef = useRef<Audio.Sound | null>()
  
 
  const { t } = useTranslation();
  const ws = useRef<WebSocket>();


  // Functions Start

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
  

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

 
  // Sound Effects
  const playSoundF = async () => {
    if (!soundRef.current) return;
      await soundRef.current.playAsync();
  };

  const pauseSound = async () => {
    if (!soundRef.current) return;
      await soundRef.current.pauseAsync();
  };
  // End Sound Effects

  // End Functions

 /**
  * websocket callbacks
  * 
  *   readonly readyState: number;
      send(data: string | ArrayBuffer | ArrayBufferView | Blob): void;
      close(code?: number, reason?: string): void;
      onopen: (() => void) | null;
      onmessage: ((event: WebSocketMessageEvent) => void) | null;
      onerror: ((event: WebSocketErrorEvent) => void) | null;
      onclose: ((event: WebSocketCloseEvent) => void) | null;
  * 
  */

 const onOpen = () => {
   ws.current?.send(
     JSON.stringify({
       user_id: user?._id,
       token: expoToken,
     })
   );
 };


const onDataReceived = async (eventMessage: WebSocketMessageEvent) => {
          setIsDriverATS(true);
          await playSoundF();
        };

  const onError = (eventError: WebSocketCloseEvent) => {
    let tellMeWhy = eventError.message ?? "Unexpected Error Just Happned";
    const isIpAddress = tellMeWhy.match("([0-9].)+");
    if (isIpAddress) {
      tellMeWhy = "Sorry currently we're not able to connect, try later please";
    }
    Alert.alert("Error Encounnted", tellMeWhy, [
      {
        text: "report",
        onPress: () => {
          setIsConneected(false);
          setIsRecording(false);
        },
      },
      {
        text: "OK",
        onPress: () => {
          setIsConneected(false);
          setIsRecording(false);
        },
      },
    ]);
  };

  const onClose = (closeEvent: WebSocketCloseEvent) => {
    setIsConneected(false);
    setIsRecording(false);
  };

  // Sockets Callback End

  // Effects Start


  /**
   * Idea: Create sound object
   * Dep: No
   * Cleanup: Clear sound object 
   */

  useEffect(() => {
    (async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          soundMp,
          { shouldPlay: false , isLooping: true}
        );
        soundRef.current = sound;
      } catch (error) {
        log.error("Can't Begin Sound Effect")
      }
    })();

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);


  /**
   * Idea: Record Begin => Connection Begin
   * Dep: [isRecording]
   * clean: close connection
   */
  useEffect(() => {
    (() => {
      if (isRecording) {
        if (expoToken == null) {
          Alert.alert(
            "Allow Notification",
            "Please back to home and click on the notification icon to begin recording",
            [
              {
                text: "OK",
                onPress: () => {
                  setIsRecording(false);
                },
              },
            ]
          );
          return;
        }

        ws.current = new WebSocket(`ws://${IP_ADRESS}:${WS_PORT}`);
        ws.current.onopen = onOpen;
        ws.current.onmessage = onDataReceived;
        ws.current.onerror = onError;
        ws.current.onclose = onClose; 
        setIsConneected(true)
        log.info("Connection Open => Stream Begin");

    }else {
      // Close Connection if the Cliend Close Recording 
      setIsConneected(false)
      ws.current?.close();
      ws.current = undefined;
    }
  }
  )();
    return () => {
      ws.current?.close();
      ws.current = undefined;
    };
  }, [isRecording]);


  /**
   * Idea: Camera permission
   * Dep: NO (Execute once)
   *   
   */

  useEffect(() => {
      Camera.requestCameraPermissionsAsync().then(
        (value) => {
          if (value.granted) {
            setIsCameraPermitted(true)
          } else if (value.expires) {
            log.error("Permission: Permission Exipred")            
            throw new Error("Effect: Camera Permission Can't Ask Any More")
          } else if (value.canAskAgain) {
            log.info("Permission: Permission Not Permitted but we Can Ask For It")            
          }
        },
        (error) => {
          log.error(error)
          throw error
        }
      );
  }, [])




  /**
   * Idea: send frames if we're connected to server
   * Dep: [isConnected]
   */

  useEffect(() => {
    if(isConnected) {
        const cleaner = setInterval(() => {
            pictureTaker().then( async (normalizedImage) => {
              if(ws.current) {
                ws.current.send(normalizedImage.base64 ?? '')
              }
            }
            ).catch(console.warn)
      }, 200);

      return () => clearInterval(cleaner)
    }
    
  }, [isConnected]); // change from isRecording to isConnected to begin transmite data


  // End Effects



  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <View style={{ ...styles.container, backgroundColor: "#ff000032" }}>
        {isDriverATS && (
          <AlertComponentRecord
            onClick={async () => {
              setIsDriverATS(false);
              await pauseSound();
            }}
          />
        )}
        <CameraView
          flash="off"
          animateShutter={false}
          ratio="4:3"
          style={styles.camera}
          facing={facing}
          ref={(ref) => setCameraRef(ref)}
          onCameraReady={() => {}}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "space-between",
              backgroundColor: background,
            }}
          >
            <View
              style={{
                padding: 12,
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity onPress={() => setIsRecording(false)}>
                <MaterialIcons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>

              <View
                style={{
                  backgroundColor: isRecording ? "green" : "white",
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                }}
              />

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
                padding: 12,
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