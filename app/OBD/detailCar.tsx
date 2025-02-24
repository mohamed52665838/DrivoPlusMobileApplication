import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

interface DataItem {
  title: string;
  value: string;
  unit: string;
}

const WEBSOCKET_URL = "ws://192.168.252.132:5006";

const DashboardScreen = () => {
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
    <View style={styles.container}>
      <FlatList
        data={data}
        numColumns={2}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.value}>{item.value}</Text>
            <Text style={styles.unit}>{item.unit}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default DashboardScreen;
