import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Button,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface RecordType {
  id: string;
  name: string;
}

const availableRecords: RecordType[] = [
  { id: "1", name: "Speed" },
  { id: "2", name: "Temperature" },
  { id: "3", name: "Fuel Consumption" },
  { id: "4", name: "Engine Regime" },
  { id: "5", name: "RPM (Revolutions Per Minute)" },
 { id: "6", name: "Throttle Position" },
{ id: "7", name: "Engine Load" },
{ id: "8", name: "Horsepower" },
{ id: "9", name: "Torque" },

{ id: "10", name: "Coolant Temperature" },
{ id: "11", name: "Intake Air Temperature" },
{ id: "12", name: "Oil Temperature" },
{ id: "13", name: "Transmission Temperature" },

{ id: "14", name: "Fuel Level" },
{ id: "15", name: "Fuel Pressure" },
{ id: "16", name: "Instantaneous Fuel Consumption" },
{ id: "17", name: "Long-Term Fuel Trim" },
{ id: "18", name: "Short-Term Fuel Trim" },

{ id: "19", name: "Battery Voltage" },
{ id: "20", name: "Alternator Voltage" },
{ id: "21", name: "Oxygen Sensor Voltage" },
{ id: "22", name: "MAF Sensor (Mass Air Flow)" },

{ id: "23", name: "Vehicle Speed" },
{ id: "24", name: "Acceleration (G-Force)" },
{ id: "25", name: "Braking Pressure" },
{ id: "26", name: "Steering Angle" },

{ id: "27", name: "Catalyst Temperature" },
{ id: "28", name: "Exhaust Gas Recirculation (EGR) Rate" },
{ id: "29", name: "Nitrogen Oxide (NOx) Emissions" },
{ id: "30", name: "OBD Readiness Status" },
];

const RecordSelectionScreen = () => {
  const [selectedRecords, setSelectedRecords] = useState<RecordType[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newRecord, setNewRecord] = useState("");

  const toggleRecordSelection = (item: RecordType) => {
    setSelectedRecords((prev) => {
      if (prev.some((record) => record.id === item.id)) {
        return prev.filter((record) => record.id !== item.id); // Deselect
      } else {
        return [...prev, item]; // Select
      }
    });
  };

  const handleAddNewRecord = () => {
    if (newRecord.trim() === "") return;

    const newRecordItem: RecordType = {
      id: (availableRecords.length + 1).toString(),
      name: newRecord,
    };

    availableRecords.push(newRecordItem); // Add to available options
    setSelectedRecords((prev) => [...prev, newRecordItem]); // Auto-select new item
    setNewRecord("");
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select What to Record</Text>

      <FlatList
        data={availableRecords}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.recordItem,
              selectedRecords.some((record) => record.id === item.id) &&
                styles.selectedItem,
            ]}
            onPress={() => toggleRecordSelection(item)}
          >
            <Text style={styles.recordText}>{item.name}</Text>
            {selectedRecords.some((record) => record.id === item.id) && (
              <Ionicons name="checkmark-circle" size={24} color="green" />
            )}
          </TouchableOpacity>
        )}
      />

    

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Enter New Record Type:</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Oil Pressure"
              value={newRecord}
              onChangeText={setNewRecord}
            />
            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
              <Button title="Add" onPress={handleAddNewRecord} />
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.selectedSection}>
  <Text style={styles.selectedTitle}>Selected Records:</Text>

  {selectedRecords.length === 0 ? (
    <Text style={styles.noSelection}>No records selected</Text>
  ) : (
    <View style={{ maxHeight: 150 }}> {/* Adjust height as needed */}
      <FlatList
        data={selectedRecords} // Show only first 3 items
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.selectedItemRow}>
            <Text style={styles.selectedItemText}>{item.name}</Text>
          </View>
        )}
        nestedScrollEnabled={true} // Important for scrolling inside another scroll view
        />
    </View>
  )}
</View>

    </View>
  );
};

export default RecordSelectionScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F8F9FA" },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  recordItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  recordText: { fontSize: 16, color: "#333" },
  selectedItem: { backgroundColor: "#DFF6DD" },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1586AC",
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  addButtonText: { fontSize: 16, color: "white", marginLeft: 5 },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginVertical: 10 },
  modalButtons: { flexDirection: "row", justifyContent: "space-around", marginTop: 10 },
  selectedSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#E3F2FD",
    borderRadius: 10,
  },
  selectedTitle: { fontSize: 18, fontWeight: "bold" },
  noSelection: { fontSize: 14, color: "#555", textAlign: "center", marginTop: 10 },
  selectedItemRow: { padding: 10, borderBottomWidth: 1, borderColor: "#ddd" },
  selectedItemText: { fontSize: 16 },
});
