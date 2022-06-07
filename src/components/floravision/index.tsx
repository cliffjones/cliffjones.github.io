import { useEffect } from 'react';

import './index.scss';
import config from '../../config.json';
import imageData from './images.json';

const BASE_CLASS = 'Floravision';
const ROW_CLASS = `${BASE_CLASS}-row`;
const CIRCLE_CLASS = `${BASE_CLASS}-circle`;
const ID_PREFIX = 'fv-';
const RETRY_DELAY = 50;
const RETRY_LIMIT = 100;
const FRAME_RATE = 4;
const FLICKER_TYPES = 5;
const FLICKER_TIME = 1000 / FRAME_RATE;
const SCREEN_WIDTH = 24;
const SCREEN_HEIGHT = 75;
const SCREEN_STRETCH = 3;
const SCREEN_RATIO = 78 / 75;
const IMAGE_WIDTH = 150;

// Returns a random integer between 1 and a specified maximum.
function randomInt(max: number) {
  return Math.floor(Math.random() * max) + 1;
}

// Returns the number of circles in a specified row.
function getRowWidth(y: number) {
  return (y % 2) ? SCREEN_WIDTH : SCREEN_WIDTH - 1;
}

// Colors the circles based on a supplied image.
function updateCircles(animation: string, frames: any[], frameNum: number) {
  const frame = frames[frameNum];
  const styleRules = [];
  for (let y = 0; y < SCREEN_HEIGHT; y += 1) {
    const rowWidth = getRowWidth(y);
    for (let x = 0; x < rowWidth; x += 1) {
      const color = frame[y][x];
      styleRules.push(`
        #${ID_PREFIX}${animation} > :nth-child(${y + 1}) > :nth-child(${x + 1}) {
          background-color: rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]});
          animation: flicker${randomInt(FLICKER_TYPES)} ${FLICKER_TIME}ms infinite;
        }
      `);
    }
  }

  // Apply the generated rules to an embedded style sheet.
  const styleId = `${ID_PREFIX}${animation}-style`;
  let styleEl = document.querySelector(`#${styleId}`) as HTMLStyleElement;
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.setAttribute('id', styleId);
    document.head.append(styleEl);
  }
  styleEl.textContent = styleRules.join('');
}

// Updates the screen with a new frame.
function updateFrame(animation: string, frames: any[], frameNum: number = 0) {
  updateCircles(animation, frames, frameNum);

  let newFrameNum = frameNum + 1;
  if (newFrameNum >= frames.length) {
    newFrameNum = 0;
  }

  if (frames.length > 1) {
    setTimeout(() => {
      updateFrame(animation, frames, newFrameNum);
    }, 1000 / FRAME_RATE);
  }
}

// Gathers up image data for the frames and starts the animation loop.
function loadImages(animation: string, images: any[], retries: Map<string, number> = new Map()) {
  // Wait until every image has loaded before proceeding.
  for (const image of images) {
    if (!image.complete || !image.naturalWidth) {
      if (retries.has(image.src)) {
        retries.set(image.src, retries.get(image.src) + 1);
      } else {
        retries.set(image.src, 1);
      }
      if (retries.get(image.src) > RETRY_LIMIT) {
        return;
      }

      setTimeout(() => {
        loadImages(animation, images, retries);
      }, RETRY_DELAY);
      return;
    }
  }

  // Create an off-screen canvas, and use it to load the image data.
  const canvas = document.createElement('canvas');
  canvas.width = SCREEN_WIDTH * SCREEN_STRETCH;
  canvas.height = SCREEN_HEIGHT;

  const frames = [];
  for (const image of images) {
    // Draw the image (possibly scaled down and cropped) to an off-screen canvas element.
    const imageRatio = image.width / image.height;
    const xNudge = (imageRatio > SCREEN_RATIO) ? canvas.width * (imageRatio - SCREEN_RATIO) : 0;
    const yNudge = (imageRatio < SCREEN_RATIO) ? canvas.height * (SCREEN_RATIO - imageRatio) : 0;
    canvas.getContext('2d').drawImage(
      image,
      -(xNudge / 2),
      -(yNudge / 2),
      canvas.width + xNudge,
      canvas.height + yNudge,
    );

    // Pull pixel color data from the canvas, and store it as a new frame.
    const frame = [];
    for (let y = 0; y < SCREEN_HEIGHT; y += 1) {
      frame.push([]);
      const rowWidth = getRowWidth(y);
      for (let x = 0; x < rowWidth; x += 1) {
        const rowNudge = (x % 2) ? 0 : SCREEN_STRETCH - 1;
        frame[y].push(
          canvas.getContext('2d').getImageData((x * SCREEN_STRETCH) + rowNudge, y, 1, 1).data,
        );
      }
    }
    frames.push(frame);
  }

  // Set the animation loop going.
  updateFrame(animation, frames);
}

function Floravision({ animation }) {
  useEffect(() => {
    // Generate a list of image elements from the specified animation key.
    const images = [];
    const { url, transform } = config.imageKit;
    const imageIds: string[] = imageData[animation] || [];
    for (const imageId of imageIds) {
      const image = document.createElement('img');
      image.src = `${url}${imageId}${transform}${IMAGE_WIDTH}`;
      image.crossOrigin = 'anonymous';
      images.push(image);
    }

    // Load the image data, and use it to color the circles.
    loadImages(animation, images);
  }, [animation]);

  return (
    <div className={BASE_CLASS} id={`${ID_PREFIX}${animation}`}>
      {Array.from(Array(SCREEN_HEIGHT)).map((u, y) => (
        <div className={ROW_CLASS} key={y}>
          {Array.from(Array(getRowWidth(y))).map((u2, x) => (
            <div className={CIRCLE_CLASS} key={x}></div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Floravision;
