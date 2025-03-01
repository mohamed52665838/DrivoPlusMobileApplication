import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import Svg, { Rect, Text as SvgText } from "react-native-svg";
import axios from "axios";

export default function DetectionScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [imageWidth, setImageWidth] = useState(1); // ⚠️ Éviter la division par 0
  const [imageHeight, setImageHeight] = useState(1);
  const [displayWidth, setDisplayWidth] = useState(1);
  const [displayHeight, setDisplayHeight] = useState(1);
  const [detections, setDetections] = useState<
    { x: number; y: number; width: number; height: number; confidence: number; class: string }[]
  >([]);

  // 📌 Sélection d'image depuis la galerie
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

      // 🔥 Obtenir les dimensions réelles de l’image
      Image.getSize(imageUri, (width, height) => {
        setImageWidth(width);
        setImageHeight(height);
      });

      detectDamage(imageUri);
    }
  };

  // 🔍 Analyse de l'image avec l'API Roboflow
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
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log("Réponse API :", JSON.stringify(response.data, null, 2));

      if (response.data && response.data.predictions) {
        setDetections(response.data.predictions);
      }
    } catch (error) {
      console.error("Erreur lors de l'analyse :", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* 📌 Bouton pour sélectionner une image */}
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>CHOISIR UNE IMAGE</Text>
      </TouchableOpacity>

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  button: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: { color: "white", fontWeight: "bold" },
  imageContainer: { width: 300, height: 300, position: "relative" },
  image: { width: "100%", height: "100%", resizeMode: "contain" },
  svgOverlay: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%" },
});
