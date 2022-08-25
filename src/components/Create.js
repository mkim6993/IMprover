import React, { useState, useEffect } from "react";
import { View, Text, Button } from "react-native";
import { Audio, InterruptionModeIOS } from "expo-av";

class ChordItem {
    constructor(name, path) {
        this.name = name;
        this.path = path;
    }
}

const allChords = [
    new ChordItem("Paul - extra", require("../assets/sounds/extra.m4a")),
    new ChordItem("NYC - train", require("../assets/sounds/subway.m4a")),
];

const loading_string = "... loading ...";
const buffering_string = "... buffering ...";

const Create = () => {
    const [index, setIndex] = useState(0);
    const [rate, setRate] = useState(0.0);
    const [volume, setVolume] = useState(1.0);
    const [muted, setMuted] = useState(false);
    const [looping, setLooping] = useState(false);
    const [playbackInstanceInfo, setPBII] = useState({
        playbackInstancePosition: null,
        playbackInstanceDuration: null,
    });
    const [shouldplay, setShouldPlay] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    

    const [sound, setSound] = useState();
    const [playbackInstance, setPlaybackInstance] = useState(null);

    // set audio settings
    function componentDidMount() {
        Audio.setAudioModeAsync({
            staysActiveInBackground: true,
            interruptionModeIOS: InterruptionModeIOS.DoNotMix,
            playsInSilentModeIOS: true,
        });
    }

    // loading new playback instance
    async function loadNewPlaybackInstance(playing) {
        if (playbackInstance != null) {
            await playbackInstance.unloadAsync();
            playbackInstance = null;
        }

        // set path for chord
        const source = { path: allChords[index].path };
        const initialStatus = {
            shouldPlay: playing,
            rate: rate,
            shouldCorrectPitch: true,
            volume: volume,
            isMuted: muted,
            isLooping: looping,
        };

        const { sound } = await Audio.Sound.createAsync(source, initialStatus);
    }

    const onPlaybackStatusUpdate = (status) => {
        if (status.isLoaded) {
        }
    };

    async function playSound() {
        console.log("Loading Sound");
        const { sound } = await Audio.Sound.createAsync(arr[0]);

        sound.setRateAsync(3.5, true, Audio.PitchCorrectionQuality.Low);

        setSound(sound);

        console.log("playing sounds");
        await sound.playAsync();
    }

    useEffect(() => {
        return sound
            ? () => {
                  console.log("unloading sound");
                  sound.unloadAsync();
              }
            : undefined;
    }, [sound]);

    return (
        <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
            <Button onPress={playSound} title="play" color="tomato" />
        </View>
    );
};

export default Create;
