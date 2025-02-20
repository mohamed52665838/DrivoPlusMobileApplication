import { AppThemedView } from "@/components/ui/AppThemedView"
import { AppTextTheme } from "@/components/ui/TextThemed"
import { useTranslation } from "react-i18next"
import { View, Text } from "react-native"

export default () => {
    const {t} = useTranslation()
    return (
        <AppThemedView style={{flex: 1}}>
                <AppTextTheme variente="headlineMedium" style={
                    {
                        paddingHorizontal: 12,
                        paddingVertical: 16
                    
                    }
                }>
                    {t('dashboard.damage.damage')}

                </AppTextTheme>
        </AppThemedView>
    )

   
}