// script.js
// Element references
const refreshBtn   = document.getElementById('refresh-btn');
const easyBtn      = document.getElementById('easy-btn');   // NEW
const hardBtn      = document.getElementById('hard-btn');   // NEW
const submitBtn    = document.getElementById('submit-btn');
const timerEl      = document.getElementById('timer');
const messageBox   = document.getElementById('message-box');
const startScreen  = document.getElementById('start-screen');
const dropZone     = document.getElementById('dropzone');

// Constants
const naturalScale   = ['C','D','E','F','G','A','B'];
const DEFAULT_WIDTH  = 60;
const DEFAULT_HEIGHT = 150;
const BAR_GAP        = 20;
const VERTICAL_GAP   = 10; // gap between bars and submit button

// Dynamic vars
let notes = [], answerOrder = [], dropOrder = [];
let currentBarW = DEFAULT_WIDTH, currentBarH = DEFAULT_HEIGHT;
let gameMode = 'hard'; // "easy" or "hard"

// Timer
let timerInterval, startTime;

// Color backgrounds
const colors = {
  C: 'linear-gradient(135deg,#ff4040,#f04242), repeating-linear-gradient(45deg,#fff5 0 2px,transparent 2px 6px), repeating-linear-gradient(-45deg,#fff2 0 1px,transparent 1px 5px)',
  D: 'linear-gradient(135deg,#ff9900,#ffbb33), repeating-linear-gradient(45deg,#fff5 0 2px,transparent 2px 6px), repeating-linear-gradient(-45deg,#fff2 0 1px,transparent 1px 5px)',
  E: 'linear-gradient(135deg,#ffe04d,#ffe966), repeating-linear-gradient(45deg,#fff5 0 2px,transparent 2px 6px), repeating-linear-gradient(-45deg,#fff2 0 1px,transparent 1px 5px)',
  F: 'linear-gradient(135deg,#47d147,#5ee86e), repeating-linear-gradient(45deg,#fff5 0 2px,transparent 2px 6px), repeating-linear-gradient(-45deg,#fff2 0 1px,transparent 1px 5px)',
  G: 'linear-gradient(135deg,#24d6d6,#5ef3f3), repeating-linear-gradient(45deg,#fff5 0 2px,transparent 2px 6px), repeating-linear-gradient(-45deg,#fff2 0 1px,transparent 1px 5px)',
  A: 'linear-gradient(135deg,#3b6aff,#7baaff), repeating-linear-gradient(45deg,#fff5 0 2px,transparent 2px 6px), repeating-linear-gradient(-45deg,#fff2 0 1px,transparent 1px 5px)',
  B: 'linear-gradient(135deg,#a85fff,#d0a8ff), repeating-linear-gradient(45deg,#fff5 0 2px,transparent 2px 6px), repeating-linear-gradient(-45deg,#fff2 0 1px,transparent 1px 5px)'
};

// Feedback messages
const successMessages = [
  "You did it! You're like a baby Mozart!",
  "Congratulations, you'd make Beethoven proud.",
  "Amazing, you understand music better than The Beatles.",
  "Bravo! You're composing your own legend!",
  "Fantastic! You’ve got perfect pitch on ordering!"
];
const errorMessages = [
  "I'm going to close my eyes and let you try again on this one.",
  "You do understand the alphabet, don't you? Try again.",
  "Let's pretend this didn't happen, try again.",
  "Oops! That hit a wrong note—start over!",
  "Not quite—refresh and take it from the top!"
];

// Recalculate bar dimensions based on viewport width
function updateBarDimensions() {
  const n = naturalScale.length + 1; // 8 bars
  const available = window.innerWidth;
  const totalGaps = (n - 1) * BAR_GAP;
  const maxBarW = (available - totalGaps) / n;
  currentBarW = Math.min(DEFAULT_WIDTH, Math.max(30, maxBarW));
  currentBarH = currentBarW * (DEFAULT_HEIGHT / DEFAULT_WIDTH);
}

// Shuffle array in-place
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// Initialize the scale and randomized notes
function initScale() {
  let root;
  if (gameMode === "easy") {
    root = "C"; // Always C in easy mode
  } else {
    root = naturalScale[Math.floor(Math.random() * naturalScale.length)];
  }
  answerOrder = [];
  const startIndex = naturalScale.indexOf(root);
  for (let i = 0; i < naturalScale.length; i++) {
    answerOrder.push(naturalScale[(startIndex + i) % naturalScale.length]);
  }
  answerOrder.push(root);
  notes = answerOrder.slice();
  shuffleArray(notes);
}

// Create bars with dynamic sizing and centered above submit button
function createBars() {
  updateBarDimensions();
  document.querySelectorAll('.bar').forEach(b => b.remove());
  const n = notes.length;
  const totalWidth = n * currentBarW + (n - 1) * BAR_GAP;
  const startX = (window.innerWidth - totalWidth) / 2;
  const sbRect = submitBtn.getBoundingClientRect();
  const yPos = sbRect.top - currentBarH - VERTICAL_GAP;

  notes.forEach((note, i) => {
    const bar = document.createElement('div');
    bar.className = 'bar';
    bar.textContent = note;
    bar.dataset.note = note;
    bar.dataset.origIndex = i;
    bar.style.background = colors[note];
    bar.style.width = `${currentBarW}px`;
    bar.style.height = `${currentBarH}px`;
    const x = startX + i * (currentBarW + BAR_GAP);
    bar.style.left = `${x}px`;
    bar.style.top = `${yPos}px`;
    bar.dataset.originalLeft = bar.style.left;
    bar.dataset.originalTop = bar.style.top;
    document.body.appendChild(bar);
    makeDraggable(bar);
  });
  dropOrder = [];
}

// Make an element draggable with pointer events
function makeDraggable(elem) {
  elem.addEventListener('pointerdown', e => {
    elem.setPointerCapture(e.pointerId);
    const rect = elem.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    function onMove(e) {
      elem.style.left = `${e.clientX - offsetX}px`;
      elem.style.top = `${e.clientY - offsetY}px`;
    }
    function onUp(e) {
      elem.releasePointerCapture(e.pointerId);
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
      handleDrop(elem, e.clientX, e.clientY);
      elem.style.zIndex = 1;
    }

    elem.style.zIndex = 10;
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
  });
}

// Handle dropping a bar into or out of the drop-zone
function handleDrop(elem, clientX, clientY) {
  const dz = dropZone.getBoundingClientRect();
  const pos = elem.getBoundingClientRect();
  const cx = pos.left + pos.width / 2;
  const cy = pos.top + pos.height / 2;

  if (cx > dz.left && cx < dz.right && cy > dz.top && cy < dz.bottom) {
    dropOrder = dropOrder.filter(b => b !== elem);
    let insertIndex = 0;
    dropOrder.forEach((b, i) => {
      const bc = b.getBoundingClientRect().left + b.getBoundingClientRect().width / 2;
      if (cx > bc) insertIndex = i + 1;
    });
    dropOrder.splice(insertIndex, 0, elem);
    repositionBars();
  } else {
    if (dropOrder.includes(elem)) {
      dropOrder = dropOrder.filter(b => b !== elem);
      repositionBars();
    }
    resetPosition(elem);
  }
}

// Reposition bars within the drop-zone
function repositionBars() {
  const dz = dropZone.getBoundingClientRect();
  const n = dropOrder.length;
  if (!n) return;
  const total = n * currentBarW + (n - 1) * BAR_GAP;
  const startX = dz.left + (dz.width - total) / 2;
  const y = dz.top + 30;
  dropOrder.forEach((b, i) => {
    b.style.left = `${startX + i * (currentBarW + BAR_GAP)}px`;
    b.style.top = `${y}px`;
    b.style.opacity = "1";
  });
}

// Reset a bar to its original position
function resetPosition(bar) {
  bar.style.left = bar.dataset.originalLeft;
  bar.style.top = bar.dataset.originalTop;
  bar.style.opacity = "1";
}

// Update the on-screen timer
function updateTimer() {
  const elapsed = Date.now() - startTime;
  const minutes = Math.floor(elapsed / 60000);
  const seconds = Math.floor((elapsed % 60000) / 1000);
  const tenths = Math.floor((elapsed % 1000) / 100);
  timerEl.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}.${tenths}`;
}

// Start the timer interval
function startTimer() {
  startTime = Date.now();
  updateTimer();
  timerInterval = setInterval(updateTimer, 100);
}

// Stop the timer
function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  updateTimer();
}

// Shuffle and reset to start screen
function shuffleAndReset() {
  stopTimer(); // Always clear the timer on refresh/reset!
  messageBox.style.display = 'none';
  timerEl.textContent = '00:00.0';
  document.querySelectorAll('.bar').forEach(b => b.remove());
  startScreen.style.display = 'flex';
}

// Show a success or error message
function showMessage(type) {
  const list = type === 'success' ? successMessages : errorMessages;
  messageBox.textContent = list[Math.floor(Math.random() * list.length)];
  messageBox.className = type;
  messageBox.style.display = 'block';
  setTimeout(() => {
    function onClick() {
      messageBox.style.display = 'none';
      if (type === 'error') shuffleAndReset();
      document.removeEventListener('click', onClick);
    }
    document.addEventListener('click', onClick);
  }, 0);
}

// On window resize, update bars and reposition
window.addEventListener('resize', () => {
  updateBarDimensions();
  const n = notes.length;
  const totalWidth = n * currentBarW + (n - 1) * BAR_GAP;
  const startX = (window.innerWidth - totalWidth) / 2;
  const sbRect = submitBtn.getBoundingClientRect();
  const yPos = sbRect.top - currentBarH - VERTICAL_GAP;

  document.querySelectorAll('.bar').forEach(bar => {
    bar.style.width  = `${currentBarW}px`;
    bar.style.height = `${currentBarH}px`;
    if (!dropOrder.includes(bar)) {
      const i = parseInt(bar.dataset.origIndex, 10);
      const x = startX + i * (currentBarW + BAR_GAP);
      bar.style.left = `${x}px`;
      bar.style.top  = `${yPos}px`;
      bar.dataset.originalLeft = bar.style.left;
      bar.dataset.originalTop  = bar.style.top;
    }
  });
  repositionBars();
});

// Event listeners
refreshBtn.addEventListener('click', shuffleAndReset);

easyBtn.addEventListener('click', () => {
  gameMode = 'easy';
  startScreen.style.display = 'none';
  initScale();
  createBars();
  startTimer();
});
hardBtn.addEventListener('click', () => {
  gameMode = 'hard';
  startScreen.style.display = 'none';
  initScale();
  createBars();
  startTimer();
});

submitBtn.addEventListener('click', () => {
  stopTimer();
  const correct = dropOrder.length === answerOrder.length
    && answerOrder.every((n, i) => dropOrder[i].textContent === n);
  showMessage(correct ? 'success' : 'error');
});

// Initialize on load
window.addEventListener('load', () => {
  startScreen.style.display = 'flex';
});
