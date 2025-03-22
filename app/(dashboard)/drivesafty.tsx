import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
  Modal
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Svg, { Rect, Text as SvgText } from "react-native-svg";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

// ✅ Définition du type Car
interface Car {
  id: string;
  name: string;
  make: string;
  model: string;
  year: string;
  vin?: string;
  damage?: any[];
  cost?: string;
}

export default function DetectionScreen() {
  const router = useRouter();

  const [image, setImage] = useState<string | null>(null);
  const [imageWidth, setImageWidth] = useState(1);
  const [imageHeight, setImageHeight] = useState(1);
  const [displayWidth, setDisplayWidth] = useState(1);
  const [displayHeight, setDisplayHeight] = useState(1);
  const [detections, setDetections] = useState<any[]>([]);
  const [damageCost, setDamageCost] = useState<string | null>(null);
  const [cars, setCars] = useState<Car[]>([]);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [carSelectionModal, setCarSelectionModal] = useState(false);

  useEffect(() => {
    loadCars();
  }, []);

  // 📌 Charger les voitures enregistrées
  const loadCars = async () => {
    try {
      const storedCars = await AsyncStorage.getItem("cars");
      if (storedCars) {
        const carList = JSON.parse(storedCars);
        console.log("📌 Voitures chargées :", carList); // 🔍 Vérification
        setCars(carList);
      }
    } catch (error) {
      console.error("❌ Erreur de chargement des voitures :", error);
    }
  };

  // 📌 Sélection d'une image
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setImage(imageUri);

      Image.getSize(imageUri, (width, height) => {
        setImageWidth(width);
        setImageHeight(height);
      });

      detectDamage(imageUri);
    }
  };

  // 🔍 Détection des dommages
  const detectDamage = async (imageUri: string) => {
    const formData = new FormData();
    formData.append("file", {
      uri: imageUri,
      name: "image.jpg",
      type: "image/jpeg",
    } as any);

    try {
      const response = await axios.post(
        "https://detect.roboflow.com/car-damage-detection-t0g92/1?api_key=a8pzOTr1SXczG35376SL",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Accept": "application/json",
          },
          transformRequest: (data) => data,
        }
      );

      if (response.data && response.data.predictions) {
        setDetections(response.data.predictions);
        estimateDamageCost(response.data.predictions);
      }
    } catch (error) {
      console.error("Erreur API Roboflow :", error);
    }
  };

  // 💰 Estimation du coût avec Gemini AI
  const estimateDamageCost = async (detections: any[]) => {
    const apiKey = "AIzaSyA02NQvH7ETl_ZEppHc4XDEk3pXxCHUkAs"; // Remplace avec ta clé

    const damageDescription = detections
        .map((d) => `${d.class} endommagé à ${Math.round(d.confidence * 100)}%`)
        .join(", ");

    const prompt = `J'ai détecté les dommages suivants sur une voiture : ${damageDescription}.
    Peux-tu me donner une estimation approximative des réparations en dinars tunisiens (TND) ?
    Réponds brièvement avec :
    - 📌 Nom de la pièce endommagée + pourcentage
    - 💰 Coût estimé en TND
    - 🔧 Brève explication`;

    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
            { contents: [{ role: "user", parts: [{ text: prompt }] }] } ,
            { headers: { "Content-Type": "application/json" } }
        );

        const estimation = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "Aucune estimation trouvée.";
        setDamageCost(estimation);

        Alert.alert(
            "💰 Estimation de réparation :", estimation,
            [{ text: "OK", onPress: () => saveDamageToCar() }] // Ajout de l'enregistrement ici 🚀
        );
    } catch (error) {
        console.error("Erreur API Gemini :", error);
    }
};

const saveDamageToCar = async () => {
  if (!selectedCar) {
      return Alert.alert("Sélectionnez une voiture avant d'enregistrer !");
  }

  try {
      const storedCars = await AsyncStorage.getItem("cars");
      let cars = storedCars ? JSON.parse(storedCars) : [];

      let updatedCars = cars.map((car: Car) =>
          car.id === selectedCar.id ? { ...car, damage: detections, cost: damageCost } : car
      );

      await AsyncStorage.setItem("cars", JSON.stringify(updatedCars));
      setCars(updatedCars); // 🔄 Rafraîchir immédiatement la liste affichée

      console.log("✅ Dommages et coût enregistrés :", updatedCars); // Vérification console 🚀
      Alert.alert("✅ Dommages et coût enregistrés !");
  } catch (error) {
      console.error("❌ Erreur de sauvegarde :", error);
  }
};

  const styles = StyleSheet.create({
    /* 📌 Conteneur principal */
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#f5f7fa", // 🎨 Fond plus moderne
      padding: 15,
    },
 
    /* 📌 Style des boutons */
    button: {
      backgroundColor: "#4DA8DA",
      paddingVertical: 10,
      paddingHorizontal: 10,
      borderRadius: 40,
      marginVertical: 10,
      shadowColor: "#000",
      shadowOpacity: 0.6,
      shadowOffset: { width: 1, height: 3 },
      elevation: 5, // 🎨 Effet de profondeur
      alignItems: "center",
    },
 
    /* 📌 Texte des boutons */
    buttonText: {
      color: "white",
      fontWeight: "bold",
      fontSize: 13,
      textTransform: "uppercase",
      textAlign: "center",
      letterSpacing: 2,
    },
 
    /* 📌 Conteneur de l'image */
    imageContainer: {
      width: 320,
      height: 320,
      position: "relative",
      backgroundColor: "#fff",
      borderRadius: 10,
      padding: 5,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowOffset: { width: 1, height: 3 },
      elevation: 4,
      marginTop: 15,
    },
 
    /* 📌 Image avec bord arrondi */
    image: {
      width: "100%",
      height: "100%",
      resizeMode: "contain",
      borderRadius: 8,
    },
 
    /* 📌 Overlay SVG pour annotations */
    svgOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
    },
 
    /* 📌 Conteneur des détails */
    detailsContainer: {
      marginTop: 20,
      padding: 15,
      backgroundColor: "#ffffff",
      borderRadius: 12,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowOffset: { width: 1, height: 2 },
      alignItems: "center",
      width: "90%",
      elevation: 4, // 🎨 Effet de profondeur
      borderLeftWidth: 5,
      borderLeftColor: "#28a745", // 🎨 Ajout de couleur pour donner du style
    },
 
    /* 📌 Nom de la voiture */
    carName: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#1586AC",
      textAlign: "center",
    },
 
    /* 📌 Bouton d'icône en haut à droite */
    iconButton: {
      position: "absolute",
      top: 10,
      right: 10,
      padding: 12,
      borderRadius: 50,
 
    },
 
    /* 📌 Élément de liste de voiture */
    carItem: {
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: "#ddd",
      backgroundColor: "#fff",
      alignItems: "center",
      borderRadius: 8,
      marginBottom: 8,
      width: "90%",
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowOffset: { width: 1, height: 2 },
      elevation: 3,
    },
    saveButton: {
      backgroundColor: "#28A745", // 🎨 Vert pour valider l'enregistrement
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 10,
      marginTop: 15,
      alignItems: "center",
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowOffset: { width: 1, height: 3 },
      elevation: 5, // 🎨 Effet de profondeur
    },
   
    saveButtonText: {
      color: "white",
      fontWeight: "bold",
      fontSize: 16,
      textTransform: "uppercase",
      letterSpacing: 1,
    },
  });
 
  return (
    <View style={styles.container}>
      {/* 📌 Icône pour voir l'historique */}
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => router.push("/(dashboard)/detection")}
      >
        <Ionicons name="car-outline" size={30} color="black" />
      </TouchableOpacity>

      {/* 📌 Sélectionner une voiture existante */}
      <TouchableOpacity style={styles.button} onPress={() => setCarSelectionModal(true)}>
        <Text style={styles.buttonText}>Associer à une voiture</Text>
      </TouchableOpacity>
      {/* 📌 Affichage des détails de la voiture sélectionnée */}
      {selectedCar && (
        <View style={styles.detailsContainer}>
          <Text style={styles.carName}>{selectedCar.name}</Text>
          <Text>{selectedCar.make} {selectedCar.model} ({selectedCar.year})</Text>
        </View>
      )}

      {/* 📌 Bouton Ajouter Image */}
      {selectedCar && (
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>Ajouter une Image</Text>
        </TouchableOpacity>
      )}

{image && (
  <View
          style={styles.imageContainer}
          onLayout={(event) => {
            setDisplayWidth(event.nativeEvent.layout.width);
            setDisplayHeight(event.nativeEvent.layout.height);
          }}
        >
          <Image source={{ uri: image }} style={styles.image} />

          {/* 🔥 Dessin des boîtes de détection sur l'image */}
          <Svg width={displayWidth} height={displayHeight} style={styles.svgOverlay}>
            {detections.map((detection, index) => {
              const scaleX = displayWidth / imageWidth;
              const scaleY = displayHeight / imageHeight;

              const x = (detection.x - detection.width / 2) * scaleX;
              const y = (detection.y - detection.height / 2) * scaleY;
              const boxWidth = detection.width * scaleX;
              const boxHeight = detection.height * scaleY;

              return (
                <React.Fragment key={index}>
                  {/* 🔴 Dessin de la boîte de détection */}
                  <Rect
                    x={x}
                    y={y}
                    width={boxWidth}
                    height={boxHeight}
                    stroke="red"
                    strokeWidth="3"
                    fill="none"
                  />
                  {/* 🏷 Ajout du texte avec le label */}
                  <SvgText
                    x={x + 5}
                    y={y > 20 ? y - 10 : y + 20}
                    fill="red"
                    fontSize="16"
                    fontWeight="bold"
                    stroke="white"
                    strokeWidth="1"
                  >
                    {detection.class} {Math.round(detection.confidence * 100) || "??"}%
                  </SvgText>
                </React.Fragment>
              );
            })}
          </Svg>
        </View>
      )}
 

      {/* 📌 Modal pour la sélection d'une voiture */}
      <Modal visible={carSelectionModal} animationType="slide">
        <FlatList data={cars} keyExtractor={(item) => item.id} renderItem={({ item }) => (
          <TouchableOpacity style={styles.carItem} onPress={() => {
            setSelectedCar(item);
            setCarSelectionModal(false);
          }}>
            <Text>{item.name} - {item.make} {item.model}</Text>
          </TouchableOpacity>
        )} />
      </Modal>
    </View>
  );
}