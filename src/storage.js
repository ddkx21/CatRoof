import { BEST_KEY } from './config.js';

export function loadBest() {
    try {
        const raw = window.localStorage.getItem(BEST_KEY);
        const value = Number.parseInt(raw ?? '0', 10);
        return Number.isFinite(value) && value > 0 ? value : 0;
    } catch {
        return 0;
    }
}

export function saveBest(value) {
    try {
        window.localStorage.setItem(BEST_KEY, String(value));
    } catch {
        return;
    }
}
