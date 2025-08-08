import { appState, getProgressionData } from './state.js';
import { 
    scaleChordMaps, allChordOptions, optionColors, restDashImgUrl, dashImgUrl, rhythmBox2, 
    rhythmBox3, rhythmBox4, noteColorClass, chordTones, chordAlternateThirds, 
    chordSevenths, chordMajorSevenths, chordSixths, chordFourths, chordSeconds,
    chordAugmentedFifths, chordDiminishedFifths
} from './config.js';
import { getNotesToPlayForChord } from './audio.js';

export function updateWaveformDisplay() {
  document.getElementById("waveform-name").textContent = appState.currentWaveform;
}

export function updateKeyDisplay() {
  document.getElementById("current-key-name").textContent = appState.currentDisplayKey;
}

export function updateChordDropdowns() {
    const currentKey = appState.musicalKey;
    const currentScale = appState.currentScale;
    
    const keyChords = scaleChordMaps[currentScale]?.[currentKey] || [];
    const keyChordValues = new Set(keyChords.map(c => c.value));

    const allSelects = document.querySelectorAll('.chord-select');
    
    allSelects.forEach(select => {
        const currentVal = select.value;
        select.innerHTML = ''; 

        const emptyOption = document.createElement('option');
        emptyOption.value = "";
        emptyOption.textContent = "----";
        select.appendChild(emptyOption);

        if (keyChords.length > 0) {
            const groupInKey = document.createElement('optgroup');
            groupInKey.label = `Chords in ${currentKey} ${currentScale}`;
            keyChords.forEach(chord => {
                const option = document.createElement('option');
                option.value = chord.value;
                // Replace both 'dim' and 'vii°' to ensure both parts get the symbol
                option.textContent = chord.display.replace(/dim/g, '°').replace(/vii°/g, 'vii°');
                groupInKey.appendChild(option);
            });
            select.appendChild(groupInKey);
        }

        const groupOutOfKey = document.createElement('optgroup');
        groupOutOfKey.label = "Other Chords";
        allChordOptions.forEach(chord => {
            // Only add if it's not already in the in-key group
            if (!keyChordValues.has(chord.value)) {
                const option = document.createElement('option');
                option.value = chord.value;
                // The display property from allChordOptions is already formatted with °
                option.textContent = chord.display; 
                groupOutOfKey.appendChild(option);
            }
        });
        select.appendChild(groupOutOfKey);
        
        select.value = currentVal;
    });
}


export function setSlotContent(slotIndex) {
  const slot = document.getElementById(`slot${slotIndex}`);
  if (!slot) return;

  const currentData = getProgressionData(appState.currentToggle);
  if (!currentData) return;

  const primaryChordName = currentData.p[slotIndex];
  const isSplitActive = currentData.splitActive[slotIndex];
  const splitChordName = currentData.splitVal[slotIndex];

  const dashImg = slot.querySelector('.dash-img-slot');
  const noteRectsContainer = slot.querySelector('.note-rects-container');
  const primaryRects = slot.querySelector('.primary-note-rects');
  const splitRects = slot.querySelector('.split-note-rects');

  primaryRects.innerHTML = '';
  splitRects.innerHTML = '';

  let hasContent = false;

  if (primaryChordName) {
    _createNoteRects(primaryChordName, false, slotIndex, primaryRects);
    hasContent = true;
  }
  if (isSplitActive && splitChordName) {
    _createNoteRects(splitChordName, true, slotIndex, splitRects);
    hasContent = true;
  }

  if (hasContent) {
    dashImg.style.display = 'none';
    noteRectsContainer.style.display = 'flex';
  } else {
    dashImg.style.display = 'block';
    noteRectsContainer.style.display = 'none';
  }
}

function getNotesToDisplayForChord(chordName, isSplit, slotIndex) {
    if (!chordName || chordName === "empty") return [];

    const progData = getProgressionData(appState.currentToggle);
    if (!progData) return [];

    const aug = isSplit ? progData.splitAug[slotIndex] : progData.aug[slotIndex];
    const s7 = isSplit ? progData.splitS7[slotIndex] : progData.s7[slotIndex];
    const maj7 = isSplit ? progData.splitMaj7[slotIndex] : progData.maj7[slotIndex];
    const s6 = isSplit ? progData.splitS6[slotIndex] : progData.s6[slotIndex];
    const s2 = isSplit ? progData.splitS2[slotIndex] : progData.s2[slotIndex];
    const s4 = isSplit ? progData.splitS4[slotIndex] : progData.s4[slotIndex];
    const m = isSplit ? progData.splitM[slotIndex] : progData.m[slotIndex];
    const sus = isSplit ? progData.splitSus[slotIndex] : progData.sus[slotIndex];
    
    const baseTones = chordTones[chordName] || [];
    let notes = new Map();

    notes.set('root', baseTones[0]);

    if (aug === 'aug' && chordAugmentedFifths[chordName]) {
        notes.set('fifth', chordAugmentedFifths[chordName]);
    } else if (aug === 'dim' && chordDiminishedFifths[chordName]) {
        notes.set('fifth', chordDiminishedFifths[chordName]);
    } else {
        notes.set('fifth', baseTones[2]);
    }

    if (!sus) {
        if (m === 'major' && chordAlternateThirds[chordName]) {
            notes.set('third', chordAlternateThirds[chordName].major);
        } else if (m === 'minor' && chordAlternateThirds[chordName]) {
            notes.set('third', chordAlternateThirds[chordName].minor);
        } else {
            notes.set('third', baseTones[1]);
        }
    }

    if (s2 && chordSeconds[chordName]) notes.set('second', chordSeconds[chordName]);
    if (s4 && chordFourths[chordName]) notes.set('fourth', chordFourths[chordName]);
    if (s6 && chordSixths[chordName]) notes.set('sixth', chordSixths[chordName]);
    
    if (maj7 && chordMajorSevenths[chordName]) {
        notes.set('seventh', chordMajorSevenths[chordName]);
    } else if (s7 && chordSevenths[chordName]) {
        notes.set('seventh', chordSevenths[chordName]);
    }
    
    const sortOrder = ['root', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh'];
    return Array.from(notes.entries())
        .sort(([keyA], [keyB]) => sortOrder.indexOf(keyA) - sortOrder.indexOf(keyB))
        .map(([, value]) => value);
}


function _createNoteRects(chordName, isSplit, slotIndex, container) {
    if (!chordName) return;
    
    const notes = getNotesToDisplayForChord(chordName, isSplit, slotIndex);

    notes.forEach(noteName => {
        if (!noteName) return;

        const baseNote = noteName.charAt(0);
        const colorClass = noteColorClass[baseNote] || `note-${baseNote}`;
        // Prioritize double accidentals, then single ones
        let accidentals = '';
        if (noteName.includes('𝄫')) {
            accidentals = '𝄫';
        } else if (noteName.includes('𝄪')) {
            accidentals = '𝄪';
        } else if (noteName.includes('♭')) {
            accidentals = '♭';
        } else if (noteName.includes('♯')) {
            accidentals = '♯';
        } else if (noteName.includes('b')) {
            accidentals = '♭';
        } else if (noteName.includes('#')) {
            accidentals = '♯';
        }

        const rect = document.createElement('div');
        rect.className = `note-rect ${colorClass}`;
        
        let accidentalClass = 'accidental';
        if (accidentals === '𝄪') {
            accidentalClass += ' double-sharp';
        } else if (accidentals === '𝄫') {
            accidentalClass += ' double-flat';
        }
        
        if (accidentals) {
            rect.innerHTML = `${baseNote}<span class="${accidentalClass}">${accidentals}</span>`;
        } else {
            rect.innerHTML = baseNote;
        }
        
        container.appendChild(rect);
    });
}


export function updateRhythmPictures() {
  const states = Array.from(document.querySelectorAll('.bottom-rhythm-box')).map(box => box.classList.contains('active'));
  const pictureImgs = document.querySelectorAll('.bottom-picture-img');
  
  for (let i = 0; i < pictureImgs.length; i++) {
    const firstOfPair = states[i * 2];
    const secondOfPair = states[i * 2 + 1];

    if (firstOfPair && !secondOfPair) {
      pictureImgs[i].src = rhythmBox2;
    } 
    else if (firstOfPair && secondOfPair) {
      pictureImgs[i].src = rhythmBox3;
    } 
    else if (!firstOfPair && secondOfPair) {
      pictureImgs[i].src = rhythmBox4;
    } 
    else {
      pictureImgs[i].src = dashImgUrl;
    }
  }
}

export function setPlayingUI(playing) {
  document.getElementById('playIcon').style.display = playing ? 'none' : 'block';
  document.getElementById('pauseIcon').style.display = playing ? 'block' : 'none';
}

export function updateSlotHighlights() {
    appState.slotIds.forEach((id, index) => {
        const slot = document.getElementById(id);
        if (slot) {
            // Apply the 'enlarged' class directly to the slot, not its parent.
            slot.classList.toggle('enlarged', appState.isPlaying && index === (appState.slotHighlightStep % 4));
        }
    });
}

export function updatePictureHighlights() {
    const pictures = document.querySelectorAll('.bottom-picture');
    pictures.forEach((pic, index) => {
        pic.classList.toggle('picture-highlighted', appState.isPlaying && index === appState.pictureHighlightStep);
    });
}

export function updateModifierButtonVisuals(modifierKey, className, states) {
  document.querySelectorAll(`.${className}`).forEach((btn, idx) => {
    btn.classList.toggle('active', states[idx]);
  });
}

export function updateAugButtonVisuals(states) {
    document.querySelectorAll('.aug-btn').forEach((btn, idx) => {
        const state = states[idx];
        btn.classList.remove('active', 'diminished');
        btn.innerHTML = '+';

        if (state === 'aug') {
            btn.classList.add('active');
        } else if (state === 'dim') {
            btn.classList.add('active', 'diminished');
            btn.innerHTML = 'o';
        }
    });
}

export function _updateQualityButtonVisualForSlot(idx, quality) {
  const btn = document.querySelectorAll('.quality-toggle-btn')[idx];
  if (!btn) return;

  btn.classList.remove('quality-active');
  let text = 'M';

  if (quality === 'major') {
    text = 'M';
    btn.classList.add('quality-active');
  } else if (quality === 'minor') {
    text = 'm';
    btn.classList.add('quality-active');
  }

  btn.textContent = text;
}

export function setPrimarySlotColorAndStyle(idx, primarySelect, primaryVal) {
    const rootNote = primaryVal ? primaryVal.match(/^[A-G][b#]?/)?.[0] : null;
    const colorInfo = rootNote ? optionColors[rootNote.charAt(0)] : null;
    
    if (colorInfo) {
        primarySelect.style.backgroundColor = colorInfo.background;
        primarySelect.style.color = colorInfo.text;
    } else {
        primarySelect.style.backgroundColor = '';
        primarySelect.style.color = '';
    }
}

export function setSplitSlotColorAndStyle(idx, splitSelect, splitVal) {
    const rootNote = splitVal ? splitVal.match(/^[A-G][b#]?/)?.[0] : null;
    const colorInfo = rootNote ? optionColors[rootNote.charAt(0)] : null;
    
    if (colorInfo) {
        splitSelect.style.backgroundColor = colorInfo.background;
        splitSelect.style.color = colorInfo.text;
    } else {
        splitSelect.style.backgroundColor = '';
        splitSelect.style.color = '';
    }
}

export function updateLinkVisuals(progLetter) {
  const icon = document.getElementById('linkIcon' + progLetter);
  const button = document.getElementById('toggle' + progLetter);
  const isLinked = appState.progressionLinkStates[progLetter];

  if (icon) {
    icon.classList.toggle('linked', isLinked);
  }
  if (button) {
    button.classList.toggle('progression-linked', isLinked);
  }
}

export function updateGridForTimeSignature(numerator) {
  const bottomGrid = document.getElementById('bottom-grid');
  const gridContainer = document.getElementById('bottom-grid-container');

  document.documentElement.style.setProperty('--time-sig-beats', numerator);

  for (let i = 0; i < 5; i++) { 
    const pic = document.getElementById(`bottomPic${i}`);
    const pair = document.getElementById(`rhythm-box-pair-${i}`);
    const shouldShow = i < numerator;
    if (pic) pic.style.display = shouldShow ? 'flex' : 'none';
    if (pair) pair.style.display = shouldShow ? 'flex' : 'none';
  }
}
