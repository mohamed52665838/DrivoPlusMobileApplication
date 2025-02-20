import { View } from "react-native";
import { Text } from "react-native-paper";
import { useTheme } from "@/app/ThemeProvider";

export default function Damage() {
    const { theme } = useTheme(); // 🔥 Appel à useTheme() à l'intérieur du composant

    return (
        <View style={{ 
            flex: 1, 
            justifyContent: "center", 
            alignItems: "center",
            backgroundColor: theme.background, // 🎨 Applique le fond du thème
        }}>
            <Text variant="headlineMedium" style={{ color: theme.text }}> {/* 🎨 Applique la couleur du texte */}
                Activités
            </Text>
        </View>
    );
}
