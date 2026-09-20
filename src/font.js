import { FONT_CHARS, FONT_CELL_W, FONT_CELL_H } from './config.js';

const cache = new Map();

function tinted(atlas, color) {
    const hit = cache.get(color);
    if (hit) return hit;

    const canvas = document.createElement('canvas');
    canvas.width = atlas.width;
    canvas.height = atlas.height;

    const g = canvas.getContext('2d');
    g.drawImage(atlas, 0, 0);
    g.globalCompositeOperation = 'source-in';
    g.fillStyle = color;
    g.fillRect(0, 0, canvas.width, canvas.height);

    cache.set(color, canvas);
    return canvas;
}

export function textWidth(value) {
    return value.length * FONT_CELL_W;
}

function blit(ctx, sheet, value, x, y) {
    for (let i = 0; i < value.length; i++) {
        const index = FONT_CHARS.indexOf(value[i]);
        if (index < 0) continue;

        ctx.drawImage(
            sheet,
            index * FONT_CELL_W, 0, FONT_CELL_W, FONT_CELL_H,
            x + i * FONT_CELL_W, y, FONT_CELL_W, FONT_CELL_H,
        );
    }
}

export function drawText(ctx, atlas, value, x, y, options = {}) {
    const { align = 'left', color = '#ffe9b8', shadow = '#1a1530' } = options;

    const glyphs = value.toUpperCase();
    const width = textWidth(glyphs);
    const offset = align === 'center' ? -width / 2 : align === 'right' ? -width : 0;
    const left = Math.round(x + offset);
    const top = Math.round(y);

    if (shadow) blit(ctx, tinted(atlas, shadow), glyphs, left + 1, top + 1);
    blit(ctx, tinted(atlas, color), glyphs, left, top);
}
