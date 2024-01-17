import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Dashboard } from "./Dashboard";
import { Analyze } from "./Analyze";
import { Wallets } from "./Wallets";
import { CircleStackIcon, WalletIcon, ChartPieIcon } from "react-native-heroicons/outline";

const Tab = createBottomTabNavigator();

const bgColor = "#021A29";
const primaryColor = "#BF1DFF";

export const Home = () => {
  return (
    <Tab.Navigator screenOptions={{
      headerShown: false,
      tabBarStyle: { backgroundColor: bgColor, paddingTop: 24, paddingBottom: 24, height: 80, borderTopColor: bgColor },
      tabBarItemStyle: { gap: 12 } 
    }}>
      <Tab.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          tabBarActiveTintColor: primaryColor,
          tabBarIcon: ({ color }) => (
            <CircleStackIcon color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="Wallets"
        component={Wallets}
        options={{
          tabBarActiveTintColor: primaryColor,
          tabBarIcon: ({ color }) => (
            <WalletIcon color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="Analyze"
        component={Analyze}
        options={{
          tabBarActiveTintColor: primaryColor,
          tabBarIcon: ({ color }) => (
            <ChartPieIcon color={color} size={24} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}