import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { PendingActionsScreen } from "./src/screens/PendingActionsScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="PendingActions"
          component={PendingActionsScreen}
          options={{ title: "Pending Actions" }}
        />
      </Stack.Navigator>
      <StatusBar style="dark" />
    </NavigationContainer>
  );
}
