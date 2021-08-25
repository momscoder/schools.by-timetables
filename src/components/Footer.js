import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Button from "react-native-button";
import { Actions } from "react-native-router-flux";

import { logout } from "../services/schoolsby";

const switchToLogin = async () => {
  if (await logout()) {
    Actions.replace("loading");
  }
};

const Footer = () => {
  const [bttnDisabled, setBttnDisabled] = useState(false);

  async function handleBttnClick() {
    setBttnDisabled(true);
  }

  useEffect(() => {
    if (bttnDisabled) {
      switchToLogin();
    }
  }, [bttnDisabled]);

  return (
    <View style={styles.footer}>
      <Button
        disabled={bttnDisabled}
        style={styles.button}
        onPressOut={() => handleBttnClick()}
      >
        Выйти
      </Button>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    bottom: 7,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    alignSelf: "center",
    fontFamily: "Inter-Regular",
    color: "#000",
    backgroundColor: "#fff",
  },
});
