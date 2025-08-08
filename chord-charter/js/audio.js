import { appState, getProgressionData } from './state.js';
import { 
    soundProfiles, 
    rhythmChordNotes, 
    rhythmChordSeventhNotes, 
    rhythmChordMajorSeventhNotes, 
    rhythmChordSecondNotes, 
    rhythmChordFourthNotes,
    rhythmChordSixthNotes,
    chordAlternateThirds,
    chordAugmentedFifths,
    chordDiminishedFifths
} from './config.js';

let audioContext;
let masterGain;

export function ensureAudio() {
    if (!audioContext) {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            masterGain = audioContext.createGain();
            // Set master volume to 65% (halfway between 100% and 30%)
            masterGain.gain.setValueAtTime(0.65, audioContext.currentTime);
            masterGain.connect(audioContext.destination);
        } catch (e) {
            console.error("Web Audio API is not supported in this browser", e);
        }
    }
}

function noteToFrequency(note) {
    const noteFrequencies = {
        'C': 261.63, 'C#': 277.18, 'Db': 277.18, 'D': 293.66, 'D#': 311.13, 'Eb': 311.13, 'E': 329.63, 'Fb': 329.63,
        'E#': 349.23, 'F': 349.23, 'F#': 369.99, 'Gb': 369.99, 'G': 392.00, 'G#': 415.30, 'Ab': 415.30, 'A': 440.00, 
        'A#': 466.16, 'Bb': 466.16, 'B': 493.88, 'Cb': 493.88, 'B#': 523.25,
        'C##': 293.66, 'D##': 329.63, 'E##': 369.99, 'F##': 392.00, 'G##': 440.00, 'A##': 493.88, 'B##': 277.18,
        'Bbb': 440.00, 'Ebb': 293.66, 'Abb': 392.00, 'Dbb': 261.63, 'Gbb': 349.23,
        'Cbb': 466.16, 'Fbb': 329.63
    };

    // Normalize the note name to handle all accidental symbols
    const normalizedNote = note.replace('♯', '#').replace('♭', 'b').replace('𝄪', '##').replace('𝄫', 'bb');
    const octave = parseInt(normalizedNote.slice(-1), 10);
    const noteName = normalizedNote.slice(0, -1);
    
    const baseFrequency = noteFrequencies[noteName];
    if (!baseFrequency) {
        console.warn(`Frequency not found for note: ${noteName} (from original: ${note})`);
        return 0;
    }

    return baseFrequency * Math.pow(2, octave - 4);
}

function playTone(frequency, waveform, soundProfile) {
    if (!audioContext || !frequency) return;

    const osc = audioContext.createOscillator();
    const noteGain = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();
    
    // Add compression to prevent clipping
    const compressor = audioContext.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-24, audioContext.currentTime);
    compressor.knee.setValueAtTime(30, audioContext.currentTime);
    compressor.ratio.setValueAtTime(12, audioContext.currentTime);
    compressor.attack.setValueAtTime(0.003, audioContext.currentTime);
    compressor.release.setValueAtTime(0.25, audioContext.currentTime);

    osc.type = waveform;
    osc.frequency.setValueAtTime(frequency, audioContext.currentTime);

    const { duration, attack, hold, release, filterFreq, filterQ, gain, pitchBend, bendAmount, bendTime, vibrato, vibratoFreq, vibratoAmount } = soundProfile;

    if (pitchBend) {
        osc.frequency.setValueAtTime(frequency + bendAmount, audioContext.currentTime);
        osc.frequency.linearRampToValueAtTime(frequency, audioContext.currentTime + bendTime);
    }
    
    if (vibrato) {
        const vibratoOsc = audioContext.createOscillator();
        const vibratoGain = audioContext.createGain();
        vibratoOsc.frequency.setValueAtTime(vibratoFreq, audioContext.currentTime);
        vibratoGain.gain.setValueAtTime(vibratoAmount, audioContext.currentTime);
        vibratoOsc.connect(vibratoGain);
        vibratoGain.connect(osc.frequency);
        vibratoOsc.start();
        vibratoOsc.stop(audioContext.currentTime + duration);
    }
    
    // Reduce individual note gain by 30% (halfway between 0% and 60% reduction)
    const adjustedGain = gain * 0.7;
    noteGain.gain.setValueAtTime(0, audioContext.currentTime);
    noteGain.gain.linearRampToValueAtTime(adjustedGain, audioContext.currentTime + attack);
    noteGain.gain.setValueAtTime(adjustedGain, audioContext.currentTime + attack + hold);
    noteGain.gain.linearRampToValueAtTime(0, audioContext.currentTime + attack + hold + release);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(filterFreq, audioContext.currentTime);
    filter.Q.setValueAtTime(filterQ, audioContext.currentTime);

    // Connect through compressor
    osc.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(compressor);
    compressor.connect(masterGain);

    osc.start();
    osc.stop(audioContext.currentTime + duration);
}

export function getNotesToPlayForChord(chordName, isSplit, slotIndex, progData) {
    if (!chordName || chordName === "empty") return [];

    const aug = isSplit ? progData.splitAug[slotIndex] : progData.aug[slotIndex];
    const s7 = isSplit ? progData.splitS7[slotIndex] : progData.s7[slotIndex];
    const maj7 = isSplit ? progData.splitMaj7[slotIndex] : progData.maj7[slotIndex];
    const s6 = isSplit ? progData.splitS6[slotIndex] : progData.s6[slotIndex];
    const s2 = isSplit ? progData.splitS2[slotIndex] : progData.s2[slotIndex];
    const s4 = isSplit ? progData.splitS4[slotIndex] : progData.s4[slotIndex];
    const m = isSplit ? progData.splitM[slotIndex] : progData.m[slotIndex];
    const sus = isSplit ? progData.splitSus[slotIndex] : progData.sus[slotIndex];

    const baseNotes = rhythmChordNotes[chordName] || [];
    let notesToPlay = [baseNotes[0], baseNotes[1]];

    if (!sus) {
        if (m === 'major' && chordAlternateThirds[chordName]) {
            notesToPlay.push(chordAlternateThirds[chordName].majorNote);
        } else if (m === 'minor' && chordAlternateThirds[chordName]) {
            notesToPlay.push(chordAlternateThirds[chordName].minorNote);
        } else {
            notesToPlay.push(baseNotes[2]);
        }
    }

    if (aug === 'aug' && chordAugmentedFifths[chordName]) {
        const augFifthNoteName = chordAugmentedFifths[chordName];
        const originalFifth = baseNotes[3];
        if (originalFifth) {
            const octave = originalFifth.slice(-1);
            notesToPlay.push(augFifthNoteName + octave);
        }
    } else if (aug === 'dim' && chordDiminishedFifths[chordName]) {
        const dimFifthNoteName = chordDiminishedFifths[chordName];
        const originalFifth = baseNotes[3];
        if (originalFifth) {
            const octave = originalFifth.slice(-1);
            notesToPlay.push(dimFifthNoteName + octave);
        }
    } else {
        notesToPlay.push(baseNotes[3]);
    }

    if (s6 && rhythmChordSixthNotes[chordName]) {
        notesToPlay.push(rhythmChordSixthNotes[chordName]);
    }
    
    if (maj7 && rhythmChordMajorSeventhNotes[chordName]) {
        notesToPlay.push(rhythmChordMajorSeventhNotes[chordName]);
    } else if (s7 && rhythmChordSeventhNotes[chordName]) {
        notesToPlay.push(rhythmChordSeventhNotes[chordName]);
    }

    if (s2 && rhythmChordSecondNotes[chordName]) {
        notesToPlay.push(rhythmChordSecondNotes[chordName]);
    }
    if (s4 && rhythmChordFourthNotes[chordName]) {
        notesToPlay.push(rhythmChordFourthNotes[chordName]);
    }
    
    return notesToPlay.filter(note => note);
}

export function playTriangleNotes(notes) {
    const soundProfile = soundProfiles[appState.currentWaveform];
    notes.forEach(note => {
        const freq = noteToFrequency(note);
        if (freq) {
            playTone(freq, appState.currentWaveform, soundProfile);
        }
    });
}

function createNoiseBuffer() {
    const bufferSize = audioContext.sampleRate * 0.5;
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
    }
    return buffer;
}

export function playBrush() {
    if (!audioContext) return;
    const noiseSource = audioContext.createBufferSource();
    noiseSource.buffer = createNoiseBuffer();

    const bandpass = audioContext.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 3000;
    bandpass.Q.value = 1;

    const brushGain = audioContext.createGain();
    // Set brush volume to 0.055 (halfway between 0.1 and 0.01)
    brushGain.gain.setValueAtTime(0.055, audioContext.currentTime);
    brushGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2);

    noiseSource.connect(bandpass);
    bandpass.connect(brushGain);
    brushGain.connect(masterGain);
    
    noiseSource.start();
    noiseSource.stop(audioContext.currentTime + 0.2);
}

export function playBassDrum() {
    if (!audioContext) return;
    const osc = audioContext.createOscillator();
    const drumGain = audioContext.createGain();
    
    osc.frequency.setValueAtTime(150, audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
    
    // Set bass drum volume to 0.7 (halfway between 1.0 and 0.4)
    drumGain.gain.setValueAtTime(0.7, audioContext.currentTime);
    drumGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
    
    osc.connect(drumGain);
    drumGain.connect(masterGain);
    
    osc.start();
    osc.stop(audioContext.currentTime + 0.3);
}
