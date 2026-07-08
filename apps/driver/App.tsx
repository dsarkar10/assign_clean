import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { TodayTripScreen } from "./src/screens/TodayTripScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="TodayTrip"
          component={TodayTripScreen}
          options={{ title: "Today's Trip" }}
        />
      </Stack.Navigator>
      <StatusBar style="dark" />
    </NavigationContainer>
  );
}
