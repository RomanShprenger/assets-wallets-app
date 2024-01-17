import { View, Text, ScrollView } from "react-native";
import { roundToCents } from '../utils';

const TopAssets = ({ list, title }) => {
  return (
    <View className="bg-neutral-800 p-4 flex flex-col items-start justify-between mt-6 rounded-2xl">
        <Text className="text-white text-lg font-semibold mb-8">{title}</Text>
        <ScrollView className="w-full flex flex-col gap-y-2">
            {
                list.map((item) => <View className="flex flex-row items-center justify-between" key={item.symbol}>
                  <Text className="text-white text-base">{item.symbol}</Text>
                  <Text className="text-white text-base">{roundToCents(item.amount)}</Text>
                </View>)
            }
        </ScrollView>
    </View>
  );
};

export default TopAssets;
