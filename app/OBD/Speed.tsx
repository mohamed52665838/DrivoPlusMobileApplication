import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Svg, { Circle, Path, Line, Text as SvgText } from 'react-native-svg';

interface SpeedGaugeProps {
  animatedValue: Animated.Value;
  size: number;
  maxValue: number;
}

const SpeedGauge: React.FC<SpeedGaugeProps> = ({ animatedValue, size, maxValue }) => {
  const [currentSpeed, setCurrentSpeed] = useState<number>(0);

  useEffect(() => {
    const listener = animatedValue.addListener(({ value }) => {
      setCurrentSpeed(Math.round(value));
    });

    return () => {
      animatedValue.removeListener(listener);
    };
  }, [animatedValue]);

  const interpolateRotation = (animatedValue: Animated.Value, maxValue: number) => {
    return animatedValue.interpolate({
      inputRange: [0, maxValue],
      outputRange: ['-90deg', '90deg'],
    });
  };

  const renderScale = () => {
    const step = 20;
    return Array.from({ length: maxValue / step + 1 }).map((_, i) => {
      const angle = -90 + (i * 180) / (maxValue / step);
      const value = i * step;
      return (
        <React.Fragment key={i}>
          <Line
            x1="100"
            y1="20"
            x2="100"
            y2={i % 2 === 0 ? '30' : '25'}
            stroke="#333"
            strokeWidth="2"
            transform={`rotate(${angle} 100 100)`}
          />
          {i % 2 === 0 && (
            <SvgText
              x="100"
              y="45"
              fill="#333"
              fontSize="12"
              textAnchor="middle"
              transform={`rotate(${angle} 100 100)`}
            >
              {value}
            </SvgText>
          )}
        </React.Fragment>
      );
    });
  };

  const rotation = interpolateRotation(animatedValue, maxValue);

  return (
    <View style={styles.gaugeContainer}>
      <Svg height={size} width={size} viewBox="0 0 200 200">
        <Circle cx="100" cy="100" r="90" stroke="#333" strokeWidth="5" fill="none" />
        {renderScale()}
        <Animated.View
          style={{
            position: 'absolute',
            transform: [{ rotate: rotation }],
          }}
        >
          <Svg height={size} width={size} viewBox="0 0 200 200">
            <Path d="M100 20 L110 100 L90 100 Z" fill="#FF4444" stroke="#CC0000" strokeWidth="2" />
            <Circle cx="100" cy="100" r="10" fill="#333" />
          </Svg>
        </Animated.View>
      </Svg>

      {/* Display the current speed below the gauge */}
      <Text style={styles.speedValue}>Speed {currentSpeed} KTS</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  gaugeContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  gaugeLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
  },
  speedValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
});

export default SpeedGauge;