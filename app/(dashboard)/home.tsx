import { buttonStyle } from "@/components/ui/ButtonEditStyle";
import { useUser } from "@/components/ui/UserProvider.provider";
import useCurrentUserState from "@/zustands.stores/userStore";
import { router } from "expo-router";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import { useTheme } from "@/app/ThemeProvider";
import { useTranslation } from "react-i18next";


export default function HomeScreen() {
  const { theme } = useTheme(); // 🔥 Appel à useTheme() à l'intérieur du composant
    const user = useCurrentUserState();
    console.log("Thème appliqué dans HomeScreen :", theme);
    const {t} = useTranslation()

    return (
        <View style={{ 
            flex: 1, 
            paddingHorizontal: 12, 
            paddingVertical: 12, 
            backgroundColor: theme.background, // 🎨 Applique le fond du mode sombre ou clair
        }}>
            {user.userModel?.full_name && (
                <Text 
                    variant="headlineSmall" 
                    style={{
                        textTransform: 'capitalize', 
                        fontWeight: 'bold', 
                        color: theme.text // 🎨 Applique la couleur du texte
                    }}
                >
                    {t('dashboard.welcome', {name: user.userModel.full_name.split(' ').at(0)})} 
                </Text>
            )}

            {/* Contenu central */}
            <View style={{ flex: 1, justifyContent: "center", alignItems: 'center', backgroundColor: theme.background, }}>
                <Text style={{ color: theme.text }}> {/* 🎨 Texte avec couleur du thème */}
                    Welcome Back: Something Great Coming Soon!
                </Text>
            </View>

            {/* Bouton Acheter Premium */}
            <Button 
                style={[buttonStyle.normal, { backgroundColor: theme.button }]} // 🎨 Applique la couleur du bouton
                mode="contained" 
                onPress={() => {
                    console.log('Navigating to /paymentScreen');
                    router.push('/paymentScreen');
                }}
            >
                Acheter Premium
            </Button>
        </View>
    );
    
}

