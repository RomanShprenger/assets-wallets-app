import React, { useState, useEffect, useContext, useCallback } from "react";
import PageTitle from "../components/PageTitle";
import { View, Text, KeyboardAvoidingView, Platform, TextInput, Pressable, ScrollView, Alert } from "react-native";
import { addWallet } from "../db";
import { getWalletBalance } from '../services/zerionApi';
import { getPortfolio, getBalancies } from '../services/getData';

export const AddWallet = ({ navigation }) => {
    const [wallet, setWallet] = useState({
        name: "",
        address: ""
    });

    const updateWallet = (key, value) => {
        setWallet((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };

    const submit = async () => {
        const walletData = await getWalletBalance(wallet.address);
        if (walletData?.data) {
            addWallet({ ...wallet, total: walletData?.data?.attributes?.total?.positions || 0 });
            await getPortfolio();
            await getBalancies();
            navigation.goBack();
        } else {
            Alert.alert("Can't get data of the wallet. Check the address field value and repeat again");
        }
    };

    const clear = () => {
        setWallet({
            name: "",
            address: ""
        });
    };

    return (
        <KeyboardAvoidingView
            className="flex flex-1 bg-neutral-900 pt-4 justify-start items-start"
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View className="flex p-4 flex-col justify-center w-full mb-4">
                <PageTitle title="Add new wallet" />
                <Text className="text-white text-lg mt-8">Please fill the next fields to add your wallet in portfolio.</Text>
                <Text className="text-neutral-400 italic text-base mt-2">Note: we don't save your data to any external services. All your data is stored on your phone only</Text>
            </View>
            <ScrollView className="px-4 flex flex-col gap-y-8 w-full">
                <View className="">
                    <Text className="text-white mb-4">
                        Name
                    </Text>
                    <TextInput
                        className="bg-neutral-800 px-4 py-4 rounded-2xl text-primary-100"
                        value={wallet.name}
                        onChangeText={(newValue) => updateWallet("name", newValue)}
                        placeholder={"My new wallet"}
                        placeholderTextColor="#666" 
                    />
                </View>

                <View>
                    <Text className="text-white mb-4">
                        Address
                    </Text>
                    <TextInput
                        className="bg-neutral-800 px-4 py-4 rounded-2xl text-primary-100"
                        value={wallet.address}
                        onChangeText={(newValue) => updateWallet("address", newValue)}
                        placeholder={"e.g. 0x0....000"}
                        placeholderTextColor="#666" 
                    />
                </View>

                <View className="pt-4">
                    <Pressable onPress={submit} className="w-full bg-primary-100 items-center justify-center p-4 rounded-2xl">
                        <Text className="uppercase font-semibold">Add Wallet</Text>
                    </Pressable>
                    <Pressable onPress={clear} className="w-full items-center justify-center p-4 rounded-2xl mt-4">
                        <Text className="text-white uppercase font-semibold">Discard changes</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};