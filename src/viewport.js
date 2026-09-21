import {WIDTH, HEIGHT} from './config.js';


const BORDER = 2;
const MIN_FILL = 1;

export function fitCanvas(canvas) {
    function resize() {
        const dpr = window.devicePixelRatio || 1;
        const availW = window.innerWidth - BORDER * 2;
        const availH = window.innerHeight - BORDER * 2;

        const fit = Math.min(availW/WIDTH, availH/HEIGHT) * dpr;

        const whole = Math.floor(fit);
        const scale = whole >= 1 &&  whole / fit  >= MIN_FILL ? whole : fit;


        canvas.style.width = `${(WIDTH * scale) / dpr}px`;
        canvas.style.height = `${(HEIGHT * scale) / dpr}px`;
    }

    window.addEventListener('resize', resize);
    document.addEventListener('fullscreenchange', resize);
    resize();
}

export function setupFullscreen() {
    const root = document.documentElement;
    if (!root.requestFullscreen) return;

    async function enter() {
        if (document.fullscreenElement) return;
        try {
            await root.requestFullscreen({ navigationUI: 'hide' });
            await screen.orientation?.lock?.('landscape');
        } catch {

        }
    }

    window.addEventListener('pointerdown', (event) => {
        if (event.pointerType === 'touch') enter();
    });

    window.addEventListener('keydown', (event) => {
        if (event.code !== 'KeyF' || event.repeat) return;
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            enter();
        }
    });
}
