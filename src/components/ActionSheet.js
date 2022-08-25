import React, { useState } from "react";
import { View, Text, Animated, StyleSheet, Dimensions } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Chord from "./Chord.js";

const { width, height } = Dimensions.get("screen");

const ActionSheet = ({ keyChords, onPressTitle, onPressAdd }) => {
    const [alignment] = useState(new Animated.Value(0));
    const bringUpActionSheet = () => {
        Animated.timing(alignment, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };

    const hideTheActionSheet = () => {
        Animated.timing(alignment, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };

    const actionSheetIntropolate = alignment.interpolate({
        inputRange: [0, 2.43],
        outputRange: [-height / 2.3, 0],
    });

    const actionSheetStyle = {
        bottom: actionSheetIntropolate,
    };

    const gestureHandler = (e) => {
        if (e.nativeEvent.contentOffset.y > 0) bringUpActionSheet();
        else if (e.nativeEvent.contentOffset.y < 0) hideTheActionSheet();
    };
    return (
        <Animated.View style={[styles.container, actionSheetStyle]}>
            <View style={styles.grabberContainer}>
                <View style={styles.grabberBar} />
                <ScrollView
                    scrollEventThrottle={0}
                    onScroll={(e) => gestureHandler(e)}
                    style={styles.grabber}
                ></ScrollView>
            </View>
            <Text style={styles.chordsText}>CHORDS</Text>
            <View style={styles.chordsContainer}>
                {keyChords.map((chord) => (
                    <Chord
                        title={chord.name}
                        index={chord.index}
                        onPressTitle={onPressTitle}
                        onPressAdd={onPressAdd}
                        key={chord.id}
                        chordsInKeyIndex={chord.arrIndex}
                    />
                ))}
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#E9E9E9",
        height: height / 1.2,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        alignItems: "flex-start",
    },
    grabberContainer: {
        height: 40,
        width: "100%",
        // backgroundColor: "orangered",
    },
    grabber: {
        width: "100%",
    },
    grabberBar: {
        width: "18%",
        backgroundColor: "black",
        height: 5,
        marginTop: 10,
        position: "absolute",
        zIndex: 3,
        left: "41%",
        borderRadius: 5,
    },
    chordsContainer: {
        // backgroundColor: "red",
        width: "100%",
        height: "40%",
        display: "flex",
        flexWrap: "wrap",
        marginLeft: 20,
        marginTop: 5,
    },
    chordsText: {
        position: "absolute",
        marginLeft: 20,
        top: 20,
    },
});

export default ActionSheet;
