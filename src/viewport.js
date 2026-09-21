import {WIDTH, HEIGHT} from './config.js';


const BORDER = 2;
const MIN_FILL = 0.85;

export function fitCanvas(canvas) {
    function resize() {
        const dpr = window.devicePixelRatio || 1;
        const availW = window.innerWidth - BORDER * 2;
        const availH = window.innerHeight - BORDER * 2;

        const fit = Math.min(availW/WIDTH, availH/HEIGHT) * dpr;

        const whole = Math.floor(fit);
        const scale = whole >= 1 &&  whole / fit  >= MIN_FILL ? whole : fit;


        canvas.style.width = `${(WIDTH * scale) / dpr}px%`;
        canvas.style.height = `${(HEIGHT * scale) / dpr}px%`;
    }

    window.addEventListener('resize', resize);
    resize();
}