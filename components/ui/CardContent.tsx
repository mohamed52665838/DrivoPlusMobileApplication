import React, { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';

interface CardContentProps {
  children: ReactNode;
}

const CardContent: React.FC<CardContentProps> = ({ children }) => {
  return <View style={styles.content}>{children}</View>;
};

const styles = StyleSheet.create({
  content: {
    paddingVertical: 8,
  },
});

export default CardContent;
