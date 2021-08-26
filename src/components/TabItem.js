import React, { useMemo } from "react";
import { StyleSheet } from "react-native";
import { Tab } from "react-native-elements";

const TabItem = (props) => {
  return useMemo(() => {
    return (
      <Tab.Item
        onPress={props.onPress}
        title={props.title}
        containerStyle={styles.container}
        titleStyle={styles.title}
        buttonStyle={styles.bttn}
      />
    );
  }, []);
};

export default TabItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: "Inter-Regular",
    fontSize: 15,
    color: "#fff",
  },
  bttn: {
    margin: 0,
    padding: 0,
  },
});
