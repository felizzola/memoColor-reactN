import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Pressable,
  Text,
  View,
  Image,
  TouchableOpacity,
  BackHandler,
} from "react-native";
import ColorCard from "../componentes/ColorCard";
import vibrar from "../componentes/utils/comportamientos";
import timeout from "../componentes/utils/timeout";
import Temporizador from "../componentes/utils/temporizador";
import { Audio } from "expo-av";

const TIEMPO_JUEGO = 1.0; //1.0 --> 1min
const minToSec = (min) => min * 60;
var interval;

export default function Juego({ navigation, route }) {
  const [timeRemaining, setTimeRemaining] = useState(minToSec(TIEMPO_JUEGO));
  const [estaIniciado, setEstaIniciado] = useState(false);
  const [soundPlay, setSoundPlay] = React.useState();
  const [soundError, setSoundError] = React.useState();
  var dificultad = route.params.dificultad;

  if (dificultad === "facil") {
    var colorList = ["red", "deepskyblue", "mediumseagreen", "orange"];
  } else {
    var colorList = [
      "red",
      "deepskyblue",
      "mediumseagreen",
      "orange",
      "plum",
      "pink",
    ];
  }

  const inicializarValoresJuego = {
    isDisplay: false,
    colors: [],
    score: 0,
    userPlay: false,
    userColors: [],
    error: false,
  };

  const [play, setPlay] = useState(inicializarValoresJuego);
  const [flashColor, setFlashColor] = useState("");

  async function playSound() {
    const songList = {
      0: require(`../componentes/songs/song1.mp3`),
      1: require(`../componentes/songs/song2.mp3`),
      2: require(`../componentes/songs/song3.mp3`),
    };
    const nro = Math.floor(Math.random() * 3);
    const cancion = songList[nro];
    const { sound: soundPlay } = await Audio.Sound.createAsync(cancion);
    setSoundPlay(soundPlay);
    await soundPlay.playAsync();
  }

  function iniciarJuego() {
    BackHandler.addEventListener("hardwareBackPress", () => true);
    setEstaIniciado(true);
    playSound();
    interval = setInterval(() => {
      setTimeRemaining((prev) => prev - 1);
    }, 1000);
  }

  useEffect(() => {
    return () => {
      clearInterval(interval);
      BackHandler.removeEventListener("hardwareBackPress", () => true);
    };
  }, []);

  useEffect(() => {
    if (timeRemaining == 0) {
      soundPlay.unloadAsync();
      if (soundError !== undefined) {
        soundError.unloadAsync();
      }
      const puntaje = play.score;
      setEstaIniciado(false);
      setTimeRemaining(minToSec(TIEMPO_JUEGO));
      clearInterval(interval);
      setPlay(inicializarValoresJuego);
      vibrar();
      navigation.navigate("Puntajes", { puntaje, dificultad });
    }
  }, [timeRemaining]);

  useEffect(() => {
    if (estaIniciado) {
      setPlay({ ...inicializarValoresJuego, isDisplay: true });
    } else {
      setPlay(inicializarValoresJuego);
    }
  }, [estaIniciado]);

  useEffect(() => {
    if (estaIniciado && play.isDisplay) {
      console.log("useEfect estaIniciado y armando el patron");
      var copyColors = [...play.colors];
      for (let i = 0; i < colorList.length; i++) {
        let newColor = colorList[Math.floor(Math.random() * colorList.length)];
        copyColors.push(newColor);
        setPlay({ ...play, colors: copyColors });
      }
    }
  }, [play.isDisplay]);

  useEffect(() => {
    if (estaIniciado && play.isDisplay && play.colors.length) {
      console.log(
        "useEfect estaIniciado y muestra patron " + play.colors.length
      );
      setPlay({ ...play, error: false });
      mostrarPatronColores();
    }
  }, [estaIniciado, play.isDisplay, play.colors.length]);

  async function mostrarPatronColores() {
    await timeout(400);
    for (let i = 0; i < play.colors.length; i++) {
      if (estaIniciado) {
        setFlashColor(play.colors[i]);
        console.log(play.colors[i]);
        await timeout(400);
        setFlashColor("");
        await timeout(300);
      }
      if (estaIniciado) {
        if (i === play.colors.length - 1) {
          const copyColors = [...play.colors];
          console.log("Reproducir patron");
          setPlay({
            ...play,
            isDisplay: false,
            userPlay: true,
            userColors: copyColors.reverse(),
            colors: [],
            error: false,
          });
        }
      }
    }
  }

  async function reproducirError() {
    let songsObje = {
      1: require("../componentes/songs/error1.mp3"),
      2: require("../componentes/songs/error2.mp3"),
    };
    const numero = Math.floor(Math.random() * 2) + 1;
    const reproducirError = songsObje[numero];
    const { sound: soundError } = await Audio.Sound.createAsync(
      reproducirError
    );
    setSoundError(soundError);
    await soundError.playAsync();
  }

  async function patronRealizado(color) {
    if (!play.isDisplay && play.userPlay) {
      const patronAReproducir = [...play.userColors];
      const lastColor = patronAReproducir.pop();
      setFlashColor(color);

      if (color === lastColor) {
        console.log("color ok ");
        if (patronAReproducir.length) {
          setPlay({ ...play, userColors: patronAReproducir });
        } else {
          console.log("hizo patron ok ");
          await timeout(500);

          if (estaIniciado) {
            setPlay({
              ...play,
              isDisplay: true,
              userPlay: false,
              score: play.score + play.userColors.length,
              userColors: [],
              error: false,
            });
          }
        }
      } else {
        console.log(" error ");
        vibrar();
        await reproducirError();
        setPlay({
          ...play,
          error: true,
        });
        await timeout(200);
        setPlay({
          ...play,
          error: true,
          isDisplay: true,
          userPlay: false,
          score: play.score,
        });
      }
      await timeout(200);
      setFlashColor("");
    }
  }

  return (
    <View style={styles.container}>
      <View>
        <Temporizador timeRemaining={timeRemaining} />
      </View>
      <View
        style={
          dificultad == "facil" ? styles.containerEasy : styles.containerHard
        }
      >
        {colorList &&
          colorList.map((v, i) => (
            <View key={i}>
              <ColorCard
                key={i}
                onClick={() => {
                  patronRealizado(v);
                }}
                flash={flashColor === v}
                color={v}
              ></ColorCard>
            </View>
          ))}

        {!estaIniciado && !play.score && (
          <TouchableOpacity style={styles.buttonStart} onPress={iniciarJuego}>
            <Image
              source={require("../assets/START1.png")}
              style={styles.butonImage}
            />
          </TouchableOpacity>
        )}

        {estaIniciado && (play.isDisplay || play.userPlay) && (
          <Pressable style={styles.score}>
            <Text style={styles.text}>{play.score}</Text>
          </Pressable>
        )}
        {estaIniciado && play.error && <Text style={styles.error}>Error</Text>}
      </View>
      <View>
        <Image
          style={styles.gif}
          source={estaIniciado ? require("./gif.gif") : require("./fija.png")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  containerEasy: {
    padding: 10,
    flexWrap: "wrap",
    maxHeight: 300,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  containerHard: {
    padding: 10,
    flexWrap: "wrap",
    maxHeight: 300,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  error: {
    fontSize: 12,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 100,
    paddingHorizontal: 100,
    borderRadius: 100,
    backgroundColor: "red",
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  center: {
    alignSelf: "center",
  },
  buttonContainer: {
    marginTop: 25,
    padding: 5,
    flexDirection: "row",
  },
  button2: {
    borderRadius: 50,
  },
  buttonStart: {
    width: 300,
    height: 300,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  butonImage: {
    width: "50%",
    height: "100%",
    resizeMode: "contain",
  },
  button: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 100,
  },
  score: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 100,
    backgroundColor: "black",
  },
  box: {
    width: 120,
    height: 120,
    borderWidth: 1,
    borderRadius: 20,
  },
  gif: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    height: 200,
    width: 200,
  },
});
