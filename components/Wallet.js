import { View, Text, Pressable, Alert } from "react-native";
import { roundToCents, shortcutAddress } from '../utils';

const Wallet = ({ data, editable, deleteWalletFromDbAndList, navigation }) => {
    const handleDelete = (walletId) => {
        Alert.alert(
            "Confirm your action",
            "Are you sure, you want to delete wallet from the list?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: 'destructive',
                    onPress: () => deleteWalletFromDbAndList(walletId)
                }
            ],
            { cancelable: false }
        );
    };

    return (
        <View className="flex flex-row w-full">
            {
                editable && (
                    <>
                        <Pressable
                            className="flex h-10 w-10 bg-red-500 rounded-full mt-4 flex-row items-center justify-center ml-auto mr-4"
                            onPress={() => handleDelete(data.id)}
                        >
                            <Text className="flex text-2xl text-white">-</Text>
                        </Pressable>
                        <View className="bg-white rounded-3xl flex flex-row items-center justify-between p-6 mb-4 flex-1">
                            <View className="">
                                <Text className="text-neutral-800 text-2xl font-semibold mb-1">{data.name}</Text>
                                <Text className="text-neutral-400 text-sm">{shortcutAddress(data.address)}</Text>
                            </View>
                            <View className="flex flex-row justify-between items-center">
                                <Text className="text-lg font-semibold">$ {roundToCents(data.total)}</Text>
                            </View>
                        </View>
                    </>


                )
            }

            <Pressable
                className="bg-white rounded-3xl flex flex-row items-center justify-between p-6 mb-4 flex-1"
                onPress={() => navigation.push('Wallet', { address: data.address, walletName: data.name })}
            >
                <View className="">
                    <Text className="text-neutral-800 text-2xl font-semibold mb-1">{data.name}</Text>
                    <Text className="text-neutral-400 text-sm">{shortcutAddress(data.address)}</Text>
                </View>
                <View className="flex flex-row justify-between items-center">
                    <Text className="text-lg font-semibold">$ {roundToCents(data.total)}</Text>
                </View>
            </Pressable>
        </View>
    );
};

export default Wallet;
