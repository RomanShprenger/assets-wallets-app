import { useReducer, useEffect } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AddWallet } from "./screens/AddWallet";
import { Home } from "./screens/Home";
import { SplashScreen } from "./screens/SplashScreen";
import { StatusBar } from "expo-status-bar";

import { getWallets, getPortfolio, getBalancies } from './services/getData';

const Stack = createNativeStackNavigator();

export default function App({ navigation }) {
  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case "increment":
          return {
            ...prevState,
            loadingStatus: prevState.loadingStatus + 1
          };
      }
    },
    {
      loadingStatus: 0,
    }
  );

  const loadData = async () => {
    const walletsFromDb = await getWallets()
    dispatch({ type: "increment" });

    const positionsFromDb = await getPortfolio();
    dispatch({ type: "increment" });

    const balanciedFromDb = await getBalancies();
    dispatch({ type: "increment" });

    console.log("WALLETS: ", walletsFromDb);
    console.log("POSITIONS: ", positionsFromDb);
    console.log("BALANCIES: ", balanciedFromDb);

    dispatch({ type: "increment" });
  }

  useEffect(() => {
    loadData();
  }, []);

  if (state.loadingStatus < 4) {
    return <SplashScreen />;
  }

  return (
    <>
      <StatusBar style="dark" />
      <NavigationContainer>
        <Stack.Navigator>
          <>
              <Stack.Screen
                name="Home"
                component={Home}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="AddWallet"
                component={AddWallet}
                options={{
                  title: "",
                  headerShown: true,
                  headerStyle: {
                    backgroundColor: '#171717',
                  },
                  headerTintColor: '#fff',
                }}
              />
            </>           
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
