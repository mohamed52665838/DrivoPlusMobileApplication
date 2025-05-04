// HomeScreen.tsx
import { useUser } from "@/components/ui/UserProvider.provider";
import useCurrentUserState, { useExpoToken } from "@/zustands.stores/userStore";
import { router } from "expo-router";
import {
  Alert,
  FlatList,
  TouchableOpacity,
  View,
  Dimensions,
  StyleSheet,
  ScrollView,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Text } from "react-native-paper";
import { useTheme } from "@/app/ThemeProvider";
import { useTranslation } from "react-i18next";
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Notifications from 'expo-notifications';
import { useEffect, useState } from "react";
import axios from 'axios';
import { PieChart } from "react-native-chart-kit";
import { IP_ADRESS, PORT } from "@/constants/Network.config";
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { AppThemedView } from "@/components/ui/AppThemedView";
import { Colors } from "react-native/Libraries/NewAppScreen";

const screenWidth = Dimensions.get("window").width;

export default function HomeScreen() {
  const { theme } = useTheme();
  const user = useCurrentUserState();
  const { t } = useTranslation();
  const { isDarkMode, toggleDarkMode } = useTheme();

  const styles = getStyles(isDarkMode);

  const [permissionGranted, setPermissionGranted] = useState(false);
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const updateToken = useExpoToken((state) => state.updateToken);
  const [categoryData, setCategoryData] = useState<any[]>([]);

  const askNotificationPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status === "granted") {
      setPermissionGranted(true);
      Alert.alert("✅ Permission granted", "You'll receive notifications.");
    } else {
      Alert.alert("❌ Permission denied", "You won’t receive notifications.");
    }
  };

  const getPushToken = async () => {
    try {
      const { data } = await Notifications.getExpoPushTokenAsync();
      updateToken(data);
      setPushToken(data);
    } catch (error) {
      console.error("Push token error:", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      if (user.userModel?._id) {
        const response = await axios.get(`http://${IP_ADRESS}:${PORT}/notifications/user_notifications?user_id=${user.userModel._id}`);
        setNotifications(response.data);
      }
    } catch (error) {
      console.error("Notification fetch error:", error);
    }
  };

  const fetchNotificationsByCategory = async () => {
    try {
      if (!user.userModel?._id) return;

      const response = await axios.get(`http://${IP_ADRESS}:${PORT}/notifications/user_notifications?user_id=${user.userModel._id}`);
      const notifications = response.data;

      const categoryCount = notifications.reduce((acc: Record<string, number>, notif: any) => {
        const category = notif.category || "Unknown";
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {});

      const formattedData = Object.entries(categoryCount).map(([category, count]) => ({
        name: category,
        count,
        color: getRandomColor(),
        legendFontColor: "#333",
        legendFontSize: 14,
      }));

      setCategoryData(formattedData);
    } catch (error) {
      console.error("Category fetch error:", error);
    }
  };

  const getRandomColor = () => {
    const colors = ['#e57373', '#81c784', '#64b5f6', '#ffb74d', '#ba68c8'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  useEffect(() => {
    if (permissionGranted) getPushToken();
  }, [permissionGranted]);

  useEffect(() => {
    const sub = Notifications.addNotificationReceivedListener(notification => {
      Alert.alert("🚨 New Alert", notification.request.content.body || "New Notification!");
      fetchNotifications();
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (user.userModel) {
      fetchNotifications();
      fetchNotificationsByCategory();
      const interval = setInterval(() => {
        fetchNotifications();
        fetchNotificationsByCategory();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [user.userModel]);

  const renderItem = ({ item }: any) => (
    <Animatable.View animation="fadeInUp" duration={800} style={styles.card}>
      <Ionicons name="alert-circle-outline" size={24} color={theme.primary} />
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardBody}>{item.body}</Text>
        <Text style={styles.cardTime}>{item.time}</Text>
      </View>
    </Animatable.View>
  );

  return (
    <AppThemedView  style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Animatable.Text animation="fadeInLeft" style={styles.welcomeText}>
            {user.userModel?.full_name ? `👋 Hello, ${user.userModel.full_name.split(" ")[0]}!` : "👋 Hello!" }
          </Animatable.Text>
          <TouchableOpacity onPress={askNotificationPermission}>
            <Ionicons name="notifications" size={26} color="#444" />
          </TouchableOpacity>
        </View>

        <Animatable.View animation="fadeInUp" delay={200} style={styles.tipBox}>
          <Text style={styles.tipText}>💡 Tip of the day: Keep your engine healthy with regular oil changes!</Text>
        </Animatable.View>

        <Text style={styles.sectionTitle}>📬 Your Notifications</Text>
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={(item) => item._id.toString()}
          scrollEnabled={false}
        />

        {categoryData.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>📊 Categories</Text>
            <View style={styles.chartContainer}>
              <PieChart
                data={categoryData}
                width={screenWidth - 40}
                height={220}
                chartConfig={{
                  backgroundColor: "transparent",
                  backgroundGradientFrom: "#fff",
                  backgroundGradientTo: "#fff",
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor="count"
                backgroundColor="transparent"
                paddingLeft="15"
              />
            </View>
          </>
        )}

        <Text style={styles.sectionTitle}>⚡ Quick Actions</Text>
        <View style={styles.quickActions}>
          <ActionButton icon="gas" label="Log Fuel"  style={styles} />
          <ActionButton icon="calendar" label="Set Reminder" style={styles} />
          <ActionButton icon="wrench" label="Book Service" style={styles} />
        </View>

        <TouchableOpacity onPress={() => router.push('/paymentScreen')}>
          <LinearGradient colors={['#43cea2', '#185a9d']} style={styles.premiumButton}>
            <Text style={styles.premiumText}>💎 Upgrade to Premium</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </AppThemedView>
  );
}

interface ActionButtonProps {
  icon: any; 
  label: string
  style: {
    actionBtn: ViewStyle;
    actionLabel: TextStyle;

  };
}

const ActionButton = ({ icon, label, style }: ActionButtonProps) => (
  <TouchableOpacity style={style.actionBtn}>
    <Ionicons name={icon} size={26} color="#fff" />
    <Text style={style.actionLabel}>{label}</Text>
  </TouchableOpacity>
);


const getStyles = (isDark: boolean) =>
  StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: '700',
    color: isDark ? "white":'#333',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipBox: {
    backgroundColor: '#dcedc8',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
  },
  tipText: {
    fontSize: 14,
    color: '#33691e',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 10,
    color: isDark ? "white":'#333',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 10,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#222',
  },
  cardBody: {
    fontSize: 14,
    marginTop: 4,
    color: '#555',
  },
  cardTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  chartContainer: {
    backgroundColor: '#ffffffcc',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: 'center',
  },
  premiumButton: {
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  premiumText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionBtn: {
  //  backgroundColor: isDark ? '#555' : '#4caf50', 
    backgroundColor: isDark ? "#1E1E1E" : "#82E0AA",
                  shadowColor: isDark ? "#000" : "#ccc",
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  actionLabel: {
    color: isDark ? "white" :'#fff',
    fontSize: 12,
    marginTop: 4,
  },
});
