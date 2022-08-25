import React, { Component, useState } from "react";
import {
    View,
    Button,
    StyleSheet,
    Text,
    SafeAreaView,
    FlatList,
    TouchableOpacity,
    ScrollView,
    Animated,
} from "react-native";
import { Audio, InterruptionModeIOS } from "expo-av";
import Icon from "react-native-vector-icons/Ionicons";
import Modal from "react-native-modal";
import commonProgressions from "../assets/chordProgressions/commonProgressions.js";
import ALLCHORDS from "../assets/sounds/ALLCHORDS.js";
import chordsInKey from "../assets/chordsInKey.js";
import Chord from "./Chord.js";
import ChordinBuilder from "./ChordinBuilder.js";
import Item from "./ChordProgression.js";
import ActionSheet from "./ActionSheet.js";

const loading_string = "... loading ...";
const buffering_string = "... buffering ...";

var isHidden = true;

export default class QuickPlay extends React.Component {
    initial = true;
    currKey = "cmajor";
    keyDATA = commonProgressions.cmajor;
    keyChords = chordsInKey.cmajor;
    index = 0;
    playbackInstance = null;
    showPlayer = false;
    progOrChord = true; // is playback instance playing demo progression or chord
    builderIndex = 0; // index of ALLCHORDS for progression builder
    state = {
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
        rate: 2.0,
        demoProgression: [], // selected common progressions are placed in here
        playPause: false,
        bounceValue: new Animated.Value(1000), // initial position of player control
        progIndex: 0, // index of progression playing specific key
        chordPlayIndex: -1,
        changeKeySetting: false,
        progressionBuilder: [], // arr of audio source for progression builder
        builderPlaying: false, // is the builder playing?
    };

    componentDidMount() {
        Audio.setAudioModeAsync({
            staysActiveInBackground: true,
            interruptionModeIOS: InterruptionModeIOS.DoNotMix,
            playsInSilentModeIOS: true,
        });
        console.log("component mounted");
        this.loadDemoPlaybackInstance(false);
        console.log("QUICKPLAY");
    }

    /**
     * Change keys
     * @param {*} keyString
     */
    // show player
    changeKey(keyString) {
        this.currKey = keyString;
        if (keyString == "cmajor") {
            this.keyDATA = commonProgressions.cmajor;
            this.keyChords = chordsInKey.cmajor;
        } else if (keyString == "eminor") {
            this.keyDATA = commonProgressions.eminor;
            this.keyChords = chordsInKey.eminor;
        } else if (keyString == "amajor") {
            this.keyDATA = commonProgressions.amajor;
            this.keyChords = chordsInKey.amajor;
        } else if (keyString == "bmajor") {
            this.keyDATA = commonProgressions.bmajor;
            this.keyChords = chordsInKey.bmajor;
        } else if (keyString == "fmajor") {
            this.keyDATA = commonProgressions.fmajor;
            this.keyChords = chordsInKey.fmajor;
        } else if (keyString == "gmajor") {
            this.keyDATA = commonProgressions.gmajor;
            this.keyChords = chordsInKey.gmajor;
        } else if (keyString == "emajor") {
            this.keyDATA = commonProgressions.emajor;
            this.keyChords = chordsInKey.emajor;
        } else if (keyString == "dmajor") {
            this.keyDATA = commonProgressions.dmajor;
            this.keyChords = chordsInKey.dmajor;
        }
        this.setState({ changeKeySetting: false });
    }

    /**
     * PLAYER CONTROLS DISPLAY
     */
    // show/hide expanded player controller
    togglePlayerControl() {
        var toValue = 1000;
        if (isHidden) {
            toValue = 0;
        }
        // animate the translateY of subview between 0 and 100
        Animated.spring(this.state.bounceValue, {
            toValue: toValue,
            velocity: 30,
            tension: 10,
            friction: 6,
            useNativeDriver: true,
        }).start();
        isHidden = !isHidden;
    }

    // show hide small player controller
    togglePlayerDisplay() {
        this.showPlayer = true;
    }

    // play next chord progression
    nextProgression() {
        let len = this.keyDATA.length - 1;
        if (this.state.progIndex == len) {
            this.setState({ progIndex: 0 });
            this.onPressTitle(this.keyDATA[0].prog, 0, 0);
        } else {
            let curr = this.state.progIndex + 1;
            this.setState({ progIndex: curr });
            this.onPressTitle(this.keyDATA[curr].prog, curr, 0);
        }
    }

    // play previous chord progression
    previousProgression() {
        let len = this.keyDATA.length - 1;
        if (this.state.progIndex == 0) {
            this.setState({ progIndex: len });
            this.onPressTitle(this.keyDATA[len].prog, len, 0);
        } else {
            let curr = this.state.progIndex - 1;
            this.setState({ progIndex: curr });
            this.onPressTitle(this.keyDATA[curr].prog, curr, 0);
        }
    }

    // show hide key setting window
    toggleKeyChange() {
        console.log("toggle");
        this.setState({ changeKeySetting: !this.state.changeKeySetting });
    }

    onPlayPause = () => {
        console.log("PLAY OR PAUSE");
        if (this.playbackInstance != null) {
            if (this.state.isPlaying) {
                if (this.progOrChord == false) {
                    this.playbackInstance.stopAsync();
                    this.setState({ playPause: false });
                } else {
                    this.playbackInstance.pauseAsync();
                    this.setState({ playPause: false });
                }
            } else {
                this.playbackInstance.playAsync();
                this.setState({ playPause: true });
            }
        }
    };

    onStop = () => {
        console.log("STOPPED");
        if (this.playbackInstance != null) {
            this.playbackInstance.stopAsync();
        }
    };

    /**
     * METHODS TO SAMPLE DEMOS
     */

    // Load demo playback instance given that this.state.demoProgression arr exists
    async loadDemoPlaybackInstance(playing) {
        console.log("LOAD DEMO PLAYBACK INSTANCE");
        if (this.playbackInstance != null) {
            this.initial = false;
            await this.playbackInstance.unloadAsync();
            this.playbackInstance = null;
            console.log("UNLOADED PLAYBACK INSTANCE FOR DEMO");
        }

        const initialStatus = {
            shouldPlay: playing,
            rate: this.state.rate,
            shouldCorrectPitch: true,
            volume: this.state.volume,
            isMuted: this.state.muted,
        };

        var sourceIndex = -1;

        if (this.initial == true) {
            // initial playbackinstance not loaded(start)
            sourceIndex = 0;
        } else {
            // if initial playbackinstance is loaded
            if (this.state.builderPlaying) {
                sourceIndex =
                    this.state.progressionBuilder[this.builderIndex].index;
            } else {
                if (this.progOrChord) {
                    sourceIndex = this.state.demoProgression[this.index];
                } else {
                    sourceIndex = this.state.chordPlayIndex;
                }
            }
        }

        // takes index from progression and uses to reference index of chord in ALLCHORDS
        const { sound, status } = await Audio.Sound.createAsync(
            ALLCHORDS[sourceIndex],
            initialStatus,
            this._onDemoPlaybackStatusUpdate
        );

        await sound.setRateAsync(
            this.state.rate,
            true,
            Audio.PitchCorrectionQuality.High
        );

        this.playbackInstance = sound;
    }

    // update state related to playback instance status
    _onDemoPlaybackStatusUpdate = (status) => {
        console.log("DEMO PLAYBACK STATUS UPDATE");
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
                if (this.state.builderPlaying) {
                    this._advanceBuilderIndex(true);
                } else {
                    this._advanceDemoIndex(true);
                }
                this._updateDemoPlaybackInstanceForIndex(true);
            }
        } else {
            if (status.error) {
                console.log("error: " + status.error);
            }
        }
    };

    // advance builer player array index
    _advanceBuilderIndex(forward) {
        this.builderIndex =
            (this.builderIndex +
                (forward ? 1 : this.state.progressionBuilder - 1)) %
            this.state.progressionBuilder.length;
    }

    // advance player array index
    _advanceDemoIndex(forward) {
        console.log("ADVANCE DEMO PROGRESSION");
        this.index =
            (this.index + (forward ? 1 : this.state.demoProgression - 1)) %
            this.state.demoProgression.length;
    }

    // update playback player
    async _updateDemoPlaybackInstanceForIndex(playing) {
        console.log("UPDATE DEMO PLAYBACK INSTANCE FOR INDEX");
        this.loadDemoPlaybackInstance(playing);
    }

    // change title displayed in player control, handle onPress when player is playing/notplaying
    onPressTitle = (title, progIndex, playType) => {
        this.togglePlayerDisplay();
        this.setState({ builderPlaying: false });
        try {
            if (playType == 0) {
                this.progOrChord = true;
                this.setState({ progIndex: progIndex });
                // resets the index if another progression is selected
                if (title == this.state.playerTitle) {
                    if (this.state.isPlaying) {
                        this.playbackInstance.pauseAsync();
                        this.index = 0;
                        this.setState({ playPause: true }, async () => {
                            await this.loadDemoPlaybackInstance(false);
                            this.playbackInstance.playAsync();
                        });
                    } else {
                        this.index = 0;
                        this.setState({ playPause: true }, async () => {
                            await this.loadDemoPlaybackInstance(false);
                            this.playbackInstance.playAsync();
                        });
                    }
                } else {
                    if (this.state.isPlaying) {
                        this.playbackInstance.pauseAsync();
                        this.index = 0;
                        this.setState(
                            {
                                playerTitle: title,
                                subTitle: "Key of " + this.currKey,
                                demoProgression: this.keyDATA[progIndex].cIndex,
                            },
                            async () => {
                                await this.loadDemoPlaybackInstance(false);
                                this.playbackInstance.playAsync();
                                this.setState({ playPause: true });
                            }
                        );
                    } else if (this.state.playerTitle != "") {
                        this.index = 0;
                        this.setState(
                            {
                                playerTitle: title,
                                subTitle: "Key of " + this.currKey,
                                demoProgression: this.keyDATA[progIndex].cIndex,
                            },
                            async () => {
                                await this.loadDemoPlaybackInstance(false);
                                this.playbackInstance.playAsync();
                                this.setState({ playPause: true });
                            }
                        );
                    } else {
                        this.setState(
                            {
                                playerTitle: title,
                                subTitle: "Key of " + this.currKey,
                                demoProgression: this.keyDATA[progIndex].cIndex,
                            },
                            async () => {
                                await this.loadDemoPlaybackInstance(false);
                                this.playbackInstance.playAsync();
                                this.setState({ playPause: true });
                            }
                        );
                    }
                }
            } else if (playType == 1) {
                this.progOrChord = false;
                this.setState({ chordPlayIndex: progIndex[0] });
                if (title == this.state.playerTitle) {
                    this.setState({ playPause: true }, async () => {
                        this.playbackInstance.pauseAsync();
                        await this.loadDemoPlaybackInstance(false);
                        this.playbackInstance.playAsync();
                    });
                } else {
                    // if different chord is select than the one currently playing
                    if (this.state.isPlaying) {
                        this.setState(
                            {
                                playerTitle: title,
                                subTitle: "Key of " + this.currKey,
                            },
                            async () => {
                                this.playbackInstance.pauseAsync();
                                await this.loadDemoPlaybackInstance(false);
                                this.playbackInstance.playAsync();
                                this.setState({ playPause: true });
                            }
                        );
                    } else {
                        this.setState(
                            {
                                playerTitle: title,
                                subTitle: "Key of " + this.currKey,
                            },
                            async () => {
                                await this.loadDemoPlaybackInstance(false);
                                this.playbackInstance.playAsync();
                                this.setState({ playPause: true });
                            }
                        );
                    }
                }
            }
        } catch (err) {
            console.log("error onpressTitle:", err);
        }
    };

    // TRACK BUILDER CONTROLS
    async playBuilder() {
        console.log("builder play");
        try {
            if (this.state.progressionBuilder.length) {
                await this.setState({ builderPlaying: true }, async () => {
                    await this.loadDemoPlaybackInstance(false);
                    this.playbackInstance.playAsync();
                });
            }
        } catch (err) {
            console.log("error in playBuilder:", err);
        }
    }

    async pauseBuilder() {
        try {
            await this.setState({ builderPlaying: false }, () =>
                this.playbackInstance.pauseAsync()
            );
        } catch (err) {
            console.log("error in pauseBuilder:", err);
        }
    }

    // render flatlist item Common Progressions
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

    // add chord progression to track
    onPressAdd = (chordsInKeyIndex) => {
        // if (this.state.builderPlaying) {
        //     this.playbackInstance.pauseAsync();
        // }
        console.log("add", chordsInKeyIndex);
        const chordToBeAdded = this.keyChords[chordsInKeyIndex];
        this.setState(
            {
                progressionBuilder: [
                    ...this.state.progressionBuilder,
                    chordToBeAdded,
                ],
            },
            () => {
                console.log(this.state.progressionBuilder);
            }
        );
    };

    //key generator
    makeID() {
        var text = "";
        var possible =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < 8; i++) {
            text += possible.charAt(
                Math.floor(Math.random() * possible.length)
            );
        }
        console.log(text);
        return text;
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Icon
                        name={"person-outline"}
                        size={25}
                        style={styles.profileIcon}
                    />
                    <TouchableOpacity
                        style={styles.keySelectContainer}
                        onPress={() => this.toggleKeyChange()}
                    >
                        <View style={styles.keySelectDrop}>
                            <Icon name={"sunny"} size={10} color="white" />
                            <Text style={{ fontSize: 15, color: "white" }}>
                                {"  "}
                                {this.currKey}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <Modal isVisible={this.state.changeKeySetting}>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "flex-end",
                            marginRight: 10,
                        }}
                    >
                        <Button
                            title="Back"
                            onPress={() => this.toggleKeyChange()}
                        />
                    </View>

                    <View style={styles.keyContainer}>
                        <Text style={styles.keyClass}>Major</Text>
                        <ScrollView>
                            <TouchableOpacity
                                style={styles.keyOptions}
                                onPress={() => this.changeKey("bmajor")}
                            >
                                <Text>B major</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.keyOptions}>
                                <Text>Bb major x</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.keyOptions}
                                onPress={() => this.changeKey("amajor")}
                            >
                                <Text>A major</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.keyOptions}>
                                <Text>Ab major x</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.keyOptions}
                                onPress={() => this.changeKey("gmajor")}
                            >
                                <Text>G major</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.keyOptions}>
                                <Text>Gb major x</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.keyOptions}>
                                <Text>F# major x</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.keyOptions}
                                onPress={() => this.changeKey("fmajor")}
                            >
                                <Text>F major</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.keyOptions}
                                onPress={() => this.changeKey("emajor")}
                            >
                                <Text>E major</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.keyOptions}>
                                <Text>Eb major x</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.keyOptions}
                                onPress={() => this.changeKey("dmajor")}
                            >
                                <Text>D major</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.keyOptions}>
                                <Text>Db major x</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.keyOptions}>
                                <Text>C# major x</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.keyOptions}
                                onPress={() => this.changeKey("cmajor")}
                            >
                                <Text>C major</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.keyOptions}>
                                <Text>Cb major x</Text>
                            </TouchableOpacity>
                        </ScrollView>
                        <Text style={[styles.keyClass, { marginTop: 5 }]}>
                            Minor
                        </Text>
                        <ScrollView>
                            <TouchableOpacity style={styles.keyOptions}>
                                <Text>B minor</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.keyOptions}>
                                <Text>Bb minor</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.keyOptions}>
                                <Text>A# minor</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.keyOptions}>
                                <Text>A minor</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.keyOptions}>
                                <Text>Ab minor</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.keyOptions}>
                                <Text>G# minor</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.keyOptions}>
                                <Text>G minor</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.keyOptions}>
                                <Text>F# minor</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.keyOptions}>
                                <Text>F minor</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.keyOptions}
                                onPress={() => this.changeKey("eminor")}
                            >
                                <Text>E minor</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.keyOptions}>
                                <Text>Eb minor</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.keyOptions}>
                                <Text>D# minor</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.keyOptions}>
                                <Text>D minor</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.keyOptions}>
                                <Text>C# minor</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.keyOptions}>
                                <Text>C minor</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </Modal>
                <Animated.View
                    style={[
                        styles.playerControlView,
                        { transform: [{ translateY: this.state.bounceValue }] },
                    ]}
                >
                    <View style={styles.upperHeader}>
                        <TouchableOpacity
                            style={{ padding: 10 }}
                            onPress={() => this.togglePlayerControl()}
                        >
                            <Icon name={"chevron-down-sharp"} size={30} />
                        </TouchableOpacity>

                        <Text style={{ fontWeight: "bold" }}>
                            Progression in the {this.state.subTitle}
                        </Text>
                        <Text>{this.state.progIndex}</Text>
                        <TouchableOpacity style={{ padding: 10 }}>
                            <Icon name={"ellipsis-vertical-sharp"} size={23} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.body}>
                        <Text>Controls</Text>
                    </View>
                    <View style={styles.playerController}>
                        <View style={styles.titlesAndSave}>
                            <View>
                                <Text
                                    style={{ fontSize: 20, fontWeight: "bold" }}
                                >
                                    {this.state.playerTitle}
                                </Text>
                                <Text>{this.state.subTitle}</Text>
                            </View>
                            <View>
                                <Icon name={"heart-outline"} size={30} />
                            </View>
                        </View>
                        <View style={styles.playerNavigation}>
                            <TouchableOpacity
                                onPress={() => this.previousProgression()}
                            >
                                <Icon name={"play-skip-back-sharp"} size={40} />
                            </TouchableOpacity>

                            <View
                                style={{
                                    padding: 5,
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    paddingLeft: 10,
                                    marginHorizontal: 20,
                                }}
                            >
                                <TouchableOpacity
                                    onPress={() => this.onPlayPause()}
                                >
                                    {this.state.playPause ? (
                                        <Icon
                                            name={"pause-circle-sharp"}
                                            size={70}
                                        />
                                    ) : (
                                        <Icon
                                            name={"play-circle-sharp"}
                                            size={70}
                                        />
                                    )}
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity
                                onPress={() => this.nextProgression()}
                            >
                                <Icon
                                    name={"play-skip-forward-sharp"}
                                    size={40}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>
                <View style={styles.quickPlayItems}>
                    <View style={styles.builder}>
                        <ScrollView
                            style={styles.trackBuilder}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            ref={(ref) => {
                                this.scrollView = ref;
                            }}
                            onContentSizeChange={() =>
                                this.scrollView.scrollToEnd({ animated: true })
                            }
                        >
                            {this.state.progressionBuilder.map((chord) => (
                                <ChordinBuilder
                                    key={this.makeID()}
                                    title={chord.name}
                                    index={chord.index}
                                />
                            ))}
                        </ScrollView>
                        <View style={styles.builderControls}>
                            <TouchableOpacity>
                                <Icon
                                    name={"play-skip-back"}
                                    size={30}
                                    color="white"
                                />
                            </TouchableOpacity>
                            {this.state.builderPlaying ? (
                                <TouchableOpacity
                                    onPress={() => this.pauseBuilder()}
                                >
                                    <Icon
                                        name={"pause"}
                                        size={30}
                                        color="white"
                                    />
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity
                                    onPress={() => this.playBuilder()}
                                >
                                    <Icon
                                        name={"play"}
                                        size={30}
                                        color="white"
                                    />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                    <Text
                        style={{
                            marginLeft: 20,
                            marginBottom: 10,
                            marginTop: 5,
                        }}
                    >
                        COMMON CHORD PROGRESSIONS
                    </Text>
                    <View style={styles.progressions}>
                        <FlatList
                            horizontal
                            data={this.keyDATA}
                            renderItem={this.renderItem}
                            keyExtractor={(item) => item.id}
                            showsHorizontalScrollIndicator={false}
                        />
                    </View>
                    {/* <Text style={{ marginLeft: 10 }}>chords</Text>
                    <View style={styles.chords}>
                        {this.keyChords.map((chord) => (
                            <Chord
                                title={chord.name}
                                index={chord.index}
                                onPressTitle={this.onPressTitle}
                                onPressAdd={this.onPressAdd}
                                key={chord.id}
                                chordsInKeyIndex={chord.arrIndex}
                            />
                        ))}
                    </View> */}
                    <ActionSheet
                        keyChords={this.keyChords}
                        onPressTitle={this.onPressTitle}
                        onPressAdd={this.onPressAdd}
                    />
                </View>

                {this.showPlayer ? (
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
                                onPress={() => this.togglePlayerControl()}
                            >
                                <Icon
                                    name={"musical-notes-outline"}
                                    size={25}
                                />
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
                                onPress={() => this.onPlayPause()}
                            >
                                {this.state.playPause ? (
                                    <Icon name={"pause"} size={28} />
                                ) : (
                                    <Icon name={"play"} size={28} />
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <></>
                )}
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        flex: 1,
    },
    header: {
        backgroundColor: "white",
        flex: 0.12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    profileIcon: {
        marginLeft: 20,
    },
    keySelectContainer: {
        // backgroundColor: "orange",
        flexDirection: "row",
        justifyContent: "flex-end",
        marginRight: 20,
    },
    keySelectDrop: {
        backgroundColor: "#1E2246",
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    quickPlayItems: {
        backgroundColor: "white",
        flex: 1,
    },
    progressions: {
        height: "10%",
        marginHorizontal: 10,
        // backgroundColor: "purple",
    },
    chords: {
        height: "35%",
        flexDirection: "column",
        justifyContent: "center",
        flexWrap: "wrap",
        marginLeft: 25,
    },
    chordsContainer: {
        padding: 5,
        marginHorizontal: 5,
        backgroundColor: "lightgray",
        marginTop: 5,
        marginBottom: 5,
        borderRadius: 5,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    progressionItemIcons: {
        flexDirection: "row",
    },
    playerControls: {
        backgroundColor: "white",
        height: 90,
        borderRadius: 5,
        flexDirection: "row",
        alignItems: "flex-start",
        position: "absolute",
        bottom: 0,
    },
    playerItems: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        backgroundColor: "white",
        marginTop: 10,
    },
    playerTitles: {
        marginLeft: 10,
    },
    keyOptions: {
        backgroundColor: "lightgray",
        marginVertical: 5,
        padding: 10,
        borderRadius: 5,
    },
    keyContainer: {
        height: "80%",
        padding: 10,
    },
    keyClass: {
        color: "white",
        marginBottom: 5,
        fontSize: 15,
        fontWeight: "bold",
        textAlign: "center",
    },
    playerControlView: {
        backgroundColor: "white",
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "100%",
        zIndex: 3,
    },
    upperHeader: {
        // backgroundColor: "red",
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        flex: 0.75,
        paddingRight: 10,
        paddingLeft: 10,
    },
    body: {
        // backgroundColor: "yellow",
        flex: 5,
    },
    playerController: {
        // backgroundColor: "green",
        flex: 1.5,
    },
    titlesAndSave: {
        // backgroundColor: "orange",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        alignItems: "center",
    },
    playerNavigation: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        // backgroundColor: "pink",
        flex: 1,
        paddingBottom: 20,
    },
    builder: {
        backgroundColor: "#2F3036",
        height: "30%",
        flexDirection: "column",
        alignItems: "flex-start",
        paddingTop: "8%",
        marginBottom: 14,
    },
    trackBuilder: {
        // backgroundColor: "#F0F5ED",
        width: "100%",
        flexDirection: "row",
        paddingLeft: 5,
        paddingRight: 10,
    },
    builderControls: {
        backgroundColor: "#2F3036",
        // backgroundColor: "red",
        marginTop: 1,
        width: "50%",
        height: "20%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
        marginBottom: 20,
        marginTop: 10,
    },
    touchableChord: {
        height: "100%",
        flexDirection: "row",
        alignItems: "center",
        padding: 1,
        borderRadius: 5,
    },
});
