import AsyncStorage from "@react-native-async-storage/async-storage";
import AppLoading from "expo-app-loading";
import { useFonts } from "expo-font";

import React, { useEffect, useState } from "react";

import { ActionConst, Router, Scene } from "react-native-router-flux";

import LoadingScreen from "./screens/LoadingScreen";
import MainScreen from "./screens/MainScreen";

let customFonts = {
  "Inter-Black": require("../assets/fonts/Inter/Inter-Black.otf"),
  "Inter-Regular": require("../assets/fonts/Inter/Inter-Regular.otf"),
};

export default function App() {
  let [fontsLoaded] = useFonts(customFonts);
  const [loggedIn, setLoggedIn] = useState(null);

  const checkLogin = () => {
    AsyncStorage.getItem("classId")
      .then((res) => setLoggedIn(res !== null ? true : false))
      .catch((error) => {
        console.log(error);
        setLoggedIn(false);
      });
  };

  useEffect(checkLogin, []);

  if (!fontsLoaded || loggedIn === null) return <AppLoading />;

  return (
    <Router>
      <Scene key="root">
        <Scene
          key="loading"
          component={LoadingScreen}
          initial={!loggedIn}
          headerShown={false}
        />
        <Scene
          key="main"
          component={MainScreen}
          initial={loggedIn}
          headerShown={false}
          type={ActionConst.RESET}
        />
      </Scene>
    </Router>
  );
}
