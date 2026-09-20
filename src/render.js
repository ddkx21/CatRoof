import {
    WIDTH, HEIGHT, CAT_X, SHEETS, FISH_POINTS, FONT_CELL_H,
    PUFF_FRAME_TIME, PUFF_LIFE, POPUP_LIFE,
} from './config.js';
import { drawSky, drawGround, drawFrame, drawWhole } from './draw.js';
import { drawText, textWidth } from './font.js';
import { catFrame } from './cat.js';
import { frameOf } from './obstacles.js';
import { scoreOf } from './game.js';

const INK = '#ffe9b8';
const BONUS_INK = '#8fd6f0';
const LINE = FONT_CELL_H + 3;

function pad(value) {
    return String(value).padStart(5, '0');
}

function drawObstacles(ctx, images, obstacles) {
    for (const o of obstacles) {
        const sheet = images[o.image];
        if (o.frames) {
            drawFrame(ctx, sheet, o.frameWidth, frameOf(o), o.x, o.y);
        } else {
            drawWhole(ctx, sheet, o.x, o.y);
        }
    }
}

function drawPuffs(ctx, images, puffs) {
    for (const p of puffs) {
        const index = Math.min(SHEETS.smoke.frames - 1, Math.floor(p.age / PUFF_FRAME_TIME));
        ctx.globalAlpha = Math.max(0, 1 - p.age / PUFF_LIFE);
        drawFrame(ctx, images.smoke, SHEETS.smoke.frameWidth, index, p.x, p.y);
    }
    ctx.globalAlpha = 1;
}

function drawPopups(ctx, images, popups) {
    for (const p of popups) {
        ctx.globalAlpha = Math.max(0, 1 - p.age / POPUP_LIFE);
        drawText(ctx, images.font, `+${p.value}`, p.x, p.y, { align: 'center', color: BONUS_INK });
    }
    ctx.globalAlpha = 1;
}

function drawHud(ctx, images, state) {
    const blink = Math.floor(state.cat.animTime / 0.18) % SHEETS.fish.frames;
    drawFrame(ctx, images.fish, SHEETS.fish.frameWidth, blink, 5, 6);
    drawText(ctx, images.font, String(state.fish).padStart(2, '0'), 30, 3);
    drawText(ctx, images.font, `+${FISH_POINTS}`, 30, 3 + LINE, { color: BONUS_INK });

    if (state.best > 0) {
        drawText(ctx, images.font, `РЕКОРД ${pad(state.best)}`, WIDTH - 4, 3, { align: 'right' });
    }
    drawText(ctx, images.font, pad(scoreOf(state)), WIDTH - 4, 3 + LINE, { align: 'right' });
}

function drawPanel(ctx, lines, top) {
    const width = Math.max(...lines.map((line) => textWidth(line))) + 18;
    const height = (lines.length - 1) * LINE + FONT_CELL_H + 12;

    ctx.fillStyle = 'rgba(12, 8, 38, 0.74)';
    ctx.fillRect(Math.round((WIDTH - width) / 2), top - 6, width, height);
}

function drawLines(ctx, images, lines, top) {
    lines.forEach((line, i) => {
        drawText(ctx, images.font, line, WIDTH / 2, top + i * LINE, { align: 'center' });
    });
}

function drawReady(ctx, images) {
    const lines = [
        'КОТИК НА КРЫШЕ',
        '',
        'ПРОБЕЛ - ПРЫЖОК',
        'ВНИЗ - ПРИГНУТЬСЯ',
        `РЫБКА +${FISH_POINTS}`,
        'НАЖМИ ПРОБЕЛ',
    ];
    drawPanel(ctx, lines, 40);
    drawLines(ctx, images, lines, 40);
}

function drawOver(ctx, images, state) {
    ctx.fillStyle = 'rgba(12, 8, 38, 0.6)';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    drawLines(ctx, images, [
        'ИГРА ОКОНЧЕНА',
        '',
        `СЧЁТ ${pad(scoreOf(state))}`,
        `РЕКОРД ${pad(state.best)}`,
        `РЫБОК ${String(state.fish).padStart(2, '0')}`,
        'ПРОБЕЛ - ЗАНОВО',
    ], 40);
}

export function render(ctx, images, state) {
    drawSky(ctx, images, state.scroll);
    drawObstacles(ctx, images, state.obstacles.filter((o) => o.behindGround));
    drawGround(ctx, images, state.scroll);
    drawObstacles(ctx, images, state.obstacles.filter((o) => !o.behindGround));
    drawPuffs(ctx, images, state.puffs);
    drawFrame(ctx, images.cat, SHEETS.cat.frameWidth, catFrame(state.cat), CAT_X, state.cat.y);
    drawPopups(ctx, images, state.popups);
    drawHud(ctx, images, state);

    if (state.phase === 'ready') drawReady(ctx, images);
    if (state.phase === 'over') drawOver(ctx, images, state);
}
