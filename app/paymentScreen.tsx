import React, { useState, useEffect } from 'react';
import { View, Text, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import axios from '../constants/Network.config';
import useCurrentUserState from '@/zustands.stores/userStore';
import Button from '@/components/ui/Button';
import Card from '../components/ui/Card';
import CardContent from '../components/ui/CardContent';
import CardHeader from '../components/ui/CardHeader';
import CardTitle from '../components/ui/CardTitle';
import { useTheme } from "@/app/ThemeProvider";

const PaymentScreen = () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { userModel, updateUser } = useCurrentUserState();
  const { theme } = useTheme(); // 🎨 Utilisation du thème dynamique

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isPremium, setIsPremium] = useState(userModel?.is_active_premium || false);

  useEffect(() => {
    // please make sure refactor all this code to service !!
    const initializePaymentSheet = async () => {
      try {
        console.log("🔄 Initialisation du paiement...");

        if (!userModel?.email) {
          Alert.alert("Erreur", "Aucun utilisateur connecté !");
          return;
        }

        const response = await axios.post('/payment/create-payment-intent', {
          amount: 999,
          currency: 'usd',
          email: userModel.email,
        });

        if (!response.data.clientSecret) {
          // throw new Error("❌ Client secret introuvable !");
          // as long as your you don't give me the key this error disabled!
        }

        setClientSecret(response.data.clientSecret);

        const { error } = await initPaymentSheet({
          paymentIntentClientSecret: response.data.clientSecret,
          merchantDisplayName: "Mon Application",
          allowsDelayedPaymentMethods: true,
        });

        if (error) {
          Alert.alert("Erreur Stripe", error.message);
        } else {
          console.log("✅ PaymentSheet prêt !");
        }
      } catch (error) {
        // console.error("❌ Erreur d'initialisation Stripe:", error);
        Alert.alert("Erreur", "Impossible d'initialiser le paiement.");
      }
    };

    initializePaymentSheet();
  }, []);

  const handlePayment = async () => {
    if (!clientSecret) {
      Alert.alert("Erreur", "Le paiement n'a pas été initialisé.");
      return;
    }

    setLoading(true);
    try {
      console.log("💳 Ouverture du PaymentSheet...");
      const { error } = await presentPaymentSheet();

      if (error) {
        Alert.alert("Paiement échoué", error.message);
      } else {
        Alert.alert("Succès", "Paiement réussi ✅");
        updateUser({ is_active_premium: true });
        setIsPremium(true);
        console.log("✅ Utilisateur mis à jour en premium !");
      }
    } catch (error) {
      console.error("❌ Erreur lors du paiement:", error);
      Alert.alert("Erreur", "Une erreur est survenue.");
    }
    setLoading(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Card style={[styles.card, { backgroundColor: theme.card }]}>
        <CardHeader>
          <CardTitle>
            <Text style={[styles.cardTitle, { color: theme.text }]}>
              Abonnement Premium
            </Text>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Text style={[styles.description, { color: theme.text }]}>
            Profitez de toutes les fonctionnalités premium pour seulement <Text style={[styles.price, { color: theme.text }]}>9.99€</Text> par mois.
          </Text>
          {isPremium ? (
            <Text style={[styles.premiumText, { color: theme.button }]}>✅ Votre abonnement est actif</Text>
          ) : loading ? (
            <ActivityIndicator size="large" color={theme.button} />
          ) : (
            <Button style={[styles.button, { backgroundColor: theme.button }]} onPress={handlePayment}>
              Payer maintenant
            </Button>
          )}
        </CardContent>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    borderRadius: 16,
    padding: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 16,
  },
  price: {
    fontWeight: 'bold',
  },
  button: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  premiumText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
});

export default PaymentScreen;
