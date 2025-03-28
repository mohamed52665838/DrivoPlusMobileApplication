import { UserProvider } from "@/components/ui/UserProvider.provider";
import { NavigationContainer } from "@react-navigation/native";
import { Slot, Stack } from "expo-router";
import React from "react";
import { View } from "react-native";
import { StripeProvider } from "@stripe/stripe-react-native"; // 📌 Vérifie cet import !
import { ThemeProvider } from "@/app/ThemeProvider"; // 🔥 Assure-toi que le chemin est correct !
import { useTranslation } from "react-i18next";
function RootLayout() {
  const {t} = useTranslation()
  return (
    <StripeProvider
      publishableKey="pk_test_51QdwMWP4raKWxiv6MpQEHIWYiPPFG02xbOQEjBjNPLKxxstW2fp7Tke25qAJcCTQeRNfqzY11AHOqttD3viTxBG100HoWj9N07" // 📌 Remplace par ta clé publique Stripe
    >
      <ThemeProvider>
        <UserProvider>
          <Stack initialRouteName="signupscreen">
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen
              name="preferences"
              options={{
                headerShown: true,
                title: t("dashboard.prefirences.prefirences"),
              }}
            />
            <Stack.Screen
              name="signupscreen"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="confirmotp" options={{ headerShown: false }} />
            <Stack.Screen name="(dashboard)" options={{ headerShown: false }} />
            <Stack.Screen name="profilee" options={{ headerShown: false }} />
            <Stack.Screen
              name="paymentScreen"
              options={{ title: "Paiement" }}
            />
            <Stack.Screen
              name="CarScannerScreen"
              options={{
                headerTitle: "Drivo Plus",
                headerStyle: { backgroundColor: "#1586AC" },
                headerTintColor: "#fff",
              }}
            />
          </Stack>
        </UserProvider>
      </ThemeProvider>
    </StripeProvider>
  );
}

export default RootLayout;
