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
Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage"

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
Alert.alert(
"Delete Car",
"Are you sure you want to delete this car?",
[
{ text: "Cancel", style: "cancel" },
{
text: "Delete",
style: "destructive",
onPress: () => {
const updatedCars = cars.filter((car) => car.id !== id);
setCars(updatedCars);
saveCarsToStorage(updatedCars);
}
}
]
);
};


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
const vinResponse = await fetch("http://192.168.203.132:5009/get_vin");
const vinData = await vinResponse.json();
if (vinData.vin && vinData.vin !== "Unknown") {
console.log("VIN Retrieved:", vinData.vin);
// Step 2: Fetch Vehicle Details
const detailsResponse = await fetch("http://192.168.203.132:5009/get_vehicle_details");
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
const updatedCars = [...cars, { ...updatedCar, id: Date.now().toString() }];

setNewCar(updatedCar);
setCars([...cars, { ...updatedCar, id: Date.now().toString() }]); // Use updatedCar, not newCar
setManualEntryModal(false);
saveCarsToStorage(updatedCars); // Save cars locally

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

setCars([...cars, { ...newCar, id: Date.now().toString() }]);
saveCarsToStorage(updatedCars); // Save to AsyncStorage

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
container: {
flex: 1,
backgroundColor: "#f8f9fa", // Light gray background
padding: 15,
}, card: {
backgroundColor: "#ffffff",
padding: 15,
marginVertical: 10,
borderRadius: 10,
shadowColor: "#000",
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.1,
shadowRadius: 5,
elevation: 3, // Adds shadow for Android
flexDirection: "row",
justifyContent: "space-between",
alignItems: "center",
},
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

carInfo: {
flex: 1, // Makes sure text takes most space
},
carName: {
fontSize: 18,
fontWeight: "bold",
color: "#333",
},
carDetails: {
fontSize: 14,
color: "#666",
marginVertical: 2,
},
vin: {
fontSize: 12,
color: "#999",
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
});




export default MyCarsScreen;