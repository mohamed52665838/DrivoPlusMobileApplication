import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { Button, Text, TextInput, Divider } from 'react-native-paper';
import { router } from 'expo-router';
import { signupRequest } from '@/serviers/Registration.servcie.rn';
import { AxiosError } from 'axios';
import networkErrorTranslation from '@/utils/network.translation';
import { storeApiKey, TokenStructure } from '@/utils/secure.session';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';

const SignupScreen = () => {
  const [isVisible, setVisibility] = useState(false);
  const { handleSubmit, control, formState: { errors, isSubmitting } } = useForm<SignupFields>();
  const { t } = useTranslation();

  const signup = async (data: SignupFields) => {
    data.username = data.email;
    const response = await signupRequest(data).catch((e: AxiosError) => {
      const [title, message] = networkErrorTranslation(e);
      Alert.alert(title, message);
    });

    if (response?.data) {
      storeApiKey(response.data.access_token, TokenStructure.TOKEN);
      storeApiKey(response.data.refresh_token, TokenStructure.REFRESH_TOKEN);
      router.replace(`/confirmotp?email=${data.email}`);
    }
  };

  return (
    <LinearGradient colors={['#ffffff', '#e8f5e9']} style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Drivo +</Text>
               <Text style={styles.subtitle}>Welcome back, car lover 🚗</Text>

        <Controller
          name="full_name"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label={t('signup.fullname')}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="account" />}
            />
          )}
          rules={{ required: true, minLength: 3 }}
        />
        {errors.full_name && <Text style={styles.error}>Name must be at least 3 characters</Text>}

        <Controller
          name="email"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label={t('signup.email')}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="email" />}
            />
          )}
          rules={{ pattern: /^[a-zA-Z]+[a-zA-Z0-9#!`._+-]*[a-zA-Z0-9]*@[a-z]+(\.[a-z])+/, required: true }}
        />
        {errors.email && <Text style={styles.error}>Please enter a valid email</Text>}

        <Controller
          name="phone_number"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label={t('signup.phonenumber')}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="phone-pad"
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="phone" />}
            />
          )}
          rules={{ pattern: /^(\+216 ?)?[25793][0-9]{7}$/, required: true }}
        />
        {errors.phone_number && <Text style={styles.error}>Please enter a valid phone number</Text>}

        <Controller
          name="password"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label={t('signup.password')}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry={!isVisible}
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="lock" />}
              right={
                <TextInput.Icon
                  icon={isVisible ? 'eye-off' : 'eye'}
                  onPress={() => setVisibility(!isVisible)}
                />
              }
            />
          )}
          rules={{ required: true, minLength: 8 }}
        />
        {errors.password && <Text style={styles.error}>Password must be at least 8 characters</Text>}

        <Button
          mode="contained"
          onPress={handleSubmit(signup)}
          loading={isSubmitting}
          disabled={isSubmitting}
          style={styles.signupButton}
        >
          Sign Up
        </Button>

        <Divider style={styles.divider} />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <Button onPress={() => router.push('/')} textColor="#4CAF50">
            Sign In
          </Button>
        </View>
      </View>
    </LinearGradient>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  formContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#229954',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#F7F7F7',
    borderRadius: 10,
  },
  signupButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    marginTop: 8,
  },
  error: {
    fontSize: 12,
    color: 'red',
    marginBottom: 8,
  },
  divider: {
    borderColor: 'gray',
    borderBlockColor: 'gray',
    borderWidth: 0.5,
    marginVertical: 16,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#888',
  },
});
