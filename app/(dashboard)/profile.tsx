import React, { useState } from "react";
import { View, StyleSheet, TextInput, Image } from "react-native";
import { router } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Entypo from "@expo/vector-icons/Entypo";
import { TouchableRipple, Divider } from "react-native-paper";
import { useTheme } from "@/app/ThemeProvider";
import useCurrentUserState from "@/zustands.stores/userStore";
import { sessionCleaner } from "@/utils/secure.session";
import { useTranslation } from "react-i18next";
import { AppTextTheme } from "@/components/ui/TextThemed";
import { useForm } from "react-hook-form";
import { LinearGradient } from "expo-linear-gradient";
import { AppThemedView } from "@/components/ui/AppThemedView";

interface UpdateFields {
    name: string
    email: string
    phone: string
}



const SettingsScreen = () => {
  const userState = useCurrentUserState()
    const [isEditable, setIsEditable] = useState(false)
    const userNamePlain = userState.userModel?.full_name 
    const Email = userState.userModel?.email 

    const userName = `${userNamePlain?.slice(0, 1).toUpperCase()}${userNamePlain?.slice(1, userNamePlain?.length ?? 0).toLowerCase()}`


  const { isDarkMode, toggleDarkMode } = useTheme();
  const userSignOuter = useCurrentUserState((state) => state.signOut);
  const { t } = useTranslation();

  return (
    <AppThemedView style={styles.container}>
    
      {/* Search Bar */}
      <TextInput
        placeholder="Search..."
        placeholderTextColor={isDarkMode ? "#aaa" : "#666"}
        style={[styles.searchBar, isDarkMode && styles.searchBarDark]}
      />

      {/* Profile Card */}
      <View style={[styles.profileCard, isDarkMode && styles.cardDark]}>
        <Image
          source={{ uri: "https://randomuser.me/api/portraits/women/44.jpg" }}
          style={styles.avatar}
        />
        <View>
          <AppTextTheme style={styles.userName}>{userName}</AppTextTheme>
          <AppTextTheme style={styles.userEmail}>{Email}</AppTextTheme>
        </View>
      </View>

      {/* Settings Sections */}
      <View style={[styles.sectionCard, isDarkMode && styles.cardDark]}>
        <SettingsMenuItem
          name={t("dashboard.settings.profile")}
          icon={<MaterialIcons name="person-outline" size={28} color={iconColor(isDarkMode)} />}
          onPressed={() => router.push("/profilee")}
          isDarkMode={isDarkMode}
        />
        <Divider style={[styles.divider, isDarkMode && styles.dividerDark]} />

        <SettingsMenuItem
          name={t("dashboard.settings.prefirences")}
          icon={<Entypo name="sound-mix" size={24} color={iconColor(isDarkMode)} />}
          onPressed={() => router.push("/preferences")}
          isDarkMode={isDarkMode}
        />
      </View>

      <View style={[styles.sectionCard, isDarkMode && styles.cardDark]}>
        <SettingsMenuItem
          name={t("dashboard.settings.learnmore")}
          icon={<AntDesign name="infocirlceo" size={24} color={iconColor(isDarkMode)} />}
          onPressed={() => console.log("Learn More Pressed")}
          isDarkMode={isDarkMode}
        />
        <Divider style={[styles.divider, isDarkMode && styles.dividerDark]} />

        <SettingsMenuItem
          name={t("dashboard.settings.licence")}
          icon={<MaterialCommunityIcons name="license" size={28} color={iconColor(isDarkMode)} />}
          onPressed={() => console.log("Licence Pressed")}
          isDarkMode={isDarkMode}
        />
        <Divider style={[styles.divider, isDarkMode && styles.dividerDark]} />

        <SettingsMenuItem
          name={t("dashboard.settings.pap")}
          icon={
            <MaterialCommunityIcons
              name="police-badge-outline"
              size={28}
              color={iconColor(isDarkMode)}
            />
          }
          onPressed={() => console.log("Policy Pressed")}
          isDarkMode={isDarkMode}
        />
      </View>

      <View style={[styles.sectionCard, isDarkMode && styles.cardDark]}>
        <SettingsMenuItem
          name={t("dashboard.settings.disconnect")}
          icon={<SimpleLineIcons name="logout" size={24} color={iconColor(isDarkMode)} />}
          onPressed={async () => {
            userSignOuter();
            await sessionCleaner();
            router.replace("/?sessionCleand=1");
          }}
          isDarkMode={isDarkMode}
        />
      </View>
    </AppThemedView>
  );
};

type SettingsMenuItemProps = {
  name: string;
  icon: React.ReactNode;
  onPressed: () => void;
  isDarkMode: boolean;
};

const SettingsMenuItem = ({ name, icon, onPressed, isDarkMode }: SettingsMenuItemProps) => (
  <TouchableRipple onPress={onPressed}>
    <View style={[styles.menuItem]}>
      {icon}
      <AppTextTheme style={styles.menuText}>{name}</AppTextTheme>
    </View>
  </TouchableRipple>
);

const iconColor = (isDarkMode: boolean) => (isDarkMode ? "white" : "black");

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    margin: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
    fontSize: 16,
  },
  searchBarDark: {
    backgroundColor: "#444",
    color: "white",
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 16,
    backgroundColor: "#82E0AA",
    marginBottom: 8,
    gap: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#ccc",
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  userEmail: {
    fontSize: 14,
    color: "#777",
  },
  sectionCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    backgroundColor: "#D5F5E3",
    overflow: "hidden",
  },
  cardDark: {
    backgroundColor: "#2A2A2A",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  menuText: {
    fontSize: 16,
    fontWeight: "500",
  },
  divider: {
    borderColor: "black",
    borderWidth: 0.3,
    marginHorizontal: 16,
  },
  dividerDark: {
    borderColor: "white",
  },
});

export default SettingsScreen;
