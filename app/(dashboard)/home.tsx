import { buttonStyle } from "@/components/ui/ButtonEditStyle";
import { useUser } from "@/components/ui/UserProvider.provider";
import useCurrentUserState from "@/zustands.stores/userStore";
import { router } from "expo-router";
import { Alert, FlatList, TouchableOpacity, View, Dimensions } from "react-native";
import { Button, Text } from "react-native-paper";
import { useTheme } from "@/app/ThemeProvider";
import { useTranslation } from "react-i18next";
import { AppThemedView } from "@/components/ui/AppThemedView";
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Notifications from 'expo-notifications';
import { useEffect, useState } from "react";
import axios from 'axios';
import { PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function HomeScreen() {
  const { theme } = useTheme();
  const user = useCurrentUserState();
  const { t } = useTranslation();

  const [permissionGranted, setPermissionGranted] = useState(false);
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<{ 
    name: string; 
    count: number; 
    color: string; 
    legendFontColor: string; 
    legendFontSize: number; 
  }[]>([]);
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
        const response = await axios.get(`http://192.168.1.4:5050/notifications/user_notifications?user_id=${user.userModel._id}`);
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
      fetchNotifications();
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [user.userModel?._id]);

  const fetchNotificationsByCategory = async () => {
    try {
      if (!user.userModel?._id) return;

      const response = await axios.get(`http://192.168.1.4:5050/notifications/user_notifications?user_id=${user.userModel._id}`);
      const notifications = response.data;

      const categoryCount = notifications.reduce((acc: Record<string, number>, notification: any) => {
        const category = notification.category || "Unknown";
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {});

      const formattedData = Object.entries(categoryCount).map(([category, count]) => ({
        name: category,
        count: count as number, // 💡 Force TypeScript à voir count comme un nombre
        color: getRandomColor(),
        legendFontColor: theme.text,
        legendFontSize: 15,
      }));
      

      setCategoryData(formattedData);
    } catch (error) {
      console.error("Erreur lors de la récupération des notifications par catégorie:", error);
    }
  };
  useEffect(() => {
    fetchNotificationsByCategory(); // Charger les données au démarrage

    const interval = setInterval(() => {
      fetchNotificationsByCategory(); // Mise à jour automatique
    }, 5000); // Rafraîchir toutes les 5 secondes

    return () => clearInterval(interval); // Nettoyer l'intervalle quand le composant est démonté
  }, []);
  
  useEffect(() => {
    fetchNotificationsByCategory();
  }, [user.userModel?._id]);

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

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
      <View style={{ flex: 1 }}>
        <Text style={{ color: theme.text, fontWeight: 'bold' }}>{item.title}</Text>
        <Text style={{ color: theme.text, marginTop: 5 }}>{item.body}</Text>
      </View>
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
            {t('dashboard.welcome', { name: user.userModel.full_name.split(' ')[0] })}
          </Text>
        )}
        <TouchableOpacity onPress={askNotificationPermission}>
          <Ionicons name="notifications-outline" size={24} color={theme.text} />
        </TouchableOpacity>
      </AppThemedView>

      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item._id.toString()}
      />

      {categoryData.length > 0 && (
        <PieChart
          data={categoryData}
          width={screenWidth - 40}
          height={250}
          chartConfig={{
            backgroundColor: theme.background,
            backgroundGradientFrom: theme.background,
            backgroundGradientTo: theme.background,
            decimalPlaces: 0,
            color: () => theme.primary,
            style: { borderRadius: 16 },
          }}
          accessor="count"
          backgroundColor="transparent"
          paddingLeft="15"
        />
      )}

      <Button
        style={[buttonStyle.normal, { backgroundColor: theme.button }]}
        mode="contained"
        onPress={() => router.push('/paymentScreen')}
      >
        Acheter Premium
      </Button>
    </View>
  );
}
