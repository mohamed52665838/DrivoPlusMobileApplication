import { AppTextTheme } from "@/components/ui/TextThemed";
import { useTheme } from "./ThemeProvider";
import { Switch, Divider, Surface } from "react-native-paper";
import { useTranslation } from "react-i18next";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Modal,
  ViewStyle,
} from "react-native";
import { useEffect, useState, useLayoutEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { AppThemedView } from "@/components/ui/AppThemedView";
import { useNavigation } from "expo-router";

const supportedLanguages = new Set<string>(["en", "fr"]);
const LANGUAGE_KEY = "lang";

export default function PreferencesScreen() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState<string>();
  const [modalVisible, setModalVisible] = useState(false);
  const styles = getStyles(isDarkMode);
  const navigation = useNavigation();

  // Set custom AppBar color dynamically

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);
  

  useEffect(() => {
    (async () => {
      const currentLang = await AsyncStorage.getItem(LANGUAGE_KEY);
      if (!currentLang) {
        const defaultLang = i18n.language.includes("fr") ? "fr" : "en";
        setLanguage(defaultLang);
        await AsyncStorage.setItem(LANGUAGE_KEY, defaultLang);
      } else {
        if (!supportedLanguages.has(currentLang))
          throw Error("language not supported");
        setLanguage(currentLang);
        i18n.changeLanguage(currentLang);
      }
    })();
  }, []);

  const onLanguageChange = async (lang: string) => {
    setLanguage(lang);
    await AsyncStorage.setItem(LANGUAGE_KEY, lang);
    i18n.changeLanguage(lang);
    setModalVisible(false);
  };

  return (
    <AppThemedView style={styles.container}>
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      style={{
        position: "absolute",
        top :10,
        left: 20,
        width: 45,
        height: 45,
        borderRadius: 20,
        backgroundColor: isDarkMode ? "#2A2A2A" : "#D5F5E3",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,
      }}
    >
      <Ionicons name="arrow-back" size={22} color={isDarkMode ? "#fff" : "#00796B"} />
    </TouchableOpacity>
  
    {/* Appearance Section */}
    <AppTextTheme variente="labelLarge" style={{ marginBottom: 50 , top: 45 }}>
      {t("Appearance")}
    </AppTextTheme>
    <Surface style={styles.prefCard}>
      <AppTextTheme>Dark Mode</AppTextTheme>
      <Switch
        onValueChange={toggleDarkMode}
        value={isDarkMode}
        color={isDarkMode ? "white" : "black"}
      />
    </Surface>
  
    <Divider style={styles.divider} />
  
    {/* Language Section */}
    <View style={{ marginTop: 20 }}>
      <AppTextTheme variente="labelLarge">{t("Language")}</AppTextTheme>
  
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Surface
          style={[
            styles.dropdownBox,
            { backgroundColor: isDarkMode ? "#2A2A2A" : "#f9f9f9" },
          ]}
        >
          <AppTextTheme>
            {language === "fr" ? "Français" : "English"}
          </AppTextTheme>
          <Ionicons
            name="chevron-down"
            size={20}
            color={isDarkMode ? "white" : "black"}
          />
        </Surface>
      </TouchableOpacity>
    </View>
  
    {/* Language Modal */}
    <Modal transparent={true} visible={modalVisible} animationType="fade">
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContent,
            { backgroundColor: isDarkMode ? "#222" : "white" },
          ]}
        >
          <TouchableOpacity
            onPress={() => onLanguageChange("en")}
            style={styles.modalItem}
          >
            <AppTextTheme>English</AppTextTheme>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onLanguageChange("fr")}
            style={styles.modalItem}
          >
            <AppTextTheme>Français</AppTextTheme>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={styles.modalItem}
          >
            <AppTextTheme style={{ color: "red" }}>
              {t("Cancel")}
            </AppTextTheme>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  </AppThemedView>
  
  );
}

interface PrefMenuItemProps {
  title: string;
  label: string;
  widget: React.ReactNode;
  style: {
    prefCard: ViewStyle;
  };
}

const PrefMenuItem = ({ title, label, widget, style }: PrefMenuItemProps) => {
  return (
    <View style={{ marginBottom: 24 }}>
      <AppTextTheme variente="labelLarge">{label}</AppTextTheme>
      <Surface style={style.prefCard}>
        <AppTextTheme>{title}</AppTextTheme>
        {widget}
      </Surface>
    </View>
  );
};

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 18,
      paddingVertical: 20,
    },
    divider: {
      height: 1,
      marginVertical: 12,
    },
    dropdownBox: {
      flexDirection: "row",
      justifyContent: "space-between",
      padding: 14,
      borderRadius: 12,
      elevation: 2,
      marginTop: 12,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      width: "80%",
      borderRadius: 16,
      padding: 20,
      elevation: 10,
    },
    modalItem: {
      paddingVertical: 14,
    },
    prefCard: {
      marginTop: 8,
      padding: 14,
      borderRadius: 12,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      elevation: 3,
      backgroundColor: isDark ? "#2A2A2A" : "#f9f9f9",
    },
  });
