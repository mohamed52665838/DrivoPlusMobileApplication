import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { ProgressBar } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";

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

  useFocusEffect(
    React.useCallback(() => {
      setCars([]); // 🔄 Vider la liste avant le chargement
      loadCars();  // 🔄 Recharger les nouvelles voitures
    }, [])
  );
 

  const loadCars = async () => {
    try {
        const storedCars = await AsyncStorage.getItem("cars");
        if (storedCars) {
            const carList = JSON.parse(storedCars);
            console.log("📌 Voitures chargées :", carList); // 🔍 Vérification console
            setCars(carList);
        } else {
            console.log("🚨 Aucune voiture trouvée !");
        }
    } catch (error) {
        console.error("❌ Erreur de chargement des voitures :", error);
    }
};

 

  return (
    <View style={styles.container}>
      <FlatList
        data={cars}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.carCard}>
            {/* 🔹 En-tête */}
            <View style={styles.header}>
              <Ionicons name="car-sport-outline" size={26} color="#0D6EFD" />
              <Text style={styles.carTitle}>
                {item.name} - {item.make} {item.model} ({item.year})
              </Text>
            </View>

            {/* 📌 VIN */}
            {item.vin && <Text style={styles.vin}>🔢 VIN: {item.vin}</Text>}

            {/* 🚨 Dommages détectés */}
            {item.damage && item.damage.length > 0 ? (
              <View style={styles.damageContainer}>
                <Text style={styles.damageTitle}>🚨 Dommages détectés :</Text>
                {item.damage.map((d, index) => (
                  <View key={index} style={styles.damageRow}>
                    <Text style={styles.damageText}>
                      🛑 {d.class} ({Math.round(d.confidence * 100)}%)
                    </Text>
                    <ProgressBar
                      progress={d.confidence}
                      color="red"
                      style={styles.progressBar}
                    />
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.noDamageContainer}>
                <Ionicons name="checkmark-circle" size={18} color="green" />
                <Text style={styles.noDamageText}>Aucun dommage enregistré.</Text>
              </View>
            )}

            {/* 💰 Coût estimé */}
            {item.cost ? (
              <View style={styles.costContainer}>
                <Ionicons name="cash-outline" size={22} color="green" />
                <Text style={styles.costText}> {item.cost} TND</Text>
              </View>
            ) : (
              <View style={styles.noCostContainer}>
                <Ionicons name="information-circle" size={18} color="#888" />
                <Text style={styles.noCostText}>Coût non disponible.</Text>
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
}

// ✅ **Styles améliorés**
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    padding: 10,
  },

  carCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 1, height: 2 },
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  carTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0D6EFD",
    marginLeft: 10,
  },

  vin: {
    fontSize: 12,
    color: "#555",
    marginBottom: 5,
  },

  damageContainer: {
    backgroundColor: "#FFE5E5",
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },

  damageTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#D9534F",
    marginBottom: 5,
  },

  damageRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
  },

  damageText: {
    fontSize: 14,
    color: "#D9534F",
  },

  progressBar: {
    width: "50%",
    height: 8,
    borderRadius: 5,
  },

  costContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "#E3FCEC",
    padding: 10,
    borderRadius: 8,
  },

  costText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#28A745",
    marginLeft: 5,
  },

  noDamageContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "#E3FCEC",
    padding: 8,
    borderRadius: 8,
  },

  noDamageText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#28A745",
    marginLeft: 5,
  },

  noCostContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "#F0F0F0",
    padding: 8,
    borderRadius: 8,
  },

  noCostText: {
    fontSize: 14,
    color: "#888",
    marginLeft: 5,
  },
});