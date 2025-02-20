import { AppThemedView } from "@/components/ui/AppThemedView"
import { AppTextTheme } from "@/components/ui/TextThemed"
import { useTheme } from "./ThemeProvider";
import { Appbar,Text, Button, Switch } from "react-native-paper";
import { useTranslation } from "react-i18next";

export default () => {
    const {isDarkMode, toggleDarkMode} = useTheme()

    const {t} = useTranslation()
    return (
      <AppThemedView>
        <Appbar style={{backgroundColor: isDarkMode ? 'black' : 'white'}} >
          <Appbar.Header  style={{backgroundColor: isDarkMode ? 'black' : 'white'}}>
            <AppTextTheme variente="headlineMedium">
              {t("dashboard.prefirences.prefirences")}
            </AppTextTheme>
          </Appbar.Header>
        </Appbar>
        <AppTextTheme style={{ borderBlockColor: "black" }}>
          Hello From Pref
        </AppTextTheme>
        <AppTextTheme>
          Mode Sombre
        </AppTextTheme>
        <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
      </AppThemedView>
    );
}


