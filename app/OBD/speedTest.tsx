import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";

const WEBSOCKET_URL = "ws://192.168.252.132:5006"; // WebSocket server

const AccelerationScreen = () => {
  const [testStarted, setTestStarted] = useState(false);
  const [accelerationTime, setAccelerationTime] = useState("00:00.000");
  const [speed, setSpeed] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [targetSpeed, setTargetSpeed] = useState("20"); // Default 20 km/h
  const router = useRouter();

  useEffect(() => {
    const ws = new WebSocket(WEBSOCKET_URL);

    ws.onopen = () => console.log("WebSocket connected!");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received:", data);

      if (data.speed !== undefined) {
        setSpeed(data.speed);

        if (testStarted && startTime) {
          const elapsedTime = Date.now() - startTime;
          setAccelerationTime(formatTime(elapsedTime));

          // Stop test when speed reaches user-defined target
          if (data.speed >= Number(targetSpeed)) {
            setTestStarted(false);
            console.log(`Test Stopped at ${targetSpeed} km/h!`);
          }
        }
      }
    };

    ws.onerror = (error) => console.error("WebSocket Error:", error);
    ws.onclose = () => console.log("WebSocket closed!");

    return () => ws.close();
  }, [testStarted, startTime, targetSpeed]);

  const startTest = () => {
    setTestStarted(true);
    setStartTime(Date.now());
    setAccelerationTime("00:00.000");
    console.log("Test Started!");
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = ms % 1000;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(milliseconds).padStart(3, "0")}`;
  };

  return (
    <>
      <View style={styles.container}>
      

        {/* Speed Display */}
        <View style={styles.speedContainer}>
          <Text style={styles.label}>Current Speed:</Text>
          <Text style={styles.speed}>{speed} km/h</Text>
        </View>

        {/* Target Speed Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Target Speed (km/h):</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={targetSpeed}
            onChangeText={setTargetSpeed}
            editable={!testStarted} // Disable input while testing
          />
        </View>

        {/* Acceleration Time */}
        <View style={styles.card}>
          <Text style={styles.label}>Acceleration Time:</Text>
          <Text style={styles.time}>{accelerationTime}</Text>
        </View>

        {/* Start Button */}
        <TouchableOpacity style={[styles.button, testStarted && styles.buttonDisabled]} onPress={startTest} disabled={testStarted}>
          <Text style={styles.buttonText}>{testStarted ? "Testing..." : "Start Test"}</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default AccelerationScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA", justifyContent: "center", alignItems: "center" },
  header: { 
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: "#1586AC", 
    padding: 15, 
    width: "100%",
  },  headerTitle: { fontSize: 18, color: "white", fontWeight: "bold" },
  speedContainer: { alignItems: "center", marginVertical: 20 },
  label: { fontSize: 16, fontWeight: "bold", color: "#555" },
  speed: { fontSize: 24, fontWeight: "bold", color: "#1586AC" },
  inputContainer: { flexDirection: "row", alignItems: "center", marginVertical: 10 },
  input: { borderBottomWidth: 1, borderColor: "#1586AC", fontSize: 20, padding: 5, width: 60, textAlign: "center" },
  card: { backgroundColor: "white", padding: 20, borderRadius: 10, alignItems: "center", marginVertical: 10, shadowColor: "#000", shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 3 },
  time: { fontSize: 24, fontWeight: "bold", color: "#1586AC" },
  button: { backgroundColor: "#4CAF50", paddingVertical: 14, paddingHorizontal: 28, borderRadius: 25, marginTop: 20 },
  buttonDisabled: { backgroundColor: "#B0BEC5" }, // Gray when disabled
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold", textAlign: "center" },
});
