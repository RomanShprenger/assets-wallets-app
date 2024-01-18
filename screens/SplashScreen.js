import React from "react";
import { View, Image, Text } from "react-native";
import * as Progress from 'react-native-progress';

export const SplashScreen = ({ status }) => {
  return (
    <View className="flex flex-1 bg-secondary-100 items-center justify-center">
      <View className="relative shadow-xl shadow-primary-100/30 rounded-full">
        <Image
          className="flex h-64 w-64 object-contain"
          source={require("../assets/Logo.png")}
        />
      </View>
      <Progress.Bar className="text-white text-center mt-24 w-72 text-2xl" progress={status} color={"#02F9E4"}  borderColor={"#02F9E4"} borderWidth={3} />
    </View>
  );
};
