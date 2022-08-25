import React from "react";
import { View, Text, SafeAreaView, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Ionicons";

const PlayerControls = ({ route }) => {
    const { currentTitle, subTitle } = route.params;
    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: "lightgray",
            }}
        >
            <View style={styles.upperHeader}>
                <Icon name={"chevron-down-sharp"} size={30} />
                <Text style={{ fontWeight: "bold" }}>
                    progression in the key of eminor
                </Text>
                <Icon name={"ellipsis-vertical-sharp"} size={23} />
            </View>
            <View style={styles.body}>
                <Text>Controls</Text>
            </View>
            <View style={styles.playerController}>
                <View style={styles.titlesAndSave}>
                    <View>
                        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                            {currentTitle}
                        </Text>
                        <Text>{subTitle}</Text>
                    </View>
                    <View>
                        <Icon name={"heart-outline"} size={30} />
                    </View>
                </View>
                <View style={styles.playerNavigation}>
                    <Icon name={"play-skip-back"} size={40} />
                    <View
                        style={{
                            padding: 5,
                            flexDirection: "row",
                            justifyContent: "center",
                            paddingLeft: 10,
                            marginHorizontal: 20,
                        }}
                    >
                        <TouchableOpacity>
                            <Icon name={"pause-circle"} size={70} />
                        </TouchableOpacity>
                    </View>

                    <Icon name={"play-skip-forward"} size={40} />
                </View>
            </View>
        </SafeAreaView>
    );
};

export default PlayerControls;

const styles = StyleSheet.create({
    upperHeader: {
        backgroundColor: "red",
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        flex: 0.75,
        paddingRight: 10,
        paddingLeft: 10,
    },
    body: {
        backgroundColor: "yellow",
        flex: 5,
    },
    playerController: {
        backgroundColor: "green",
        flex: 1.5,
    },
    titlesAndSave: {
        backgroundColor: "orange",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        alignItems: "center",
    },
    playerNavigation: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "pink",
        flex: 1,
    },
});
