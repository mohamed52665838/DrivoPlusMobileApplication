import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet,Alert } from "react-native";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router"; // Import router

// Define FeatureItem Type
interface FeatureItem {
  name: string;
  icon: string;
  library: any;
  route?: string; // Add a route property

}

// Features List
const features: FeatureItem[] = [
  { name: "Dashboard", icon: "speedometer", library: MaterialCommunityIcons,route: "/OBD/dashboard" },
  { name: "Live data", icon: "chart-line", library: MaterialCommunityIcons,route: "/OBD/detailCar" },
 // { name: "All sensors", icon: "sensor", library: MaterialCommunityIcons },
  { name: "Diagnostic trouble codes", icon: "car-battery", library: MaterialCommunityIcons, route: "/OBD/searchproblems" },
 // { name: "Freeze frame", icon: "database", library: FontAwesome5 },
  { name: "Noncontinuous Monitors", icon: "clipboard-list", library: FontAwesome5 },
  { name: "My cars", icon: "car", library: MaterialCommunityIcons,route: "/OBD/MyCarsScreen" },
  { name: "Settings", icon: "cog", library: FontAwesome5 },
  { name: "Statistics", icon: "chart-bar", library: FontAwesome5 },
  { name: "Data recording", icon: "video", library: MaterialCommunityIcons,route: "/OBD/RecordDataScreen"  },
  { name: "Acceleration tests", icon: "speedometer", library: MaterialCommunityIcons, route: "/OBD/speedTest" },
  { name: "Emission tests", icon: "flask", library: FontAwesome5 },

];

const HomeScreen: React.FC = () => {
    const router = useRouter(); // Initialize router

  const [isConnected, setIsConnected] = useState(false);

  const handleDemoClick = () => {
    if(!isConnected) {
    Alert.alert(
      "Select Demo Mode",
      "Smart car can show you all sensors available in the app with Demo mode.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Agree",
          onPress: () => setIsConnected((prev) => !prev),
        },
      ]
    );
} else {
    setIsConnected(false)
}
  };
  

  return (
    <View style={styles.container}>
      {/* Features Grid */}
      <FlatList
        data={features}
        numColumns={3}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.featureItem  }  onPress={() => {
            if (item.name === "Statistics") {
              // Show alert instead of navigating
              Alert.alert(
                "Data Required",
                "You need to record data first before accessing Statistics.",
                [{ text: "OK" }]
              );
            } else {
            if (isConnected) {
              
                if (item.route) {
                  router.push(item.route as any); // Navigate if route exists
                }
              } else {
                Alert.alert("Not connected!", "You need to connect to OBDII adapter befor using diagnostic features ! You can also enable Demo mode to access without connecting to a real vehicle", [
                  { text: "OK" },
                ]);
              }
            }
          } }>
            <View style={styles.iconContainer}>
              <item.library name={item.icon} size={45} color={isConnected ? "#1586AC" :  "#595959"} />
            </View>
            <Text style={styles.featureText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Connection Status */}
      <View style={styles.connectionContainer}>
        <View style={styles.connectionRow}>
          <Text style={styles.connectionLabel}>ELM connection:</Text>
          <Text style={isConnected ? styles.connected : styles.disconnected}>
            {isConnected ? "Connected" : "Disconnected"}
          </Text>
        </View>
        <View style={styles.connectionRow}>
          <Text style={styles.connectionLabel}>ECU connection:</Text>
          <Text style={isConnected ? styles.connected : styles.disconnected}>
            {isConnected ? "Connected" : "Disconnected"}
          </Text>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.connectButton]}>
          <Text style={styles.buttonText}>CONNECT</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, isConnected ? styles.stopDemoButton : styles.demoButton]}
          onPress={handleDemoClick}
        >
          <Text style={styles.buttonText}>{isConnected ? "Stop Demo" : "Demo"}</Text>
        </TouchableOpacity>
      </View>

      {/* Upgrade Banner */}
      <View style={styles.upgradeBanner}>
        <Text style={styles.upgradeText}>
          🚀 Upgrade to Car Scanner Pro! No ads! No limits! Low price!
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F9FC", padding: 15 },

  // Feature Icons & Grid
  featureItem: {
    flex: 1,
    alignItems: "center",
    margin: 12,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // Android shadow
  },
  featureText: { fontSize: 14, textAlign: "center", marginTop: 8, fontWeight: "500" },
  iconContainer: { padding: 10 },

  // Connection Status
  connectionContainer: {
    backgroundColor: "#fff",
    padding: 15,
    marginTop: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  connectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  connectionLabel: { fontSize: 16, fontWeight: "500", color: "#333" },
  connected: { color: "#0BAF5D", fontSize: 16, fontWeight: "600" },
  disconnected: { color: "#D32F2F", fontSize: 16, fontWeight: "600" },

  // Buttons
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  connectButton: { backgroundColor: "#0BAF5D" }, // Green for connect
  demoButton: { backgroundColor: "#1586AC" }, // Blue for demo
  stopDemoButton: { backgroundColor: "#D32F2F" }, // Red for stopping demo
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },

  // Upgrade Banner
  upgradeBanner: {
    backgroundColor: "#FFF3CD",
    padding: 12,
    marginTop: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  upgradeText: { fontSize: 14, fontWeight: "500", color: "#856404" },
});

export default HomeScreen;
