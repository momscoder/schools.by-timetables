import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

const MainScene = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.logoText}> Main Scene </Text>
    </View>
  );
};

export default MainScene;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    color: "#000",
    fontFamily: "Inter-Black",
    fontSize: 20,
    marginTop: 29.1,
    fontWeight: "300",
  },
});
