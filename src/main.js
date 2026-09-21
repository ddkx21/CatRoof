import { IMAGES } from './config.js';
import { loadImages } from './assets.js';
import { createState, update } from './game.js';
import { render } from './render.js';
import { readInput } from './input.js';
import { loadBest, saveBest } from './storage.js';
import {fitCanvas , setupFullscreen} from "./viewport.js";

const MAX_DT = 0.05;

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
fitCanvas(canvas, ctx);
setupFullscreen();
const images = await loadImages(IMAGES);

let state = createState(loadBest());
let last = performance.now();

function frame(now) {
    const dt = Math.min((now - last) / 1000, MAX_DT);
    last = now;

    const previousBest = state.best;
    state = update(state, dt, readInput());
    if (state.best > previousBest) saveBest(state.best);

    render(ctx, images, state);
    requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
