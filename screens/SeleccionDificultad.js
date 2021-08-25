import React, { useState, useEffect } from "react";
import { Image, StyleSheet, Text, View, Button,TouchableOpacity } from "react-native";
import Storage from "../componentes/utils/SecureStorage";
import { RFValue } from "react-native-responsive-fontsize";
import Constants from "expo-constants";

const SeleccionDificultad = ({ navigation }) => {
  const [estaLogueado, setEstaLogueado] = useState({});
  const [dificultad, setDificultad] = React.useState('facil');

  const usuarioLogueado = async (key) => {
    const result = await Storage.getValueFor(key)
    if (result) {
      setEstaLogueado(result)
    } else {
      console.log("No hay valores guardados para la key. ", result)
      setEstaLogueado(result)
    }
  }

  useEffect(() => {
    usuarioLogueado("KEY")
  }, []);


  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/Select.png")}
        style={styles.logoImage}
      />

      <View style={styles.difficultyContainer}>
        <TouchableOpacity
          value="dificil"
          status={dificultad === "dificil"}
          onPress={() =>
            navigation.navigate("Juego", { dificultad: "dificil" })
          }
          style={styles.difficultyButton}
        >
          <Image
            source={require("../assets/hard.png")}
            style={styles.difficultyImage}
          />
        </TouchableOpacity>

        <TouchableOpacity
          value="facil"
          status={dificultad === "facil"}
          onPress={() => navigation.navigate("Juego", { dificultad: "facil" })}
          style={styles.difficultyButton}
        >
          <Image
            source={require("../assets/easy.png")}
            style={styles.difficultyImage}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SeleccionDificultad;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: Constants.statusBarHeight,
  },
  logoImage: {
    width: "80%",
    height: 300,
    paddingTop: 50,
    marginLeft: -5,
  },
  difficultyContainer: {
    flex: 1,
    alignItems: "center",
    flexWrap: "wrap",
    flexDirection: "row",
    paddingTop:'30%',
  },
  difficultyButton: {
    width: 170,
    height: 100,
    aspectRatio: 1 * 1.4,
  },
  difficultyImage: {
    resizeMode: 'cover',
    width: '100%',
    height: '140%',
  },
});
