import { useState, useCallback, useMemo, useEffect } from "react";
// prettier-ignore
import { View, FlatList, Alert, Text, Pressable } from "react-native";
// prettier-ignore
import { selectWalletByAddress } from "../db";
import WalletBalance from "../components/WalletBalance";
import CoinItem from "../components/CoinItem";
import { useFocusEffect } from '@react-navigation/native';
import { fetchWalletPositions } from '../services/zerionApi';

export const Wallet = ({ navigation, route }) => {
    const { address, walletName } = route.params;
    const [positions, setPositions] = useState([]);
    const [wallet, setWallet] = useState(null);
    const [loaded, setLoaded] = useState(false)

    const loadPositions = async () => {
        try {
            const walletFromDb = await selectWalletByAddress(address);
            setWallet(walletFromDb);

            const positionsData = await fetchWalletPositions([address]);

            setPositions(positionsData);
            setLoaded(true);
        } catch (e) {
            Alert.alert(e.message);
            setLoaded(true);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadPositions();
        }, [])
        
    );

    useEffect(() => {
        navigation.setOptions({
            headerTitle: walletName
        });
    }, [navigation]);

    return (
        <View
            className="flex flex-1 bg-secondary-100 pt-12 items-stretch justify-between"
        >
            <View className="basis-auto px-4 pb-8 w-full">
                {wallet && <WalletBalance data={wallet} assets={positions} />}
            </View>

            {
                !loaded ? (
                    <View className="flex-1 bg-white pt-2 px-8 flex flex-col items-center justify-center w-full rounded-t-2xl">
                        <Text className="text-secondary-100 opacity-40 text-center text-2xl">Loading...</Text>
                    </View>
                ) : (
                    positions.length ? <FlatList
                        data={positions}
                        contentContainerStyle={{ paddingBottom: 20, paddingTop: 20 }}
                        className="bg-white px-6 rounded-t-2xl"
                        renderItem={({ item }) => (
                            <CoinItem data={item} />
                        )}
                        keyExtractor={item => item.symbol}
                    /> : <View className="flex-1 bg-white pt-2 px-8 flex flex-col items-center justify-center w-full rounded-t-2xl">
                        <Text className="text-neutral-800 text-center text-3xl font-semibold">This wallet doesn't have any assets on balance</Text>
                    </View>
                )
            }

        </View>
    );
};