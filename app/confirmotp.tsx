import { useUser } from "@/components/ui/UserProvider.provider";
import { verifyOtpToken } from "@/serviers/OtpService.service.rn";
import { storeApiKey, TokenStructure } from "@/utils/secure.session";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { View, TextInput, StyleSheet, TextInputKeyPressEventData, NativeSyntheticEvent } from "react-native";
import { Button, Text } from "react-native-paper";

interface OTPInputProps {
  length?: number; // Number of OTP digits
  onComplete: (otp: string) => void; // Callback when OTP is complete
}


const OTPInput: React.FC<OTPInputProps> = ({ length = 6, onComplete }) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const inputs = useRef<Array<TextInput | null>>([]);
  const [isRunning, setIsRunning] = useState(true)
  const { email } = useLocalSearchParams()
  const [error, setError] = useState<string | null>() 
  if(email == undefined || typeof email != "string") {
    router.replace('/?e-conf=0')
  }
  const user  = useUser()
  const [counter, setCounter] = useState(0)

  useEffect(() => {
    if(!isRunning) return
      const counterInterval = setInterval(() => {
            setCounter((value) => {
                if(value === 59) {
                    setIsRunning(false)
                    return 0
                }
                return value + 1
            })
      }, 1000)

      return () => clearInterval(counterInterval)
  }, [isRunning])

  const onChange = (caracterat: string, index: number) => {
    console.log(` we have a character ${caracterat}`)
    if(index == length) return // This means no more fill

    const newOtp = [...otp];
    newOtp[index] = caracterat;
    setOtp(newOtp);

    if (caracterat && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }

}
  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };


  // verification request

  const verificationRequest = async () => {
    if(!otp.every((e) => e.length > 0)) return 
    // required empty string without it the result is samething like this '1, 2, 3, 4' we need '1234'
    const code = otp.join('')
    const response = await verifyOtpToken({code: code, email: email as string})
    if(response != null) {
        const result = await storeApiKey(response.data.tokens.access_token, TokenStructure.TOKEN)
        const goback = await storeApiKey(response.data.tokens.refresh_token, TokenStructure.REFRESH_TOKEN)
        user?.updateUser(response.data.user)
      router.replace(`/(dashboard)/home?eConf=${response.status ? 1 : 0}`)
    } 
  }

  const {t} = useTranslation()

  return (
    <View style={{paddingVertical: 20, paddingHorizontal: 16}}>
        <Text variant="labelLarge" style = {{textAlign: "center", paddingVertical: 12}}>
          {t('otpc.head')}
        </Text>
    <View style={styles.container}>
      {otp.map((_, index) => (
        <TextInput
          key={index}
          ref={(el) => (inputs.current[index] = el)}
          style={styles.input}
          keyboardType="numeric"
          maxLength={1}
          onChangeText={(text) => onChange(text, index) }
          onKeyPress={(e) => handleKeyPress(e, index) }
          value={otp[index]}
          autoFocus={index === 0}
        />
      ))}
    </View>
          <View style={{marginTop: 20}}>
                <Button onPress={() => setIsRunning(true)} disabled={isRunning} style={{backgroundColor: (!isRunning) ? 'transparent' : 'lightgray', width: 100}}>
                    {t('otpc.resend')} {isRunning && counter}
                </Button>
              <Button disabled={otp.filter((e) => e.length == 0).length > 0} onPress={() => verificationRequest() }>
                  {t('otpc.verify')}
              </Button>
          </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
  },
  input: {
    width: 40,
    height: 50,
    borderWidth: 2,
    borderColor: "#333",
    textAlign: "center",
    fontSize: 22,
    marginHorizontal: 5,
    borderRadius: 10,
  },
});

export default OTPInput;
