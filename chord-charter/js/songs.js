export const songs = {
  "eagle-view-song": {
    key: "D",
    bpm: 136,
    progressions: {
      A: { 
        chords: ["D", "G", "A", "G"],
        rhythm: [true, false, false, true, true, false, true, false],
        modifiers: [ 
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'none' },
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'none' },
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'none' },
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'none' }
        ]
      },
      B: { 
        chords: ["D", "G", "A", "D"],
        rhythm: [true, false, false, true, true, false, true, false],
        modifiers: [ 
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'none' },
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'none' },
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'none' },
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'none' }
        ]
      },
      C: { 
        chords: ["A", "D", "A", "D"],
        rhythm: [true, true, false, true, false, true, true, false],
        modifiers: [ 
          { seventh: true,  second: false, fourth: false, sus: false, majSeventh: false, quality: 'none' },
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'none' },
          { seventh: true,  second: false, fourth: false, sus: false, majSeventh: false, quality: 'none' },
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'none' }
        ]
      },
      D: { 
        chords: ["A", "D", "E", "A"],
        rhythm: [true, true, false, true, false, true, true, true],
        modifiers: [ 
          { seventh: true,  second: false, fourth: false, sus: false, majSeventh: false, quality: 'none' },
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'none' },
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'major'},
          { seventh: true,  second: false, fourth: false, sus: false, majSeventh: false, quality: 'none' }
        ]
      }
    }
  },
  "shake-the-papaya": {
    key: "E",
    bpm: 120,
    progressions: {
      A: { 
        chords: ["E", "F#m", "B", "E"],
        rhythm: [true, true, false, true, true, false, true, false],
        modifiers: [ 
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'none' },
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'none' },
          { seventh: true, second: false, fourth: false, sus: false, majSeventh: false, quality: 'none' },
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'none' }
        ]
      },
      B: { 
        chords: ["", "", "", ""],
        rhythm: Array(8).fill(false),
        modifiers: [ 
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'none' },
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'none' },
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'none' },
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'none' }
        ]
      },
      C: { 
        chords: ["", "", "", ""],
        rhythm: Array(8).fill(false),
        modifiers: [ 
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'none' },
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'none' },
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'none' },
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'none' }
        ]
      },
      D: { 
        chords: ["", "", "", ""],
        rhythm: Array(8).fill(false),
        modifiers: [ 
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'none' },
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'none' },
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'none' },
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'none' }
        ]
      }
    }
  },
  "count-on-me": {
    key: "C",
    bpm: 86,
    progressions: {
      A: { 
        chords: ["C", "Em", "Am", "F"],
        splitVal: ["", "", "G", ""],
        splitActive: [false, false, true, false],
        rhythm: [true, false, false, true, false, true, true, true],
        modifiers: [ 
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'none' },
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'none' },
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'none' },
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'none' }
        ]
      },
      B: { 
        chords: ["C", "Em", "Am", "F"],
        splitVal: ["", "", "G", ""],
        splitActive: [false, false, true, false],
        rhythm: [true, false, false, true, false, true, true, true],
        modifiers: [ 
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'none' },
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'none' },
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'none' },
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'none' }
        ]
      },
      C: { 
        chords: ["C", "Em", "Am", "F"],
        splitVal: ["", "", "G", ""],
        splitActive: [false, false, true, false],
        rhythm: [true, false, false, true, false, true, true, true],
        modifiers: [ 
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'none' },
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'none' },
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'none' },
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'none' }
        ]
      },
      D: { 
        chords: ["Dm", "Em", "F", "G"],
        rhythm: [true, false, false, true, false, true, true, true],
        modifiers: [ 
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'none' },
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'none' },
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'none' },
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'none' }
        ]
      }
    }
  },
  "country-roads": {
    key: "G",
    bpm: 86,
    progressions: {
      A: { 
        chords: ["G", "Em", "D", "C"],
        splitVal: ["", "", "", "G"],
        splitActive: [false, false, false, true],
        rhythm: [true, false, false, true, true, false, true, false],
        modifiers: [ 
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'none' },
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'none' },
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'none' },
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'none' }
        ]
      },
      B: { 
        chords: ["G", "Em", "D", "C"],
        splitVal: ["", "", "", "G"],
        splitActive: [false, false, false, true],
        rhythm: [true, false, false, true, true, false, true, false],
        modifiers: [ 
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'none' },
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'none' },
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'none' },
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'none' }
        ]
      },
      C: { 
        chords: ["G", "D", "Em", "C"],
        rhythm: [true, false, false, true, true, false, true, false],
        modifiers: [ 
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'none' },
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'none' },
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'none' },
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'none' }
        ]
      },
      D: { 
        chords: ["G", "D", "C", "G"],
        rhythm: [true, false, false, true, true, false, true, false],
        modifiers: [ 
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'none' },
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'none' },
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'none' },
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'none' }
        ]
      }
    }
  },
  "yesterday": {
    key: "C",
    bpm: 80,
    progressions: {
      A: { 
        chords: ["F", "Em", "Dm", "Bb"],
        splitVal: ["", "A", "Dm", "C"],
        splitActive: [false, true, true, true],
        rhythm: [true, false, false, true, true, false, true, false],
        modifiers: [ 
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'none' }, // F
          { seventh: true, second: false, fourth: false, sus: false, majSeventh: false, quality: 'minor' }, // Em7
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'minor' }, // Dm
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'none' }  // Bb
        ],
        splitModifiers: [
          {}, // F
          { seventh: true }, // A7
          { seventh: true }, // Dm7
          { seventh: true }  // C7
        ]
      },
      B: { 
        chords: ["F", "Dm", "Bb", "Em"],
        splitVal: ["", "G", "F", "A"],
        splitActive: [false, true, true, true],
        rhythm: [true, false, false, true, true, false, true, false],
        modifiers: [ 
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'none' }, // F
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'minor' }, // Dm
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'none' }, // Bb
          { seventh: true, second: false, fourth: false, sus: false, majSeventh: false, quality: 'minor' }  // Em7
        ],
        splitModifiers: [
          {}, // F
          { seventh: true }, // G7
          {}, // F
          { seventh: true }  // A7
        ]
      },
      C: { 
        chords: ["Dm", "Gm", "F", "Em"],
        splitVal: ["Bb", "C", "", "A"],
        splitActive: [true, true, false, true],
        rhythm: [true, false, false, true, true, false, true, false],
        modifiers: [ 
          { seventh: true, second: false, fourth: false, sus: false, majSeventh: false, quality: 'minor' }, // Dm7
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'minor' }, // Gm
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'none' }, // F
          { seventh: true, second: false, fourth: false, sus: false, majSeventh: false, quality: 'minor' }  // Em7
        ],
        splitModifiers: [
          {}, // Bb
          {}, // C
          {}, // F
          { seventh: true }  // A7
        ]
      },
      D: { 
        chords: ["Dm", "Gm", "F", "F"],
        splitVal: ["Bb", "C", "", ""],
        splitActive: [true, true, false, false],
        rhythm: [true, false, false, true, true, false, true, false],
        modifiers: [ 
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'minor' }, // Dm
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'minor' }, // Gm
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'none' }, // F
          { seventh: false, second: false, fourth: false, sus: false, majSeventh: false, quality: 'none' }  // F
        ],
        splitModifiers: [
          {}, // Bb
          {}, // C
          {}, // F
          {}  // F
        ]
      }
    }
  }
};
