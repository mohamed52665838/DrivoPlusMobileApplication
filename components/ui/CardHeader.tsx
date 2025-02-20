import React, { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';

interface CardHeaderProps {
  children: ReactNode;
}

const CardHeader: React.FC<CardHeaderProps> = ({ children }) => {
  return <View style={styles.header}>{children}</View>;
};

const styles = StyleSheet.create({
  header: {
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 8,
  },
});

export default CardHeader;
