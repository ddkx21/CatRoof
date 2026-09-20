const JUMP_KEYS = ['Space', 'ArrowUp', 'KeyW'];
const DUCK_KEYS = ['ArrowDown', 'KeyS'];
const POINTER = 'Pointer';

const held = new Set();
let queuedJump = false;

function isJumpCode(code) {
    return JUMP_KEYS.includes(code);
}

function isDuckCode(code) {
    return DUCK_KEYS.includes(code);
}

window.addEventListener('keydown', (event) => {
    if (isJumpCode(event.code) || isDuckCode(event.code)) event.preventDefault();
    if (event.repeat) return;

    held.add(event.code);
    if (isJumpCode(event.code)) queuedJump = true;
});

window.addEventListener('keyup', (event) => {
    held.delete(event.code);
});

window.addEventListener('blur', () => {
    held.clear();
});

window.addEventListener('pointerdown', () => {
    held.add(POINTER);
    queuedJump = true;
});

window.addEventListener('pointerup', () => {
    held.delete(POINTER);
});

export function readInput() {
    const jumpPressed = queuedJump;
    queuedJump = false;

    return {
        jumpPressed,
        jumpHeld: JUMP_KEYS.some((code) => held.has(code)) || held.has(POINTER),
        duck: DUCK_KEYS.some((code) => held.has(code)),
    };
}
