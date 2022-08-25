import React, { Component } from "react";
import { View, Button } from "react-native";
import { Audio, InterruptionModeIOS } from "expo-av";
import { useFocusEffect } from "@react-navigation/native";

// const ALLCHORDS = [
//     require("../assets/sounds/eminor/em.mp3"), // 0
//     require("../assets/sounds/eminor/fsharpdim.mp3"), // 1
//     require("../assets/sounds/eminor/g.mp3"), // 2
//     require("../assets/sounds/eminor/am.mp3"), // 3
//     require("../assets/sounds/eminor/bm.mp3"), // 4
//     require("../assets/sounds/eminor/c.mp3"), // 5
//     require("../assets/sounds/eminor/d.mp3"), // 6
//     require("../assets/sounds/eminor/bm.mp3"), // 7
//     require("../assets/sounds/cmajor/f.mp3"), // 8
//     require("../assets/sounds/cmajor/bdim.mp3"), // 9
//     require("../assets/sounds/cmajor/cmaj7.mp3"), // 10
//     require("../assets/sounds/cmajor/dm7.mp3"), // 11
//     require("../assets/sounds/cmajor/g7.mp3"), // 12
// ];

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
        Audio.setAudioModeAsync({
            staysActiveInBackground: true,
            interruptionModeIOS: InterruptionModeIOS.DoNotMix,
            playsInSilentModeIOS: true,
        });
        console.log("component mounted");
        this.loadNewPlaybackInstance(false);
        console.log("CREATE");
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
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Button
                    onPress={this.onPlayPause}
                    title="play progression"
                    color="tomato"
                />
            </View>
        );
    }
}
