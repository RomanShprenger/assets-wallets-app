import React, { useState, useCallback } from "react";
// prettier-ignore
import { View, ScrollView, Text, Alert } from "react-native";
import PageTitle from "../components/PageTitle";
import { useFocusEffect } from '@react-navigation/native';
import * as SplashScreen from "expo-splash-screen";
import { selectWallets, selectPortfolio, selectBalancies } from "../db";
import SwitchSelector from "react-native-switch-selector";
import { Chart } from '../components/Chart';
import { randomColor, roundToCents } from "../utils";


export const Analyze = () => {
  const [wallets, setWallets] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [switcherState, setSwitcherState] = useState('assets');
  const [chartData, setChartData] = useState([]);
  const [chartBalanciesData, setChartBalanciesData] = useState([]);

  const loadPositions = async () => {
    try {
      const walletsFromDb = await selectWallets();
      setWallets(walletsFromDb);

      const balanciesFromDb = await selectBalancies();

      const savedPositions = await selectPortfolio();
      const sumOfPositions = savedPositions?.reduce((accumulator, currentValue) => accumulator + currentValue.value, 0);
      setChartData(savedPositions.map(item => ({
        value: item.value,
        color: randomColor(),
        text: Math.round((item.value / sumOfPositions) * 100) + '%',
        symbol: item.symbol,
        name: item.name
      })));

      const sumOfBalancies = balanciesFromDb?.reduce((accumulator, currentValue) => accumulator + currentValue.value, 0);
      setChartBalanciesData(balanciesFromDb.map(item => ({
        value: item.value,
        color: randomColor(),
        text: Math.round((item.value / sumOfBalancies) * 100) + '%',
        symbol: item.chain,
        name: item.chain,
        value: item.value
      })));

      setDataLoaded(true);
    } catch (e) {
      Alert.alert(e.message);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadPositions();
    }, [])
  );

  const onLayoutRootView = useCallback(async () => {
    if (dataLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [dataLoaded]);

  if (!dataLoaded) {
    return null;
  }

  return (
    <ScrollView
      className="flex flex-1 bg-secondary-100 pt-12 px-4"
      onLayout={onLayoutRootView}
    >
      <View className="flex py-4 flex-col justify-center bg-transparent mb-4">
        <View className="mt-0">
          <PageTitle title="Analyze" />
        </View>
      </View>

      {
        wallets.length ? <View
        className="flex flex-1 bg-secondary-100 mb-12"
        onLayout={onLayoutRootView}
      >
          <SwitchSelector
            initial={0}
            onPress={value => setSwitcherState(value)}
            className="mb-8"
            textColor="#BF1DFF"
            selectedColor="#021A29"
            backgroundColor="rgba(0,0,0,0)"
            buttonColor="#BF1DFF"
            borderColor="#BF1DFF"
            hasPadding
            options={[
              { label: "Assets", value: "assets" },
              { label: "Chains", value: "chains" }
            ]}
          />

          {
            switcherState === 'assets' && <Chart data={chartData} />
          }
          {
            switcherState === 'chains' && <View>
              <Chart data={chartBalanciesData} />
              <View className="flex flex-col gap-y-2 px-4">
                {chartBalanciesData.map(item => (
                  <View className="flex flex-row justify-between items-center" key={item.name}>
                    <Text className="text-white text-center text-lg font-semibold">{item.name}</Text>
                    <Text className="text-primary-200 text-center text-base">${roundToCents(item.value)}</Text>
                  </View>
                ))}
              </View>
            </View>
          }
        </View> : <>
          <View className="flex-1 pt-2 px-6 px-8 flex flex-col items-center justify-center w-full rounded-t-2xl">
            <Text className="text-white opacity-40 text-center text-2xl font-semibold">No data for analyze</Text>
          </View>
        </>
      }
    </ScrollView>
  );
};
