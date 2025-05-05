import { Tabs } from "expo-router";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider, useTheme } from "@/app/ThemeProvider";
import { useTranslation } from "react-i18next";
import { View, Platform } from "react-native";

export default function RootLayout() {
    const queryClient = new QueryClient();
    const { theme } = useTheme();
    const { t } = useTranslation();
    const {isDarkMode}= useTheme()

    return (
        <QueryClientProvider client={queryClient}>
            <Tabs
                initialRouteName="home"
                screenOptions={{
                    tabBarStyle: {
                      left: 20,
                      right: 20,
                      bottom: Platform.OS === "ios" ? 25 : 15,
                      backgroundColor: theme.card,
                      borderRadius: 30,
                      height: 70,
                      paddingBottom: Platform.OS === "ios" ? 20 : 10,
                      paddingTop: 10,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 5 },
                      shadowOpacity: 0.1,
                      shadowRadius: 10,
                      elevation: 10,
                      borderTopWidth: 0,
                    },
                    tabBarActiveTintColor: isDarkMode ? "#196F3D": "#28B463", // 💚 active tab icon turns green
                    tabBarInactiveTintColor: "#999",
                    headerShown: false,
                    tabBarLabelStyle: {
                      fontSize: 12,
                      marginBottom: 4,
                    },
                  }}
            >
                      <Tabs.Screen
                    name="home"
                    options={{
                        title: t("dashboard.tabbaritems.home"),
                        tabBarIcon: ({ color }) => (
                            <Ionicons name="home" size={28} color={color} />
                        ),
                    }}
                /> 

                <Tabs.Screen
                    name="CarScannerScreen"
                    options={{
                        title: t("dashboard.tabbaritems.diagnostic"),
                        tabBarIcon: ({ color }) => (
                            <Ionicons name="car-sport-outline" size={28} color={color} />
                        ),
                    }}
                />
               
                <Tabs.Screen
                    name="damage"
                    options={{
                        title: t("dashboard.tabbaritems.damage"),
                        tabBarIcon: ({ color }) => (
                            <MaterialIcons name="report-problem" size={28} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="drivesafty"
                    options={{
                        title: t("dashboard.tabbaritems.drivesafety"),
                        tabBarIcon: ({ color }) => (
                            <Ionicons name="shield-checkmark-outline" size={28} color={color} />
                        ),
                    }}
                />
                  <Tabs.Screen
                    name="detection"
                    options={{
                        title: t("detection"),
                        tabBarIcon: ({ color }) => (
                            <Ionicons name="eye" size={26} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="profile"
                    options={{
                        title: t("dashboard.tabbaritems.profile"),
                        tabBarIcon: ({ color }) => (
                            <FontAwesome name="user" size={26} color={color} />
                        ),
                    }}
                />
            </Tabs>
        </QueryClientProvider>
    );
}
