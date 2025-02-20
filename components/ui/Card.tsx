import React, { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';

interface CardProps {
  children: ReactNode; // ✅ Permet d'afficher du texte ou d'autres composants React
  style?: object; // ✅ Optionnel : permet d'ajouter un style personnalisé
}

const Card: React.FC<CardProps> = ({ children, style = {} }) => {
  return <View style={[styles.card, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4, // Pour Android
    marginVertical: 8,
  },
});

export default Card;
