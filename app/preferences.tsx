import { AppThemedView } from "@/components/ui/AppThemedView"
import { AppTextTheme } from "@/components/ui/TextThemed"
import { useTheme } from "./ThemeProvider";
import { Appbar,Text, Button, Switch, Icon, Divider } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { Children, ReactNode, useEffect, useState } from "react";
import { Dropdown } from 'react-native-paper-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker';

const supportedLanguages = new Set<string> ([
    'en',
    'fr'
])
const LANGUAGE_KEY = 'lang'
export default () => {
    const {isDarkMode, toggleDarkMode} = useTheme()
    const {t, i18n} = useTranslation()
    const [langauge, setLaguage] = useState<string>()
    const [isFocused, setIsFocused] = useState(false)
    
    useEffect(() => {
        ( async () => {
        const currentLang = await AsyncStorage.getItem(LANGUAGE_KEY)
        console.log(i18n.language)
        if(!currentLang) {
           if(i18n.language.includes('fr')) {
            setLaguage('fr')
            await AsyncStorage.setItem(LANGUAGE_KEY, 'fr')
           }else {
            setLaguage('en')
            await AsyncStorage.setItem(LANGUAGE_KEY, 'en')
           }
        }else {
            if(!supportedLanguages.has(currentLang)) 
                throw Error('language not supported')
            setLaguage(currentLang)
            i18n.changeLanguage(currentLang)
        }
        })()


    }, [])

    const onLanguageChange = (newLang: string) => {
        setLaguage(newLang)
        AsyncStorage.setItem(LANGUAGE_KEY, newLang)
        i18n.changeLanguage(newLang)
    }
    
    return (
      <AppThemedView
        style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 18 }}
      >
        <PrefMenuItem
          title="Dark Mode"
          label="Mode"
          widget={<Switch onChange={toggleDarkMode} value={isDarkMode} />}
        />
        <Divider style={{ height: 1 }} />
        <View style={{ marginTop: 12 }}>
          <AppTextTheme variente="labelLarge">Longauge</AppTextTheme>
          <Picker
           onFocus={() => {
            setIsFocused(true)
           }} 
           onBlur={() => {
            setIsFocused(false)
           }}
            itemStyle = {{backgroundColor: 'black'}}
            selectedValue={langauge}
            onValueChange={onLanguageChange}
            dropdownIconColor={(isDarkMode)? 'white': 'black'}
            style={{marginVertical: 12, backgroundColor: (isDarkMode) ? 'black': 'white'}}
          >
            <Picker.Item label="English" value="en" style= { {
                color: (isFocused)? 'black' : (isDarkMode) ? 'white' : 'black'
            } }/>
            <Picker.Item label="French" value="fr" style= { {
                color: (isFocused)? 'black' : (isDarkMode) ? 'white': 'black'
            } }/>
          </Picker>
        </View>
      </AppThemedView>
    );
}

interface PrefMenuItemProps  {
    title: string,
    label: string,
    widget: ReactNode
}

const PrefMenuItem = ({ title, label, widget }: PrefMenuItemProps) => {
  return (
    <AppThemedView style={{

          paddingVertical: 4,
    }}>
        <AppTextTheme variente="labelLarge">
            {label}
        </AppTextTheme>
      <AppThemedView
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <AppTextTheme>{title}</AppTextTheme>
        {widget}
      </AppThemedView>
    </AppThemedView>
  );
};

const styles = StyleSheet.create({
    label: {

    },

  menuItem: {
    flexDirection: "row",
    gap: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuItemDark: {
    backgroundColor: "black",
  },
  menuText: {
    fontSize: 18,
    fontWeight: "bold",
  },
   itemStyleNotDarkMode: {backgroundColor: 'white', color: 'black'},
   itemStyleDarkMode:  {backgroundColor: 'black', color: 'white'}
},

)


