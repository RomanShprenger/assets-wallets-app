import { View, Text, Image } from "react-native";
import { roundToCents } from '../utils';
import { getCoinLogo } from '../utils/getCoinLogo';

const CoinItem = ({ data }) => {
  return (
    <View className="flex flex-row w-full items-center justify-between mb-4">
        <View className="basis-[40px] max-w-[40px] mr-4">
            <Image
                className="w-10 h-10 rounded-full bg-secondary-100 border border-secondary-100 p-4"
                source={getCoinLogo(data.symbol.toLowerCase())}
            />
        </View>
        <View className="flex flex-col mr-auto">
            <Text className="text-secondary-100 text-base font-semibold">{data.name}</Text>
            <Text className="text-secondary-100 opacity-40 text-sm">{data.symbol}</Text>
        </View>
        <View className="flex flex-col items-end">
            <Text className="text-primary-100 text-base font-semibold">$ {roundToCents(data.value)}</Text>
            <Text className="text-secondary-100 opacity-40 text-sm">{data.amount} {data.symbol}</Text>
        </View>
    </View>
  );
};

export default CoinItem;
