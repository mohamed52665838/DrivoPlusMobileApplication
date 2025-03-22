import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface VehicleError {
  code: string;
  description: string;
}

interface DiagnosticInterfaceProps {
  onScanComplete?: (errors: VehicleError[]) => void;
}

const DiagnosticInterface: React.FC<DiagnosticInterfaceProps> = ({ onScanComplete }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [foundErrors, setFoundErrors] = useState<VehicleError[]>([]);
  const scanAnim = useRef(new Animated.Value(0)).current;
  const { width } = Dimensions.get('window');
  const socketRef = useRef<WebSocket | null>(null);

  const startScan = () => {
    setIsScanning(true);
    setFoundErrors([]);

    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scanAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    const socket = new WebSocket('ws://192.168.203.132:5006');
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('WebSocket connected');
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (Array.isArray(data.dtc) && data.dtc.length > 0) {
          const errors = data.dtc.map((error: { code: string; description: string }) => ({
            code: error.code,
            description: error.description,
          }));
          setFoundErrors(errors);
          onScanComplete?.(errors);
        } else {
          console.warn('No errors found.');
        }
      } catch (error) {
        console.error('Error processing WebSocket data:', error);
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    setTimeout(() => {
      stopScan();
    }, 4000);
  };

  const stopScan = () => {
    setIsScanning(false);
    scanAnim.stopAnimation();
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
  };

  const translateX = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-width * 0.4, width * 0.4],
  });

  const rotateSearch = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.statusContainer}>
        {isScanning ? (
          <Animated.View style={[styles.scanIndicator, { transform: [{ translateX }] }]}>
            <MaterialIcons name="car-repair" size={50} color="#FFA500" />
            <Animated.View style={{ transform: [{ rotate: rotateSearch }] }}>
              <MaterialIcons name="search" size={30} color="#FFA500" style={styles.searchIcon} />
            </Animated.View>
          </Animated.View>
        ) : (
          <MaterialIcons
            name={foundErrors.length ? 'error-outline' : 'check-circle'}
            size={60}
            color={foundErrors.length ? '#FF4444' : '#4CAF50'}
          />
        )}
      </View>

      <TouchableOpacity
        style={[styles.button, isScanning && styles.scanningButton]}
        onPress={isScanning ? stopScan : startScan}
        disabled={isScanning}
      >
        <Text style={styles.buttonText}>{isScanning ? 'Stop Scanning' : 'Start Diagnostic'}</Text>
      </TouchableOpacity>

      {foundErrors.length > 0 && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>Detected Issues:</Text>
          {foundErrors.map((error, index) => (
            <View key={index} style={styles.errorItem}>
              <Text style={styles.errorCode}>{error.code}</Text>
              <Text style={styles.errorDescription}>{error.description}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  statusContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  scanIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    marginLeft: 10,
  },
  button: {
    backgroundColor: '#1586AC',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  scanningButton: {
    backgroundColor: '#FF9800',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultsContainer: {
    marginTop: 20,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  errorItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  errorCode: {
    color: '#FF4444',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 3,
  },
});

export default DiagnosticInterface;
