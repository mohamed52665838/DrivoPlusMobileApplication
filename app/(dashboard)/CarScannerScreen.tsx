import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Animated,
<<<<<<< HEAD
=======
  NativeModules,
>>>>>>> a7756f9 (Initial commit on abderrahmen-2)
} from "react-native";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { AppThemedView } from "@/components/ui/AppThemedView";
import { useTheme } from "@/app/ThemeProvider"; // Assuming you're using your custom ThemeProvider

interface FeatureItem {
  name: string;
  icon: string;
  library: any;
  route?: string;
}

const features: FeatureItem[] = [
  { name: "Dashboard", icon: "speedometer", library: MaterialCommunityIcons, route: "/OBD/dashboard" },
  { name: "Live data", icon: "chart-line", library: MaterialCommunityIcons, route: "/OBD/detailCar" },
  { name: "Diagnostic trouble codes", icon: "car-battery", library: MaterialCommunityIcons, route: "/OBD/searchproblems" },
  { name: "Noncontinuous Monitors", icon: "clipboard-list", library: FontAwesome5 },
  { name: "My cars", icon: "car", library: MaterialCommunityIcons, route: "/OBD/MyCarsScreen" },
 //  { name: "Settings", icon: "cog", library: FontAwesome5 },
  { name: "Statistics", icon: "chart-bar", library: FontAwesome5 },
  { name: "Data recording", icon: "video", library: MaterialCommunityIcons, route: "/OBD/RecordDataScreen" },
  { name: "Acceleration tests", icon: "speedometer", library: MaterialCommunityIcons, route: "/OBD/speedTest" },
  { name: "Emission tests", icon: "flask", library: FontAwesome5 },
];

const HomeScreen: React.FC = () => {
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(false);
  const { isDarkMode } = useTheme();
<<<<<<< HEAD
=======
  const { AppMonitor } = NativeModules;
>>>>>>> a7756f9 (Initial commit on abderrahmen-2)


  const handleDemoClick = () => {
    if (!isConnected) {
      Alert.alert("Select Demo Mode", "View sensors in demo mode.", [
        { text: "Cancel", style: "cancel" },
<<<<<<< HEAD
        { text: "Agree", onPress: () => setIsConnected(true) },
=======
        { text: "Agree",onPress: () => {
          setIsConnected(true);
          AppMonitor.startService(); // ✅ Start your background service here
        } },
>>>>>>> a7756f9 (Initial commit on abderrahmen-2)
      ]);
    } else {
      setIsConnected(false);
    }
  };

  return (
    <AppThemedView  style={styles.container}>
      <Text style={styles.title}>Smart Car Diagnostics</Text>

      <FlatList
        data={features}
        numColumns={3}
        keyExtractor={(item) => item.name}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => {
          const Icon = item.library;
          return (
            <TouchableOpacity
              style={styles.featureItem}
              onPress={() => {
                if (item.name === "Statistics") {
                  Alert.alert("Data Required", "You need to record data first.", [{ text: "OK" }]);
                } else if (isConnected && item.route) {
                  router.push(item.route as any);
                } else if (!isConnected) {
                  Alert.alert(
                    "Not connected!",
                    "Connect to an OBDII adapter or use Demo mode.",
                    [{ text: "OK" }]
                  );
                }
              }}
            >
              {isDarkMode ? (
                <View style={[styles.iconContainer, { backgroundColor: "#1E1E1E" }]}>
                  <Icon name={item.icon} size={36} color="white" />
                </View>
              ) : (
                <LinearGradient colors={["#D0ECE7", "#ABEBC6"]} style={styles.iconContainer}>
                  <Icon name={item.icon} size={36} color={isConnected ? "#145A32" : "#17202A"} />
                </LinearGradient>
              )}
              <Text style={[styles.featureText, isDarkMode && { color: "#eee" }]}>{item.name}</Text>
            </TouchableOpacity> 
          );
        }}
        
      />

      {/* Connection Status Section */}
      <View
  style={[
    styles.connectionContainer,
    isDarkMode && { backgroundColor: "#1E1E1E", borderColor: "#555" },
  ]}
>
  {["ELM connection", "ECU connection"].map((label, index) => (
    <View key={index} style={styles.connectionRow}>
      <Ionicons
        name={isConnected ? "radio-button-on" : "radio-button-off"}
        size={22}
        color={isConnected ? "#0BAF5D" : "#D32F2F"}
        style={styles.icon}
      />
      <Text
        style={[
          styles.connectionLabel,
          isDarkMode && { color: "#fff" },
        ]}
      >
        {label}
      </Text>
    </View>
  ))}
</View>


      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.connectButton]}>
          <Ionicons name="bluetooth" size={20} color="#fff" />
          <Text style={styles.buttonText}>Connect</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, isConnected ? styles.stopDemoButton : styles.demoButton]}
          onPress={handleDemoClick}
        >
          <Ionicons name={isConnected ? "stop-circle" : "play-circle"} size={20} color="#fff" />
          <Text style={styles.buttonText}>{isConnected ? "Stop Demo" : "Demo"}</Text>
        </TouchableOpacity>
      </View>
    </AppThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#145A32",
    textAlign: "center",
  },
  featureItem: {
    flex: 1,
    margin: 6,
    alignItems: "center",
  },
  iconContainer: {
    padding: 15,
    borderRadius: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  featureText: {
    marginTop: 8,
    fontSize: 13,
    textAlign: "center",
    fontWeight: "600",
    color: "#333",
  },
  connectionContainer: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 12,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#DDE",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  connectionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  connectionLabel: {
    fontSize: 15,
    color: "#333",
    marginLeft: 10,
    fontWeight: "500",
  },
  icon: {
    marginRight: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 25,
    justifyContent: "space-between",
    marginBottom : 70
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 12,
    justifyContent: "center",
    borderRadius: 14,
  },
  connectButton: {
    backgroundColor: "#0BAF5D",
  },
  demoButton: {
    backgroundColor: "#1586AC",
  },
  stopDemoButton: {
    backgroundColor: "#D32F2F",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
    fontSize: 15,
  },
});

export default HomeScreen;
