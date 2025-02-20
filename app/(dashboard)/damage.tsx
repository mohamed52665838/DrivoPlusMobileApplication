import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { useTheme } from "@/app/ThemeProvider";
import { CameraView, CameraType, useCameraPermissions, Camera } from 'expo-camera';
import { AppThemedView } from "@/components/ui/AppThemedView";
import { AppTextTheme } from "@/components/ui/TextThemed";
import { useEffect, useState, useTransition } from "react";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Entypo from '@expo/vector-icons/Entypo';
import { useFocusEffect } from "expo-router";
import { useTranslation } from "react-i18next";


export default function Damage() {
    const { theme } = useTheme(); 


  const [permission, requestPermission] = useCameraPermissions();
  const [cameraRef, setCameraRef] = useState<CameraView | null>(null)
  const [facing, setFacing] = useState<CameraType>('back');
  const [latestUri, setLatestUri ] = useState<string | undefined>()
  const [isCameraShown, setIsCameraShon] = useState(false)

  const {t} = useTranslation() 

  useEffect(() => {
   ( () => {
        Camera.requestCameraPermissionsAsync().then((value) => {
            if(value.granted) {
                console.log('granted')
            }
            else if(value.expires) {
                console.log('expaired')
            }
            else if(value.canAskAgain) {
            
            }
        }, (error)=> {
            console.log(error)
        })
    })()
    return () => {
        setIsCameraShon(false)
        console.log('component unmounted')
    }
  }, [])

  if (!permission) {
    // Camera permissions are still loading.
    return (
        <AppThemedView>
            <AppTextTheme>
                Camera not permited!
            </AppTextTheme>
        </AppThemedView>
    )
  }


  if (!permission?.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission}>grant permission </Button>
      </View>
    );
  }
const toggleCameraFacing = () => {
  setFacing((current) => (current === "back" ? "front" : "back"));
};
  
    const onPictureTaken = () => {
        cameraRef?.takePictureAsync().then((imageCapturedUri) => {
        setLatestUri(imageCapturedUri?.uri)
        }).catch((error) => {
            console.log("we've problem in capturing image")
        })
    }
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.background,
        }}
      >
        {isCameraShown ? (
          <View style={styles.container}>
            <CameraView
              flash="on"
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
                  <TouchableOpacity onPress={() => setIsCameraShon(false)}>
                    <MaterialIcons name="arrow-back" size={24} color="white" />
                  </TouchableOpacity>
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
                  {latestUri && (
                    <Image
                      style={{ alignSelf: "flex-start" }}
                      source={{ uri: latestUri }}
                      width={90}
                      height={90}
                    />
                  )}
                  <TouchableOpacity onPress={() => onPictureTaken()}>
                    <Entypo name="picasa" size={50} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            </CameraView>
          </View>
        ) : (
            <View style={{flex: 1}}>
                <AppTextTheme variente="headlineMedium" style={
                    {
                        paddingHorizontal: 12,
                        paddingVertical: 16
                    
                    }
                }>
                    {t('dashboard.damage.damage')}
                </AppTextTheme>
          <AppThemedView
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Image
              source={require("@/assets/images/photo-camera-svgrepo-com.png")}
              style={{ width: 72, height: 72 }}
            />
            <Button
              onPress={() => {
                setIsCameraShon(true);
              }}
            >
                {t('dashboard.damage.captureimage')}
            </Button>
          </AppThemedView>
                </View>
        )}
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