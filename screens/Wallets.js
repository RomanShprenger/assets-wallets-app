import React, { useState, useCallback } from "react";
import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import PageTitle from "../components/PageTitle";
import Wallet from "../components/Wallet";
import { selectWallets, deleteWallet } from "../db";
import { PencilSquareIcon, PlusIcon } from "react-native-heroicons/outline";

export const Wallets = ({ navigation }) => {
    const [data, setData] = useState([]);
    const [editable, setEditable] = useState(false);

    const loadWallets = async () => {
        try {
            const walletsFromDb = await selectWallets();
            setData(walletsFromDb);
        } catch (e) {
            Alert.alert(e.message);
        }
    };

    const deleteWalletFromDbAndList = async (walletId) => {
        await deleteWallet(walletId);
        const updatedWallets = data.filter(wallet => wallet.id !== walletId);
        setData(updatedWallets);
    };

    useFocusEffect(
        useCallback(() => {
            setEditable(false);
            loadWallets();
        }, [])
    );

    return (
        <View className="flex flex-1 bg-secondary-100 pt-12 justify-start items-start">
            <View className="flex p-4 flex-col justify-center bg-transparent">
                <View className="mt-0 flex flex-row items-center justify-between w-full mb-4">
                    <PageTitle title="Wallets" />
                    { data.length ? (
                        <Pressable
                            className="flex h-10 w-10 rounded-full mt-4 flex-row items-center justify-center ml-auto mr-4"
                            onPress={() => setEditable(!editable)}
                        >
                            <PencilSquareIcon className="flex text-2xl text-white" color="#999" size={24} />
                        </Pressable>
                    ) : null }
                    <Pressable
                        className="flex bg-primary-200 h-10 w-10 rounded-full mt-4 flex-row items-center justify-center"
                        onPress={() => navigation.navigate('AddWallet')}
                    >
                        <PlusIcon className="flex text-2xl text-white" color="#262626" size={24} />
                    </Pressable>
                </View>
            </View>
            {
                data.length ? (
                    <ScrollView className="flex flex-1 px-4 w-full">
                        {
                            data.map((item) => <Wallet data={item} key={item.address} editable={editable} deleteWalletFromDbAndList={deleteWalletFromDbAndList} navigation={navigation} />)
                        }
                    </ScrollView>
                ) : (
                    <View className="flex-1 pt-2 px-6 px-8 flex flex-col items-center justify-center w-full rounded-t-2xl">
                        <Text className="text-white opacity-40 text-center text-2xl font-semibold">To add wallet click on "+" at the top right screen angle</Text>
                    </View>
                )
            }

        </View>
    );
};
