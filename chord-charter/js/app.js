import { songs, timeSignatureNumerators, scaleChordMaps, waveforms, displayKeys, keyMap, allChords } from './config.js';
import { appState, getProgressionData } from './state.js';
import { ensureAudio, playTriangleNotes, playBrush, playBassDrum, getNotesToPlayForChord } from './audio.js';
import { 
    updateWaveformDisplay, updateKeyDisplay, setSlotContent, updateRhythmPictures, 
    setPlayingUI, updateSlotHighlights, updatePictureHighlights, updateModifierButtonVisuals, 
    _updateQualityButtonVisualForSlot, setPrimarySlotColorAndStyle, setSplitSlotColorAndStyle, 
    updateChordDropdowns, updateLinkVisuals, updateGridForTimeSignature, updateAugButtonVisuals
} from './ui.js';
import { clampBpm } from './utils.js';

document.addEventListener("DOMContentLoaded", main);

function main() {
  console.log("DOM fully loaded. Setting up event listeners.");
  
  initializeKeyDial();
  initializeScaleSelector();
  initializeWaveformDial();
  initializeABCDToggles();
  initializeSlotBoxes();
  initializeModifierButtons();
  initializeRhythmBoxes();
  initializePlaybackControls();
  initializeClearButton();
  initializeSongLoader();
  initializeTimeSignature();
  initializeSaveModal();
  initializeBeatSwingToggles();

  // Initial UI setup
  updateKeyDisplay();
  updateGridForTimeSignature(timeSignatureNumerators[appState.currentTimeSignatureIndex]);
  loadProgression(appState.currentToggle); 
  updateRhythmPictures();
  updateSlotHighlights();
  updatePictureHighlights();
  setPlayingUI(false); 
}

// --- INITIALIZATION ---

function initializeKeyDial() {
    const keyLeftBtn = document.getElementById("key-left");
    const keyRightBtn = document.getElementById("key-right");
    if (keyLeftBtn) { 
        keyLeftBtn.onclick = () => handleKeyDial(-1); 
        keyLeftBtn.addEventListener("keydown", (e) => { if (e.key===" "||e.key==="Enter"||e.key==="ArrowLeft") { e.preventDefault(); handleKeyDial(-1); }});
    }
    if (keyRightBtn) { 
        keyRightBtn.onclick = () => handleKeyDial(1); 
        keyRightBtn.addEventListener("keydown", (e) => { if (e.key===" "||e.key==="Enter"||e.key==="ArrowRight") { e.preventDefault(); handleKeyDial(1); }});
    }
    updateKeyDisplay();
}

function initializeScaleSelector() {
    const scaleSelect = document.getElementById('scale-select');
    
    scaleSelect.innerHTML = '';

    const placeholderOption = document.createElement('option');
    placeholderOption.value = "";
    placeholderOption.textContent = "Scale";
    placeholderOption.disabled = true;
    scaleSelect.appendChild(placeholderOption);

    appState.availableScales.forEach(scaleName => {
        const option = document.createElement('option');
        option.value = scaleName;
        option.textContent = scaleName;
        scaleSelect.appendChild(option);
    });

    scaleSelect.value = appState.currentScale;

    scaleSelect.addEventListener('change', (e) => {
        appState.currentScale = e.target.value;
        updateKeyDisplay();
        updateChordDropdowns();
        loadProgression(appState.currentToggle);
    });
}


function initializeWaveformDial() {
    document.getElementById("wave-left").onclick = () => handleWaveformDial(-1);
    document.getElementById("wave-right").onclick = () => handleWaveformDial(1);
    document.getElementById("wave-left").addEventListener("keydown", (e) => { if (e.key===" "||e.key==="Enter"||e.key==="ArrowLeft") { e.preventDefault(); handleWaveformDial(-1); e.target.focus(); }});
    document.getElementById("wave-right").addEventListener("keydown", (e) => { if (e.key===" "||e.key==="Enter"||e.key==="ArrowRight") { e.preventDefault(); handleWaveformDial(1); e.target.focus(); }});
    updateWaveformDisplay();
}

function initializeABCDToggles() {
    const container = document.querySelector('.abcd-toggle-container');
    if (!container) {
        console.error("ABCD toggle container not found!");
        return;
    }

    ['A', 'B', 'C', 'D'].forEach(t => {
        const btn = container.querySelector('#toggle' + t);
        const linkIcon = container.querySelector('#linkIcon' + t);

        if (btn) {
            btn.addEventListener('click', (event) => {
                if (event.target === linkIcon) {
                    toggleLinkState(t);
                } else {
                    switchToggle(t);
                }
            });

            if (linkIcon) {
                linkIcon.setAttribute('tabindex', '0'); 
                linkIcon.addEventListener('keydown', (e) => {
                    if (e.key === ' ' || e.key === 'Enter') {
                        e.preventDefault();
                        e.stopPropagation(); 
                        toggleLinkState(t);
                    }
                });
            }
        }
    });
}

function initializeSlotBoxes() {
    document.querySelectorAll('.slot-box').forEach((slot, idx) => {
        const primarySelect = slot.querySelector('.primary-chord-select');
        primarySelect.addEventListener('change', function() { 
            const currentData = getProgressionData(appState.currentToggle); 
            currentData.p[idx] = this.value; 
            setPrimarySlotColorAndStyle(idx, primarySelect, this.value);
            setSlotContent(idx);
            playChordPreview(idx); 
            saveCurrentProgression(); 
        }); 

        const splitSelect = slot.querySelector('.split-chord-select');
        splitSelect.addEventListener('change', function() {
            const currentData = getProgressionData(appState.currentToggle);
            currentData.splitVal[idx] = this.value;
            setSplitSlotColorAndStyle(idx, splitSelect, this.value);
            setSlotContent(idx);
            playSimpleChordPreview(this.value);
            saveCurrentProgression();
        });

        const splitBtn = slot.querySelector('.add-split-chord-btn');
        splitBtn.addEventListener('click', () => toggleSplitChord(idx));
    });
}

function initializeModifierButtons() {
    document.querySelectorAll('.seventh-btn').forEach((btn, idx) => { btn.onclick = () => toggleSeventh(idx); });
    document.querySelectorAll('.sixth-btn').forEach((btn, idx) => { btn.onclick = () => toggleSixth(idx); });
    document.querySelectorAll('.second-btn').forEach((btn, idx) => { btn.onclick = () => toggleSecond(idx); });
    document.querySelectorAll('.fourth-btn').forEach((btn, idx) => { btn.onclick = () => toggleFourth(idx); });
    document.querySelectorAll('.sus-btn').forEach((btn, idx) => { btn.onclick = () => toggleSus(idx); });
    document.querySelectorAll('.aug-btn').forEach((btn, idx) => { btn.onclick = () => cycleAugDim(idx); });
    document.querySelectorAll('.maj-seventh-btn').forEach((btn, idx) => { btn.onclick = () => toggleMajSeventh(idx); });
    document.querySelectorAll('.slot-box .quality-toggle-btn').forEach((btn, idx) => { btn.onclick = () => toggleMajorMinor(idx); });
}

function initializeRhythmBoxes() {
    document.querySelectorAll('.bottom-rhythm-box').forEach(box => {
        function toggleActive(e) { 
            e.preventDefault(); 
            box.classList.toggle('active'); 
            updateRhythmPictures(); 
            saveCurrentProgression(); 
        }
        box.addEventListener('click', toggleActive);
        box.addEventListener('touchstart', toggleActive);
    });
}

function initializePlaybackControls() {
    const playPauseBtn = document.getElementById('playPauseBtn');
    if(playPauseBtn) {
        function togglePlay(e) { 
            e.preventDefault(); 
            ensureAudio();
            saveCurrentProgression(); 
            setPlaying(!appState.isPlaying); 
        }
        playPauseBtn.addEventListener('click', togglePlay);
        playPauseBtn.addEventListener('keydown', (e) => { if (e.key === " " || e.key === "Enter") togglePlay(e); });
    }

    const bpmInput = document.getElementById('bpmInput');
    const bpmUp = document.getElementById('bpmUp');
    const bpmDown = document.getElementById('bpmDown');
    if(bpmInput && bpmUp && bpmDown) {
        bpmInput.addEventListener('change', () => {
            let val = parseInt(bpmInput.value, 10);
            bpmInput.value = clampBpm(val);
            restartAnimationWithBpm();
        });
        bpmUp.addEventListener('click', () => {
            bpmInput.value = clampBpm(parseInt(bpmInput.value, 10) + 1);
            restartAnimationWithBpm();
        });
        bpmDown.addEventListener('click', () => {
            bpmInput.value = clampBpm(parseInt(bpmInput.value, 10) - 1);
            restartAnimationWithBpm();
        });
    }
}

function initializeClearButton() {
    const clearButton = document.getElementById('clear');
    if(clearButton) {
        clearButton.addEventListener('click', clearAll);
        clearButton.addEventListener('touchstart', (e) => { e.preventDefault(); clearAll(); });
    }
}

function initializeSongLoader() {
    const songSelectDropdown = document.getElementById('song-select');
    if (songSelectDropdown) {
        songSelectDropdown.addEventListener('change', function() {
            if (this.value) { 
                loadSong(this.value);
            }
        });
    }
}

function initializeTimeSignature() {
    const timeSigButton = document.getElementById('time-sig-top');
    if (timeSigButton) {
        timeSigButton.addEventListener('click', cycleTimeSignature);
    }
}

function initializeSaveModal() {
    const saveSongBtn = document.getElementById('save-song-btn');
    const saveModalOverlay = document.getElementById('save-modal-overlay');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const cancelSaveBtn = document.getElementById('cancel-save-btn');
    const submitSaveBtn = document.getElementById('submit-save-btn');
    const summaryTextarea = document.getElementById('song-summary-textarea');
    const copySummaryBtn = document.getElementById('copy-summary-btn');
    
    function openModal() {
        saveCurrentProgression(); 
        summaryTextarea.value = generateSongSummary();
        saveModalOverlay.classList.remove('modal-hidden');
    }
    function closeModal() {
        saveModalOverlay.classList.add('modal-hidden');
    }

    saveSongBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    cancelSaveBtn.addEventListener('click', closeModal);
    submitSaveBtn.addEventListener('click', () => {
        parseAndLoadSongSummary(summaryTextarea.value);
        closeModal();
    });
    saveModalOverlay.addEventListener('click', (e) => {
        if (e.target === saveModalOverlay) {
            closeModal();
        }
    });

    copySummaryBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(summaryTextarea.value).then(() => {
            const copyIcon = copySummaryBtn.querySelector('.copy-icon');
            const checkIcon = copySummaryBtn.querySelector('.check-icon');
            copyIcon.style.display = 'none';
            checkIcon.style.display = 'inline-block';
            setTimeout(() => {
                copyIcon.style.display = 'inline-block';
                checkIcon.style.display = 'none';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    });
}

function initializeBeatSwingToggles() {
    const beatBtn = document.getElementById('beat-toggle');
    const swingBtn = document.getElementById('swing-toggle');

    if (beatBtn) {
        beatBtn.addEventListener('click', () => {
            appState.beatEnabled = !appState.beatEnabled;
            beatBtn.classList.toggle('active', appState.beatEnabled);
        });
    }

    if (swingBtn) {
        swingBtn.addEventListener('click', () => {
            appState.swingEnabled = !appState.swingEnabled;
            swingBtn.classList.toggle('active', appState.swingEnabled);
            restartAnimationWithBpm();
        });
    }
}

// --- CORE LOGIC ---

function saveCurrentProgression() {
  const currentData = getProgressionData(appState.currentToggle);
  if (!currentData) return;

  const rhythmBoxes = document.querySelectorAll('.bottom-rhythm-box');
  rhythmBoxes.forEach((box, index) => {
    currentData.r[index] = box.classList.contains('active');
  });
}

function setPlaying(playing) {
  appState.isPlaying = playing;
  setPlayingUI(playing);
  if (appState.isPlaying) {
    startMainAnimation();
  } else {
    stopMainAnimation();
  }
}

function startMainAnimation() {
  stopMainAnimation(); // Clear any existing timer
  appState.slotHighlightStep = 0;
  appState.pictureHighlightStep = 0;
  appState.rhythmStep = 0;
  appState.currentLinkedProgressionIndex = 0;

  updateLinkedProgressionSequence(); 

  if (appState.linkedProgressionSequence.length > 0) {
      const firstLinkedProg = appState.linkedProgressionSequence[0];
      if (appState.currentToggle !== firstLinkedProg) {
          appState.currentToggle = firstLinkedProg;
          document.querySelectorAll('.abcd-toggle-btn').forEach(btn => btn.classList.remove('abcd-active'));
          document.getElementById('toggle' + appState.currentToggle)?.classList.add('abcd-active');
          loadProgression(appState.currentToggle);
      }
  } else {
      document.querySelectorAll('.abcd-toggle-btn').forEach(btn => btn.classList.remove('abcd-active'));
      document.getElementById('toggle' + appState.currentToggle)?.classList.add('abcd-active');
      loadProgression(appState.currentToggle);
  }

  updateSlotHighlights(); 
  updatePictureHighlights();

  // Kick off the self-adjusting timer
  playEighthNoteStep(); 
}

function stopMainAnimation() {
  if (appState.rhythmInterval) clearTimeout(appState.rhythmInterval); // Use clearTimeout
  appState.rhythmInterval = null;
  updateSlotHighlights();
  updatePictureHighlights();
}

function playEighthNoteStep() {
    if (!appState.isPlaying) return; // Stop the loop if playback is paused

    const numerator = timeSignatureNumerators[appState.currentTimeSignatureIndex];
    const totalEighthNotes = numerator * 2;

    let playingProgLetter;
    let isLinkedMode = appState.linkedProgressionSequence.length > 0;

    if (isLinkedMode) {
        if (appState.currentLinkedProgressionIndex >= appState.linkedProgressionSequence.length) {
            appState.currentLinkedProgressionIndex = 0;
        }
        playingProgLetter = appState.linkedProgressionSequence[appState.currentLinkedProgressionIndex];

        if (appState.currentToggle !== playingProgLetter) {
            appState.currentToggle = playingProgLetter;
            document.querySelectorAll('.abcd-toggle-btn').forEach(btn => btn.classList.remove('abcd-active'));
            document.getElementById('toggle' + appState.currentToggle)?.classList.add('abcd-active');
            loadProgression(appState.currentToggle);
        }
    } else {
        playingProgLetter = appState.currentToggle;
    }

    const progData = getProgressionData(playingProgLetter);
    if (!progData) return;

    updateSlotHighlights();
    
    if (appState.rhythmStep % 2 === 0) {
        updatePictureHighlights();
    }

    const currentSlotIdx = appState.slotHighlightStep % 4;
    let chordNameToPlay = progData.p[currentSlotIdx];
    let isPlayingSplit = false;

    if (progData.splitActive[currentSlotIdx] && progData.splitVal[currentSlotIdx]) {
        const splitPoint = Math.floor(totalEighthNotes / 2);
        if (appState.rhythmStep >= splitPoint) {
            chordNameToPlay = progData.splitVal[currentSlotIdx];
            isPlayingSplit = true;
        }
    }

    const rhythmIndex = Math.floor(appState.rhythmStep / 2) * 2 + (appState.rhythmStep % 2);

    if (progData.r[rhythmIndex]) {
        if (!chordNameToPlay || chordNameToPlay === "empty") {
            playBassDrum();
        } else {
            const notesToPlay = getNotesToPlayForChord(chordNameToPlay, isPlayingSplit, currentSlotIdx, progData);
            if (notesToPlay.length > 0) {
                playTriangleNotes(notesToPlay);
            } else {
                playBassDrum();
            }
        }
    }

    if (appState.rhythmStep % 2 === 0 && appState.beatEnabled) {
        playBrush();
    }

    // --- Calculate delay for the NEXT step ---
    const beatDurationMs = (60 / getBpmInputValue()) * 1000;
    let nextStepDelay;

    if (appState.swingEnabled) {
        // Your 5:3 swing ratio
        // 1/8 + 1/32 = 5/32 of a whole note. For a quarter note beat, this is 5/8 of the beat.
        // 1/16 + 1/32 = 3/32 of a whole note. For a quarter note beat, this is 3/8 of the beat.
        const longDuration = beatDurationMs * (5 / 8);
        const shortDuration = beatDurationMs * (3 / 8);
        
        // If current step is ON the beat (0, 2, 4...), the next delay is long.
        if (appState.rhythmStep % 2 === 0) {
            nextStepDelay = longDuration;
        } else { // If current step is OFF the beat (1, 3, 5...), the next delay is short.
            nextStepDelay = shortDuration;
        }
    } else {
        // Straight rhythm: each eighth note is half a beat.
        nextStepDelay = beatDurationMs / 2;
    }

    // --- Advance the steps ---
    appState.rhythmStep = (appState.rhythmStep + 1) % totalEighthNotes;
    if (appState.rhythmStep % 2 === 0) {
        appState.pictureHighlightStep = (appState.pictureHighlightStep + 1) % numerator;
    }

    if (appState.rhythmStep === 0) {
        appState.slotHighlightStep = (appState.slotHighlightStep + 1) % 4;
        if (isLinkedMode && appState.slotHighlightStep === 0) {
            appState.currentLinkedProgressionIndex = (appState.currentLinkedProgressionIndex + 1) % appState.linkedProgressionSequence.length;
        }
    }
    
    // Schedule the next call
    appState.rhythmInterval = setTimeout(playEighthNoteStep, nextStepDelay);
}

function loadProgression(progLetter) {
  const dataToLoad = getProgressionData(progLetter);
  if (!dataToLoad) return;

  const { p, r, s7, s6, s2, s4, sus, aug, maj7, m, splitActive, splitVal } = dataToLoad;

  updateChordDropdowns(); 

  document.querySelectorAll('.slot-box').forEach((slot, idx) => {
    const primarySelect = slot.querySelector('.primary-chord-select');
    const splitSelect = slot.querySelector('.split-chord-select');
    const splitBtn = slot.querySelector('.add-split-chord-btn');

    primarySelect.value = p[idx] || ""; 
    setPrimarySlotColorAndStyle(idx, primarySelect, p[idx]);
    splitSelect.value = splitVal[idx] || "";
    setSplitSlotColorAndStyle(idx, splitSelect, splitVal[idx]);

    const isActive = splitActive[idx];
    slot.classList.toggle('split-active', isActive);
    splitBtn.classList.toggle('active', isActive);
    splitSelect.classList.toggle('visible', isActive);
    
    setSlotContent(idx);
  });

  document.querySelectorAll('.bottom-rhythm-box').forEach((box, idx) => box.classList.toggle('active', r[idx]));
  
  updateModifierButtonVisuals('s7', 'seventh-btn', s7);
  updateModifierButtonVisuals('s6', 'sixth-btn', s6); 
  updateModifierButtonVisuals('s2', 'second-btn', s2); 
  updateModifierButtonVisuals('s4', 'fourth-btn', s4); 
  updateModifierButtonVisuals('sus', 'sus-btn', sus); 
  updateAugButtonVisuals(aug);
  updateModifierButtonVisuals('maj7', 'maj-seventh-btn', maj7);
  
  m.forEach((state, idx) => _updateQualityButtonVisualForSlot(idx, state || 'none')); 
  updateRhythmPictures();
}

function clearAll() {
  if (appState.isPlaying) setPlaying(false);

  // Clear Primary
  appState.progressionA = ['', '', '', '']; appState.progressionB = ['', '', '', '']; appState.progressionC = ['', '', '', '']; appState.progressionD = ['', '', '', ''];
  appState.rhythmBoxesA.fill(false); appState.rhythmBoxesB.fill(false); appState.rhythmBoxesC.fill(false); appState.rhythmBoxesD.fill(false);
  [appState.seventhA, appState.sixthA, appState.secondA, appState.fourthA, appState.susA, appState.majSeventhA, 
   appState.seventhB, appState.sixthB, appState.secondB, appState.fourthB, appState.susB, appState.majSeventhB, 
   appState.seventhC, appState.sixthC, appState.secondC, appState.fourthC, appState.susC, appState.majSeventhC, 
   appState.seventhD, appState.sixthD, appState.secondD, appState.fourthD, appState.susD, appState.majSeventhD].forEach(arr => arr.fill(false));
  [appState.augA, appState.augB, appState.augC, appState.augD].forEach(arr => arr.fill('none'));
  [appState.majorA, appState.majorB, appState.majorC, appState.majorD].forEach(arr => arr.fill('none'));
  [appState.splitChordActiveA, appState.splitChordActiveB, appState.splitChordActiveC, appState.splitChordActiveD].forEach(arr => arr.fill(false));
  [appState.splitChordValueA, appState.splitChordValueB, appState.splitChordValueC, appState.splitChordValueD].forEach(arr => arr.fill(''));

  // Clear Split Chord Modifiers
  [appState.splitSeventhA, appState.splitSixthA, appState.splitSecondA, appState.splitFourthA, appState.splitSusA, appState.splitMajSeventhA,
   appState.splitSeventhB, appState.splitSixthB, appState.splitSecondB, appState.splitFourthB, appState.splitSusB, appState.splitMajSeventhB,
   appState.splitSeventhC, appState.splitSixthC, appState.splitSecondC, appState.splitFourthC, appState.splitSusC, appState.splitMajSeventhC,
   appState.splitSeventhD, appState.splitSixthD, appState.splitSecondD, appState.splitFourthD, appState.splitSusD, appState.splitMajSeventhD].forEach(arr => arr.fill(false));
  [appState.splitAugA, appState.splitAugB, appState.splitAugC, appState.splitAugD].forEach(arr => arr.fill('none'));
  [appState.splitMajorA, appState.splitMajorB, appState.splitMajorC, appState.splitMajorD].forEach(arr => arr.fill('none'));

  // Clear Links
  Object.keys(appState.progressionLinkStates).forEach(progLetter => {
    appState.progressionLinkStates[progLetter] = false;
    updateLinkVisuals(progLetter); 
  });
  updateLinkedProgressionSequence(); 

  // Reset Beat/Swing toggles
  appState.beatEnabled = true;
  appState.swingEnabled = false;
  document.getElementById('beat-toggle')?.classList.add('active');
  document.getElementById('swing-toggle')?.classList.remove('active');

  // Reset UI
  appState.currentToggle = 'A';
  document.querySelectorAll('.abcd-toggle-btn').forEach(btn => btn.classList.remove('abcd-active'));
  document.getElementById('toggleA')?.classList.add('abcd-active');
  loadProgression('A'); 
  
  // Reset playback state
  appState.slotHighlightStep = 0;
  appState.pictureHighlightStep = 0;
  appState.rhythmStep = 0;
  appState.currentLinkedProgressionIndex = 0;
  updateSlotHighlights(); 
  updatePictureHighlights(); 
}

// --- EVENT HANDLERS ---

function handleKeyDial(direction) {
  const transposeCheckbox = document.getElementById('transpose-checkbox');
  const oldKey = appState.musicalKey;
  
  let newIndex = (appState.currentKeyIndex + direction + displayKeys.length) % displayKeys.length;
  appState.currentKeyIndex = newIndex; // This line was missing
  appState.currentDisplayKey = displayKeys[newIndex];
  const newKey = appState.musicalKey;

  if (transposeCheckbox && transposeCheckbox.checked) {
      saveCurrentProgression();
      ['A', 'B', 'C', 'D'].forEach(progLetter => {
          const progData = getProgressionData(progLetter);
          progData.p = progData.p.map(chord => transposeChord(chord, oldKey, newKey));
          progData.splitVal = progData.splitVal.map(chord => transposeChord(chord, oldKey, newKey));
      });
  }
  
  updateKeyDisplay();
  updateChordDropdowns();
  loadProgression(appState.currentToggle); 
}

function switchToggle(toggle) {
  saveCurrentProgression();

  appState.currentToggle = toggle;
  document.querySelectorAll('.abcd-toggle-btn').forEach(btn => btn.classList.remove('abcd-active'));
  document.getElementById('toggle' + toggle).classList.add('abcd-active');
  loadProgression(toggle);

  if (appState.isPlaying) { 
    saveCurrentProgression();
    startMainAnimation();
  }
}

function toggleMajorMinor(idx) {
  const arrays = getProgressionData(appState.currentToggle);
  const chord = arrays.p[idx];

  if (!chord || chord === "" || chord === "empty") {
    arrays.m[idx] = 'none';
    _updateQualityButtonVisualForSlot(idx, 'none');
    return;
  }

  if (arrays.m[idx] === 'none') {
    arrays.m[idx] = 'major';
  } else if (arrays.m[idx] === 'major') {
    arrays.m[idx] = 'minor';
  } else if (arrays.m[idx] === 'minor') {
    arrays.m[idx] = 'none';
  } else {
    arrays.m[idx] = 'major'; 
  }

  _updateQualityButtonVisualForSlot(idx, arrays.m[idx]);

  setSlotContent(idx);
  saveCurrentProgression();
  playChordPreview(idx);
}

function _createToggleFunction(modifierKey, updateBtnStatesFn, dependencies = null) {
  return function(idx) {
    const currentData = getProgressionData(appState.currentToggle);
    const targetModifierArray = currentData[modifierKey];

    if (!Array.isArray(targetModifierArray) || typeof targetModifierArray[idx] === 'undefined') {
      return;
    }
    
    const wasActive = targetModifierArray[idx];
    targetModifierArray[idx] = !targetModifierArray[idx];

    if (dependencies) {
      if (modifierKey === 'maj7' && targetModifierArray[idx] && !currentData.s7[idx]) { 
        currentData.s7[idx] = true; 
        if (dependencies.updateFnS7) dependencies.updateFnS7(currentData.s7); 
      } else if (modifierKey === 's7' && !targetModifierArray[idx] && wasActive && currentData.maj7[idx]) { 
        currentData.maj7[idx] = false; 
        if (dependencies.updateFnMaj7) dependencies.updateFnMaj7(currentData.maj7); 
      }
    }
    if ((modifierKey === 's2' && !targetModifierArray[idx]) || (modifierKey === 's4' && !targetModifierArray[idx])) {
        if (currentData.sus[idx] && !currentData.s2[idx] && !currentData.s4[idx]) {
            currentData.sus[idx] = false;
            updateModifierButtonVisuals('sus', 'sus-btn', currentData.sus);
        }
    }
    
    updateBtnStatesFn(targetModifierArray); 
    setSlotContent(idx);
    saveCurrentProgression(); 
    playChordPreview(idx);
  };
}

function cycleAugDim(idx) {
    const currentData = getProgressionData(appState.currentToggle);
    const currentState = currentData.aug[idx];
    let nextState;

    if (currentState === 'none') {
        nextState = 'aug';
    } else if (currentState === 'aug') {
        nextState = 'dim';
    } else { // 'dim'
        nextState = 'none';
    }
    currentData.aug[idx] = nextState;

    updateAugButtonVisuals(currentData.aug);
    setSlotContent(idx);
    saveCurrentProgression();
    playChordPreview(idx);
}

const toggleSeventh = _createToggleFunction('s7', (s7Arr) => updateModifierButtonVisuals('s7', 'seventh-btn', s7Arr), { updateFnMaj7: (maj7Arr) => updateModifierButtonVisuals('maj7', 'maj-seventh-btn', maj7Arr) });
const toggleSixth = _createToggleFunction('s6', (s6Arr) => updateModifierButtonVisuals('s6', 'sixth-btn', s6Arr));
const toggleSecond = _createToggleFunction('s2', (s2Arr) => updateModifierButtonVisuals('s2', 'second-btn', s2Arr)); 
const toggleFourth = _createToggleFunction('s4', (s4Arr) => updateModifierButtonVisuals('s4', 'fourth-btn', s4Arr)); 
const toggleSus = _createToggleFunction('sus', (susArr) => updateModifierButtonVisuals('sus', 'sus-btn', susArr));
const toggleMajSeventh = _createToggleFunction('maj7', (maj7Arr) => updateModifierButtonVisuals('maj7', 'maj-seventh-btn', maj7Arr), { updateFnS7: (s7Arr) => updateModifierButtonVisuals('s7', 'seventh-btn', s7Arr) });

function getBpmInputValue() { let val = parseInt(document.getElementById('bpmInput').value, 10); return isNaN(val) ? 90 : val; }
function setBpmInputValue(val) { document.getElementById('bpmInput').value = val; }

function restartAnimationWithBpm() {
  if (appState.isPlaying) {
    setPlaying(false);
    setPlaying(true);
  }
}

function playChordPreview(idx) {
  ensureAudio();
  if (appState.isPlaying) return;
  const currentData = getProgressionData(appState.currentToggle); 
  const chordName = currentData.p[idx]; 
  if (!chordName || chordName === "" || chordName === "empty") return;
  const notesToPlay = getNotesToPlayForChord(chordName, false, idx, currentData);
  playTriangleNotes(notesToPlay);
}

function playSimpleChordPreview(chordName) {
    ensureAudio();
    if (appState.isPlaying || !chordName || chordName === "" || chordName === "empty") return;
    const notesToPlay = getNotesToPlayForChord(chordName, false, -1, getProgressionData(appState.currentToggle));
    playTriangleNotes(notesToPlay);
}

function transposeChord(chord, oldKey, newKey) {
    if (!chord || chord === "" || chord === "empty") {
        return chord;
    }
    const currentKeyChords = scaleChordMaps[appState.currentScale]?.[oldKey] || [];
    const newKeyChords = scaleChordMaps[appState.currentScale]?.[newKey] || [];

    if (currentKeyChords.length === 0 || newKeyChords.length === 0) {
        return chord;
    }

    const chordIndex = currentKeyChords.findIndex(c => c.value === chord);
    if (chordIndex === -1) {
        return chord;
    }
    const newChordData = newKeyChords[chordIndex];
    return newChordData ? newChordData.value : chord;
}

function handleWaveformDial(dir) {
  appState.currentWaveformIndex = (appState.currentWaveformIndex + dir + waveforms.length) % waveforms.length;
  updateWaveformDisplay();
}

function toggleLinkState(progLetter) {
  appState.progressionLinkStates[progLetter] = !appState.progressionLinkStates[progLetter];
  updateLinkVisuals(progLetter);
  updateLinkedProgressionSequence(); 
}

function updateLinkedProgressionSequence() {
  const currentProg = appState.isPlaying ? appState.linkedProgressionSequence[appState.currentLinkedProgressionIndex] : null;

  appState.linkedProgressionSequence = [];
  ['A', 'B', 'C', 'D'].forEach(progLetter => {
    if (appState.progressionLinkStates[progLetter]) {
      appState.linkedProgressionSequence.push(progLetter);
    }
  });

  if (appState.isPlaying && currentProg) {
    const newIndex = appState.linkedProgressionSequence.indexOf(currentProg);
    if (newIndex !== -1) {
      appState.currentLinkedProgressionIndex = newIndex;
    } else {
      appState.currentLinkedProgressionIndex = 0;
    }
  } else {
     appState.currentLinkedProgressionIndex = 0;
  }
}

function loadSong(songId) {
  console.log("Loading song:", songId); 
  const songData = songs[songId];
  if (!songData) {
    console.warn("Song not found:", songId);
    return;
  }

  if (appState.isPlaying) {
    setPlaying(false); 
  }
  
  clearAll();

  setBpmInputValue(songData.bpm);
  
  const displayKey = Object.keys(keyMap).find(key => keyMap[key].Major === songData.key || keyMap[key]['Natural Minor'] === songData.key);

  if (displayKey) {
    appState.currentDisplayKey = displayKey;
    updateKeyDisplay();
    updateChordDropdowns(); 
  } else {
    console.warn("Key not found in keyMap:", songData.key);
  }

  ['A', 'B', 'C', 'D'].forEach(progLetter => {
    const targetData = getProgressionData(progLetter);
    const songProgDetails = songData.progressions[progLetter];

    if (targetData && songProgDetails) {
      targetData.p.splice(0, 4, ...(songProgDetails.chords || ["", "", "", ""]));
      targetData.r.splice(0, targetData.r.length, ...(songProgDetails.rhythm || Array(8).fill(false)));
      
      targetData.splitVal.splice(0, 4, ...(songProgDetails.splitVal || ["", "", "", ""]));
      targetData.splitActive.splice(0, 4, ...(songProgDetails.splitActive || [false, false, false, false]));

      for (let i = 0; i < 4; i++) { 
        const modifiers = songProgDetails.modifiers ? songProgDetails.modifiers[i] || {} : {};
        targetData.s7[i] = modifiers.seventh || false;
        targetData.s2[i] = modifiers.second || false;
        targetData.s4[i] = modifiers.fourth || false;
        targetData.sus[i] = modifiers.sus || false;
        targetData.maj7[i] = modifiers.majSeventh || false;
        targetData.m[i] = modifiers.quality || 'none';
        
        const splitModifiers = songProgDetails.splitModifiers ? songProgDetails.splitModifiers[i] || {} : {};
        targetData.splitS7[i] = splitModifiers.seventh || false;
        targetData.splitS2[i] = splitModifiers.second || false;
        targetData.splitS4[i] = splitModifiers.fourth || false;
        targetData.splitSus[i] = splitModifiers.sus || false;
        targetData.splitMaj7[i] = splitModifiers.majSeventh || false;
        targetData.splitM[i] = splitModifiers.quality || 'none';
      }
    }
  });

  if (songId === "eagle-view-song" || songId === "count-on-me" || songId === "country-roads" || songId === "yesterday") {  
    ['A', 'B', 'C', 'D'].forEach(progLetter => {
      appState.progressionLinkStates[progLetter] = true;
      updateLinkVisuals(progLetter);
    });
    updateLinkedProgressionSequence(); 
  }

  appState.currentToggle = 'A';
  document.querySelectorAll('.abcd-toggle-btn').forEach(btn => btn.classList.remove('abcd-active'));
  document.getElementById('toggleA')?.classList.add('abcd-active');
  loadProgression('A'); 
}

function cycleTimeSignature() {
  appState.currentTimeSignatureIndex = (appState.currentTimeSignatureIndex + 1) % timeSignatureNumerators.length;
  const newNumerator = timeSignatureNumerators[appState.currentTimeSignatureIndex];
  document.getElementById('time-sig-top').textContent = newNumerator;
  
  updateGridForTimeSignature(newNumerator);

  if (appState.isPlaying) {
    restartAnimationWithBpm();
  }
}

function toggleSplitChord(idx) {
    const currentData = getProgressionData(appState.currentToggle);
    const splitActiveArr = currentData.splitActive;

    const isActive = !splitActiveArr[idx];
    splitActiveArr[idx] = isActive;

    const slot = document.getElementById('slot' + idx);
    const splitBtn = slot.querySelector('.add-split-chord-btn');
    const splitSelect = slot.querySelector('.split-chord-select');

    slot.classList.toggle('split-active', isActive);
    splitBtn.classList.toggle('active', isActive);
    splitSelect.classList.toggle('visible', isActive);
    
    setSlotContent(idx);

    saveCurrentProgression();
}

function _generateChordString(baseChord, progData, idx, isSplit) {
    if (!baseChord || baseChord === 'empty') return '--';

    const s2 = isSplit ? progData.splitS2[idx] : progData.s2[idx];
    const s4 = isSplit ? progData.splitS4[idx] : progData.s4[idx];
    const s6 = isSplit ? progData.splitS6[idx] : progData.s6[idx];
    const maj7 = isSplit ? progData.splitMaj7[idx] : progData.maj7[idx];
    const s7 = isSplit ? progData.splitS7[idx] : progData.s7[idx];
    const m = isSplit ? progData.splitM[idx] : progData.m[idx];
    const sus = isSplit ? progData.splitSus[idx] : progData.sus[idx];
    const aug = isSplit ? progData.splitAug[idx] : progData.aug[idx];

    let chordStr = baseChord;
    
    let isDiminished = chordStr.endsWith('dim');
    if (isDiminished) {
        chordStr = chordStr.slice(0, -3);
    }
    let isMinor = chordStr.endsWith('m');
    if (isMinor) {
        chordStr = chordStr.slice(0, -1);
    }

    if (m === 'minor' || isMinor) {
        chordStr += 'm';
    }

    if (s2) chordStr += '2';
    if (s4) chordStr += '4';
    if (s6) chordStr += '6';
    if (sus) chordStr += 'sus';
    
    if (maj7) chordStr += 'maj7';
    else if (s7) chordStr += '7';
    
    if (aug === 'aug') {
        chordStr += '+';
    } else if (aug === 'dim' || isDiminished) {
        chordStr += 'o';
    }

    return chordStr;
}

function generateSongSummary() {
    saveCurrentProgression();

    const bpm = getBpmInputValue();
    const timeSig = `${timeSignatureNumerators[appState.currentTimeSignatureIndex]}/4`;
    const key = appState.musicalKey;

    let summaryLines = [];
    summaryLines.push(`[BPM: ${bpm}; Time Signature: ${timeSig}; Key: ${key}]`);

    ['A', 'B', 'C', 'D'].forEach(progLetter => {
        const progData = getProgressionData(progLetter);
        const linkStatus = appState.progressionLinkStates[progLetter] ? 'linked' : 'unlinked';
        
        const rhythmText = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
        const activeRhythm = progData.r
            .map((isActive, i) => isActive ? rhythmText[i] : '')
            .join('')
            .slice(0, timeSignatureNumerators[appState.currentTimeSignatureIndex] * 2);

        const chordsSummary = progData.p.map((chord, idx) => {
            let primaryStr = _generateChordString(chord, progData, idx, false);
            if (progData.splitActive[idx] && progData.splitVal[idx]) {
                const splitStr = _generateChordString(progData.splitVal[idx], progData, idx, true);
                primaryStr += `/${splitStr}`;
            }
            return primaryStr;
        }).join(', ');

        summaryLines.push(`[Section ${progLetter}, ${linkStatus}; Rhythm: ${activeRhythm}; Chords: ${chordsSummary}]`);
    });

    return summaryLines.join('\n');
}

function _parseAndApplyModifiers(chordToken, progData, idx, isSplit) {
    if (!chordToken || chordToken.trim() === '--') return;

    let token = chordToken.trim();
    
    const s7 = token.includes('7') && !token.includes('maj7');
    const maj7 = token.includes('maj7');
    const s6 = token.includes('6');
    const s2 = token.includes('2');
    const s4 = token.includes('4');
    const sus = token.includes('sus');
    const aug = token.endsWith('+');
    const dim = token.endsWith('o');

    token = token.replace(/maj7|7|sus|6|2|4|\+|o/g, '');
    
    const baseChordMatch = token.match(/^([A-G][b#]?)/);
    if (!baseChordMatch) return;
    
    const root = baseChordMatch[0];
    const isMinor = token.substring(root.length).startsWith('m');
    
    let finalBaseChord = isMinor ? root + 'm' : root;
    let finalAugState = aug ? 'aug' : (dim ? 'dim' : 'none');
    
    if (dim && !isMinor) {
        const potentialDimChord = root + 'dim';
        if (allChords.includes(potentialDimChord)) {
            finalBaseChord = potentialDimChord;
            finalAugState = 'none';
        }
    }
    
    const mState = (finalBaseChord.endsWith('m')) ? 'none' : (isMinor ? 'minor' : 'none');

    const target = {
        p: isSplit ? progData.splitVal : progData.p,
        s7: isSplit ? progData.splitS7 : progData.s7,
        s6: isSplit ? progData.splitS6 : progData.s6,
        maj7: isSplit ? progData.splitMaj7 : progData.maj7,
        s2: isSplit ? progData.splitS2 : progData.s2,
        s4: isSplit ? progData.splitS4 : progData.s4,
        sus: isSplit ? progData.splitSus : progData.sus,
        aug: isSplit ? progData.splitAug : progData.aug,
        m: isSplit ? progData.splitM : progData.m,
        splitActive: progData.splitActive
    };

    target.p[idx] = finalBaseChord;
    target.s7[idx] = s7 || maj7;
    target.s6[idx] = s6;
    target.maj7[idx] = maj7;
    target.s2[idx] = s2;
    target.s4[idx] = s4;
    target.sus[idx] = sus;
    target.aug[idx] = finalAugState;
    target.m[idx] = mState;
    if (isSplit) {
        target.splitActive[idx] = true;
    }
}


function parseAndLoadSongSummary(summaryText) {
    try {
        clearAll();
        const lines = summaryText.split('\n').filter(line => line.trim() !== '');

        const headerLine = lines.find(line => line.includes('BPM:'));
        if (headerLine) {
            const headerContent = headerLine.slice(1, -1);
            const parts = headerContent.split(';').reduce((acc, part) => {
                const [key, value] = part.split(':').map(s => s.trim());
                if (key && value) acc[key] = value;
                return acc;
            }, {});

            if (parts['BPM']) setBpmInputValue(clampBpm(parseInt(parts['BPM'], 10)));
            if (parts['Time Signature']) {
                const timeSigNum = parseInt(parts['Time Signature'].split('/')[0], 10);
                const timeSigIndex = timeSignatureNumerators.indexOf(timeSigNum);
                if (timeSigIndex !== -1) {
                    appState.currentTimeSignatureIndex = timeSigIndex;
                }
            }
            if (parts['Key']) {
                const musicalKey = parts['Key'];
                const displayKey = Object.keys(keyMap).find(dKey => 
                    keyMap[dKey].Major === musicalKey || keyMap[dKey]['Natural Minor'] === musicalKey
                );
                if (displayKey) {
                    appState.currentDisplayKey = displayKey;
                }
            }
        }

        updateKeyDisplay();
        updateGridForTimeSignature(timeSignatureNumerators[appState.currentTimeSignatureIndex]);
        document.getElementById('time-sig-top').textContent = timeSignatureNumerators[appState.currentTimeSignatureIndex];

        const sectionLines = lines.filter(line => line.includes('Section'));
        sectionLines.forEach(line => {
            const sectionMatch = line.match(/\[Section ([A-D]), (linked|unlinked); Rhythm: (.*?); Chords: (.*?)\]/);
            if (sectionMatch) {
                const [, progLetter, linkStatus, rhythmStr, chordsStr] = sectionMatch;
                const progData = getProgressionData(progLetter);

                appState.progressionLinkStates[progLetter] = (linkStatus === 'linked');

                const rhythmMap = {'1':0, '2':1, '3':2, '4':3, '5':4, '6':5, '7':6, '8':7, '9':8, '0':9};
                progData.r.fill(false);
                for (const char of rhythmStr) {
                    if (rhythmMap.hasOwnProperty(char)) {
                         progData.r[rhythmMap[char]] = true;
                    }
                }

                const chordTokens = chordsStr.split(',').map(s => s.trim());
                chordTokens.forEach((chordToken, idx) => {
                    if (idx >= 4) return;
                    const [primaryToken, splitToken] = chordToken.split('/');
                    _parseAndApplyModifiers(primaryToken, progData, idx, false);
                    if (splitToken) {
                        _parseAndApplyModifiers(splitToken, progData, idx, true);
                    }
                });
            }
        });

        updateChordDropdowns();
        ['A', 'B', 'C', 'D'].forEach(updateLinkVisuals);
        updateLinkedProgressionSequence();
        loadProgression(appState.currentToggle);

    } catch (error) {
        console.error("Failed to parse song summary:", error);
        alert("Could not load the song from the text. Please check the format.");
    }
}


