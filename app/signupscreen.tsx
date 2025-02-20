import React, { useState } from 'react'
import { View, ScrollView, Alert } from 'react-native'
import { Controller, useForm } from 'react-hook-form'
import { Button, Divider, TextInput, Text, useTheme } from 'react-native-paper'
import { textEditStyle } from '@/components/ui/TextEditStyle'
import { router } from 'expo-router'
import { buttonStyle } from '@/components/ui/ButtonEditStyle'
import { AxiosError } from 'axios'
import networkErrorTranslation from '@/utils/network.translation'
import { signupRequest } from '@/serviers/Registration.servcie.rn'
import { storeApiKey, TokenStructure } from '@/utils/secure.session'
import { useTranslation } from 'react-i18next'



const SignupScreen = () => {
  const [isVisible, setVisibility] = useState(false)
  const [userName, setUserName] = useState('')
  const {register, handleSubmit, control,formState: {errors, isSubmitting}} = useForm<SignupFields>()

  const signup = async (data: SignupFields)  => {
    data.username = data.email
    const response = await signupRequest(data).catch((e: AxiosError) => {
      const [title, message] = networkErrorTranslation(e);
      Alert.alert(title, message)
    }).catch((e) => 
      Alert.alert('Sorry', 'unexpectd error just happned')
  );

  if(response != null) {
    data.username = data.email
    if(response.data) {
      storeApiKey(response.data.access_token, TokenStructure.TOKEN)
      storeApiKey(response.data.refresh_token, TokenStructure.REFRESH_TOKEN)
      router.replace(`/confirmotp?email=${data.email}`)

      // const isSent = await sendOtpTokenCode({email: data.email})
      // if(isSent) {
      //   console.log('redirect ot confimration') 
      // }
      // else {
      //   router.replace('/?eConf=0' )
      // }

    }else 
      // maybe !
      throw new Error("unexpected action just happned: signup response not null but the data is unvalid")
  }

  }



  const { t } = useTranslation()

  // const sendOtpTokenCode = async (otpPayloadSend: OtpPayloadSend): Promise<boolean> => {
  //   const response = await sendOtpToken(otpPayloadSend)
  //   .catch((e: AxiosError) => {
  //     const [title, message] = networkErrorTranslation(e); Alert.alert(title, message + "\nso we couldn't send the verification, don't worry you can verify later!")
  //   })
  //   if(response == null || response.data == null) {
  //     return false
  //   } 
  //  return true; 
  // }

  const theme = useTheme()
  return (
    <ScrollView style={{flex: 1, paddingVertical: 32}}>
    <View style={{paddingHorizontal: 16, flex: 1, justifyContent: 'center'}} >
      <View style={{alignItems: 'center', paddingBottom: '10%'}}>
        <Text variant='headlineSmall' style={{ fontWeight: 'bold', color:  theme.colors.primary }}>
        {t('signup.signup')}
        </Text>
      </View>
        <View style={{marginVertical: 8}}>
        <Controller
          name='full_name'
          control={control}
          render={ ({field: {onChange,onBlur,value}}) => {
            return (
                <TextInput  style={textEditStyle.normal} autoComplete='off' autoCorrect={false} autoCapitalize='none' onBlur={onBlur}  onChangeText={onChange} value={value} mode='flat' label={t('signup.fullname')} left= {<TextInput.Icon icon='account-outline'/>} />
            )
          }
          }
          rules={{required: true, minLength: 3}}
          />
            {errors?.full_name && <Text variant='labelSmall' style={{color: 'red'}}>name at least three character</Text>}
        <Controller
          name='email'
          control={control}
          render={ ({field: {onChange,onBlur,value}}) => {
            return (
                <TextInput  style={textEditStyle.normal} autoComplete='off' autoCorrect={false} autoCapitalize='none' onBlur={onBlur}  onChangeText={onChange} value={value} mode='flat' label={t('signup.email')} left= {<TextInput.Icon icon='email-outline'/>} />
            )
          }
          }
          rules={{pattern: /^[a-zA-Z]+[a-zA-Z0-9#!`._+-]*[a-zA-Z0-9]*@[a-z]+(\.[a-z])+/, required: true}}
          />
            {errors?.email && <Text variant='labelSmall' style={{color: 'red'}}>email invalid</Text>}
        <Controller
          name='phone_number'
          control={control}
          render={ ({field: {onChange,onBlur,value}}) => {
            return (
                <TextInput keyboardType='phone-pad'  style={textEditStyle.normal} autoComplete='off' autoCorrect={false} autoCapitalize='none' onBlur={onBlur}  onChangeText={onChange} value={value} mode='flat' label={t('signup.phonenumber')} left= {<TextInput.Icon icon='phone-outline'/>} />
            )
          }
          }
          rules={{pattern: /^(\+216 ?)?[25793][0-9]{7}$/, required: true}}
          />
            {errors?.phone_number && <Text variant='labelSmall' style={{color: 'red'}}>valid tunisian phone number</Text>}
        <Controller
          name='password'
          control={control}
          render={ ({field: {onChange,onBlur,value}}) => {
            return (
                <TextInput style={textEditStyle.normal} autoComplete='off' autoCorrect={false} autoCapitalize='none' onBlur={onBlur} secureTextEntry={!isVisible} left={<TextInput.Icon icon='lock-outline'/>}  right={<TextInput.Icon icon={(isVisible) ? 'eye-off': 'eye' } style={{marginTop: 16}} onPress={() => setVisibility((value) => !value)} />} onChangeText={onChange} value={value} mode='flat' label={t('signup.password')} />
            )
          }
          }
          rules={{required: true, minLength: 8 }} 
          />
            {errors?.password && <Text variant='labelSmall' style = {{color: 'red'}}> password at least 8 characters </Text>}
        </View>
          <Button style={buttonStyle.normal} mode='outlined' disabled={isSubmitting}  onPress={handleSubmit(signup)} loading ={isSubmitting}>
            Get Started 
          </Button>
          <Divider style = {{borderColor: 'gray', borderBlockColor: 'gray', borderWidth: 0.5, marginVertical: 16}}/>
          <View style= {{justifyContent: 'center', alignItems: 'center'}}>
             <Text>
              {t('signup.yhac')}
             </Text>
            <Button onPress={() => router.push('/')}>
            {t('signup.backsignin')}
            </Button>
          </View>
          <Divider style = {{borderColor: 'gray', borderBlockColor: 'gray', borderWidth: 0.5, marginVertical: 16}}/>
          <Text variant='labelMedium' >
            {<Text variant='labelMedium'  style={{fontWeight: 'bold'}}>*IMPORTENT:</Text>} {t('signup.important')}
          </Text>
    </View>
    </ScrollView>
  )
}

SignupScreen.propTypes = {

}

export default SignupScreen
