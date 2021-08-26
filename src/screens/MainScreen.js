// trash

import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  RefreshControl,
  StyleSheet,
  View,
  ToastAndroid,
} from "react-native";
import { Tab, TabView } from "react-native-elements";
import Footer from "../components/Footer";
import WeekDay from "../components/WeekDay";
import TabItem from "../components/TabItem";
import { downloadTimetable, logout } from "../services/schoolsby";
import { Actions } from "react-native-router-flux";

const switchToLogin = async () => {
  if (await logout()) {
    Actions.replace("loading");
  }
};

const MainScreen = () => {
  const [index, setIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [successRefresh, setSuccessRefresh] = useState(false);

  useEffect(() => {
    setIndex(new Date().getDay() - 1 || 0);
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    downloadTimetable()
      .then((result) => {
        if (result) {
          setSuccessRefresh(true);
        } else if (result === null) {
          switchToLogin();
        } else if (!result) {
          ToastAndroid.show(
            "Не удалось получить расписание",
            ToastAndroid.SHORT
          );
        }
      })
      .catch(() => {
        ToastAndroid.show(
          "не удалось получить расписание!!!!!!",
          ToastAndroid.SHORT
        );
      })
      .finally(() => setRefreshing(false));
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#000" />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Tab
          value={index}
          onChange={setIndex}
          indicatorStyle={{ backgroundColor: "#f9e665" }}
        >
          <TabItem title="Пн" />
          <TabItem title="Вт" />
          <TabItem title="Ср" />
          <TabItem title="Чт" />
          <TabItem title="Пт" />
          <TabItem title="Сб" />
        </Tab>

        <TabView value={index} onChange={setIndex}>
          <WeekDay
            dayName="mon"
            refreshTimetable={successRefresh}
            setRefreshTimetable={setSuccessRefresh}
          />
          <WeekDay
            dayName="tue"
            refreshTimetable={successRefresh}
            setRefreshTimetable={setSuccessRefresh}
          />
          <WeekDay
            dayName="wed"
            refreshTimetable={successRefresh}
            setRefreshTimetable={setSuccessRefresh}
          />
          <WeekDay
            dayName="thu"
            refreshTimetable={successRefresh}
            setRefreshTimetable={setSuccessRefresh}
          />
          <WeekDay
            dayName="fri"
            refreshTimetable={successRefresh}
            setRefreshTimetable={setSuccessRefresh}
          />
          <WeekDay
            dayName="sat"
            refreshTimetable={successRefresh}
            setRefreshTimetable={setSuccessRefresh}
          />
        </TabView>
      </ScrollView>
      {!refreshing && <Footer />}
    </View>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: "8%",
  },
});
