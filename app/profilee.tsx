import { useUser } from '@/components/ui/UserProvider.provider';
import { router, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import {
  ActivityIndicator,
  Avatar,
  Button,
  Divider,
  Text,
  TextInput,
} from 'react-native-paper';
import { Controller, useForm } from 'react-hook-form';
import { updateUser } from '@/serviers/User.service.rn';
import useCurrentUserState from '@/zustands.stores/userStore';
import { useTheme } from '@/app/ThemeProvider';
import { AppThemedView } from '@/components/ui/AppThemedView';
import { Ionicons } from '@expo/vector-icons';

interface UpdateFields {
  name: string;
  email: string;
  phone: string;
}

// imports remain the same...

function Profile() {
  const router = useRouter();
  const userState = useCurrentUserState();
  const {  isDarkMode } = useTheme();

  const [isEditable, setIsEditable] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateFields>({
    defaultValues: {
      name: userState.userModel?.full_name ?? '',
      phone: userState.userModel?.phone_number ?? '',
      email: userState.userModel?.email ?? '',
    },
  });

  const userName = userState.userModel?.full_name || 'User';
  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  const themedStyles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 24,
      backgroundColor: isDarkMode ? '#0E1117' : '#F8F9FA',
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFF' : '#000',
    },
    avatar: {
      alignSelf: 'center',
      marginBottom: 24,
      backgroundColor: isDarkMode ? '#1F2937' : '#E0E0E0',
    },
    field: {
      marginBottom: 20,
    },
    input: {
      backgroundColor: isDarkMode ? '#1C1C1E' : '#fff',
      borderRadius: 16,
    },
    errorText: {
      color: '#FF6B6B',
      fontSize: 12,
      marginTop: -14,
      marginBottom: 10,
    },
    button: {
      backgroundColor: isEditable ? '#22C55E' : '#3B82F6',
      paddingVertical: 14,
      borderRadius: 16,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 5,
      marginTop: 12,
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
    loading: {
      alignItems: 'center',
      marginVertical: 16,
    },
  });

  const submitForm = async (data: UpdateFields) => {
    setIsSubmitting(true);
    const updated = await updateUser({
      full_name: data.name,
      phone_number: data.phone,
    });
    if (updated) userState.updateUser(updated);
    setIsSubmitting(false);
    setIsEditable(false);
  };

  return (
    <AppThemedView style={themedStyles.container}>

      <View style={themedStyles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}    style={{
        position: "absolute",
        width: 45,
        height: 45,
        borderRadius: 20,
        backgroundColor: isDarkMode ? "#2A2A2A" : "#D5F5E3",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,
      }}>
            <Ionicons name="arrow-back" size={22} color={isDarkMode ? "#fff" : "#00796B"} />
 
        </TouchableOpacity>
        <Text style={themedStyles.title} >Edit</Text>
        <TouchableOpacity onPress={() => {
          if (isEditable) handleSubmit(submitForm)();
          else setIsEditable(true);
        }}
        style={{
          position: "absolute",
          right: 1,
          width: 45,
          height: 45,
          borderRadius: 20,
          backgroundColor: isDarkMode ? "#2A2A2A" : "#D5F5E3",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 10,
        }} >
          <Feather name={isEditable ? 'check' : 'edit'} size={24} color={isDarkMode ? '#FFF' : '#00796B'} />
        </TouchableOpacity>
      </View>

      <Avatar.Text
        size={100}
        label={initials}
        style={themedStyles.avatar}
        labelStyle={{ fontSize: 36 }}
      />

      {isSubmitting && (
        <View style={themedStyles.loading}>
          <ActivityIndicator size="large" color="#60A5FA" />
          <Text style={{ color: isDarkMode ? '#ccc' : '#444', marginTop: 8 }}>Updating...</Text>
        </View>
      )}

      {/* Name */}
      <View style={themedStyles.field}>
        <Controller
          control={control}
          name="name"
          rules={{
            required: 'Name is required',
            minLength: { value: 2, message: 'Too short' },
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              mode="outlined"
              label="Full Name"
              value={value}
              onChangeText={onChange}
              left={<TextInput.Icon icon="account" />}
              style={themedStyles.input}
              disabled={!isEditable}
              textColor={isDarkMode ? '#FFF' : '#000'}
            />
          )}
        />
        {errors.name && <Text style={themedStyles.errorText}>{errors.name.message}</Text>}
      </View>

      {/* Email (not editable) */}
      <View style={themedStyles.field}>
        <Controller
          control={control}
          name="email"
          render={({ field: { value } }) => (
            <TextInput
              mode="outlined"
              label="Email"
              value={value}
              left={<TextInput.Icon icon="email" />}
              disabled
              style={themedStyles.input}
              textColor={isDarkMode ? '#AAA' : '#666'}
            />
          )}
        />
      </View>

      {/* Phone */}
      <View style={themedStyles.field}>
        <Controller
          control={control}
          name="phone"
          rules={{
            required: 'Phone is required',
            pattern: {
              value: /^(\+216 ?)?[25793][0-9]{7}$/,
              message: 'Invalid Tunisian number',
            },
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              mode="outlined"
              label="Phone Number"
              value={value}
              keyboardType="phone-pad"
              onChangeText={onChange}
              left={<TextInput.Icon icon="phone" />}
              style={themedStyles.input}
              disabled={!isEditable}
              textColor={isDarkMode ? '#FFF' : '#000'}
            />
          )}
        />
        {errors.phone && <Text style={themedStyles.errorText}>{errors.phone.message}</Text>}
      </View>

      {isEditable && (
        <TouchableOpacity style={themedStyles.button} onPress={handleSubmit(submitForm)}>
          <Text style={themedStyles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
      )}
    </AppThemedView>

  );
}

export default Profile;