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
import * as Notifications from 'expo-notifications';
import { useEffect, useState } from "react";



export default function HomeScreen() {
  const { theme } = useTheme(); // 🔥 Appel à useTheme() à l'intérieur du composant
    const user = useCurrentUserState();
    console.log("Thème appliqué dans HomeScreen :", theme);
    const {t} = useTranslation()


const [hasPermission, setHasPermission] = useState(false);

useEffect(() => {
  checkNotificationPermission();
}, []);

const checkNotificationPermission = async () => {
  const { status } = await Notifications.getPermissionsAsync();
  setHasPermission(status === 'granted');
};

// Fonction appelée lorsqu'on clique sur l'icône de notification
const handleNotificationPress = async () => {
    const { status } = await Notifications.getPermissionsAsync();
  
    if (status !== 'granted') {
      // Affichage de l'alerte pour demander la permission
      Alert.alert(
        "Autoriser les notifications",
        "Vous devez activer les notifications pour recevoir des alertes.",
        [
          {
            text: "Annuler",
            style: "cancel"
          },
          {
            text: "Autoriser",
            onPress: async () => {
              const { status: newStatus } = await Notifications.requestPermissionsAsync();
              setHasPermission(newStatus === 'granted');
  
              if (newStatus === 'granted') {
                Alert.alert("Notifications activées", "Vous recevrez des notifications.");
              } else {
                // Si l'utilisateur refuse à nouveau, on lui propose d'aller dans les paramètres
                Alert.alert(
                  "Notifications non activées",
                  "Vous devez activer les notifications depuis les paramètres de l'application.",
                  [
                    {
                      text: "Ouvrir les paramètres",
                      onPress: () => {
                        Linking.openSettings(); // Ouvre les paramètres de l'app
                      }
                    },
                    { text: "Annuler", style: "cancel" }
                  ]
                );
              }
            }
          }
        ]
      );
    } else {
      Alert.alert("Notifications activées", "Vous recevrez des notifications.");
    }
  };
  
  
    
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
            <TouchableOpacity onPress={handleNotificationPress}>
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

