import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import ProfileScreen from "./src/components/Profile";
import CreateScreen from "./src/components/Create";
import CreateProgScreen from "./src/components/CreateProg";
import Icon from "react-native-vector-icons/Ionicons";
// import QuickPP from "./src/components/QuickPlayAndPlayer";
import QuickPlay from "./src/components/QuickPlay";

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <StatusBar barStyle={"dark-content"} />
            <Stack.Navigator>
                <Stack.Screen
                    name="QuickPlay"
                    component={QuickPlay}
                    options={{ headerShown: false }}
                />
                <Stack.Screen name="Profile" component={ProfileScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});
