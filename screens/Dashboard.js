import { useState, useCallback, useMemo } from "react";
// prettier-ignore
import { View, FlatList, Alert, Text, Pressable } from "react-native";
import { Searchbar } from "react-native-paper";
import debounce from "lodash.debounce";
// prettier-ignore
import { selectWallets, selectPortfolio, filterByQuery } from "../db";
import Balance from "../components/Balance";
import CoinItem from "../components/CoinItem";
import PageTitle from "../components/PageTitle";
import { useFocusEffect } from '@react-navigation/native';
import { useUpdateEffect } from '../utils/utils';

export const Dashboard = ({ navigation }) => {
  const [positions, setPositions] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [searchBarText, setSearchBarText] = useState("");
  const [query, setQuery] = useState("");

  const loadPositions = async () => {
    try {
      const walletsFromDb = await selectWallets();
      setWallets(walletsFromDb);

      const positionsFromDb = await selectPortfolio();
      setPositions(positionsFromDb);
    } catch (e) {
      Alert.alert(e.message);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadPositions();
    }, [])
  );

  useUpdateEffect(() => {
    (async () => {
      try {
        const positions = await filterByQuery(query);
        setPositions(positions);
      } catch (e) {
        Alert.alert(e.message);
      }
    })();
  }, [query]);

  const lookup = useCallback((q) => {
    setQuery(q);
  }, []);

  const debouncedLookup = useMemo(() => debounce(lookup, 1000), [lookup]);

  const handleSearchChange = (text) => {
    setSearchBarText(text);
    debouncedLookup(text);
  };

  return (
    <View
      className="flex flex-1 bg-secondary-100 pt-12 items-stretch justify-between"
    >
      <View className="basis-auto p-4 mb-4 mt-0">
        <PageTitle title="Dashboard" />
      </View>

      <View className="basis-auto px-4 pb-8 w-full">
        <Balance data={positions} wallets={wallets} />
      </View>

      {
        positions.length ? <>
          <Searchbar
            placeholder="Type coin name"
            placeholderTextColor="#999"
            onChangeText={handleSearchChange}
            value={searchBarText}
            className="bg-transparent bg-white rounded-none rounded-t-2xl pt-2 px-4"
            iconColor="#333333"
            inputStyle={{ color: "#333333", paddingLeft: 12 }}
            elevation={0}
          />

          <FlatList
            data={positions}
            className="bg-white pt-2 px-6"
            renderItem={({ item }) => (
              <CoinItem data={item} />
            )}
            keyExtractor={item => item.symbol}
          />
        </> : <>
          <View className="flex-1 bg-white pt-2 px-6 px-8 flex flex-col items-center justify-center w-full rounded-t-2xl">
            <Text className="text-neutral-800 text-center text-3xl font-semibold">Add your first wallet to get a list of assets</Text>
            <Pressable
              className="flex bg-primary-200 items-center justify-center p-4 my-4 rounded-2xl"
              onPress={() => navigation.navigate('AddWallet')}
            >
              <Text className="uppercase font-semibold">Add Wallet</Text>
            </Pressable>
          </View>
        </>
      }


    </View>
  );
};