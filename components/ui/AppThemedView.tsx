import { useTheme } from "@/app/ThemeProvider";
import { ViewProps, View } from "react-native";

export const AppThemedView = (props: ViewProps) => {
    const {isDarkMode} = useTheme()
    return (
    <View {...props} style={[props.style, {backgroundColor: isDarkMode ? 'black' : 'white' }]}>
      {props.children}
    </View>

    )
}