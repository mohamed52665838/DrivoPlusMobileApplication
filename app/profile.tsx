import { useUser } from '@/components/ui/UserProvider.provider'
import { router } from 'expo-router';
import React, { useState } from 'react'
import { Alert, View } from 'react-native'
import Feather from '@expo/vector-icons/Feather';
import { ActivityIndicator, Appbar, Button, Dialog, Divider, PaperProvider, Portal, Text, TextInput } from 'react-native-paper'
import { Controller, useForm } from 'react-hook-form';
import { textEditStyle } from '@/components/ui/TextEditStyle';
import { updateUser } from '@/serviers/User.service.rn';
import useCurrentUserState from '@/zustands.stores/userStore';

interface UpdateFields {
    name: string
    email: string
    phone: string
}


function Profile() {
    const userApp = useUser();
    const userState = useCurrentUserState()
    const [isEditable, setIsEditable] = useState(false)
    const {handleSubmit, control,formState: {errors, isSubmitting}} = useForm<UpdateFields>({defaultValues: {name: userState.userModel?.full_name ?? '', phone: userState.userModel?.phone_number ?? '', email: userState.userModel?.email ?? '' }})
    const [isDeleteDialogShown, setIsDeleteDialogShown] = useState(false)
    const userNamePlain = userState.userModel?.full_name 

    const userName = `${userNamePlain?.slice(0, 1).toUpperCase()}${userNamePlain?.slice(1, userNamePlain?.length ?? 0).toLowerCase()}`

    const submitFunction = async (data: UpdateFields) => {
        const {name, phone} = data
        console.log('submit function executed!!')
        const response = await updateUser({full_name: name, phone_number: phone})
        if(response != undefined) {
            console.log(`user has come ${response}`)
            userState.updateUser(response)
        }else {
            console.log(response);
        }
        setIsEditable(false)
    }
    return (
        <View>
 <Appbar.Header>
            <Appbar.BackAction onPress={() => {router.back()}} />
            <Appbar.Content title={`${ userName }'s Profile`}  />
            <Appbar.Action icon={() => <Feather disabled={isSubmitting} name={  isEditable ? "check" : "edit-2"} size={24} color="black" onPress={ async() => {
               if(isEditable) {
                console.log('here !!')
                     handleSubmit(submitFunction, () => console.log('data invalid'))()
                }else {
                    setIsEditable(true)
                }
            } } />} onPress={() => {}} />
            <Appbar.Action icon="menu" onPress={() => {}} />
         </Appbar.Header>
    <View style={{paddingHorizontal: 16}}>
       {isSubmitting &&  
       <View style={{padding: 16}}>
        <Text style= {{marginBottom: 12, textAlign: 'center'}}>
            updating
        </Text>
       <ActivityIndicator/> 
       </View>
       
       }

        <Text variant='labelLarge' style={{marginVertical: 4}}>
            User Info            
        </Text>
     <Controller
          name='name'
          control={control}
          render={ ({field: {onChange,onBlur,value}}) => {
            return (
                <TextInput disabled={!isEditable}   style={textEditStyle.normal} autoComplete='off' autoCorrect={false} autoCapitalize='none' onBlur={onBlur}  onChangeText={onChange} value={value} mode='flat' label='full name' left= {<TextInput.Icon icon='account-outline'/>} />
            )
          }
          }
          rules={{required: true, minLength: 3}}
          />
            {errors?.name && <Text variant='labelSmall' style={{color: 'red'}}>name at least three character</Text>}
      
        <Controller
          name='email'
          control={control}
          render={ ({field: {onChange,onBlur,value}}) => {
            return (
                <TextInput disabled  style={textEditStyle.normal} autoComplete='off' autoCorrect={false} autoCapitalize='none' onBlur={onBlur}  onChangeText={onChange} value={value} mode='flat' label='email' left= {<TextInput.Icon icon='email-outline'/>} />
            )
          }
          }
          />
            {errors?.email && <Text variant='labelSmall' style={{color: 'red'}}>email invalid</Text>}
        <Controller
          name='phone'
          control={control}
          render={ ({field: {onChange,onBlur,value}}) => {
            return (
                <TextInput disabled={!isEditable} keyboardType='phone-pad'  style={textEditStyle.normal} autoComplete='off' autoCorrect={false} autoCapitalize='none' onBlur={onBlur}  onChangeText={onChange} value={value} mode='flat' label='phone number' left= {<TextInput.Icon icon='phone-outline'/>} />
            )
          }
          }
          rules={{pattern: /^(\+216 ?)?[25793][0-9]{7}$/, required: true}}
          />
            {errors?.phone && <Text variant='labelSmall' style={{color: 'red'}}>valid tunisian phone number</Text>}
  
            <View>
            <Divider style={{borderBlockColor: 'black', borderWidth: 0.5, marginVertical: 8}} />
            <Text style={{'color': 'red', fontWeight: 'bold'}}>
                Danger Zone
                </Text>
            </View>
     </View>
    </View>)
}

export default Profile