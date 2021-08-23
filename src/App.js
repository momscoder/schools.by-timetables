import AsyncStorage from "@react-native-async-storage/async-storage";
import AppLoading from "expo-app-loading";
import { useFonts } from "expo-font";

import React, { useEffect, useState } from "react";

import { Router, Scene } from "react-native-router-flux";

import LoadingScene from "./scenes/LoadingScene";
import MainScene from "./scenes/MainScene";

let customFonts = {
  "Inter-Black": require("../assets/fonts/Inter/Inter-Black.otf"),
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
          component={LoadingScene}
          initial={!loggedIn}
          hideNavBar
        ></Scene>
        <Scene
          key="main"
          component={MainScene}
          initial={loggedIn}
          hideNavBar
        ></Scene>
      </Scene>
    </Router>
  );
}
