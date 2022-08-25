import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

// Common chord progression flatList items
const Item = ({ title, progIndex, onPressTitle, onPressAdd }) => {
    const titles = title.split(" ");
    return (
        <View style={styles.progressionStringContainer}>
            <TouchableOpacity
                style={styles.text}
                onPress={() => onPressTitle(title, progIndex, 0)}
            >
                <Text style={styles.progressionString}>{titles[0]}</Text>
                <Text style={styles.subString}>{titles[1]}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={{
                    flex: 0.5,
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    // backgroundColor: "blue",
                }}
                onPress={() => onPressAdd()}
            >
                <Icon name={"add-circle-outline"} size={32} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    subString: {
        color: "#939393",
        marginLeft: 5,
        fontSize: 14,
    },
    progressionString: {
        fontSize: 20,
        marginLeft: 5,
        marginBottom: 5,
    },
    progressionStringContainer: {
        padding: 10,
        borderColor: "#4DEA04",
        borderWidth: 1.5,
        borderRadius: 5,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: 210,
        // backgroundColor: "red",
        marginLeft: 10,
    },
    text: {
        justifyContent: "center",
        // backgroundColor: "orange",
    },
});

export default Item;
