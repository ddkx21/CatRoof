import {
    WIDTH, HEIGHT, CAT_X, SHEETS, FISH_POINTS, FONT_CELL_H,
    PUFF_FRAME_TIME, PUFF_LIFE, POPUP_LIFE, UI, COLORS,
} from './config.js';
import { drawSky, drawGround, drawFrame, drawWhole } from './draw.js';
import { drawText, textWidth } from './font.js';
import { catFrame } from './cat.js';
import { frameOf } from './obstacles.js';
import { scoreOf } from './game.js';

const LINE = FONT_CELL_H + UI.lineGap;

function pad(value, width = 5) {
    return String(value).padStart(width, '0');
}

function blinkOn(time, period) {
    return Math.floor(time / period) % 2 === 0;
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

function fade(age, life) {
    return Math.max(0, 1 - age / life);
}

function drawPuffs(ctx, images, puffs) {
    for (const p of puffs) {
        const index = Math.min(SHEETS.smoke.frames - 1, Math.floor(p.age / PUFF_FRAME_TIME));
        ctx.globalAlpha = fade(p.age, PUFF_LIFE);
        drawFrame(ctx, images.smoke, SHEETS.smoke.frameWidth, index, p.x, p.y);
    }
    ctx.globalAlpha = 1;
}

function drawPopups(ctx, images, popups) {
    for (const p of popups) {
        ctx.globalAlpha = fade(p.age, POPUP_LIFE);
        drawText(ctx, images.font, `+${p.value}`, p.x, p.y, { align: 'center', color: COLORS.bonus });
    }
    ctx.globalAlpha = 1;
}

function drawHud(ctx, images, state) {
    const frame = Math.floor(state.cat.animTime / UI.fishBlinkTime) % SHEETS.fish.frames;
    drawFrame(ctx, images.fish, SHEETS.fish.frameWidth, frame, UI.fishIcon.x, UI.fishIcon.y);
    drawText(ctx, images.font, pad(state.fish, 2), UI.fishCountX, UI.top);

    const right = WIDTH - UI.margin;
    if (state.best > 0) {
        drawText(ctx, images.font, `РЕКОРД ${pad(state.best)}`, right, UI.top, { align: 'right' });
    }
    drawText(ctx, images.font, pad(scoreOf(state)), right, UI.top + LINE, { align: 'right' });
}

function drawPanel(ctx, images, lines, top) {
    const width = Math.max(...lines.map((l) => textWidth(l.text))) + UI.panelPadX * 2;
    const height = (lines.length - 1) * LINE + FONT_CELL_H + UI.panelPadY * 2;

    ctx.fillStyle = COLORS.panel;
    ctx.fillRect(Math.round((WIDTH - width) / 2), top - UI.panelPadY, width, height);

    lines.forEach((l, i) => {
        drawText(ctx, images.font, l.text, WIDTH / 2, top + i * LINE, { align: 'center', color: l.color });
    });
}

function drawReady(ctx, images, state) {
    const prompt = blinkOn(state.cat.animTime, UI.promptBlink) ? 'НАЖМИ ПРОБЕЛ' : '';
    drawPanel(ctx, images, [
        { text: 'КОТИК НА КРЫШЕ' },
        { text: '' },
        { text: 'ПРЫЖОК: ПРОБЕЛ / ТАП' },
        { text: 'ПРИГНУТЬСЯ: ВНИЗ' },
        { text: `РЫБКА: +${FISH_POINTS}`, color: COLORS.bonus },
        { text: '' },
        { text: prompt },
    ], UI.panelTop);
}

function drawOver(ctx, images, state) {
    ctx.fillStyle = COLORS.dim;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    const newBest = state.newBest;
    drawPanel(ctx, images, [
        { text: 'ИГРА ОКОНЧЕНА' },
        { text: '' },
        { text: `СЧЁТ ${pad(scoreOf(state))}` },
        { text: newBest ? 'НОВЫЙ РЕКОРД!' : `РЕКОРД ${pad(state.best)}`, color: newBest ? COLORS.bonus : undefined },
        { text: `РЫБОК ${pad(state.fish, 2)}` },
        { text: '' },
        { text: 'ПРОБЕЛ - ЗАНОВО' },
    ], UI.panelTop);
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

    if (state.phase === 'ready') drawReady(ctx, images, state);
    if (state.phase === 'over') drawOver(ctx, images, state);
}