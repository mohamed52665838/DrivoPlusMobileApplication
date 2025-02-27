import { buttonStyle } from "@/components/ui/ButtonEditStyle";
import { useUser } from "@/components/ui/UserProvider.provider";
import useCurrentUserState from "@/zustands.stores/userStore";
import { router } from "expo-router";
import { Alert, FlatList, TouchableOpacity, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { useTheme } from "@/app/ThemeProvider";
import { useTranslation } from "react-i18next";
import { AppThemedView } from "@/components/ui/AppThemedView";
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Notifications from 'expo-notifications';
import { useEffect, useState } from "react";
import axios from 'axios';



export default function HomeScreen() {
  const { theme } = useTheme(); // 🔥 Appel à useTheme() à l'intérieur du composant
  const user = useCurrentUserState();
  const { t } = useTranslation();

  const [permissionGranted, setPermissionGranted] = useState(false);
  const [pushToken, setPushToken] = useState<string | null>(null); // Stocke le token de notification
  const [notifications, setNotifications] = useState<any[]>([]); // Stocke les notifications de l'utilisateur

  const askNotificationPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status === "granted") {
      setPermissionGranted(true);
      Alert.alert("Permission accordée", "Vous recevrez des notifications.");
    } else {
      Alert.alert("Permission refusée", "Vous ne recevrez pas de notifications.");
    }
  };

  const getPushToken = async () => {
    try {
      const { data } = await Notifications.getExpoPushTokenAsync();
      console.log("Push token:", data);
      setPushToken(data);
    } catch (error) {
      console.error("Erreur lors de la récupération du push token:", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      if (user.userModel?._id) {
        const response = await axios.get(`http://192.168.100.193:5050/notifications/user_notifications?user_id=${user.userModel._id}`);
        setNotifications(response.data);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des notifications:", error);
    }
  };

  useEffect(() => {
    if (permissionGranted) {
      getPushToken();
    }
  }, [permissionGranted]);

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log("Notification reçue :", notification);
      Alert.alert("🚗 Nouvelle alerte", notification.request.content.body || "Vous avez une nouvelle notification !");
      fetchNotifications(); // Récupérer les notifications après une nouvelle réception
    });

    return () => subscription.remove(); // Nettoyage
  }, []);

  useEffect(() => {
    fetchNotifications(); // Récupérer les notifications au chargement initial
  }, [user.userModel?._id]);

  const renderItem = ({ item }: any) => (
    <View style={{
      backgroundColor: theme.background,
      padding: 15,
      marginBottom: 10,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.text,
      shadowColor: theme.text,
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 6,
      elevation: 5,
      flexDirection: 'row',
      alignItems: 'center',
    }}>
      {/* Icone de notification */}
      <Ionicons name="notifications-outline" size={30} color={theme.primary} style={{ marginRight: 15 }} />

      <View style={{ flex: 1 }}>
        <Text style={{ color: theme.text, fontWeight: 'bold' }}>{item.title}</Text>
        <Text style={{ color: theme.text, marginTop: 5 }}>{item.body}</Text>
      </View>

      {/* Temps écoulé depuis la notification */}
      <Text style={{ color: theme.text, fontSize: 12, marginLeft: 10 }}>{item.time}</Text>
    </View>
  );

  return (
    <View style={{
      flex: 1,
      paddingHorizontal: 12,
      paddingVertical: 12,
      backgroundColor: theme.background,
    }}>
      <AppThemedView style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {user.userModel?.full_name && (
          <Text
            variant="headlineSmall"
            style={{
              textTransform: 'capitalize',
              fontWeight: 'bold',
              color: theme.text
            }}
          >
            {t('dashboard.welcome', { name: user.userModel.full_name.split(' ').at(0) })}
          </Text>
        )}
        <TouchableOpacity onPress={askNotificationPermission}>
          <Ionicons name="notifications-outline" size={24} color="black" />
        </TouchableOpacity>
      </AppThemedView>

      {/* Affichage des notifications */}
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item._id.toString()}  // Assurez-vous que '_id' est unique
      />

      {/* Bouton Acheter Premium */}
      <Button
        style={[buttonStyle.normal, { backgroundColor: theme.button }]}
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
