import React, { ReactNode } from 'react';
import { Text, StyleSheet } from 'react-native';

interface CardTitleProps {
  children: ReactNode;
}

const CardTitle: React.FC<CardTitleProps> = ({ children }) => {
  return <Text style={styles.title}>{children}</Text>;
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
});

export default CardTitle;
