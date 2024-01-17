import { View, Text } from "react-native";

const PageTitle = ({ title }) => {
  return (
    <View className="flex flex-row items-center justify-between mt-6">
        <Text className="text-white text-5xl font-semibold">{title}</Text>
    </View>
  );
};

export default PageTitle;
