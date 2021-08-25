import React, { useContext } from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import * as Google from "expo-google-app-auth";
import Storage from "../componentes/utils/SecureStorage";
import Context from "../componentes/utils/GlobalContext";

const PantallaLogin = () => {
  const context = useContext(Context);

  const loguinAsync = async () => {
    console.log("Logueando");
    try {
      const { type, user } = await Google.logInAsync({
        iosClientId:
          "",
        androidClientId:
          "",
      });

      if (type === "success") {
        //API Google REST
        Storage.save("KEY", user);
        context.setEstaLogueado(true);
      }
    } catch (error) {
      console.log("Error en loguin", error);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/nombre.png")}
        style={styles.logoImage}
      />
      <TouchableOpacity style={styles.loginContainer} onPress={loguinAsync}>
        <Image
          source={require("../assets/login.png")}
          style={styles.loginImage}
        />
      </TouchableOpacity>
    </View>
  );
};

export default PantallaLogin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  textoPrueba: {
    display:'none',
  },
  loginContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  spacing: {
    margin: 50,
    padding: 50,
  },
  logoImage: {
    width: "100%",
    height: 200,
    marginVertical: 50,
    marginLeft: 10,
  },
  loginImage: {
    width: "60%",
    height: 150,
    marginTop: 150,
  },
});
