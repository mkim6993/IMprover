import React, { Component, useState } from "react";
import {
    View,
    Button,
    StyleSheet,
    Text,
    SafeAreaView,
    FlatList,
    TouchableOpacity,
} from "react-native";
import { Audio, InterruptionModeIOS } from "expo-av";
import Icon from "react-native-vector-icons/Ionicons";

const commonProgressions = {
    eminor: [
        {
            id: 0,
            prog: "i-VI-VII (Em-C-D)",
            cIndex: [0, 5, 6],
        },
        {
            id: 1,
            prog: "i-iv-VII (Em-Am-D)",
            cIndex: [0, 3, 6],
        },
        {
            id: 2,
            prog: "i-iv-V (Em-Am-Bm)",
            cIndex: [0, 3, 4],
        },
        {
            id: 3,
            prog: "i-VI-III-VII (Em-C-G-D)",
            cIndex: [0, 5, 2, 6],
        },
        {
            id: 4,
            prog: "ii-V-i (F#m7b5-Bm-Em)",
            cIndex: [1, 4, 0],
        },
    ],
};

const ALLCHORDS = [
    require("../assets/sounds/eminor/emi.mp3"),
    require("../assets/sounds/eminor/fsharpdimii.mp3"),
    require("../assets/sounds/eminor/gIII.mp3"),
    require("../assets/sounds/eminor/amiv.mp3"),
    require("../assets/sounds/eminor/bmv.mp3"),
    require("../assets/sounds/eminor/cVI.mp3"),
    require("../assets/sounds/eminor/dVII.mp3"),
];

const loading_string = "... loading ...";
const buffering_string = "... buffering ...";

const Item = ({ title, progIndex, onPressTitle, onPressAdd }) => (
    <View style={styles.progressionStringContainer}>
        <TouchableOpacity
            style={{ flex: 3, height: "100%" }}
            onPress={() => onPressTitle(title, progIndex)}
        >
            <Text style={styles.progressionString}>{title}</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={{
                flex: 0.5,
                flexDirection: "row",
                justifyContent: "flex-end",
            }}
            onPress={() => onPressAdd()}
        >
            <Icon name={"add-sharp"} size={30} />
        </TouchableOpacity>
    </View>
);

export default class QuickPlay extends React.Component {
    constructor(props) {
        super(props);
        this.currKey = "eminor";
        this.keyDATA = commonProgressions.eminor;
        this.index = 0;
        this.playbackInstance = null;
        this.state = {
            playerTitle: "",
            subTitle: "",
            playbackInstanceName: loading_string,
            muted: false,
            playbackInstancePosition: null,
            playbackInstanceDuration: null,
            shouldPlay: false,
            isPlaying: false,
            isBuffering: false,
            isLoading: true,
            shouldCorrectPitch: true,
            volume: 1.0,
            rate: 1.0,
            chordProgression: [],
            demoProgression: [],
        };
    }

    componentDidMount() {
        Audio.setAudioModeAsync({
            staysActiveInBackground: true,
            interruptionModeIOS: InterruptionModeIOS.DoNotMix,
            playsInSilentModeIOS: true,
        });
        console.log("component mounted");
        this.loadNewPlaybackInstance(false);
        console.log(this.keyDATA);
    }

    /**
     * METHODS USED TO USE PLAYBACK INSTANCES
     */

    async loadNewPlaybackInstance(playing) {
        console.log("LOAD NEW PLAYBACK INSTANCE");
        if (this.playbackInstance != null) {
            await this.playbackInstance.unloadAsync();
            this.playbackInstance = null;
        }

        // set path for chord
        const initialStatus = {
            shouldPlay: playing,
            rate: this.state.rate,
            shouldCorrectPitch: this.state.shouldCorrectPitch,
            volume: this.state.volume,
            isMuted: this.state.muted,
        };

        const { sound, status } = await Audio.Sound.createAsync(
            ALLCHORDS[this.index],
            initialStatus,
            this._onPlaybackStatusUpdate
        );
        console.log("index", this.index);

        console.log("playbackInstance loaded");
        this.playbackInstance = sound;
    }

    _advanceIndex(forward) {
        console.log("ADVANCE INDEX");
        this.index =
            (this.index + (forward ? 1 : ALLCHORDS - 1)) % ALLCHORDS.length;
    }

    async _updatePlaybackInstanceForIndex(playing) {
        console.log("UPDATE PLAYBACK INSTANCE FOR INDEX");
        this.loadNewPlaybackInstance(playing);
    }

    onPlayPause = () => {
        console.log("PLAY OR PAUSE");
        if (this.playbackInstance != null) {
            if (this.state.isPlaying) {
                this.playbackInstance.pauseAsync();
            } else {
                this.playbackInstance.playAsync();
            }
        }
    };

    onStop = () => {
        console.log("STOPPED");
        if (this.playbackInstance != null) {
            this.playbackInstance.stopAsync();
        }
    };

    _onPlaybackStatusUpdate = (status) => {
        console.log("ON PLAYBACK STATUS UPDATE");
        if (status.isLoaded) {
            this.setState({
                playbackInstancePosition: status.positionMillis,
                playbackInstanceDuration: status.durationMillis,
                shouldPlay: status.shouldPlay,
                isPlaying: status.isPlaying,
                isBuffering: status.isBuffering,
                rate: status.rate,
                muted: status.isMuted,
                volume: status.volume,
                shouldCorrectPitch: status.shouldCorrectPitch,
            });
            if (status.didJustFinish && !status.isLooping) {
                this._advanceIndex(true);
                this._updatePlaybackInstanceForIndex(true);
            }
        } else {
            if (status.error) {
                console.log("error: " + status.error);
            }
        }
    };

    /**
     * METHODS FOR DEMO PLAYBACK
     */
    async loadDemoPlaybackInstance(playing) {
        console.log("LOAD NEW DEMO PLAYBACK");
        if (this.playbackInstance != null) {
            await this.playbackInstance.unloadAsync();
            this.playbackInstance = null;
        }
        // set path for chord
        const initialStatus = {
            shouldPlay: playing,
            rate: this.state.rate,
            shouldCorrectPitch: this.state.shouldCorrectPitch,
            volume: this.state.volume,
            isMuted: this.state.muted,
        };

        const { sound, status } = await Audio.Sound.createAsync(
            this.state.demoProgression[this.index],
            initialStatus,
            this._onDemoPlaybackStatusUpdate
        );
        console.log("demo index", this.index);

        console.log("playbackInstance loaded");
        this.playbackInstance = sound;
    }

    _onDemoPlaybackStatusUpdate = (status) => {
        console.log("ON PLAYBACK STATUS UPDATE");
        if (status.isLoaded) {
            this.setState({
                playbackInstancePosition: status.positionMillis,
                playbackInstanceDuration: status.durationMillis,
                shouldPlay: status.shouldPlay,
                isPlaying: status.isPlaying,
                isBuffering: status.isBuffering,
                rate: status.rate,
                muted: status.isMuted,
                volume: status.volume,
                shouldCorrectPitch: status.shouldCorrectPitch,
            });
            if (status.didJustFinish && !status.isLooping) {
                this._advanceDemoIndex(true);
                this._updatePlaybackInstanceForIndex(true);
            }
        } else {
            if (status.error) {
                console.log("error: " + status.error);
            }
        }
    };

    _advanceDemoIndex(forward) {
        console.log("ADVANCE INDEX");
        this.index =
            (this.index + (forward ? 1 : this.state.demoProgression - 1)) %
            this.state.demoProgression.length;
    }

    // open expanded player controls
    openPlayer = () => {
        if (this.playerTitle !== "") {
            this.props.navigation.navigate("Profile");
        }
    };

    // render flatlist item
    renderItem = ({ item }) => {
        return (
            <Item
                title={item.prog}
                progIndex={item.id}
                onPressTitle={this.onPressTitle}
                onPressAdd={this.onPressAdd}
            />
        );
    };

    // change title displayed in player control
    async onPressTitle(title, progIndex) {
        if (this.playbackInstance != null) {
            if (this.state.isPlaying) {
                this.playbackInstance.pauseAsync();
            }
            await this.playbackInstance.unloadAsync();
            this.loadDemoPlaybackInstance(false);
            console.log("unloaded");
        }
        this.setState(
            {
                playerTitle: title,
                subTitle: "Key of " + this.currKey,
                demoProgression: this.keyDATA[progIndex].cIndex,
            },
            () => {
                console.log("PLAY OR PAUSE demo");
                console.log(this.state.demoProgression);
                if (this.playbackInstance != null) {
                    if (this.state.isPlaying) {
                        this.playbackInstance.pauseAsync();
                    } else {
                        this.playbackInstance.playAsync();
                    }
                }
            }
        );
    }

    // add chord progression to track
    onPressAdd = () => {
        console.log("add");
    };

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.title}>
                    <Text style={{ fontSize: 30, fontWeight: "bold" }}>
                        Quick Play
                    </Text>
                </View>
                <View style={styles.quickPlayItems}>
                    <View style={styles.keySelectContainer}>
                        <View style={styles.keySelectDrop}>
                            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                                E minor{" "}
                            </Text>
                            <Icon name={"caret-down-sharp"} size={20} />
                        </View>
                    </View>
                    <Text style={{ marginLeft: 10 }}>
                        common chord progressions:
                    </Text>
                    <View style={styles.progressions}>
                        <FlatList
                            data={this.keyDATA}
                            renderItem={this.renderItem}
                            keyExtractor={(item) => item.id}
                        />
                    </View>
                </View>
                {/* <Button
                    onPress={this.onPlayPause}
                    title="play progression"
                    color="tomato"
                /> */}
                <View style={styles.playerControls}>
                    <View style={styles.playerItems}>
                        <TouchableOpacity
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginLeft: 10,
                                flex: 1,
                                height: "100%",
                            }}
                            onPress={() => this.openPlayer()}
                        >
                            <Icon name={"musical-notes-outline"} size={25} />
                            <View style={styles.playerTitles}>
                                <Text style={{ fontWeight: "bold" }}>
                                    {this.state.playerTitle}
                                </Text>
                                <Text>{this.state.subTitle}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                height: "100%",
                                paddingRight: 10,
                                paddingLeft: 10,
                                alignItems: "center",
                                flexDirection: "row",
                            }}
                        >
                            <Icon name={"play"} size={28} />
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        // backgroundColor: "purple",
        flex: 1,
    },
    title: {
        backgroundColor: "",
        marginLeft: 10,
        marginTop: 10,
    },
    keySelectContainer: {
        // backgroundColor: "orange",
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    keySelectDrop: {
        backgroundColor: "lightgray",
        marginRight: 10,
        flexDirection: "row",
        alignItems: "center",
        padding: 7,
        borderRadius: 5,
    },
    quickPlayItems: {
        // backgroundColor: "red",
        flex: 1,
    },
    progressions: {
        // backgroundColor: "teal",
        height: 280,
    },
    progressionStringContainer: {
        padding: 5,
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: "lightgray",
        marginTop: 5,
        marginBottom: 5,
        borderRadius: 5,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    progressionString: {
        fontSize: 22,
    },
    progressionItemIcons: {
        flexDirection: "row",
    },
    playerControls: {
        backgroundColor: "lightgray",
        height: 55,
        borderRadius: 5,
        flexDirection: "row",
        alignItems: "center",
    },
    playerItems: {
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
        height: "100%",
    },
    playerTitles: {
        marginLeft: 10,
    },
});
