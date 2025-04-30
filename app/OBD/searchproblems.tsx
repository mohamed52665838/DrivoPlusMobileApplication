import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { AppThemedView } from '@/components/ui/AppThemedView';
import { useTheme } from '@/app/ThemeProvider';

interface VehicleError {
  code: string;
  description: string;
}

interface DiagnosticInterfaceProps {
  onScanComplete?: (errors: VehicleError[]) => void;
}

const DiagnosticInterface: React.FC<DiagnosticInterfaceProps> = ({ onScanComplete }) => {
  const { isDarkMode } = useTheme();
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

    const socket = new WebSocket('ws://172.20.10.3:5006');
    socketRef.current = socket;

    socket.onopen = () => console.log('WebSocket connected');

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

    setTimeout(() => stopScan(), 4000);
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

  const themedStyles = styles(isDarkMode);

  return (
    <AppThemedView style={themedStyles.container}>
      <View style={themedStyles.statusContainer}>
        {isScanning ? (
          <Animated.View style={[themedStyles.scanIndicator, { transform: [{ translateX }] }]}>
            <MaterialIcons name="car-repair" size={50} color="#FFA500" />
            <Animated.View style={{ transform: [{ rotate: rotateSearch }] }}>
              <MaterialIcons name="search" size={30} color="#FFA500" style={themedStyles.searchIcon} />
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
        style={[themedStyles.button, isScanning && themedStyles.scanningButton]}
        onPress={isScanning ? stopScan : startScan}
        disabled={isScanning}
      >
        <Text style={themedStyles.buttonText}>
          {isScanning ? 'Stop Scanning' : 'Start Diagnostic'}
        </Text>
      </TouchableOpacity>

      {foundErrors.length > 0 && (
        <View style={themedStyles.resultsContainer}>
          <Text style={themedStyles.resultsTitle}>Detected Issues:</Text>
          {foundErrors.map((error, index) => (
            <View key={index} style={themedStyles.errorItem}>
              <Text style={themedStyles.errorCode}>{error.code}</Text>
              <Text style={themedStyles.errorDescription}>{error.description}</Text>
            </View>
          ))}
        </View>
      )}
    </AppThemedView>
  );
};

const styles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: isDarkMode ? '#1e1e1e' : '#f5f5f5',
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
      borderRadius: 10,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 6,
    },
    scanningButton: {
      backgroundColor: '#FFA500',
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    resultsContainer: {
      marginTop: 25,
    },
    resultsTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 15,
      color: isDarkMode ? '#fff' : '#333',
    },
    errorItem: {
      backgroundColor: isDarkMode ? '#2c2c2c' : '#fff',
      padding: 15,
      borderRadius: 10,
      marginBottom: 10,
      shadowColor: isDarkMode ? '#000' : '#aaa',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 4,
    },
    errorCode: {
      color: '#FF4444',
      fontSize: 16,
      fontWeight: 'bold',
    },
    errorDescription: {
      fontSize: 14,
      color: isDarkMode ? '#ccc' : '#666',
      marginTop: 3,
    },
  });

export default DiagnosticInterface;
