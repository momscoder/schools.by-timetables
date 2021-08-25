import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Table, Row } from "react-native-table-component";

import { StatusBar } from "expo-status-bar";

import Footer from "./Footer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppLoading from "expo-app-loading";

const flexArr = [1, 2, 9, 2];

const WeekDay = (props) => {
  //const [tableHead, setTableHead] = useState(["№", "Время", "Урок", "Кабинет"]);
  const [tableData, setTableData] = useState([]);

  async function loadTimetable() {
    const value = JSON.parse(await AsyncStorage.getItem(props.dayName));
    if (value) {
      const newTableData = [];
      for (let i = 0; i < value.length; ++i) {
        newTableData.push([
          "" + (i + 1),
          value[i].time,
          value[i].subjs,
          value[i].cabs,
        ]);
      }
      setTableData(newTableData);
    }
  }

  useEffect(() => {
    loadTimetable();
  }, []);

  if (!tableData.length) return <AppLoading />;

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#000" />

      <Table
        style={{ top: 0 }}
        borderStyle={{ borderWidth: 0, borderColor: "#000" }}
      >
        {tableData.map((rowData, index) => (
          <Row
            key={index}
            data={rowData}
            widthArr={[100, 100, 100, 100]}
            flexArr={flexArr}
            style={[styles.row, !(index % 2) && { backgroundColor: "#F0F0F0" }]}
            textStyle={[styles.text, !(index % 2) && { color: "#000" }]}
          />
        ))}
      </Table>
      <Footer />
    </View>
  );
};

/*
<Row
          data={tableHead}
          style={styles.head}
          textStyle={styles.text}
          widthArr={widthArr}
        />
*/

export default WeekDay;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  head: { height: 40, backgroundColor: "#f1f8ff" },
  text: { margin: 6, color: "#000", fontFamily: "Inter-Regular" },
});
