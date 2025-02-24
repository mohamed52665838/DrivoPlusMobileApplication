import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Text } from 'react-native';
import RpmGauge from './rpmGauche';
import SpeedGauge from './Speed';
import { useRouter } from "expo-router";
import { PanGestureHandler, State } from "react-native-gesture-handler";

const Dashboard: React.FC = () => {
  const [speed, setSpeed] = useState<number>(0);
  const [rpm, setRpm] = useState<number>(0);
 
  const speedAnimatedValue = useRef(new Animated.Value(0)).current;
  const rpmAnimatedValue = useRef(new Animated.Value(0)).current;
  const router = useRouter(); // Router for navigation

  useEffect(() => {
    const socket = new WebSocket('ws://192.168.252.132:5006');

    socket.onopen = () => {
      console.log('WebSocket connected');
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const newSpeed = Math.min(Math.max(data.speed || 0, 0), 200);
        const newRpm = Math.min(Math.max(data.rpm || 0, 0), 7000);

        console.log('Speed:', newSpeed, 'RPM:', newRpm);
        setSpeed(newSpeed);
        setRpm(newRpm);
        animateValue(speedAnimatedValue, newSpeed);
        animateValue(rpmAnimatedValue, newRpm);
      } catch (error) {
        console.error('Error parsing WebSocket data:', error);
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      socket.close();
    };
  }, []);

  const animateValue = (animatedValue: Animated.Value, toValue: number) => {
    Animated.spring(animatedValue, {
      toValue,
      friction: 5,
      useNativeDriver: false,
    }).start();
  };
  const handleSwipe = ({ nativeEvent }: any) => {
    if (nativeEvent.translationX > 100) {
      console.log("Swiped right! Navigating...");
      router.push("/components/detailCar" as any); // Update with your target screen
    }
  };

  return (
      <View style={styles.container}>
        <RpmGauge animatedValue={rpmAnimatedValue} size={300} maxValue={7000} />
        <SpeedGauge animatedValue={speedAnimatedValue} size={300} maxValue={200} />
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  borderActive: {
    borderColor: 'pink',
},
pillLabel: {
    color: 'gray',
},
activeLabel: {
    color: '#ba2d65',
},
});

export default Dashboard;