import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import Storage from "./componentes/utils/SecureStorage";
import Context from "./componentes/utils/GlobalContext";
import { AppearanceProvider, useColorScheme } from "react-native-appearance";
import { DefaultTheme, DarkTheme } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import PantallaLogin from "./screens/PantallaLogin";
import SeleccionDificultad from "./screens/SeleccionDificultad";
import Juego from "./screens/Juego";
import Puntajes from "./screens/Puntajes";
import { useTheme } from "@react-navigation/native";

const Stack = createStackNavigator();
const App = () => {
  const { colors } = useTheme();
  const [estaLogueado, setEstaLogueado] = useState(false);
  const scheme = useColorScheme();
  const myDarkTheme = {
    dark: true,
    colors: {
      primary: "#9933FF",
      background: "#000023",
      card: "#000028",
      text: "#FFFFFF",
      border: "#000028",
      Notification: "#9933FF",
    },
  };

  const validarUsuarioLogueado = async (key) => {
    const user = await Storage.getValueFor(key);
    if (user) {
      setEstaLogueado(true);
    }
  };

  useEffect(() => {
    try {
      validarUsuarioLogueado("KEY");
    } catch (error) {
      console.log(error);
    }
  }, []);

  const misfunciones = { estaLogueado, setEstaLogueado };

  return (
    <AppearanceProvider>
      <SafeAreaProvider>
        <Context.Provider value={misfunciones}>
          <NavigationContainer
            theme={scheme === "dark" ? myDarkTheme : DefaultTheme}
          >
            <Stack.Navigator>
              {!estaLogueado ? (
                <>
                  <Stack.Screen name="Login" component={PantallaLogin} />
                </>
              ) : (
                <>
                  <Stack.Screen
                    name="SeleccionDificultad"
                    component={SeleccionDificultad}
                  />
                  <Stack.Screen
                    name="Juego"
                    component={Juego}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="Puntajes"
                    component={Puntajes}
                    options={{ headerShown: false }}
                  />
                </>
              )}
            </Stack.Navigator>
          </NavigationContainer>
        </Context.Provider>
      </SafeAreaProvider>
    </AppearanceProvider>
  );
};

export default App;
