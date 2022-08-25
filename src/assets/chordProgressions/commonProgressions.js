const commonProgressions = {
    amajor: [
        {
            id: 0,
            prog: "I-IV-V A-D-E",
            cIndex: [29, 6, 18, 18],
        },
        {
            id: 1,
            prog: "I-vi-IV-V A-F#m-D-E",
            cIndex: [29, 30, 6, 18],
        },
        {
            id: 2,
            prog: "ii-V-I Bm7-E7-Amaj7",
            cIndex: [15, 16, 17, 17],
        },
    ],
    bmajor: [
        {
            id: 0,
            prog: "I-IV-V B-E-F#",
            cIndex: [31, 18, 33, 33],
        },
        {
            id: 1,
            prog: "I-vi-IV-V B-G#m-E-F#",
            cIndex: [31, 34, 18, 33],
        },
        {
            id: 2,
            prog: "ii-V-I C#m7-F#7-Bmaj7",
            cIndex: [36, 37, 38, 38],
        },
    ],
    cmajor: [
        {
            id: 0,
            prog: "I-IV-V C-F-G",
            cIndex: [5, 8, 2, 2],
        },
        {
            id: 1,
            prog: "I-vi-IV-V C-Am-F-G",
            cIndex: [5, 3, 8, 2],
        },
        {
            id: 2,
            prog: "ii-V-I Dm7-G7-Cmaj7",
            cIndex: [11, 12, 10, 10],
        },
    ],
    dmajor: [
        {
            id: 0,
            prog: "I-IV-V D-G-A",
            cIndex: [6, 2, 29, 29],
        },
        {
            id: 1,
            prog: "I-vi-IV-V D-Bm-G-A",
            cIndex: [6, 4, 2, 29],
        },
        {
            id: 2,
            prog: "ii-V-I Em7-A7-Dmaj7",
            cIndex: [55, 54, 57, 57],
        },
    ],
    emajor: [
        {
            id: 0,
            prog: "I-IV-V E-A-B",
            cIndex: [18, 29, 31, 31],
        },
        {
            id: 1,
            prog: "I-vi-IV-V E-C#m-A-B",
            cIndex: [18, 13, 29, 31],
        },
        {
            id: 2,
            prog: "ii-V-I F#m7-B7-Emaj7",
            cIndex: [52, 50, 51, 51],
        },
    ],
    fmajor: [
        {
            id: 0,
            prog: "I-IV-V F-Bb-C",
            cIndex: [8, 44, 5, 5],
        },
        {
            id: 1,
            prog: "I-vi-IV-V F-Dm-Bb-C",
            cIndex: [8, 45, 44, 5],
        },
        {
            id: 2,
            prog: "ii-V-I Gm7-C7-Fmaj7",
            cIndex: [43, 48, 49, 49],
        },
    ],
    gmajor: [
        {
            id: 0,
            prog: "I-IV-V G-C-D",
            cIndex: [2, 5, 6, 6],
        },
        {
            id: 1,
            prog: "I-vi-IV-V G-Em-C-D",
            cIndex: [2, 0, 5, 6],
        },
        {
            id: 2,
            prog: "ii-V-I Am7-D7-Gmaj7",
            cIndex: [40, 41, 47, 47],
        },
    ],
    aminor: [
        {
            id: 0,
            prog: "i-VI-VII Am-F-G",
            cIndex: [2, 5, 6, 6],
        },
        {
            id: 1,
            prog: "i-iv-VII Am-Dm-G",
            cIndex: [2, 5, 6, 6],
        },
        {
            id: 2,
            prog: "i-iv-v Am-Dm-Em",
            cIndex: [2, 5, 6, 6],
        },
        {
            id: 3,
            prog: "i-VI-III-VII Am-F-C-F",
            cIndex: [2, 5, 6, 6],
        },
        {
            id: 4,
            prog: "ii-v-i Bm7b5-Em-Am",
            cIndex: [2, 5, 6, 6],
        },
    ],
    bminor: [
        {
            id: 0,
            prog: "i-VI-VII Bm-G-A",
            cIndex: [2, 5, 6, 6],
        },
        {
            id: 1,
            prog: "i-iv-VII Bm-Em-A",
            cIndex: [2, 5, 6, 6],
        },
        {
            id: 2,
            prog: "i-iv-v Bm-Em-F#m",
            cIndex: [2, 5, 6, 6],
        },
        {
            id: 3,
            prog: "i-VI-III-VII Bm-G-D-A",
            cIndex: [2, 5, 6, 6],
        },
        {
            id: 4,
            prog: "ii-v-i C#m7b5-F#m-Bm",
            cIndex: [2, 5, 6, 6],
        },
    ],
    cminor: [
        {
            id: 0,
            prog: "i-VI-VII Cm-Ab-Bb",
            cIndex: [2, 5, 6, 6],
        },
        {
            id: 1,
            prog: "i-iv-VII Cm-Fm-Bb",
            cIndex: [2, 5, 6, 6],
        },
        {
            id: 2,
            prog: "i-iv-v Cm-Fm-Gm",
            cIndex: [2, 5, 6, 6],
        },
        {
            id: 3,
            prog: "i-VI-III-VII Cm-Ab-Eb-Bb",
            cIndex: [2, 5, 6, 6],
        },
        {
            id: 4,
            prog: "ii-v-i Dm7b5-Gm-Cm",
            cIndex: [2, 5, 6, 6],
        },
    ],
    dminor: [
        {
            id: 0,
            prog: "i-VI-VII Dm-Bb-C",
            cIndex: [2, 5, 6, 6],
        },
        {
            id: 1,
            prog: "i-iv-VII Dm-Gm-C",
            cIndex: [2, 5, 6, 6],
        },
        {
            id: 2,
            prog: "i-iv-v Dm-Gm-Am",
            cIndex: [2, 5, 6, 6],
        },
        {
            id: 3,
            prog: "i-VI-III-VII Dm-Bb-F-C",
            cIndex: [2, 5, 6, 6],
        },
        {
            id: 4,
            prog: "ii-v-i Em7b5-Am-Dm",
            cIndex: [2, 5, 6, 6],
        },
    ],
    eminor: [
        {
            id: 0,
            prog: "i-VI-VII Em-C-D",
            cIndex: [0, 5, 6, 6],
        },
        {
            id: 1,
            prog: "i-iv-VII Em-Am-D",
            cIndex: [0, 3, 6, 6],
        },
        {
            id: 2,
            prog: "i-iv-V Em-Am-Bm",
            cIndex: [0, 3, 4, 4],
        },
        {
            id: 3,
            prog: "i-VI-III-VII Em-C-G-D",
            cIndex: [0, 5, 2, 6],
        },
        {
            id: 4,
            prog: "ii-V-i F#m7b5-Bm-Em",
            cIndex: [53, 4, 0, 0],
        },
    ],
    fminor: [
        {
            id: 0,
            prog: "i-VI-VII Fm-Db-Eb",
            cIndex: [2, 5, 6, 6],
        },
        {
            id: 1,
            prog: "i-iv-VII Fm-Bbm-Eb",
            cIndex: [2, 5, 6, 6],
        },
        {
            id: 2,
            prog: "i-iv-v Fm-Bbm-Cm",
            cIndex: [2, 5, 6, 6],
        },
        {
            id: 3,
            prog: "i-VI-III-VII Fm-Db-Ab-Eb",
            cIndex: [2, 5, 6, 6],
        },
        {
            id: 4,
            prog: "ii-v-i Gm7b5-Cm-Fm",
            cIndex: [2, 5, 6, 6],
        },
    ],
    gminor: [
        {
            id: 0,
            prog: "i-VI-VII Gm-Eb-F",
            cIndex: [2, 5, 6, 6],
        },
        {
            id: 1,
            prog: "i-iv-VII Gm-Cm-F",
            cIndex: [2, 5, 6, 6],
        },
        {
            id: 2,
            prog: "i-iv-v Gm-Cm-Dm",
            cIndex: [2, 5, 6, 6],
        },
        {
            id: 3,
            prog: "i-VI-III-VII Gm-Eb-Bb-F",
            cIndex: [2, 5, 6, 6],
        },
        {
            id: 4,
            prog: "ii-v-i Am7b5-Dm-Gm",
            cIndex: [2, 5, 6, 6],
        },
    ],
};

export default commonProgressions;
