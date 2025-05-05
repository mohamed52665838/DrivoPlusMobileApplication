import React, { useState } from "react";
import { View, StyleSheet, Image, Alert, TouchableOpacity } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { Button, Text, TextInput, Checkbox } from "react-native-paper";
import { router } from "expo-router";
import { signin } from "@/serviers/Authentication.service.rn";
import { AxiosError } from "axios";
import networkErrorTranslation from "@/utils/network.translation";
import { storeApiKey, TokenStructure } from "@/utils/secure.session";
import useCurrentUserState from "@/zustands.stores/userStore";
import "@/i18n";
import { useTranslation } from "react-i18next";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign } from "@expo/vector-icons";
import { superTrackingServiceStatus } from "react-native-background-service-tracking";
import DetectionCall from './detectioncall';
type LoginFormData = {
  email: string;
  password: string;
};

const LoginScreen = () => {
  const [isVisible, setVisibility] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>();
  const { signIn } = useCurrentUserState();
  const { t } = useTranslation();

  const onLogin = async (data: LoginFormData) => {
    const response = await signin(data).catch((e: AxiosError) => {
      const [title, message] =
        e.response?.status === 400
          ? ["Wrong credentials", "Username or password incorrect"]
          : networkErrorTranslation(e);
      Alert.alert(title, message);
    });

    if (response?.data?.user) {
      await Promise.all([
        storeApiKey(response.data.tokens.access_token, TokenStructure.TOKEN),
        storeApiKey(
          response.data.tokens.refresh_token,
          TokenStructure.REFRESH_TOKEN,
        ),
      ]);
      signIn(response.data.user);
      router.replace("/(dashboard)/home");
    }
  };

  return (
    <LinearGradient colors={["#ffffff", "#e8f5e9"]} style={styles.container}>
      <Animatable.Image
        animation="fadeInDown"
        duration={1200}
        source={require("@/assets/images/Logo.png")}
        style={styles.carImage}
        resizeMode="contain"
      />

      <View style={styles.formContainer}>
        <Text style={styles.title}>Drivo +</Text>
        <Text style={styles.subtitle}>Welcome back, car lover 🚗</Text>

        <Controller
          name="email"
          control={control}
          rules={{ pattern: /[a-zA-Z0-9]+@[a-z]+(\.[a-z])+/i, required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="E-mail Address"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="email" />}
              autoCapitalize="none"
            />
          )}
        />
        {errors.email && (
          <Text style={styles.error}>Please enter a valid email</Text>
        )}

        <Controller
          name="password"
          control={control}
          rules={{ required: true, minLength: 8 }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Password"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry={!isVisible}
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="lock" />}
              right={
                <TextInput.Icon
                  icon={isVisible ? "eye-off" : "eye"}
                  onPress={() => setVisibility(!isVisible)}
                />
              }
              autoCapitalize="none"
            />
          )}
        />
        {errors.password && (
          <Text style={styles.error}>
            Password must be at least 8 characters
          </Text>
        )}

        <View style={styles.rememberContainer}>
          <Checkbox
            status={rememberMe ? "checked" : "unchecked"}
            onPress={() => setRememberMe(!rememberMe)}
            color="#4CAF50"
          />
          <Text style={{ marginLeft: 4 }}>Remember Me</Text>
        </View>

        <Button
          mode="contained"
          onPress={handleSubmit((data: LoginFormData) => onLogin(data))} // Pass the data correctly here
          loading={isSubmitting}
          disabled={isSubmitting}
          style={styles.loginButton}
          contentStyle={{ paddingVertical: 8 }}
        >
          LOG IN
        </Button>

        <View style={styles.socialContainer}>
          <TouchableOpacity style={styles.socialButton}>
            <AntDesign name="google" size={20} color="#db4437" />
            <Text style={styles.socialText}>Sign in with Google</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footerText}>
          <Text style={{ color: "#888" }}>Don't have an account?</Text>
          <Button
            onPress={() => router.push("/signupscreen")}
            textColor="#4CAF50"
          >
            Membership
          </Button>
        </View>
      </View>
             {/* Appel à la détection des appels entrants */}
    {/* Ce composant s'assure que la détection d'appels est activée lorsque la page de connexion est ouverte. */}
    <DetectionCall/>
    </LinearGradient>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  carImage: {
    width: "100%",
    height: 240,
    marginTop: 20,
    alignSelf: "center",
  },
  formContainer: {
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#229954",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
    backgroundColor: "#F7F7F7",
    borderRadius: 10,
  },
  loginButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    marginTop: 8,
  },
  error: {
    fontSize: 12,
    color: "red",
    marginBottom: 8,
  },
  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  socialContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
  },
  socialText: {
    marginLeft: 10,
    color: "#333",
  },
  footerText: {
    alignItems: "center",
    marginTop: 20,
  },
});
