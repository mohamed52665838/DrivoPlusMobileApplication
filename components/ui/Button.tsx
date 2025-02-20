import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent } from 'react-native';
import React, { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;  // ✅ Typage correct pour les enfants (ReactNode)
  onPress: (event: GestureResponderEvent) => void;  // ✅ Typage correct pour onPress
  style?: object; // ✅ Optionnel : permet de personnaliser le style
}

const Button: React.FC<ButtonProps> = ({ children, onPress, style = {} }) => (
  <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
    <Text style={styles.text}>{children}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    padding: 12,
    backgroundColor: '#007bff',
    borderRadius: 8,
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Button;
