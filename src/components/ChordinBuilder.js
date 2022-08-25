import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Pressable,
} from "react-native";

const ChordinBuilder = ({ title, index }) => {
    const [disabled, setDisabled] = useState(false);
    const [autoSizeWidth, setAutoSize] = useState(20);
    const animation = new Animated.Value(0);
    const inputRange = [0, 1];
    const outputRange = [1, 0.85];
    const scale = animation.interpolate({ inputRange, outputRange });
    const titles = title.split(" ");

    // shrink view when held
    const onPressIn = () => {
        Animated.spring(animation, {
            speed: 12,
            toValue: 1,
            useNativeDriver: true,
        }).start(({ finished }) => {
            if (finished) {
                alert("options");
            }
        });
    };

    // return view to original dimensions
    const onPressOut = () => {
        Animated.spring(animation, {
            toValue: 0,
            useNativeDriver: true,
        }).start();
    };

    //
    const onPress = () => {
        console.log("pressed");
    };
    return (
        <Animated.View
            style={[
                {
                    transform: [{ scale }],
                    alignSelf: autoSizeWidth ? "center" : "auto",
                },
            ]}
        >
            <Pressable
                onPress={async () => await onPress()}
                disabled={disabled}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                style={styles.container}
            >
                {({ pressed }) => (
                    <View style={{ flexDirection: "column" }}>
                        <Text style={styles.progressionString}>
                            {titles[0]}
                        </Text>
                        <Text style={styles.subString}>{titles[1]}</Text>
                    </View>
                )}
            </Pressable>
        </Animated.View>
    );
};

export default ChordinBuilder;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#E9FFEB",
        borderWidth: 1.5,
        borderColor: "#4DEA04",
        borderRadius: 5,
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        marginHorizontal: 3,
    },
    box: {
        height: 100,
        width: 100,
        backgroundColor: "red",
    },
    progressionString: {
        fontSize: 22,
        marginLeft: 5,
        marginBottom: 5,
        paddingRight: 5,
    },
    subString: {
        color: "#939393",
        fontSize: 14,
        marginLeft: 5,
    },
});
