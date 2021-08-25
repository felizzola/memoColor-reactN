import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import Constants from "expo-constants";
import Storage from "../componentes/utils/SecureStorage";
import SqLite from "../componentes/utils/SqLite";
import Context from "../componentes/utils/GlobalContext";
import { Audio } from "expo-av";
import { useTheme } from "@react-navigation/native";

export default function Puntajes({ navigation, route }) {
  const { colors } = useTheme();
  const [estaLogueado, setEstaLogueado] = useState({});
  const context = useContext(Context);
  const [puntos, setPuntos] = useState([]);
  const [soundPlayScore, setSoundPlayScore] = React.useState();

  const logout = async () => {
    await Storage.borrar("KEY");
    soundPlayScore.unloadAsync();
    SqLite.dropTable();
    context.setEstaLogueado(false);
  };

  const volverAJugar = async () => {
    soundPlayScore.unloadAsync();
    navigation.navigate("SeleccionDificultad", {});
  };

  const datosUsuarioLogueado = async (key) => {
    const result = await Storage.getValueFor(key);
    if (result) {
      setEstaLogueado(result);
    } else {
      console.log("No hay valores guardados para la key. ", result);
      setEstaLogueado(result);
    }
  };

  async function playSoundScore() {
    const { sound: soundPlayScore } = await Audio.Sound.createAsync(
      require(`../componentes/songs/puntaje.mp3`)
    );
    setSoundPlayScore(soundPlayScore);
    await soundPlayScore.playAsync();
  }

  useEffect(() => {
    datosUsuarioLogueado("KEY");
    const puntaje = route.params.puntaje;
    const dificultad = route.params.dificultad;
    SqLite.CrearTabla();
    SqLite.insertar(puntaje, dificultad);
    SqLite.select(setPuntos);
    playSoundScore();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.bannerContainer}>
        <Image
          style={styles.photoImage}
          source={{ uri: `${estaLogueado.photoUrl} ` }}
        />
        <Image
          source={require("../assets/SCORE.png")}
          style={styles.scoreImage}
        />
      </View>

      <Text style={[styles.textoScore, { color: colors.text }]}>
        Puntos Obtenidos en esta Partida
      </Text>
      <Text style={[styles.textoScorePunto, { color: colors.text }]}>
        {route.params.puntaje}{" "}
      </Text>
      <Text style={[styles.textoScoreHistorial, { color: colors.text }]}>
        Historial de puntos Por Partida{" "}
      </Text>

      <ScrollView key={route.params.puntaje}>
        {puntos.map((elem, index) => {
          return (
            <Text
              key={index}
              style={[styles.textoScoreHistorial, { color: colors.text }]}
            >
              Partida Nro {elem.id}- Dificultad {elem.dificultad} - Puntos
              Obtenidos {elem.puntos}{" "}
            </Text>
          );
        })}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={volverAJugar} style={styles.button}>
          <Image
            source={require("../assets/REPLAY.png")}
            style={styles.butonImage}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={logout} style={styles.button}>
          <Image
            source={require("../assets/QUIT.png")}
            style={styles.butonImage}
          />
        </TouchableOpacity>

        {/* <Button title={"A Jugar"} onPress={volverAJugar} />
          <Button title={"Logout"} onPress={logout} /> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  photoImage: {
    width: "30%",
    height: "100%",
    resizeMode: "contain",
  },
  bannerContainer: {
    width: "100%",
    height: 200,
    flexWrap: "wrap",
    // backgroundColor:'black',
  },
  button: {
    width: "50%",
    height: "100%",
    alignItems: "center",
  },
  buttonContainer: {
    marginTop: 10,
    width: "100%",
    height: 100,
    flexWrap: "wrap",
  },
  butonImage: {
    width: "50%",
    height: "100%",
    resizeMode: "contain",
  },
  scoreImage: {
    // backgroundColor:'red',
    resizeMode: "contain",
    width: "70%",
    height: "100%",
  },
  textoScore: {
    textAlign: "center",
    marginTop: 20,
    fontWeight: "bold",
    fontSize: 25,
  },
  textoScoreHistorial: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 15,
  },
  textoScorePunto: {
    textAlign: "center",
    marginTop: 5,
    fontWeight: "bold",
    fontSize: 45,
  },
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
  },
});
