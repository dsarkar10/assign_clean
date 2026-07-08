import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { TodayOrdersScreen } from "./src/screens/TodayOrdersScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="TodayOrders"
          component={TodayOrdersScreen}
          options={{ title: "Today's Orders" }}
        />
      </Stack.Navigator>
      <StatusBar style="dark" />
    </NavigationContainer>
  );
}
