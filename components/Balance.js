import { View, Text, Image } from "react-native";
import { roundToCents } from '../utils';

const Balance = ({ data, wallets }) => {
    const sumWithInitial = data?.reduce((accumulator, currentValue) => accumulator + currentValue.value, 0);

    return (
        <View className="bg-primary-100 max-h-64 rounded-3xl flex items-start justify-between w-full overflow-hidden">
            <Image
                className="max-h-64 bg-neutral-800  object-fill w-full h-full"
                source={require('../assets/bg.png')}
            />
            <View className="p-6 absolute h-full right-0 left-0 bottom-0 top-0 flex flex-col justify-between">
                <View className="mb-12">
                    <Text className="mb-2 text-base">Portfolio balance:</Text>
                    <Text className="text-white text-4xl font-semibold">${roundToCents(sumWithInitial)}</Text>
                </View>
                <View className="">
                    <View className="flex flex-row gap-x-1">
                        <Text className="text-white text-sm">Wallets:</Text>
                        <Text className="text-primary-200 text-sm">{wallets?.length}</Text>
                    </View>
                    <View className="flex flex-row gap-x-1">
                        <Text className="text-white text-sm">Assets on balance:</Text>
                        <Text className="text-primary-200 text-sm">{data?.length}</Text>
                    </View>
                </View>
            </View>
            
        </View>
    );
};

export default Balance;
