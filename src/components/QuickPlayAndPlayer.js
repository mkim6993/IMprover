import "react-native-gesture-handler";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import QuickPlay from "./QuickPlay";
import PlayerControls from "./PlayerControls";
import ExpandedPlay from "./ExpandedPlayer";

const Stack = createStackNavigator();

const QuickPlayAndPlayer = () => {
    const verticalAnimation = {
        gestureDirection: "vertical",
        headerShown: false,
        cardStyleInterpolator: ({ current, layouts }) => {
            return {
                cardStyle: {
                    transform: [
                        {
                            translateY: current.progress.interpolate({
                                inputRange: [0, 1],
                                outputRange: [layouts.screen.height, 0],
                            }),
                        },
                    ],
                },
            };
        },
    };

    return (
        <Stack.Navigator screenOptions={verticalAnimation}>
            <Stack.Screen name="QuickPlay" component={QuickPlay} />
            {/* <Stack.Screen
                name="ExpandedPlay"
                component={ExpandedPlay}
                options={{
                    gestureResponseDistance: 1000,
                }}
            /> */}
            <Stack.Screen
                name="PlayerControls"
                component={PlayerControls}
                options={{
                    gestureResponseDistance: 1000,
                }}
            />
        </Stack.Navigator>
    );
};

export default QuickPlayAndPlayer;
