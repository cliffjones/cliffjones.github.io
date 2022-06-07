import { MouseEvent, TouchEvent } from 'react';

import './index.scss';

const BASE_CLASS = 'Hexagraph';
const ACTIVE_CLASS = `${BASE_CLASS}--active`;
const ROW_CLASS = `${BASE_CLASS}-row`;
const CELL_CLASS = `${BASE_CLASS}-cell`;
const CELL_HOVER_CLASS = `${CELL_CLASS}--hover`;
const SEGMENT_CLASS = `${BASE_CLASS}-segment`;
const SEGMENT_T_CLASS = `${SEGMENT_CLASS}--t`;
const SEGMENT_TL_CLASS = `${SEGMENT_CLASS}--tl`;
const SEGMENT_TR_CLASS = `${SEGMENT_CLASS}--tr`;
const SEGMENT_BL_CLASS = `${SEGMENT_CLASS}--bl`;
const SEGMENT_BR_CLASS = `${SEGMENT_CLASS}--br`;
const SEGMENT_B_CLASS = `${SEGMENT_CLASS}--b`;
const LINK_CLASS = 'Content-link';
const FRAME_RATE = 2;
const NUM_ROWS = 59;
const NUM_CELLS = 29;

let mouseDown = false;
let mouseX = 0;
let mouseY = 0;

// Continuously listens to deactivate idle hexagrams.
async function updateFrame(screen: HTMLElement) {
  if (!screen.classList.contains(ACTIVE_CLASS)) {
    return;
  }

  // Remove recently added `hover` markers.
  const hoverCells = screen.querySelectorAll(`.${CELL_HOVER_CLASS}`);
  for (let i = 0; i < hoverCells.length; i += 1) {
    hoverCells[i].classList.remove(CELL_HOVER_CLASS);
  }

  // Continue the recursive loop after a short delay.
  await new Promise((res) => {
    setTimeout(res, 1000 / FRAME_RATE);
  });
  updateFrame(screen);
}

// Handles the initial click on the trigger button.
function doClick(event: MouseEvent<HTMLButtonElement>) {
  // On the first click, activate the painting tool.
  const screen = (event.target as HTMLElement).closest(`.${BASE_CLASS}`) as HTMLElement;
  if (screen.classList.contains(ACTIVE_CLASS)) {
    return;
  }

  // Turn the activation button into a full-screen canvas.
  screen.innerHTML = '';
  screen.classList.remove(LINK_CLASS);
  screen.classList.add(ACTIVE_CLASS);

  // Fill the screen with overlapping hexagrams.
  for (let rowNum = 0; rowNum < NUM_ROWS; rowNum += 1) {
    const rowEl = document.createElement('div');
    rowEl.classList.add(ROW_CLASS);
    for (let cellNum = 0; cellNum < NUM_CELLS; cellNum += 1) {
      const cellEl = document.createElement('span');
      cellEl.classList.add(CELL_CLASS);
      cellEl.id = `cell-${rowNum}-${cellNum}`;
      const segmentT = document.createElement('span');
      segmentT.classList.add(SEGMENT_CLASS, SEGMENT_T_CLASS);
      const segmentTl = document.createElement('span');
      segmentTl.classList.add(SEGMENT_CLASS, SEGMENT_TL_CLASS);
      const segmentTr = document.createElement('span');
      segmentTr.classList.add(SEGMENT_CLASS, SEGMENT_TR_CLASS);
      const segmentBl = document.createElement('span');
      segmentBl.classList.add(SEGMENT_CLASS, SEGMENT_BL_CLASS);
      const segmentBr = document.createElement('span');
      segmentBr.classList.add(SEGMENT_CLASS, SEGMENT_BR_CLASS);
      const segmentB = document.createElement('span');
      segmentB.classList.add(SEGMENT_CLASS, SEGMENT_B_CLASS);
      cellEl.append(segmentT);
      cellEl.append(segmentTl);
      cellEl.append(segmentTr);
      cellEl.append(segmentBl);
      cellEl.append(segmentBr);
      cellEl.append(segmentB);
      rowEl.append(cellEl);
    }
    screen.append(rowEl);
  }

  // Set the animation loop going.
  updateFrame(screen);
}

// Finds the cell at the supplied coordinates.
function getCell(x: number, y: number) {
  let target = document.elementFromPoint(x, y);
  if (
    !target.classList.contains(CELL_CLASS)
    && !target.classList.contains(SEGMENT_CLASS)
  ) {
    target = document.elementFromPoint(x - 10, y);
  }
  if (
    !target.classList.contains(CELL_CLASS)
    && !target.classList.contains(SEGMENT_CLASS)
  ) {
    target = document.elementFromPoint(x + 10, y);
  }
  if (target.classList.contains(SEGMENT_CLASS)) {
    target = target.parentNode as HTMLElement;
  }
  if (target.classList.contains(CELL_CLASS)) {
    return target;
  }
  return null;
}

// Tries to force a redraw.
function redraw(target: HTMLElement) {
  return target.offsetHeight;
}

// Handles a mouse-down, touch-start, or drag.
function doMouseDown(event: MouseEvent<HTMLButtonElement> | TouchEvent<HTMLButtonElement>) {
  if (event.type === 'mousemove' && !mouseDown) {
    return;
  }

  const screen = (event.target as HTMLElement).closest(`.${BASE_CLASS}`) as HTMLElement;
  if (!screen.classList.contains(ACTIVE_CLASS)) {
    return;
  }

  event.preventDefault();

  // Determine if the primary mouse button was pressed.
  const mouseEvent = event as MouseEvent;
  if (!mouseDown) {
    mouseDown = (event.type === 'mousedown' && mouseEvent.button === 0);
  }

  // Figure out a mouse or finger position.
  const touchEvent = event as TouchEvent;
  if (touchEvent.touches) {
    mouseX = touchEvent.touches[0].clientX;
    mouseY = touchEvent.touches[0].clientY;
  } else {
    mouseX = mouseEvent.clientX;
    mouseY = mouseEvent.clientY;
  }

  // Set the hover class on the cell under the mouse.
  var target = getCell(mouseX, mouseY) as HTMLElement;
  if (target) {
    target.classList.add(CELL_HOVER_CLASS);
    redraw(target);
  }
}

// Handles the end of a drag.
function doMouseUp(event: MouseEvent<HTMLButtonElement>) {
  const screen = (event.target as HTMLElement).closest(`.${BASE_CLASS}`) as HTMLElement;
  if (!screen.classList.contains(ACTIVE_CLASS)) {
    return;
  }

  event.preventDefault();

  // Determine if the primary mouse button was released.
  mouseDown = !(mouseDown && event.button === 0);
}

function Hexagraph({ triggerText }) {
  return (
    <button
      className={`${BASE_CLASS} ${LINK_CLASS}`}
      onClick={doClick}
      onMouseDown={doMouseDown}
      onMouseMove={doMouseDown}
      onTouchStart={doMouseDown}
      onTouchMove={doMouseDown}
      onMouseUp={doMouseUp}
    >{triggerText}</button>
  );
}

export default Hexagraph;
