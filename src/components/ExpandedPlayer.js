import React, { Component } from "react";
import {
    View,
    Button,
    StyleSheet,
    SafeAreaView,
    Text,
    TouchableOpacity,
} from "react-native";
import { Audio, InterruptionModeIOS } from "expo-av";
import { useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";

const loading_string = "... loading ...";
const buffering_string = "... buffering ...";

export default class CreateProg extends React.Component {
    constructor(props) {
        super(props);
        this.index = 0;
        this.playbackInstance = null;
        this.state = {
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
        };
    }

    componentDidMount() {
        console.log("Expanded Play");
    }

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

    render() {
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
                                {this.currentTitle}
                            </Text>
                            <Text>{/*subTitle*/}</Text>
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
    }
}

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
