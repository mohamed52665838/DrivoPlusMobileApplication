import { buttonStyle } from "@/components/ui/ButtonEditStyle";
import { useUser } from "@/components/ui/UserProvider.provider";
import useCurrentUserState from "@/zustands.stores/userStore";
import { router } from "expo-router";
import { Alert, Linking, PermissionsAndroid, Platform, TouchableOpacity, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { useTheme } from "@/app/ThemeProvider";
import { useTranslation } from "react-i18next";
import { AppThemedView } from "@/components/ui/AppThemedView";
import Ionicons from '@expo/vector-icons/Ionicons';



export default function HomeScreen() {
  const { theme } = useTheme(); // 🔥 Appel à useTheme() à l'intérieur du composant
    const user = useCurrentUserState();
    console.log("Thème appliqué dans HomeScreen :", theme);
    const {t} = useTranslation()

// const requestAndroidPermission = async () => {
//     const permissionStatus = await messaging().hasPermission();
//     console.log(permissionStatus)

//   if (Platform.OS === 'android' && Platform.Version >= 33) {
//        console.log('here') 
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
//       );
//        console.log('there') 
//       console.log(granted)
//       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//         console.log('Notification permission granted');
//       } else {
//         console.log('Notification permission denied');
//       }
//   }
// };




    return (
        <View style={{ 
            flex: 1, 
            paddingHorizontal: 12, 
            paddingVertical: 12, 
            backgroundColor: theme.background, // 🎨 Applique le fond du mode sombre ou clair
        }}>
            <AppThemedView style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            {user.userModel?.full_name && (
                <Text 
                    variant="headlineSmall" 
                    style={{
                        textTransform: 'capitalize', 
                        fontWeight: 'bold', 
                        color: theme.text // 🎨 Applique la couleur du texte
                    }}
                >
                    {t('dashboard.welcome', {name: user.userModel.full_name.split(' ').at(0)})} 
                </Text>
            )}
            <TouchableOpacity onPress={
                async () => {
                }
            }
            >
            <Ionicons name="notifications-outline" size={24} color="black" />
            </TouchableOpacity>
            </AppThemedView>
            {/* Contenu central */}
            <View style={{ flex: 1, justifyContent: "center", alignItems: 'center', backgroundColor: theme.background, }}>
                <Text style={{ color: theme.text }}> {/* 🎨 Texte avec couleur du thème */}
                    Welcome Back: Something Great Coming Soon!
                </Text>
            </View>

            {/* Bouton Acheter Premium */}
            <Button 
                style={[buttonStyle.normal, { backgroundColor: theme.button }]} // 🎨 Applique la couleur du bouton
                mode="contained" 
                onPress={() => {
                    console.log('Navigating to /paymentScreen');
                    router.push('/paymentScreen');
                }}
            >
                Acheter Premium
            </Button>
        </View>
    );
    
}

