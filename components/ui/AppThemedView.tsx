import { useTheme } from "@/app/ThemeProvider";
import { ViewProps, StyleSheet, View } from "react-native";
import { ReactNode } from "react";
import { LinearGradient } from 'expo-linear-gradient'; // or 'react-native-linear-gradient'

interface AppThemedViewProps extends ViewProps {
  children?: ReactNode;
}

export const AppThemedView = ({ children, style, ...rest }: AppThemedViewProps) => {
  const { isDarkMode } = useTheme();

  if (isDarkMode) {
    return (
      <View {...rest} style={[style, styles.darkBackground]}>
        {children}
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#ffffff', '#e8f5e9']}
      style={[styles.gradientBackground, style]}
      {...rest}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  darkBackground: {
    flex: 1,
    backgroundColor: 'black',
  },
});
