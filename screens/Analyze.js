import React, { useState, useCallback } from "react";
// prettier-ignore
import { View, ScrollView, Text, Alert } from "react-native";
import PageTitle from "../components/PageTitle";
import { useFocusEffect } from '@react-navigation/native';
import * as SplashScreen from "expo-splash-screen";
import { selectWallets, selectPortfolio, selectBalancies } from "../db";
import SwitchSelector from "react-native-switch-selector";
import { PieChart } from "react-native-gifted-charts";
import { randomColor } from "../utils";

const Dot = ({ color }) => {
  return (
    <View
      style={{
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: color
      }}
    />
  );
};

export const Analyze = () => {
  const [wallets, setWallets] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [switcherState, setSwitcherState] = useState('assets');
  const [chartData, setChartData] = useState([]);
  const [activeChartItem, setActiveChartItem] = useState(null);

  const loadPositions = async () => {
    try {
      const walletsFromDb = await selectWallets();
      setWallets(walletsFromDb);

      const balancies = await selectBalancies();

      console.log("BALANCIES FOR ANALYZE: ", balancies);

      const savedPositions = await selectPortfolio();
      const sumWithInitial = savedPositions?.reduce((accumulator, currentValue) => accumulator + currentValue.value, 0);
      // setPositions(savedPositions);
      setChartData(savedPositions.map(item => ({
        value: item.value,
        color: randomColor(),
        text: Math.round((item.value / sumWithInitial) * 100) + '%',
        symbol: item.symbol,
        name: item.name
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
    <View
      className="flex flex-1 bg-secondary-100 pt-12 px-4"
      onLayout={onLayoutRootView}
    >
      <View className="flex py-4 flex-col justify-center bg-transparent mb-4">
        <View className="mt-0">
          <PageTitle title="Analyze" />
        </View>
      </View>

      {
        wallets.length ? <ScrollView
        className="flex flex-1 bg-secondary-100 pt-12 px-4"
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
            switcherState === 'assets' && (
              <View className="mx-auto flex flex-col items-center justify-center border border-primary-100 p-4 pb-12 mb-12 rounded-2xl">
                <PieChart
                  data={chartData}
                  focusOnPress
                  donut
                  sectionAutoFocus
                  innerCircleColor="#171717"
                  onPress={(item) => setActiveChartItem(item)}
                  centerLabelComponent={() => {
                    return activeChartItem && (
                      <View className="flex flex-col items-center jusitfy-center">
                        <Text className="text-white text-lg font-semibold mb-1">{activeChartItem?.text}</Text>
                        <Text className="text-white text-xs">{activeChartItem?.symbol}</Text>
                      </View>
                    );
                  }}
                />

                <View className="flex flex-row flex-wrap justify-center gap-x-4 gap-y-4">
                  {
                    chartData.map(item => (
                      <View className="flex flex-row gap-x-2 items-center" key={item?.color}>
                        <Dot color={item?.color} />
                        <Text className="text-white text-md">{item?.name}</Text>
                        <Text className="text-white text-md font-semibold">{item?.text}</Text>
                      </View>
                    ))
                  }
                </View>
              </View>
            )
          }

          {
            switcherState === 'chains' && (
              <View className="mx-auto flex flex-col items-center justify-center bg-neutral-800 p-4 pb-12 mb-12 rounded-2xl">
                <PieChart
                  data={chartData}
                  focusOnPress
                  donut
                  sectionAutoFocus
                  innerCircleColor="#171717"
                  onPress={(item) => setActiveChartItem(item)}
                  centerLabelComponent={() => {
                    return activeChartItem && (
                      <View className="flex flex-col items-center jusitfy-center">
                        <Text className="text-white text-lg font-semibold mb-1">{activeChartItem?.text}</Text>
                        <Text className="text-white text-xs">{activeChartItem?.symbol}</Text>
                      </View>
                    );
                  }}
                />

                <View className="flex flex-row flex-wrap justify-center gap-x-4 gap-y-4">
                  {
                    chartData.map(item => (
                      <View className="flex flex-row gap-x-2 items-center" key={item?.color}>
                        <Dot color={item?.color} />
                        <Text className="text-white text-md">{item?.name}</Text>
                        <Text className="text-white text-md font-semibold">{item?.text}</Text>
                      </View>
                    ))
                  }
                </View>
              </View>
            )
          }
        </ScrollView> : <>
          <View className="flex-1 pt-2 px-6 px-8 flex flex-col items-center justify-center w-full rounded-t-2xl">
            <Text className="text-white opacity-40 text-center text-2xl font-semibold">No data for analyze</Text>
          </View>
        </>
      }
    </View>
  );
};
