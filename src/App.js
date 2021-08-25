import AsyncStorage from "@react-native-async-storage/async-storage";
import AppLoading from "expo-app-loading";
import { useFonts } from "expo-font";

import React, { useEffect, useState } from "react";

import { ActionConst, Router, Scene } from "react-native-router-flux";

import WeekDay from "./components/WeekDay";
import LoadingScreen from "./screens/LoadingScreen";

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
          initial={loggedIn}
          tabs
          legacy
          swipeEnabled
          key="mainTabBar"
          headerShown={false}
          tabBarPosition="top"
          tabBarStyle={{
            marginTop: "8%",
            backgroundColor: "#000",
          }}
          labelStyle={{ fontFamily: "Inter-Regular" }}
          type={ActionConst.RESET}
        >
          <Scene
            key="mon"
            dayName="mon"
            component={WeekDay}
            title="Пн"
            headerShown={false}
          />
          <Scene
            key="tue"
            dayName="tue"
            component={WeekDay}
            title="Вт"
            headerShown={false}
          />
          <Scene
            key="wed"
            dayName="wed"
            component={WeekDay}
            title="Ср"
            headerShown={false}
          />
          <Scene
            key="thu"
            dayName="thu"
            component={WeekDay}
            title="Чт"
            headerShown={false}
          />
          <Scene
            key="fri"
            dayName="fri"
            component={WeekDay}
            title="Пт"
            headerShown={false}
          />
          <Scene
            key="sat"
            dayName="sat"
            component={WeekDay}
            title="Сб"
            headerShown={false}
          />
        </Scene>
      </Scene>
    </Router>
  );
}
