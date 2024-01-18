import { useReducer, useEffect } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AddWallet } from "./screens/AddWallet";
import { Home } from "./screens/Home";
import { Wallet } from "./screens/Wallet";
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
    await getWallets();
    dispatch({ type: "increment" });

    await getPortfolio();
    dispatch({ type: "increment" });

    await getBalancies();
    dispatch({ type: "increment" });
  }

  useEffect(() => {
    loadData();
  }, []);

  if (state.loadingStatus < 3) {
    return <SplashScreen status={state.loadingStatus} />;
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
                    backgroundColor: '#021A29',
                  },
                  headerTintColor: '#fff',
                }}
              />
              <Stack.Screen
                name="Wallet"
                component={Wallet}
                options={{
                  title: "",
                  headerShown: true,
                  headerStyle: {
                    backgroundColor: '#021A29',
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
