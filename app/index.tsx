import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet, Image, Alert } from 'react-native'

import { ActivityIndicator, Divider, IconButton, MD2Colors, useTheme } from 'react-native-paper';
import { Button, Icon, Text, TextInput } from 'react-native-paper';
import { useForm, Controller, Form } from "react-hook-form";
import { textEditStyle } from '@/components/ui/TextEditStyle';
import { buttonStyle } from '@/components/ui/ButtonEditStyle';
import { router } from 'expo-router';
import { signin } from '@/serviers/Authentication.service.rn';
import { AxiosError } from 'axios';
import networkErrorTranslation from '@/utils/network.translation';
import { getApiKey, storeApiKey, TokenStructure } from '@/utils/secure.session';
import { useUser } from '@/components/ui/UserProvider.provider';
import UserModel from '@/models/user/User.model';
import useCurrentUserState from '@/zustands.stores/userStore';
import '@/i18n';
import { useTranslation } from 'react-i18next';





const IndexRoot = () => {

  const [isVisible, setVisibility] = useState(false)
  const {handleSubmit, control,formState: {errors, isSubmitting}} = useForm<LoginFormField>()
  // const  user = useUser()
  const { userModel, signIn, signOut } = useCurrentUserState()
  const onLogin = async (data: LoginFormField)  => {
    const respones = await signin(data).catch((e : AxiosError) => {
      console.log(`this is runing ${e.cause}`)
      console.log(`this is runing ${e.message}`)
      console.log(`this is runing ${e.stack}`)
const [title, message] = (e.response?.status === 400) ?  ['Wrong cridentials', 'Username or passwod uncorrect'] : networkErrorTranslation(e)
      Alert.alert(title, message)
    }).catch((e) => {
      Alert.alert('Sorry error has occure', 'unexpected error just happned.')
    })
    if(respones != null) {
        if(respones.data.user){
          await Promise.all([storeApiKey(respones.data.tokens.access_token, TokenStructure.TOKEN),await storeApiKey(respones.data.tokens.refresh_token, TokenStructure.REFRESH_TOKEN)]) 
          console.log(respones.data.user)
          signIn(respones.data.user)
          // user?.updateUser(respones.data.user)
          
          router.replace('/(dashboard)/home')
        }else {
          throw new Error('unexpected error happned: user returned null') 
        }
    } {
          throw new Error('unexpected error happned: response returned null') 
    }
  }

  const theme = useTheme()
  const {t} = useTranslation()
  return (
    <View style={{paddingHorizontal: 16, flex: 0.9, justifyContent: 'center'}} >
      <View style={{alignItems: 'center', paddingBottom: '10%'}}>
        <Image source={require('@/assets/images/main-logo.png')}  style={{width: 72, height: 72}}/>
        <Text variant='headlineSmall' style={{ fontWeight: 'bold', color:  theme.colors.primary }}>
          {t('signin.signin')}
        </Text>
      </View>
        <View style={{marginVertical: 8}}>
        <Controller
          name='email'
          control={control}
          render={ ({field: {onChange,onBlur,value}}) => {
            return (
                <TextInput  style={textEditStyle.normal} autoComplete='off' autoCorrect={false} autoCapitalize='none' onBlur={onBlur}  onChangeText={onChange} value={value} mode='flat' label={t('signin.username')} left= {<TextInput.Icon icon='account-outline'/>} />
            )
          }
          }
          rules={{pattern: /[a-zA-Z0-9]+@[a-z]+(\.[a-z])+/, required: true}}
          />
            {errors?.email && <Text variant='labelSmall' style={{color: 'red'}}>invalid username</Text>}
        <Controller
          name='password'
          control={control}
          render={ ({field: {onChange,onBlur,value}}) => {
            return (
                <TextInput style={textEditStyle.normal} autoComplete='off' autoCorrect={false} autoCapitalize='none' onBlur={onBlur} secureTextEntry={!isVisible} left={<TextInput.Icon icon='lock-outline'/>}  right={<TextInput.Icon icon={(isVisible) ? 'eye-off': 'eye' } style={{marginTop: 16}} onPress={() => setVisibility((value) => !value)} />} onChangeText={onChange} value={value} mode='flat' label={t('signin.password')} />
            )
          }
          }
          rules={{required: true, minLength: 8 }} 
          />
            {errors?.password && <Text variant='labelSmall' style = {{color: 'red'}}> password at least 8 characters </Text>}
        </View>
          <Button style={buttonStyle.normal} mode='outlined'  onPress={handleSubmit(onLogin)} disabled={isSubmitting} loading ={isSubmitting}>
          {t('signin.getstarted')}
          </Button>
          <Divider style = {{borderColor: 'gray', borderBlockColor: 'gray', borderWidth: 0.5, marginVertical: 16}}/>
          <View style= {{justifyContent: 'center', alignItems: 'center'}}>
             <Text>
             {t('signin.hncy')}
             </Text>
            <Button onPress={() => router.push('/signupscreen')}>
              {t('signin.createa')}
            </Button>
          </View>
        
    </View>
  )
}

IndexRoot.propTypes = {

}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  button: {
    margin: 2,
  },
});
export default IndexRoot
function useCurrentUser() {
  throw new Error('Function not implemented.');
}

