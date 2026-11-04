const STATES = {
  MENU: 'MENU',
  GUESS_0: 'GUESS_0',
  GUESS_1: 'GUESS_1',
  GUESS_2: 'GUESS_2',
  AUDIO: 'AUDIO',
  VIDEO: 'VIDEO',
  REVEAL: 'REVEAL',
  TRAITS: 'TRAITS',
};

const GUESS_STATES = [STATES.GUESS_0, STATES.GUESS_1, STATES.GUESS_2];

const NEXT_MAP = {
  [STATES.GUESS_0]: STATES.GUESS_1,
  [STATES.GUESS_1]: STATES.GUESS_2,
  [STATES.GUESS_2]: STATES.AUDIO,
  [STATES.AUDIO]: STATES.VIDEO,
  [STATES.VIDEO]: STATES.REVEAL,
  [STATES.REVEAL]: STATES.TRAITS,
};

const BUTTONS = {
  [STATES.MENU]: [],
  [STATES.GUESS_0]: ['back', 'menu', 'skip', 'next'],
  [STATES.GUESS_1]: ['back', 'menu', 'skip', 'next'],
  [STATES.GUESS_2]: ['back', 'menu', 'skip', 'next'],
  [STATES.AUDIO]: ['back', 'menu', 'skip', 'next'],
  [STATES.VIDEO]: ['back', 'menu', 'skip', 'next'],
  [STATES.REVEAL]: ['back', 'menu', 'next'],
  [STATES.TRAITS]: ['back', 'menu', 'finish'],
};

const IMAGE_EXTENSIONS = ['jpeg', 'jpg', 'png'];

let manifest = [];
let currentPuzzle = null;
let currentState = STATES.MENU;
let history = [];

// Tries each extension in IMAGE_EXTENSIONS in turn until one loads, since
// puzzle images may be supplied as .jpeg, .jpg, or .png under the same name.
function setImageWithFallback(imgEl, base, name, onFail) {
  let i = 0;
  function tryNext() {
    if (i >= IMAGE_EXTENSIONS.length) {
      imgEl.onerror = null;
      if (onFail) onFail();
      return;
    }
    imgEl.onerror = () => {
      i += 1;
      tryNext();
    };
    imgEl.onload = () => {
      imgEl.onerror = null;
    };
    imgEl.src = base + name + '.' + IMAGE_EXTENSIONS[i];
  }
  tryNext();
}

async function init() {
  try {
    const res = await fetch('manifest.json', { cache: 'no-store' });
    const data = await res.json();
    manifest = Array.isArray(data.puzzles) ? data.puzzles : [];
  } catch (e) {
    manifest = [];
  }
  renderMenu();
  wireButtons();
  wireErrorHandlers();
  render();
}

function renderMenu() {
  const list = document.getElementById('puzzle-list');
  const empty = document.getElementById('menu-empty');
  list.innerHTML = '';
  if (manifest.length === 0) {
    empty.hidden = false;
    return;
  }
  empty.hidden = true;
  manifest.forEach((folder, i) => {
    const btn = document.createElement('button');
    btn.className = 'puzzle-btn';
    btn.textContent = 'Puzzle ' + (i + 1);
    btn.addEventListener('click', () => loadPuzzle(folder));
    list.appendChild(btn);
  });
}

function loadPuzzle(folder) {
  currentPuzzle = folder;
  const base = 'puzzles/' + folder + '/';

  ['pic_0', 'pic_1', 'pic_2'].forEach((name) => {
    setImageWithFallback(new Image(), base, name);
  });

  setImageWithFallback(document.getElementById('reveal-image'), base, 'title_card', () => {
    showError('Could not find title_card.jpeg/.jpg/.png for this puzzle.');
  });

  const audio = document.getElementById('audio-player');
  audio.src = base + 'audio.mp3';
  audio.load();

  const video = document.getElementById('video-player');
  video.src = base + 'video.mp4';
  video.load();

  history = [];
  currentState = STATES.GUESS_0;
  render();
}

function pauseMedia() {
  document.getElementById('audio-player').pause();
  document.getElementById('video-player').pause();
}

function viewIdForState(state) {
  if (GUESS_STATES.includes(state)) return 'view-guess';
  return 'view-' + state.toLowerCase();
}

function render() {
  pauseMedia();

  document.querySelectorAll('.view').forEach((v) => {
    v.hidden = true;
  });
  document.getElementById(viewIdForState(currentState)).hidden = false;

  const controls = document.getElementById('controls');
  if (currentState === STATES.MENU) {
    controls.hidden = true;
  } else {
    controls.hidden = false;
    const allowed = BUTTONS[currentState] || [];
    ['back', 'menu', 'skip', 'next', 'finish'].forEach((name) => {
      document.getElementById('btn-' + name).hidden = !allowed.includes(name);
    });
  }

  if (GUESS_STATES.includes(currentState)) {
    const idx = GUESS_STATES.indexOf(currentState);
    document.getElementById('guess-title').textContent = 'Guess ' + (idx + 1) + ' of 3';
    const base = 'puzzles/' + currentPuzzle + '/';
    setImageWithFallback(document.getElementById('guess-image'), base, 'pic_' + idx, () => {
      showError('Could not find pic_' + idx + '.jpeg/.jpg/.png for this puzzle.');
    });
  }
}

function goNext() {
  const target = NEXT_MAP[currentState];
  if (!target) return;
  history.push(currentState);
  currentState = target;
  render();
}

function goBack() {
  if (history.length === 0) {
    goMenu();
    return;
  }
  currentState = history.pop();
  render();
}

function goMenu() {
  history = [];
  pauseMedia();
  currentPuzzle = null;
  currentState = STATES.MENU;
  render();
}

function skipToReveal() {
  if (currentState === STATES.REVEAL) return;
  history.push(currentState);
  currentState = STATES.REVEAL;
  render();
}

function wireButtons() {
  document.getElementById('btn-back').addEventListener('click', goBack);
  document.getElementById('btn-menu').addEventListener('click', goMenu);
  document.getElementById('btn-skip').addEventListener('click', skipToReveal);
  document.getElementById('btn-next').addEventListener('click', goNext);
  document.getElementById('btn-finish').addEventListener('click', goMenu);
}

function showError(message) {
  const banner = document.getElementById('error-banner');
  banner.textContent = message;
  banner.hidden = false;
  clearTimeout(showError._t);
  showError._t = setTimeout(() => {
    banner.hidden = true;
  }, 5000);
}

function wireErrorHandlers() {
  // guess-image and reveal-image failures are handled by setImageWithFallback's
  // onFail callback, after all extensions have been tried.
  document.getElementById('audio-player').addEventListener('error', () => {
    showError('Could not load audio.mp3 for this puzzle.');
  });
  document.getElementById('video-player').addEventListener('error', () => {
    showError('Could not load video.mp4 for this puzzle.');
  });
}

document.addEventListener('DOMContentLoaded', init);
