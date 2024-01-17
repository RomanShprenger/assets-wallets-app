import React from "react";
import { View, Image, Text } from "react-native";

export const SplashScreen = () => {
  return (
    <View className="flex flex-1 bg-neutral-900 items-center justify-center">
      <View className="relative">
        <Image
          className="flex h-64 w-64 object-contain "
          source={require("../assets/Logo.png")}
        />
        <Text className="text-white text-center mt-12 text-2xl">Loading...</Text>
      </View>
    </View>
  );
};
