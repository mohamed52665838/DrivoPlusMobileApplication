// At the top of the file
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Animated,
  Easing,
  Alert,
  useColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppThemedView } from "@/components/ui/AppThemedView";
import { useTheme } from '@/app/ThemeProvider';

interface Car {
  id: string;
  name: string;
  make: string;
  model: string;
  year: string;
  vin: string;
}

const MyCarsScreen = () => {
      const { isDarkMode } = useTheme();
    
  const translateX = useRef(new Animated.Value(-100)).current;
  const rotateSearch = useRef(new Animated.Value(0)).current;
  const [loadingVinSearch, setLoadingVinSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [cars, setCars] = useState<Car[]>([]);
  const [selectionModal, setSelectionModal] = useState(false);
  const [manualEntryModal, setManualEntryModal] = useState(false);
  const [newCar, setNewCar] = useState<Car>({
    id: "",
    name: "",
    make: "",
    model: "",
    year: "",
    vin: "",
  });

  
  const styles = getStyles(isDarkMode);

  useEffect(() => {
    loadCarsFromStorage();
  }, []);

  const saveCarsToStorage = async (cars: Car[]) => {
    try {
      await AsyncStorage.setItem("cars", JSON.stringify(cars));
    } catch (error) {
      console.error("Error saving cars:", error);
    }
  };

  const loadCarsFromStorage = async () => {
    try {
      const storedCars = await AsyncStorage.getItem("cars");
      if (storedCars) {
        setCars(JSON.parse(storedCars));
      }
    } catch (error) {
      console.error("Error loading cars:", error);
    }
  };

  const deleteCar = (id: string) => {
    Alert.alert("Delete Car", "Are you sure you want to delete this car?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          const updatedCars = cars.filter((car) => car.id !== id);
          setCars(updatedCars);
          saveCarsToStorage(updatedCars);
        },
      },
    ]);
  };

  const startSearchAnimation = () => {
    translateX.setValue(-100);
    rotateSearch.setValue(0);

    Animated.loop(
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: 300,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(rotateSearch, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const fetchVinFromOBD = async () => {
    setLoading(true);
    startSearchAnimation();
    try {
      const vinResponse = await fetch("http://192.168.203.132:5009/get_vin");
      const vinData = await vinResponse.json();
      if (vinData.vin && vinData.vin !== "Unknown") {
        const detailsResponse = await fetch("http://192.168.203.132:5009/get_vehicle_details");
        const detailsData = await detailsResponse.json();
        if (detailsData.vehicle_info) {
          const updatedCar = {
            ...newCar,
            vin: detailsData.vin,
            name: detailsData.vehicle_info.make,
            make: detailsData.vehicle_info.make,
            model: detailsData.vehicle_info.model,
            year: detailsData.vehicle_info.model_year,
          };
          const updatedCars = [...cars, { ...updatedCar, id: Date.now().toString() }];

          setNewCar(updatedCar);
          setCars(updatedCars);
          setManualEntryModal(false);
          saveCarsToStorage(updatedCars);
        } else {
          alert("Vehicle details not found.");
        }
      } else {
        alert("Failed to fetch VIN from OBD.");
      }
    } catch (error) {
      console.error("Error fetching VIN:", error);
      alert("Error connecting to OBD.");
    } finally {
      setLoading(false);
    }
  };

  const addCar = () => {
    if (newCar.name && newCar.make) {
      const updatedCars = [...cars, { ...newCar, id: Date.now().toString() }];
      setCars(updatedCars);
      saveCarsToStorage(updatedCars);
      setManualEntryModal(false);
    }
  };

  return (
    <AppThemedView style={styles.container}>
      <FlatList
        data={cars}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.carInfo}>
              <Text style={styles.carName}>{item.name}</Text>
              <Text style={styles.carDetails}>
                {item.make} {item.model} ({item.year})
              </Text>
              <Text style={styles.vin}>VIN: {item.vin}</Text>
            </View>
            <TouchableOpacity onPress={() => deleteCar(item.id)} style={styles.deleteButton}>
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => setSelectionModal(true)}>
        <Ionicons name="add-circle" size={50} color="#1abc9c" />
      </TouchableOpacity>

      <Modal visible={selectionModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>How do you want to add your car?</Text>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => {
                setSelectionModal(false);
                setManualEntryModal(true);
              }}
            >
              <Text style={styles.optionText}>📝 Enter Manually</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton} onPress={fetchVinFromOBD}>
              <Text style={styles.optionText}>🔗 Connect via VIN/OBD</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setSelectionModal(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={manualEntryModal} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add New Car</Text>
          <TextInput
            placeholder="Car Name"
            placeholderTextColor="#aaa"
            style={styles.input}
            value={newCar.name}
            onChangeText={(text) => setNewCar({ ...newCar, name: text })}
          />
          <TextInput
            placeholder="Make"
            placeholderTextColor="#aaa"
            style={styles.input}
            value={newCar.make}
            onChangeText={(text) => setNewCar({ ...newCar, make: text })}
          />
          <TextInput
            placeholder="Model"
            placeholderTextColor="#aaa"
            style={styles.input}
            value={newCar.model}
            onChangeText={(text) => setNewCar({ ...newCar, model: text })}
          />
          <TextInput
            placeholder="Year"
            placeholderTextColor="#aaa"
            keyboardType="numeric"
            style={styles.input}
            value={newCar.year}
            onChangeText={(text) => setNewCar({ ...newCar, year: text })}
          />

          <TouchableOpacity style={styles.saveButton} onPress={addCar}>
            <Text style={styles.saveText}>Save Car</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={() => setManualEntryModal(false)}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </AppThemedView>
  );
};

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? "#121212" : "#f8f9fa",
      padding: 15,
    },
    card: {
      backgroundColor: isDark ? "#1e1e1e" : "#ffffff",
      padding: 15,
      marginVertical: 10,
      borderRadius: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 4,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    carInfo: {
      flex: 1,
    },
    carName: {
      fontSize: 18,
      fontWeight: "bold",
      color: isDark ? "#fff" : "#333",
    },
    carDetails: {
      fontSize: 14,
      color: isDark ? "#ccc" : "#666",
      marginVertical: 2,
    },
    vin: {
      fontSize: 12,
      color: isDark ? "#999" : "#999",
      fontStyle: "italic",
    },
    deleteButton: {
      backgroundColor: "#ff4d4d",
      paddingVertical: 8,
      paddingHorizontal: 15,
      borderRadius: 8,
    },
    deleteText: {
      color: "white",
      fontWeight: "bold",
      fontSize: 14,
    },
    addButton: {
      position: "absolute",
      bottom: 30,
      right: 30,
    },
    modalOverlay: {
      flex: 1,
      justifyContent: "center",
      backgroundColor: "rgba(0, 0, 0, 0.4)",
    },
    modalContainer: {
      backgroundColor: isDark ? "#1f1f1f" : "#fff",
      padding: 20,
      marginHorizontal: 20,
      borderRadius: 10,
      alignItems: "center",
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 15,
      color: isDark ? "#fff" : "#000",
    },
    optionButton: {
      backgroundColor: isDark ? "#263238" : "#E0F7FA",
      padding: 12,
      borderRadius: 8,
      width: "100%",
      alignItems: "center",
      marginVertical: 8,
    },
    optionText: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#1abc9c",
    },
    input: {
      borderWidth: 1,
      borderColor: "#444",
      backgroundColor: isDark ? "#2b2b2b" : "#fff",
      color: isDark ? "#fff" : "#000",
      padding: 10,
      borderRadius: 5,
      marginBottom: 10,
      width: "100%",
    },
    saveButton: {
      backgroundColor: "#1abc9c",
      padding: 12,
      borderRadius: 5,
      marginTop: 10,
      width: "100%",
    },
    saveText: {
      textAlign: "center",
      color: "#fff",
      fontWeight: "bold",
    },
    cancelButton: {
      marginTop: 10,
      padding: 10,
    },
    cancelText: {
      textAlign: "center",
      color: "#1abc9c",
    },
  });

export default MyCarsScreen;
