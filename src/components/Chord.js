import React, { Component, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export default class Chord extends React.Component {
    state = {
        playDisabled: false,
    };

    disableBtn() {
        this.props.onPressTitle(this.props.title, [this.props.index], 1);
        this.setState({ playDisabled: true });
        setTimeout(() => this.setState({ playDisabled: false }), 1000);
    }

    render() {
        const { title, index, onPressTitle, onPressAdd, chordsInKeyIndex } =
            this.props;
        const titles = title.split(" ");
        return (
            <View style={styles.chordsContainer}>
                <TouchableOpacity
                    style={{
                        flex: 3,
                        height: "100%",
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                    onPress={() => this.disableBtn()}
                    disabled={this.state.playDisabled}
                >
                    <View style={{ flexDirection: "column" }}>
                        <Text style={styles.progressionString}>
                            {titles[0]}
                        </Text>
                        <Text style={styles.subString}>{titles[1]}</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{ marginLeft: 5 }}
                    onPress={() => onPressAdd(chordsInKeyIndex)}
                >
                    <Icon name={"add-circle-outline"} size={32} />
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    chordsContainer: {
        padding: 10,
        borderColor: "#4DEA04",
        borderWidth: 1.5,
        borderRadius: 5,
        flexDirection: "row",
        alignItems: "center",
        width: 110,
        marginBottom: 10,
        marginRight: 10,
    },
    progressionString: {
        fontSize: 20,
        marginLeft: 5,
        marginBottom: 5,
    },
    subString: {
        color: "#939393",
        fontSize: 14,
        marginLeft: 5,
    },
});
