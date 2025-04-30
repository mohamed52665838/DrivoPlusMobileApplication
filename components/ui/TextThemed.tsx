import { useTheme } from "@/app/ThemeProvider"
import { ReactNode } from "react"
import { TextStyle } from "react-native"
import { Text } from "react-native-paper"
import { VariantProp } from "react-native-paper/lib/typescript/components/Typography/types"
export const AppTextTheme = (
    {children, variente, style}: {children: ReactNode, variente?: VariantProp<never> |undefined, style?: TextStyle | TextStyle[]}
) => {
    const {isDarkMode} =  useTheme()
    return ( <Text variant={variente} style={[{ color: isDarkMode ? "white" : "black" }, style]}>
      {children}
      </Text>)
}