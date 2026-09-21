export const WIDTH = 320;
export const HEIGHT = 180;
export const GROUND_Y = 150;

export const CAT_X = 40;
export const CAT_FOOT_OFFSET = 26;
export const CAT_BASE_Y = GROUND_Y - CAT_FOOT_OFFSET;

export const CAT_RUN_FRAMES = [0, 1, 2, 3];
export const CAT_JUMP_FRAME = 4;
export const CAT_DUCK_FRAMES = [5, 6];
export const CAT_RUN_FRAME_TIME = 0.09;
export const CAT_DUCK_FRAME_TIME = 0.14;
export const CAT_RUN_HIT = { x: 6, y: 2, w: 26, h: 23 };
export const CAT_DUCK_HIT = { x: 3, y: 11, w: 32, h: 15 };

export const GRAVITY = 700;
export const JUMP_V = 308;
export const JUMP_CUT = 0.45;
export const FAST_FALL = 1500;


export const SPEED_START = 110;
export const SPEED_ACCEL = 6;
export const SPEED_MAX = 600;

export const MAX_DT = 0.05;

// Сколько пикселей пути даёт одно очко
export const DISTANCE_PER_POINT = 10;

export const GAP_MIN_S = 0.95;
export const GAP_MAX_S = 1.7;

export const FISH_CHANCE = 0.18;
export const FISH_POINTS = 100;

export const PUFF_PERIOD = 0.35;
export const PUFF_LIFE = 0.8;
export const PUFF_RISE = 14;
export const PUFF_FRAME_TIME = 0.27;

export const POPUP_LIFE = 0.9;
export const POPUP_RISE = 22;
export const POPUP_OFFSET_Y = 2;

export const SPAWN_MARGIN = 8;
export const DESPAWN_MARGIN = 8;
export const PUFF_DESPAWN_MARGIN = 20;

export const PUFF_OFFSET_X = 8;
export const PUFF_OFFSET_Y = 10;

export const FONT_CHARS = '0123456789'
    + 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'
    + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    + ' +-.,:!?()/x';
export const FONT_CELL_W = 8;
export const FONT_CELL_H = 13;


export const UI = {
    margin: 4,
    top: 3,
    lineGap: 3,
    fishIcon: { x: 5, y: 6 },
    fishCountX: 30,
    fishBlinkTime: 0.18,
    panelTop: 36,
    panelPadX: 9,
    panelPadY: 6,
    promptBlink: 0.5,
};

export const COLORS = {
    ink: '#ffe9b8',
    bonus: '#8fd6f0',
    shadow: '#1a1530',
    panel: 'rgba(12, 8, 38, 0.74)',
    dim: 'rgba(12, 8, 38, 0.6)',
};

export const RESTART_DELAY = 0.5;
export const BEST_KEY = 'catroof.best';

export const IMAGES = {
    sky:            'background/bg_sky.png',
    clouds:         'background/bg_clouds.png',
    city_far:       'background/bg_far_city.png',
    city_mid:       'background/bg_mid_city.png',
    near_roofs:     'background/bg_near_roofs.png',
    ground:         'background/bg_ground.png',

    cat:            'sprites/cat.png',
    dog:            'sprites/dog.png',
    bird:           'sprites/bird.png',
    fish:           'sprites/fish.png',
    smoke:          'sprites/smoke.png',
    font:           'sprites/font.png',

    chimney_short:  'sprites/chimney_short.png',
    chimney_tall:   'sprites/chimney_tall.png',
    chimney_double: 'sprites/chimney_double.png',
};

export const PARALLAX = [
    { name: 'clouds',     factor: 0.05 },
    { name: 'city_far',   factor: 0.15 },
    { name: 'city_mid',   factor: 0.35 },
    { name: 'near_roofs', factor: 0.60 },
];

export const SHEETS = {
    cat:   { frameWidth: 38, frames: 7 },
    dog:   { frameWidth: 42, frames: 4 },
    bird:  { frameWidth: 30, frames: 4 },
    fish:  { frameWidth: 22, frames: 2 },
    smoke: { frameWidth: 16, frames: 3 },
};

export const OBSTACLES = [
    {
        id: 'chimney_short', image: 'chimney_short', w: 21, h: 32, y: GROUND_Y - 30,
        hit: { x: 2, y: 6, w: 17, h: 26 }, pots: [10], behindGround: true, minDistance: 0, weight: 3,
    },
    {
        id: 'chimney_tall', image: 'chimney_tall', w: 21, h: 46, y: GROUND_Y - 44,
        hit: { x: 2, y: 2, w: 17, h: 43 }, pots: [], behindGround: true, minDistance: 150, weight: 2,
    },
    {
        id: 'chimney_double', image: 'chimney_double', w: 35, h: 36, y: GROUND_Y - 34,
        hit: { x: 2, y: 6, w: 31, h: 28 }, pots: [9, 24], behindGround: true, minDistance: 400, weight: 2,
    },
    {
        id: 'dog', image: 'dog', w: 42, h: 28, y: CAT_BASE_Y,
        hit: { x: 5, y: 6, w: 32, h: 19 }, frameWidth: 42, frames: 4, frameTime: 0.1,
        extraSpeed: 25, minDistance: 700, weight: 2,
    },
    {
        id: 'bird_low', image: 'bird', w: 30, h: 22, y: GROUND_Y - 40,
        hit: { x: 3, y: 4, w: 24, h: 14 }, frameWidth: 30, frames: 4, frameTime: 0.12,
        extraSpeed: 10, minDistance: 500, weight: 2,
    },
    {
        id: 'bird_high', image: 'bird', w: 30, h: 22, y: GROUND_Y - 86,
        hit: { x: 3, y: 4, w: 24, h: 14 }, frameWidth: 30, frames: 4, frameTime: 0.12,
        extraSpeed: 10, minDistance: 500, weight: 1,
    },
];

export const FISH = {
    id: 'fish', image: 'fish', w: 22, h: 13, y: GROUND_Y - 62,
    hit: { x: 1, y: 1, w: 20, h: 11 }, frameWidth: 22, frames: 2, frameTime: 0.18,
    bonus: true,
};