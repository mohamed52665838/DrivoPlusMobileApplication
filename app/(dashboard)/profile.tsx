import React from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import { router } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { TouchableRipple, Divider } from "react-native-paper";
import { useTheme } from "@/app/ThemeProvider"; // ✅ Vérifie le bon chemin !
import useCurrentUserState from "@/zustands.stores/userStore";
import { sessionCleaner } from "@/utils/secure.session";
import { useTranslation } from "react-i18next";



const SettingsScreen = () => {
  const { isDarkMode, toggleDarkMode } = useTheme(); // ✅ Correctement placé ici
  const userSignOuter = useCurrentUserState((state) => state.signOut);
  const { t } = useTranslation()
  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? "#121212" : "#f3f4f6" }]}>
      <Text style={[styles.title, { color: isDarkMode ? "white" : "black" }]}>Paramètres</Text>

      {/* Option Mode Sombre */}
      <View style={styles.settingRow}>
        <Text style={[styles.label, { color: isDarkMode ? "white" : "black" }]}>Mode Sombre</Text>
        <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
      </View>

      {/* Menu des paramètres */}
      <SettingsMenuItem

        name={t('dashboard.settings.profile')}
        icon={<MaterialIcons name="person-outline" size={28} color={isDarkMode ? "white" : "black"} />}
        onPressed={() => router.push("/profile")}
        isDarkMode={isDarkMode}
      />
      <SettingsMenuItem
        name={t('dashboard.settings.prefirences')}
        icon={<AntDesign name="infocirlceo" size={24} color={isDarkMode ? "white" : "black"} />}
        onPressed={() => console.log("Learn More Pressed")}
        isDarkMode={isDarkMode}
      />
      <SettingsMenuItem
        name={t('dashboard.settings.learnmore')}
        icon={<AntDesign name="infocirlceo" size={24} color={isDarkMode ? "white" : "black"} />}
        onPressed={() => console.log("Learn More Pressed")}
        isDarkMode={isDarkMode}
      />
      <SettingsMenuItem
        name={t('dashboard.settings.licence')}
        icon={<MaterialCommunityIcons name="license" size={28} color={isDarkMode ? "white" : "black"} />}
        onPressed={() => console.log("Licence Pressed")}
        isDarkMode={isDarkMode}
      />
      <SettingsMenuItem
        name={t('dashboard.settings.pap')}
        icon={<AntDesign name="infocirlceo" size={24} color={isDarkMode ? "white" : "black"} />}
        onPressed={() => console.log("Learn More Pressed")}
        isDarkMode={isDarkMode}
      />
      <SettingsMenuItem
        name={t('dashboard.settings.disconnect')}
        icon={<SimpleLineIcons name="logout" size={24} color={isDarkMode ? "white" : "black"} />}
        onPressed={async () => {
          userSignOuter();
          await sessionCleaner();
          router.replace("/?sessionCleand=1");
        }}
        isDarkMode={isDarkMode}
      />
    </View>
  );
};

type SettingsMenuItemProps = {
  name: string;
  icon: React.ReactNode; 
  onPressed: () => void; 
  isDarkMode: boolean; 
};

const SettingsMenuItem: React.FC<SettingsMenuItemProps> = ({ name, icon, onPressed, isDarkMode }) => {
  return (
    <TouchableRipple style={{ width: "100%" }} onPress={onPressed}>
      <View>
        <View style={[styles.menuItem, isDarkMode && styles.menuItemDark]}>
          {icon}
          <Text style={[styles.menuText, isDarkMode && styles.textDark]}>{name}</Text>
        </View>
        <Divider style={[styles.divider, isDarkMode && styles.dividerDark]} />
      </View>
    </TouchableRipple>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  label: {
    fontSize: 16,
  },
  menuItem: {
    flexDirection: "row",
    gap: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuItemDark: {
    backgroundColor: "#1e1e1e",
  },
  menuText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  textDark: {
    color: "white",
  },
  divider: {
    borderColor: "black",
    borderBlockColor: "black",
    borderWidth: 0.5,
  },
  dividerDark: {
    borderColor: "white",
  },
});

export default SettingsScreen;
