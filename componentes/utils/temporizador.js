import React from "react";
import { Text, StyleSheet } from "react-native";
import Constants from "expo-constants";
import { useTheme } from "@react-navigation/native";

const temporizador = (props) => {
const {colors} = useTheme();
  const mins = Math.floor(props.timeRemaining / 60);
  const secs = props.timeRemaining % 60;

  const paddZero = secs < 10 ? "0" : "";

  return (
    <Text style={[styles.textTemporizador,{color: colors.text}]}>
      {mins}:{paddZero}
      {secs}
    </Text>
  );
};

export default temporizador;
const styles = StyleSheet.create({
  textTemporizador: {
    flexWrap: "wrap",
    maxHeight: 480,
    fontSize: 80,
    justifyContent: "center",
    alignItems: "center",
    alignSelf:'center',
  },
});
