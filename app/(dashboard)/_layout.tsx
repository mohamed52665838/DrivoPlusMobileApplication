import { Tabs } from "expo-router";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider, useTheme } from "@/app/ThemeProvider"; // ✅ Vérifie le chemin !
import { useTransition } from "react";
import { useTranslation } from "react-i18next";

export default function RootLayout() {
    const queryClient = new QueryClient();
    const { theme } = useTheme(); // ✅ Utilisation de useTheme()
    const {t} = useTranslation()
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider> {/* ✅ Assure que ThemeProvider entoure tout */}
                <Tabs 
                    initialRouteName="home"
                    screenOptions={{
                        tabBarStyle: { backgroundColor: theme.background }, 
                        tabBarActiveTintColor: theme.text, 
                        tabBarInactiveTintColor: theme.text, 
                    }}
                >
                    <Tabs.Screen name="home" options={{
                        title: t('dashboard.tabbaritems.home'),
                        headerShown: false, 
                        tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />
                    }} />
                    
                    <Tabs.Screen name="damage" options={{
                        title: t('dashboard.tabbaritems.damage'),
                        headerShown: false,
                        tabBarIcon: ({ color }) => <FontAwesome size={28} name="opencart" color={color} />
                    }} />

                    <Tabs.Screen name="drivesafty" options={{
                        title: t('dashboard.tabbaritems.drivesafety'), 
                        headerShown: false, 
                        tabBarIcon: ({ color }) => <FontAwesome size={28} name="opencart" color={color} />
                    }} />
                    <Tabs.Screen name="profile" options={{
                        title: t('dashboard.tabbaritems.profile'),
                        headerShown: false,
                        tabBarIcon: ({ color }) => <FontAwesome size={28} name="opencart" color={color} />
                    }} />
                </Tabs>
            </ThemeProvider>
        </QueryClientProvider>
    );
}
