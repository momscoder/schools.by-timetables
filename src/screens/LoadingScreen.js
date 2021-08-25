import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Animated,
  TextInput,
  Easing,
} from "react-native";

import { StatusBar } from "expo-status-bar";

import { Actions } from "react-native-router-flux";
import Button from "react-native-button";

import { login } from "../services/schoolsby";

const switchToMain = () => {
  Actions.replace("mainTabBar");
};

const LoadingScreen = () => {
  const mountedRef = useRef();

  const [LogoAnim, setLogoAnim] = useState(new Animated.Value(0));
  const [LogoText, setLogoText] = useState(new Animated.Value(0));
  const [FooterAnim, setFooterAnim] = useState(new Animated.Value(0));
  const [FooterHidden, setFooterHidden] = useState(true);
  const [ControlsDisabled, setControlsDisabled] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function showLogo() {
    Animated.parallel([
      Animated.spring(LogoAnim, {
        toValue: 1,
        tension: 10,
        friction: 2,
        duration: 1000,
        useNativeDriver: false,
      }),

      Animated.timing(LogoText, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: false,
      }),
    ]).start(() => moveFooter());
  }

  function moveFooter() {
    if (!ControlsDisabled) setControlsDisabled(!ControlsDisabled);
    Animated.timing(FooterAnim, {
      toValue: FooterHidden ? 1 : 0,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      setFooterHidden(!FooterHidden);
    });
  }

  async function handleBttnClick() {
    if (username && password) moveFooter();
  }

  async function attemptLogin() {
    (await login(username, password)) ? switchToMain() : moveFooter();
  }

  useEffect(() => {
    if (!mountedRef.current) return;
    if (!FooterHidden) setControlsDisabled(!ControlsDisabled);
    if (FooterHidden) attemptLogin();
  }, [FooterHidden]);

  useEffect(() => {
    mountedRef.current = true;
    showLogo();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Animated.View
        style={{
          opacity: LogoAnim,
          top: LogoAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [30, 0],
          }),
        }}
      >
        <Image source={require("../../assets/favicon.png")} />
      </Animated.View>
      <Animated.View
        style={{
          opacity: LogoText,
        }}
      >
        <Text style={styles.logoText}> Дождитесь окончания загрузки </Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.footer,
          {
            transform: [
              {
                translateY: Animated.multiply(
                  FooterAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 250],
                    extrapolate: "clamp",
                  }),
                  -1
                ),
              },
            ],
          },
        ]}
      >
        <TextInput
          disabled={ControlsDisabled}
          style={styles.input}
          placeholder="Логин schools.by-сайта школы"
          placeholderTextColor="#fff"
          onChangeText={(s) => setUsername(s)}
        />
        <TextInput
          disabled={ControlsDisabled}
          style={styles.input}
          placeholder="Пароль на schools.by-сайта школы"
          placeholderTextColor="#fff"
          onChangeText={(s) => setPassword(s)}
          secureTextEntry={true}
        />

        <Button
          disabled={ControlsDisabled}
          style={styles.button}
          onPressOut={() => handleBttnClick()}
        >
          Продолжить
        </Button>
      </Animated.View>
    </View>
  );
};

export default LoadingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    position: "absolute",
    bottom: -250,
    borderTopStartRadius: 13,
    borderTopEndRadius: 13,
    borderTopWidth: 24,
    right: 0,
    left: 0,
    padding: 10,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    color: "#000",
    fontFamily: "Inter-Black",
    fontSize: 17,
    fontWeight: "300",
  },
  input: {
    borderWidth: 1.3,
    borderRadius: 13,
    borderColor: "#fff",
    padding: 8,
    margin: 8,
    width: 330,
    height: 50,
    textAlign: "center",
    color: "#fff",
    fontFamily: "Inter-Regular",
  },
  button: {
    height: 50,
    width: 330,
    borderRadius: 13,
    fontFamily: "Inter-Black",
    color: "#fff",
    fontSize: 20,
    fontWeight: "300",
    textAlignVertical: "center",
    backgroundColor: "#000",
  },
});
