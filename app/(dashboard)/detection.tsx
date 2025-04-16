import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  useColorScheme,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { ProgressBar } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "../ThemeProvider";
import { AppThemedView } from "@/components/ui/AppThemedView";

interface Car {
  id: string;
  name: string;
  make: string;
  model: string;
  year: string;
  vin?: string;
  damage?: { class: string; confidence: number }[];
  cost?: string;
}

export default function CarHistoryScreen() {
  const [cars, setCars] = useState<Car[]>([]);
  const { isDarkMode } = useTheme();

  useFocusEffect(
    React.useCallback(() => {
      setCars([]);
      loadCars();
    }, [])
  );

  const loadCars = async () => {
    try {
      const storedCars = await AsyncStorage.getItem("cars");
      if (storedCars) {
        const carList = JSON.parse(storedCars);
        setCars(carList);
      }
    } catch (error) {
      console.error("Error loading cars:", error);
    }
  };

  return (
    <AppThemedView style={styles.container}>
      <View
        style={[
          styles.headerContainer,
          { backgroundColor: isDarkMode ? "#2E7D32" : "#A5D6A7" },
        ]}
      >
        <MaterialCommunityIcons name="clipboard-list" size={28} color="white" />
        <Text style={[styles.headerTitle, { color: "white" }]}>
          Car Inspection History
        </Text>
      </View>

      {cars.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="car-sport"
            size={60}
            color={isDarkMode ? "#666" : "#ccc"}
          />
          <Text style={[styles.emptyText, { color: isDarkMode ? "#aaa" : "#777" }]}>
            No inspections found.
          </Text>
          <Text style={[styles.emptySubText, { color: isDarkMode ? "#888" : "#aaa" }]}>
            Your inspected cars will appear here 🚘
          </Text>
        </View>
      ) : (
        <FlatList
          data={cars}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={[
                styles.carCard,
                {
                  backgroundColor: isDarkMode ? "#1E1E1E" : "#fff",
                  shadowColor: isDarkMode ? "#000" : "#ccc",
                },
              ]}
            >
              <View style={styles.infoSection}>
                <View style={styles.header}>
                  <Ionicons name="car-sport-outline" size={22} color="#1F618D" />
                  <Text
                    style={[
                      styles.carTitle,
                      { color: isDarkMode ? "#BBDEFB" : "#1F618D" },
                    ]}
                  >
                    {item.name} - {item.make} {item.model} ({item.year})
                  </Text>
                </View>

                {item.vin && (
                  <Text style={[styles.vin, { color: isDarkMode ? "#bbb" : "#555" }]}>
                    🔢 VIN: {item.vin}
                  </Text>
                )}

                {/* 🚨 Damages */}
                {item.damage && item.damage.length > 0 ? (
                  <View
                    style={[
                      styles.damageContainer,
                      { backgroundColor: isDarkMode ? "#3B0000" : "#FFF0F0" },
                    ]}
                  >
                    <Text style={styles.damageTitle}>🚨 Detected Damage:</Text>
                    {item.damage.map((d, index) => (
                      <View key={index} style={styles.damageRow}>
                        <Text style={styles.damageText}>
                          🛑 {d.class} ({Math.round(d.confidence * 100)}%)
                        </Text>
                        <ProgressBar
                          progress={d.confidence}
                          color="#FF4C4C"
                          style={styles.progressBar}
                        />
                      </View>
                    ))}
                  </View>
                ) : (
                  <View
                    style={[
                      styles.noDamageContainer,
                      { backgroundColor: isDarkMode ? "#264D26" : "#E6F4EA" },
                    ]}
                  >
                    <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
                    <Text style={styles.noDamageText}>No damage detected.</Text>
                  </View>
                )}

                {/* 💰 Cost */}
                {item.cost ? (
                  <View style={styles.costContainer}>
                    <Ionicons name="cash-outline" size={22} color="green" />
                    <Text style={styles.costText}> {item.cost} TND</Text>
                  </View>
                ) : (
                  <View
                    style={[
                      styles.noCostContainer,
                      { backgroundColor: isDarkMode ? "#333" : "#F0F0F0" },
                    ]}
                  >
                    <Ionicons name="information-circle" size={18} color="#999" />
                    <Text style={styles.noCostText}>Cost not available</Text>
                  </View>
                )}
              </View>
            </View>
          )}
        />
      )}
    </AppThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },

  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
  },

  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 15,
  },

  emptySubText: {
    fontSize: 14,
    marginTop: 8,
  },

  carCard: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    flexDirection: "row",
    shadowOpacity: 0.1,
    shadowOffset: { width: 1, height: 2 },
    elevation: 3,
  },

  infoSection: {
    flex: 1,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  carTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 6,
  },

  vin: {
    fontSize: 12,
    marginBottom: 5,
  },

  damageContainer: {
    borderRadius: 6,
    padding: 8,
    marginTop: 5,
  },

  damageTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#D32F2F",
    marginBottom: 4,
  },

  damageRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },

  damageText: {
    fontSize: 13,
    color: "#D32F2F",
  },

  progressBar: {
    width: "45%",
    height: 6,
    borderRadius: 5,
  },

  costContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "#E6F4EA",
    padding: 8,
    borderRadius: 6,
  },

  costText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#388E3C",
    marginLeft: 5,
  },

  noDamageContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    padding: 6,
    borderRadius: 6,
  },

  noDamageText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#388E3C",
    marginLeft: 6,
  },

  noCostContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    padding: 6,
    borderRadius: 6,
  },

  noCostText: {
    fontSize: 13,
    marginLeft: 6,
  },
});
