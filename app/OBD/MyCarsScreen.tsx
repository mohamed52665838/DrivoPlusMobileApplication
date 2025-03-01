import React, { useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Animated,
  Easing
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface Car {
  id: string;
  name: string;
  make: string;
  model: string;
  year: string;
  vin: string;
}

const MyCarsScreen = () => {
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


  const startSearchAnimation = () => {
    translateX.setValue(-100);
    rotateSearch.setValue(0);

    Animated.loop(
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: 300, // Move across the screen
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
      // Step 1: Fetch VIN from OBD
      const vinResponse = await fetch("http://192.168.252.130:6786/get_vin");
      const vinData = await vinResponse.json();
  
      if (vinData.vin && vinData.vin !== "Unknown") {
        console.log("VIN Retrieved:", vinData.vin);      
  // Step 2: Fetch Vehicle Details
   const detailsResponse = await fetch("http://192.168.252.130:6786/get_vehicle_details");
        const detailsData = await detailsResponse.json();
  
       
        if (detailsData.vehicle_info) {
          // Step 3: Update UI
          console.log(detailsData.vehicle_info)
          const updatedCar ={
            ...newCar,
            vin: detailsData.vin,
            name:detailsData.vehicle_info.make,
            make: detailsData.vehicle_info.make,
            model: detailsData.vehicle_info.model,
            year: detailsData.vehicle_info.model_year,
          };
          setNewCar(updatedCar);
          setCars([...cars, { ...updatedCar, id: Date.now().toString() }]); // Use updatedCar, not newCar
          setManualEntryModal(false);
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
      setCars([...cars, { ...newCar, id: Date.now().toString() }]);
      setManualEntryModal(false);
    }
  };

  return (
    <View style={styles.container}>
        
      <FlatList
        data={cars}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.carName}>{item.name}</Text>
            <Text>
              {item.make} {item.model} ({item.year})
            </Text>
            <Text style={styles.vin}>VIN: {item.vin}</Text>
          </View>
        )}
      />

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setSelectionModal(true)}
      >
        <Ionicons name="add-circle" size={40} color="#1586AC" />
      </TouchableOpacity>

      {/* Selection Modal */}
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

            <TouchableOpacity style={styles.optionButton} onPress={fetchVinFromOBD} disabled={loadingVinSearch}>
  {loadingVinSearch ? (
    <Ionicons name="sync" size={20} color="#1586AC" style={{ transform: [{ rotate: "360deg" }] }} />
  ) : (
    <Text style={styles.optionText}>🔗 Connect via VIN/OBD</Text>
  )}
</TouchableOpacity>


            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setSelectionModal(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Manual Entry Modal */}
      <Modal visible={manualEntryModal} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add New Car</Text>
          <TextInput
            placeholder="Car Name"
            style={styles.input}
            value={newCar.name}
            onChangeText={(text) => setNewCar({ ...newCar, name: text })}
          />
          <TextInput
            placeholder="Make"
            style={styles.input}
            value={newCar.make}
            onChangeText={(text) => setNewCar({ ...newCar, make: text })}
          />
          <TextInput
            placeholder="Model"
            style={styles.input}
            value={newCar.model}
            onChangeText={(text) => setNewCar({ ...newCar, model: text })}
          />
          <TextInput
            placeholder="Year"
            keyboardType="numeric"
            style={styles.input}
            value={newCar.year}
            onChangeText={(text) => setNewCar({ ...newCar, year: text })}
          />

          <TouchableOpacity style={styles.saveButton} onPress={addCar}>
            <Text style={styles.saveText}>Save Car</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setManualEntryModal(false)}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
    
  );

 

};


const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#fff" },
  card: {
    backgroundColor: "#f0f8ff",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 1, height: 2 },
  },
  carName: { fontSize: 18, fontWeight: "bold", color: "#1586AC" },
  vin: { fontSize: 12, color: "#888" },
  addButton: { position: "absolute", bottom: 20, right: 20 },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
  optionButton: {
    backgroundColor: "#E0F7FA",
    padding: 12,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginVertical: 8,
  },
  optionText: { fontSize: 16, fontWeight: "bold", color: "#1586AC" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: "100%",
  },
  saveButton: {
    backgroundColor: "#1586AC",
    padding: 12,
    borderRadius: 5,
    marginTop: 10,
    width: "100%",
  },
  saveText: { textAlign: "center", color: "#fff", fontWeight: "bold" },
  cancelButton: { marginTop: 10, padding: 10 },
  cancelText: { textAlign: "center", color: "#1586AC" },
});




export default MyCarsScreen;
