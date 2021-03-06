import { KeyboardEvent, MouseEvent } from 'react';

import './index.scss';

const BASE_CLASS = 'Stroboscope';
const ACTIVE_CLASS = `${BASE_CLASS}--active`;
const CLOSE_CLASS = `${BASE_CLASS}-close`;
const LINK_CLASS = 'Content-link';
const MIN_FREQ = 8;
const MAX_FREQ = 16;

let freq: number;
let freqStep: number;
let textTimer: ReturnType<typeof setTimeout>;

// Updates the screen with a new color.
async function updateFrame(
  screen: HTMLElement,
  isBright: boolean = false,
  hue: number = 150,
  freq: number = 10,
) {
  // Only get into this recursive loop if the stroboscope has been activated.
  if (!screen.classList.contains(ACTIVE_CLASS)) {
    return;
  }

  // Set the screen color and wait just a moment.
  screen.style.backgroundColor = `hsl(${hue}, 100%, ${isBright ? 85 : 15}%)`;
  await new Promise((res) => {
    setTimeout(res, 1000 / freq);
  });

  // Change the color for the next frame.
  isBright = !isBright;
  hue += 1;
  if (hue >= 360) {
    hue = 0;
  }

  // Continue the recursive loop.
  updateFrame(screen, isBright, hue, freq);
}

// Sets the stroboscope flashing.
function activate(screen: HTMLElement) {
  screen.innerHTML = '';
  screen.classList.remove(LINK_CLASS);
  screen.classList.add(ACTIVE_CLASS);

  freq = 10;
  freqStep = 1;
  clearTimeout(textTimer);

  updateFrame(screen);
}

// Turns off the stroboscope and brings back the trigger button.
function deactivate(screen: HTMLElement) {
  screen.innerHTML = screen.dataset.triggerText;
  screen.removeAttribute('style');
  screen.classList.remove(ACTIVE_CLASS);
  screen.classList.add(LINK_CLASS);
  clearTimeout(textTimer);
}

// Displays the frequency value and close button for short time.
function showControls(screen: HTMLElement) {
  screen.innerHTML = `${freq} Hz<button class="${CLOSE_CLASS}">×</button>`;

  clearTimeout(textTimer);
  textTimer = setTimeout(() => {
    screen.innerHTML = '';
  }, 5000);
}

// Interprets click events to show or modify the stroboscope.
function doClick(event: MouseEvent<HTMLElement>) {
  // Identify the target element(s).
  const target = event.target as HTMLElement;
  const screen = target.closest(`.${BASE_CLASS}`) as HTMLElement;

  // If the close button was clicked, hide the stroboscope.
  if (target.classList.contains(CLOSE_CLASS)) {
    deactivate(screen);
    return;
  }

  // On the first click, start the flashing.
  if (!screen.classList.contains(ACTIVE_CLASS)) {
    activate(screen);
    return;
  }

  // Otherwise, adjust the frequency.
  if (freq + freqStep < MIN_FREQ || freq + freqStep > MAX_FREQ) {
    freqStep = -freqStep;
  }
  freq += freqStep;
  showControls(screen);
}

// Interprets keyboard events to hide or modify the stroboscope.
function doKeyDown(event: KeyboardEvent<HTMLElement>) {
  // Only pay attention to certain keys.
  const { key } = event;
  if (key !== 'Escape' && key !== 'Tab' && key !== 'ArrowUp' && key !== 'ArrowDown') {
    return;
  }

  // Identify the target element(s).
  const target = event.target as HTMLElement;
  const screen = target.closest(`.${BASE_CLASS}`) as HTMLElement;

  // When the user hits escape or tab, hide the stroboscope.
  if (key === 'Escape' || key === 'Tab') {
    deactivate(screen);
    return;
  }

  // Otherwise, adjust the frequency.
  if (key === 'ArrowUp') {
    freq = Math.min(freq + Math.abs(freqStep), MAX_FREQ);
  } else {
    freq = Math.max(MIN_FREQ, freq - Math.abs(freqStep));
  }
  showControls(screen);
}

function Stroboscope({ triggerText }) {
  return (
    <button
      className={`${BASE_CLASS} ${LINK_CLASS}`}
      onClick={doClick}
      onKeyDown={doKeyDown}
      data-trigger-text={triggerText}
    >{triggerText}</button>
  );
}

export default Stroboscope;
