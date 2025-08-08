const images = [
  { url: './assets/MusicalSymbolColoring0001.png', name: 'Treble Clef' },
  { url: './assets/MusicalSymbolColoring0002.png', name: 'Bass Clef' },
  { url: './assets/MusicalSymbolColoring0003.png', name: 'Sharp Sign' },
  { url: './assets/MusicalSymbolColoring0004.png', name: 'Flat Sign' },
  { url: './assets/MusicalSymbolColoring0005.png', name: 'Quarter Note' },
  { url: './assets/MusicalSymbolColoring0006.png', name: 'Quarter Rest' },
  { url: './assets/MusicalSymbolColoring0007.png', name: 'Eighth Note' },
  { url: './assets/MusicalSymbolColoring0008.png', name: 'Eighth Rest' },
  { url: './assets/MusicalSymbolColoring0009.png', name: 'Sixteenth Note' },
  { url: './assets/MusicalSymbolColoring0010.png', name: 'Sixteenth Rest' },
  { url: './assets/MusicalSymbolColoring0011.png', name: 'Whole Note' },
  { url: './assets/MusicalSymbolColoring0012.png', name: 'Half Note' },
  { url: './assets/MusicalSymbolColoring0013.png', name: 'Double Eighths' }
];
let currentIndex = 0;
let imageDrawings = new Array(images.length).fill(null);
let imageBaseCanvasDrawings = new Array(images.length).fill(null); 

const baseCanvas = document.getElementById('baseCanvas');
const bgCanvas = document.getElementById('bgCanvas');
const drawCanvas = document.getElementById('drawCanvas');
const baseCtx = baseCanvas.getContext('2d');
const bgCtx = bgCanvas.getContext('2d');
const drawCtx = drawCanvas.getContext('2d');
const imgNameSpan = document.getElementById('imgName');
const prevImgBtn = document.getElementById('prevImg');
const nextImgBtn = document.getElementById('nextImg');
const toggleSidebarBtn = document.querySelector('.toggle-sidebar');
const sidebar = document.querySelector('.sidebar');

const penBtn = document.getElementById('penBtn');
const eraserBtn = document.getElementById('eraserBtn');
const colorPicker = document.getElementById('colorPicker');
const clearBtn = document.getElementById('clearBtn');
const hideImageBtn = document.getElementById('hideImageBtn');
const copyBtn = document.getElementById('copyBtn');
const sizeCircles = document.querySelectorAll('.size-circle');
const colorButtons = document.querySelectorAll('.color-button');

let drawing = false;
let tool = 'pen'; 
let currentBrushSize = 6;
let imageVisible = true;
let isTouch = false;
let lastPoint = null;
let penColor = '#000000';
let bgColor = '#000000';

window.addEventListener('touchstart', function() { isTouch = true; }, { once: true });
toggleSidebarBtn.addEventListener('click', function() { sidebar.classList.toggle('active'); });
document.addEventListener('click', function(e) {
  if (window.innerWidth <= 600 && sidebar.classList.contains('active') && !sidebar.contains(e.target) && e.target !== toggleSidebarBtn) {
    sidebar.classList.remove('active');
  }
});

function updateSizeCircleColors() {
  sizeCircles.forEach(circle => {
    const isBgBrushCircle = circle.hasAttribute('data-bg');
    if (isBgBrushCircle) {
      circle.style.background = tool === 'bgBrush' ? bgColor : 'linear-gradient(135deg, #000 0%, #666 100%)';
    } else {
      circle.style.backgroundColor = tool === 'eraser' ? '#ffffff' : penColor;
    }
  });
}

function saveDrawingForCurrentImage() {
  if (drawCanvas.width > 0 && drawCanvas.height > 0 && currentIndex >= 0 && currentIndex < imageDrawings.length) {
    imageDrawings[currentIndex] = drawCtx.getImageData(0, 0, drawCanvas.width, drawCanvas.height);
  }
}

function loadDrawingForCurrentImage() {
  drawCtx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
  if (currentIndex >= 0 && currentIndex < imageDrawings.length && imageDrawings[currentIndex]) {
    drawCtx.putImageData(imageDrawings[currentIndex], 0, 0);
  }
}

function saveBaseCanvasForCurrentImage() {
  if (baseCanvas.width > 0 && baseCanvas.height > 0 && currentIndex >= 0 && currentIndex < imageBaseCanvasDrawings.length) {
    imageBaseCanvasDrawings[currentIndex] = baseCtx.getImageData(0, 0, baseCanvas.width, baseCanvas.height);
  }
}

function loadBaseCanvasForCurrentImage() {
  baseCtx.clearRect(0, 0, baseCanvas.width, baseCanvas.height);
  if (currentIndex >= 0 && currentIndex < imageBaseCanvasDrawings.length && imageBaseCanvasDrawings[currentIndex]) {
    baseCtx.putImageData(imageBaseCanvasDrawings[currentIndex], 0, 0);
  }
}

function resize() {
  const parentWidth = window.innerWidth;
  const parentHeight = window.innerHeight;
  if (parentWidth < 600) {
    sidebar.classList.remove('active');
    toggleSidebarBtn.style.display = 'block';
  } else {
    toggleSidebarBtn.style.display = 'none';
  }
  const container = document.querySelector('.canvas-container');
  const width = container.clientWidth;
  const height = container.clientHeight;
  
  if (drawCanvas.width > 0 && drawCanvas.height > 0) saveDrawingForCurrentImage();
  if (baseCanvas.width > 0 && baseCanvas.height > 0) saveBaseCanvasForCurrentImage();

  [baseCanvas, bgCanvas, drawCanvas].forEach(c => {
    c.width = width;
    c.height = height;
  });
  
  drawBackground(); 
  loadDrawingForCurrentImage(); 
  loadBaseCanvasForCurrentImage(); 
}

window.addEventListener('resize', resize);
window.addEventListener('message', function(e) { if (e.data && e.data.type === 'resize') resize(); });

function drawBackground() {
  bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
  const imgObj = images[currentIndex];
  const img = new Image();
  img.crossOrigin = "Anonymous";
  img.src = imgObj.url;
  img.onload = () => {
    const scale = Math.min(bgCanvas.width / img.width, bgCanvas.height / img.height) * 0.8;
    const x = (bgCanvas.width - img.width * scale) / 2;
    const y = (bgCanvas.height - img.height * scale) / 2;
    imgNameSpan.textContent = imgObj.name;
    if (imageVisible) bgCtx.drawImage(img, 0, 0, img.width, img.height, x, y, img.width * scale, img.height * scale);
  };
}

prevImgBtn.addEventListener('click', () => {
  saveDrawingForCurrentImage();
  saveBaseCanvasForCurrentImage(); 
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  drawBackground();
  loadDrawingForCurrentImage();
  loadBaseCanvasForCurrentImage(); 
  playSound('blip');
});
nextImgBtn.addEventListener('click', () => {
  saveDrawingForCurrentImage();
  saveBaseCanvasForCurrentImage(); 
  currentIndex = (currentIndex + 1) % images.length;
  drawBackground();
  loadDrawingForCurrentImage();
  loadBaseCanvasForCurrentImage(); 
  playSound('blip');
});

hideImageBtn.addEventListener('click', () => {
  imageVisible = !imageVisible;
  drawBackground();
  hideImageBtn.textContent = imageVisible ? '👁️ Hide/Show' : '👁️ Hide/Show';
  playSound('switch');
});

function updateToolHighlight() {
  penBtn.classList.toggle('selected', tool === 'pen');
  eraserBtn.classList.toggle('selected', tool === 'eraser');
  
  const isBgBrushActive = tool === 'bgBrush';
  const hugeCircle = document.querySelector('.size-circle[data-bg="true"]');
  if (hugeCircle) {
      hugeCircle.classList.toggle('selected', isBgBrushActive);
  }
  
  if (tool === 'pen') {
      colorPicker.value = penColor;
  } else if (tool === 'bgBrush') {
      colorPicker.value = bgColor;
  }
  
  updateSizeCircleColors();
  updateColorButtonSelection();
}

function updateSizeHighlight(circle) {
  sizeCircles.forEach(c => c.classList.remove('selected'));
  circle.classList.add('selected');
}

function updateColorButtonSelection() {
    colorButtons.forEach(b => b.classList.remove('selected'));
    const activeColor = (tool === 'bgBrush') ? bgColor : penColor;
    const matchingBtn = Array.from(colorButtons).find(b => b.getAttribute('data-color').toLowerCase() === activeColor.toLowerCase());
    if (matchingBtn) {
        matchingBtn.classList.add('selected');
    }
}

penBtn.addEventListener('click', () => { 
  tool = 'pen';
  updateToolHighlight(); 
  playSound('click');
});
eraserBtn.addEventListener('click', () => { 
  tool = 'eraser'; 
  updateToolHighlight(); 
  playSound('click');
});

sizeCircles.forEach(circle => {
  const sizeClickHandler = () => {
    currentBrushSize = parseInt(circle.dataset.size, 10);
    if (tool !== 'eraser') {
      tool = circle.hasAttribute('data-bg') ? 'bgBrush' : 'pen';
    }
    updateSizeHighlight(circle);
    updateToolHighlight();
    playSound('click');
  };
  circle.addEventListener('click', sizeClickHandler);
  circle.addEventListener('touchstart', (e) => { e.preventDefault(); sizeClickHandler(); });
});

colorButtons.forEach(btn => {
  const clickHandler = () => {
    if (tool === 'eraser') {
      tool = 'pen';
    }
    const color = btn.getAttribute('data-color');
    if (tool === 'bgBrush') {
        bgColor = color;
    } else {
        penColor = color;
    }
    colorPicker.value = color;
    updateToolHighlight();
    playSound('pop');
  };
  btn.addEventListener('click', clickHandler);
  btn.addEventListener('touchstart', (e) => { e.preventDefault(); clickHandler(); });
});

colorPicker.addEventListener('input', () => {
    if (tool === 'eraser') {
        tool = 'pen';
    }
    const newColor = colorPicker.value;
    if (tool === 'bgBrush') {
        bgColor = newColor;
    } else if (tool === 'pen') {
        penColor = newColor;
    }
    updateToolHighlight();
});

clearBtn.addEventListener('click', () => {
  drawCtx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
  baseCtx.clearRect(0, 0, baseCanvas.width, baseCanvas.height);
  if (currentIndex >= 0 && currentIndex < imageDrawings.length) {
    imageDrawings[currentIndex] = null;
  }
  if (currentIndex >= 0 && currentIndex < imageBaseCanvasDrawings.length) { 
    imageBaseCanvasDrawings[currentIndex] = null;
  }
  playSound('clear');
});

function getCoords(e) {
  const rect = drawCanvas.getBoundingClientRect();
  const scaleX = drawCanvas.width / rect.width;
  const scaleY = drawCanvas.height / rect.height;
  let clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
  let clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
  return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
}

function startDraw(e) {
  if (window.innerWidth <= 600 && sidebar.classList.contains('active')) sidebar.classList.remove('active');
  drawing = true;
  
  let activeCtx;
  if (tool === 'eraser') {
    activeCtx = (currentBrushSize === 50) ? baseCtx : drawCtx;
  } else if (tool === 'bgBrush') {
    activeCtx = baseCtx;
  } else { 
    activeCtx = drawCtx;
  }

  activeCtx.beginPath();
  activeCtx.lineWidth = currentBrushSize;
  activeCtx.lineCap = 'round';
  activeCtx.lineJoin = 'round';

  if (tool === 'eraser') {
    activeCtx.globalCompositeOperation = 'destination-out';
    activeCtx.strokeStyle = 'rgba(0,0,0,1)';
  } else {
    activeCtx.globalCompositeOperation = 'source-over';
    activeCtx.strokeStyle = (tool === 'bgBrush') ? bgColor : penColor;
  }
  
  const coords = getCoords(e);
  activeCtx.moveTo(coords.x, coords.y);
  lastPoint = coords;
  
  if (e.type.includes('touch')) {
    const tempGCO = activeCtx.globalCompositeOperation;
    const tempStyle = activeCtx.fillStyle;
    activeCtx.beginPath();
    activeCtx.arc(coords.x, coords.y, activeCtx.lineWidth / 2, 0, Math.PI * 2);
    if (tool === 'eraser') {
        activeCtx.globalCompositeOperation = 'destination-out';
        activeCtx.fillStyle = 'rgba(0,0,0,1)';
    } else {
        activeCtx.globalCompositeOperation = 'source-over';
        activeCtx.fillStyle = activeCtx.strokeStyle;
    }
    activeCtx.fill();
    activeCtx.globalCompositeOperation = tempGCO;
    activeCtx.fillStyle = tempStyle;
    activeCtx.beginPath();
    activeCtx.moveTo(coords.x, coords.y);
  }
  // Restore GCO for the line drawing part
  if (tool === 'eraser') {
     activeCtx.globalCompositeOperation = 'destination-out';
  } else {
     activeCtx.globalCompositeOperation = 'source-over';
  }
}

function draw(e) {
  if (!drawing) return;
  if (e.type.includes('touch')) e.preventDefault();
  
  let activeCtx;
  if (tool === 'eraser') {
    activeCtx = (currentBrushSize === 50) ? baseCtx : drawCtx;
  } else if (tool === 'bgBrush') {
    activeCtx = baseCtx;
  } else {
    activeCtx = drawCtx;
  }

  if (tool === 'eraser') activeCtx.globalCompositeOperation = 'destination-out';
  else activeCtx.globalCompositeOperation = 'source-over';

  const coords = getCoords(e);
  if (e.type.includes('touch') && lastPoint) {
    const midPointX = (lastPoint.x + coords.x) / 2;
    const midPointY = (lastPoint.y + coords.y) / 2;
    activeCtx.quadraticCurveTo(lastPoint.x, lastPoint.y, midPointX, midPointY);
  } else {
     activeCtx.lineTo(coords.x, coords.y);
  }
  activeCtx.stroke();
  activeCtx.beginPath();
  activeCtx.moveTo(coords.x, coords.y);
  lastPoint = coords;
}

function endDraw() {
  if (!drawing) return;
  drawing = false;
  lastPoint = null;
  if (tool !== 'eraser') playSound('draw');
}

function playSound(type) {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    let freq = 440, duration = 0.1, oscType = 'sine', vol = 0.1;
    switch(type) {
      case 'click': freq = 660; break;
      case 'blip': freq = 440; oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + duration); break;
      case 'draw': freq = 220 + Math.random() * 100; vol = 0.05; break;
      case 'clear': freq = 220; oscType = 'sawtooth'; duration = 0.3; oscillator.frequency.exponentialRampToValueAtTime(110, audioContext.currentTime + duration); break;
      case 'pop': freq = 880; oscillator.frequency.exponentialRampToValueAtTime(440, audioContext.currentTime + duration); break;
      case 'switch': freq = 220; oscType = 'square'; duration = 0.2; oscillator.frequency.exponentialRampToValueAtTime(330, audioContext.currentTime + duration); break;
    }
    oscillator.type = oscType;
    oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
    gainNode.gain.setValueAtTime(vol, audioContext.currentTime);
    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);
    oscillator.stop(audioContext.currentTime + duration);
  } catch (e) { console.log("Sound not supported or error:", e); }
}

copyBtn.addEventListener('click', async () => {
  const originalText = copyBtn.innerHTML;
  try {
    copyBtn.innerHTML = '⏳ Copying...';
    
    const mergedCanvas = document.createElement('canvas');
    mergedCanvas.width = drawCanvas.width;
    mergedCanvas.height = drawCanvas.height;
    const mergedCtx = mergedCanvas.getContext('2d');

    // 1. Fill background with white
    mergedCtx.fillStyle = 'white';
    mergedCtx.fillRect(0, 0, mergedCanvas.width, mergedCanvas.height);
    
    // 2. Draw the base layer (big lines/coloring)
    mergedCtx.drawImage(baseCanvas, 0, 0);

    // 3. Draw the pre-made image if it's visible
    if (imageVisible) {
      mergedCtx.drawImage(bgCanvas, 0, 0);
    }

    // 4. Draw the top drawing layer (small lines)
    mergedCtx.drawImage(drawCanvas, 0, 0);

    // Final copy to clipboard
    mergedCanvas.toBlob(async (blob) => {
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        copyBtn.innerHTML = '✅ Copied!';
      } catch (err) {
        console.error('Failed to copy image to clipboard:', err);
        copyBtn.innerHTML = '❌ Failed!';
      }
    }, 'image/png');

  } catch (error) {
    console.error('Failed to capture canvas:', error);
    copyBtn.innerHTML = '❌ Failed!';
  } finally {
    setTimeout(() => {
      copyBtn.innerHTML = originalText;
    }, 2000);
  }
});

drawCanvas.addEventListener('mousedown', startDraw);
drawCanvas.addEventListener('mousemove', draw);
document.addEventListener('mouseup', endDraw);
drawCanvas.addEventListener('touchstart', startDraw, { passive: false });
drawCanvas.addEventListener('touchmove', draw, { passive: false });
document.addEventListener('touchend', endDraw);
document.addEventListener('touchcancel', endDraw);

document.addEventListener('visibilitychange', function() { if (document.visibilityState === 'visible') resize(); });

// Initial setup
const selectedSizeCircle = document.querySelector('.size-circle.selected');
if (selectedSizeCircle) {
    tool = selectedSizeCircle.hasAttribute('data-bg') ? 'bgBrush' : 'pen';
}
updateToolHighlight();

setTimeout(() => {
    resize(); 
    loadDrawingForCurrentImage(); 
    loadBaseCanvasForCurrentImage(); 
}, 100);

window.addEventListener('message', function(event) { if (event.data && event.data.type === 'resize') resize(); });
window.addEventListener('load', function() {
  if (window.parent !== window) window.parent.postMessage({ type: 'app-loaded' }, '*');
});
