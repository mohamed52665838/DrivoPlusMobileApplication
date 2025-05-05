import { AppThemedView } from "@/components/ui/AppThemedView";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useTheme } from "@/app/ThemeProvider"; // Assuming you're using your custom ThemeProvider

interface DataItem {
  title: string;
  value: string;
  unit: string;
}

const WEBSOCKET_URL = "ws://172.20.10.3:5006";

const DashboardScreen = () => {
  const { isDarkMode } = useTheme();
  const themedStyles = styles(isDarkMode);

  const [data, setData] = useState<DataItem[]>([]);
  
  useEffect(() => {
    const socket = new WebSocket(WEBSOCKET_URL);

    socket.onopen = () => console.log("Connected to WebSocket");
    
    socket.onmessage = (event) => {
      try {
        const obdData = JSON.parse(event.data);
        console.log("Received Data:", obdData);
        
        setData([
          { title: "Inst. fuel rate", value: obdData.inst_fuel_rate.toString(), unit: "L/h" },
          { title: "Avg. fuel cons.", value: obdData.avg_fuel_cons.toString(), unit: "L/100km" },
          { title: "Inst. fuel cons.", value: obdData.inst_fuel_cons.toString(), unit: "L/100km" },
          { title: "Speed", value: obdData.speed.toString(), unit: "km/h" },
          { title: "Average speed", value: obdData.avg_speed.toString(), unit: "km/h" },
          { title: "Engine RPM", value: obdData.rpm.toString(), unit: "rpm" },
          { title: "Distance travelled", value: obdData.distance_travelled.toString(), unit: "km" },
          { title: "Fuel used", value: obdData.fuel_used.toString(), unit: "L" }
        ]);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    socket.onerror = (error) => console.error("WebSocket error:", error);
    socket.onclose = () => console.log("WebSocket disconnected");
    
    return () => socket.close();
  }, []);

  return (
    <AppThemedView style={themedStyles.container}>
    <FlatList
      data={data}
      numColumns={2}
      keyExtractor={(item) => item.title}
      renderItem={({ item }) => (
        <LinearGradient
          colors={isDarkMode ? ["#333", "#444"] : ["#D0ECE7", "#ABEBC6"]}
          style={[
            themedStyles.card,
            isDarkMode && { backgroundColor: "#333" } // fallback or layer under gradient
          ]}
        >
          <Text style={[themedStyles.title, isDarkMode && { color: "#fff" }]}>{item.title}</Text>
          <Text style={[themedStyles.value, isDarkMode && { color: "#ccc" }]}>{item.value}</Text>
          <Text style={[themedStyles.unit, isDarkMode && { color: "#aaa" }]}>{item.unit}</Text>
        </LinearGradient>
      )}
    />
  </AppThemedView>
  );
};

const styles  =(isDarkMode: boolean) =>StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 10 },
  card: {
    flex: 1,
    backgroundColor: "#f0f8ff",
    margin: 15,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 16, fontWeight: "bold" },
  value: { fontSize: 28, fontWeight: "bold" },
  unit: { fontSize: 14 },
  errorItem: {
    backgroundColor: isDarkMode ? '#2c2c2c' : '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: isDarkMode ? '#000' : '#aaa',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
});

export default DashboardScreen;
