import { waveforms, keyMap } from './config.js';

export const appState = {
  // Playback State
  isPlaying: false,
  rhythmInterval: null,
  slotHighlightStep: 0,
  pictureHighlightStep: 0,
  rhythmStep: 0,
  beatEnabled: true, // New: Replaces brushSoundEnabled, default is ON
  swingEnabled: false, // New: For future use

  // Musical Context
  currentWaveformIndex: 0,
  get currentWaveform() {
    return waveforms[this.currentWaveformIndex];
  },
  currentKeyIndex: 0,
  currentDisplayKey: 'C',
  get musicalKey() {
    return keyMap[this.currentDisplayKey][this.currentScale.replace(' ', '')] || keyMap[this.currentDisplayKey].Major;
  },
  availableScales: ['Major', 'Natural Minor'],
  currentScale: 'Major',
  
  // Progression Management
  currentToggle: 'A',
  slotIds: ['slot0', 'slot1', 'slot2', 'slot3'],
  progressionLinkStates: { 'A': false, 'B': false, 'C': false, 'D': false },
  linkedProgressionSequence: [],
  currentLinkedProgressionIndex: 0,

  // Time Signature
  currentTimeSignatureIndex: 0,

  // --- Progression Data ---
  // A
  progressionA: ['', '', '', ''],
  rhythmBoxesA: Array(10).fill(false),
  seventhA: Array(4).fill(false),
  sixthA: Array(4).fill(false),
  secondA: Array(4).fill(false),
  fourthA: Array(4).fill(false),
  susA: Array(4).fill(false),
  majSeventhA: Array(4).fill(false),
  augA: Array(4).fill('none'),
  majorA: Array(4).fill('none'),
  splitChordActiveA: Array(4).fill(false),
  splitChordValueA: ['', '', '', ''],
  splitSeventhA: Array(4).fill(false),
  splitSixthA: Array(4).fill(false),
  splitSecondA: Array(4).fill(false),
  splitFourthA: Array(4).fill(false),
  splitSusA: Array(4).fill(false),
  splitMajSeventhA: Array(4).fill(false),
  splitAugA: Array(4).fill('none'),
  splitMajorA: Array(4).fill('none'),

  // B
  progressionB: ['', '', '', ''],
  rhythmBoxesB: Array(10).fill(false),
  seventhB: Array(4).fill(false),
  sixthB: Array(4).fill(false),
  secondB: Array(4).fill(false),
  fourthB: Array(4).fill(false),
  susB: Array(4).fill(false),
  majSeventhB: Array(4).fill(false),
  augB: Array(4).fill('none'),
  majorB: Array(4).fill('none'),
  splitChordActiveB: Array(4).fill(false),
  splitChordValueB: ['', '', '', ''],
  splitSeventhB: Array(4).fill(false),
  splitSixthB: Array(4).fill(false),
  splitSecondB: Array(4).fill(false),
  splitFourthB: Array(4).fill(false),
  splitSusB: Array(4).fill(false),
  splitMajSeventhB: Array(4).fill(false),
  splitAugB: Array(4).fill('none'),
  splitMajorB: Array(4).fill('none'),

  // C
  progressionC: ['', '', '', ''],
  rhythmBoxesC: Array(10).fill(false),
  seventhC: Array(4).fill(false),
  sixthC: Array(4).fill(false),
  secondC: Array(4).fill(false),
  fourthC: Array(4).fill(false),
  susC: Array(4).fill(false),
  majSeventhC: Array(4).fill(false),
  augC: Array(4).fill('none'),
  majorC: Array(4).fill('none'),
  splitChordActiveC: Array(4).fill(false),
  splitChordValueC: ['', '', '', ''],
  splitSeventhC: Array(4).fill(false),
  splitSixthC: Array(4).fill(false),
  splitSecondC: Array(4).fill(false),
  splitFourthC: Array(4).fill(false),
  splitSusC: Array(4).fill(false),
  splitMajSeventhC: Array(4).fill(false),
  splitAugC: Array(4).fill('none'),
  splitMajorC: Array(4).fill('none'),

  // D
  progressionD: ['', '', '', ''],
  rhythmBoxesD: Array(10).fill(false),
  seventhD: Array(4).fill(false),
  sixthD: Array(4).fill(false),
  secondD: Array(4).fill(false),
  fourthD: Array(4).fill(false),
  susD: Array(4).fill(false),
  majSeventhD: Array(4).fill(false),
  augD: Array(4).fill('none'),
  majorD: Array(4).fill('none'),
  splitChordActiveD: Array(4).fill(false),
  splitChordValueD: ['', '', '', ''],
  splitSeventhD: Array(4).fill(false),
  splitSixthD: Array(4).fill(false),
  splitSecondD: Array(4).fill(false),
  splitFourthD: Array(4).fill(false),
  splitSusD: Array(4).fill(false),
  splitMajSeventhD: Array(4).fill(false),
  splitAugD: Array(4).fill('none'),
  splitMajorD: Array(4).fill('none'),
};

export function getProgressionData(progLetter) {
  switch(progLetter) {
    case 'A': return { p: appState.progressionA, r: appState.rhythmBoxesA, s7: appState.seventhA, s6: appState.sixthA, s2: appState.secondA, s4: appState.fourthA, sus: appState.susA, aug: appState.augA, maj7: appState.majSeventhA, m: appState.majorA, splitActive: appState.splitChordActiveA, splitVal: appState.splitChordValueA, splitS7: appState.splitSeventhA, splitS6: appState.splitSixthA, splitS2: appState.splitSecondA, splitS4: appState.splitFourthA, splitSus: appState.splitSusA, splitMaj7: appState.splitMajSeventhA, splitAug: appState.splitAugA, splitM: appState.splitMajorA };
    case 'B': return { p: appState.progressionB, r: appState.rhythmBoxesB, s7: appState.seventhB, s6: appState.sixthB, s2: appState.secondB, s4: appState.fourthB, sus: appState.susB, aug: appState.augB, maj7: appState.majSeventhB, m: appState.majorB, splitActive: appState.splitChordActiveB, splitVal: appState.splitChordValueB, splitS7: appState.splitSeventhB, splitS6: appState.splitSixthB, splitS2: appState.splitSecondB, splitS4: appState.splitFourthB, splitSus: appState.splitSusB, splitMaj7: appState.splitMajSeventhB, splitAug: appState.splitAugB, splitM: appState.splitMajorB };
    case 'C': return { p: appState.progressionC, r: appState.rhythmBoxesC, s7: appState.seventhC, s6: appState.sixthC, s2: appState.secondC, s4: appState.fourthC, sus: appState.susC, aug: appState.augC, maj7: appState.majSeventhC, m: appState.majorC, splitActive: appState.splitChordActiveC, splitVal: appState.splitChordValueC, splitS7: appState.splitSeventhC, splitS6: appState.splitSixthC, splitS2: appState.splitSecondC, splitS4: appState.splitFourthC, splitSus: appState.splitSusC, splitMaj7: appState.splitMajSeventhC, splitAug: appState.splitAugC, splitM: appState.splitMajorC };
    case 'D': return { p: appState.progressionD, r: appState.rhythmBoxesD, s7: appState.seventhD, s6: appState.sixthD, s2: appState.secondD, s4: appState.fourthD, sus: appState.susD, aug: appState.augD, maj7: appState.majSeventhD, m: appState.majorD, splitActive: appState.splitChordActiveD, splitVal: appState.splitChordValueD, splitS7: appState.splitSeventhD, splitS6: appState.splitSixthD, splitS2: appState.splitSecondD, splitS4: appState.splitFourthD, splitSus: appState.splitSusD, splitMaj7: appState.splitMajSeventhD, splitAug: appState.splitAugD, splitM: appState.splitMajorD };
    default: return null;
  }
}
