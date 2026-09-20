import {
    CAT_X, CAT_BASE_Y, GRAVITY, JUMP_V, JUMP_CUT, FAST_FALL,
    CAT_RUN_FRAMES, CAT_JUMP_FRAME, CAT_DUCK_FRAMES,
    CAT_RUN_FRAME_TIME, CAT_DUCK_FRAME_TIME,
    CAT_RUN_HIT, CAT_DUCK_HIT,
} from './config.js';

export function createCat() {
    return { y: CAT_BASE_Y, vy: 0, grounded: true, ducking: false, animTime: 0 };
}

export function updateCat(cat, dt, input) {
    let vy = cat.vy;
    let y = cat.y;
    let grounded = cat.grounded;
    let ducking = false;
    let launched = false;

    if (grounded) {
        if (input.jumpPressed) {
            vy = -JUMP_V;
            grounded = false;
            launched = true;
        } else {
            ducking = input.duck;
        }
    }

    if (!grounded) {
        if (!launched && !input.jumpHeld && vy < -JUMP_V * JUMP_CUT) {
            vy = -JUMP_V * JUMP_CUT;
        }
        vy += (input.duck ? FAST_FALL : GRAVITY) * dt;
        y += vy * dt;

        if (y >= CAT_BASE_Y) {
            y = CAT_BASE_Y;
            vy = 0;
            grounded = true;
            ducking = input.duck;
        }
    }

    return { y, vy, grounded, ducking, animTime: cat.animTime + dt };
}

export function catFrame(cat) {
    if (!cat.grounded) return CAT_JUMP_FRAME;

    if (cat.ducking) {
        const i = Math.floor(cat.animTime / CAT_DUCK_FRAME_TIME) % CAT_DUCK_FRAMES.length;
        return CAT_DUCK_FRAMES[i];
    }

    const i = Math.floor(cat.animTime / CAT_RUN_FRAME_TIME) % CAT_RUN_FRAMES.length;
    return CAT_RUN_FRAMES[i];
}

export function catBox(cat) {
    const hit = cat.ducking ? CAT_DUCK_HIT : CAT_RUN_HIT;
    return { x: CAT_X + hit.x, y: cat.y + hit.y, w: hit.w, h: hit.h };
}
