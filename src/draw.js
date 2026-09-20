import { WIDTH, GROUND_Y, PARALLAX } from './config.js';

function mod(a, n) {
    return ((a % n) + n) % n;
}

function drawStrip(ctx, img, offset, y) {
    const start = -mod(Math.round(offset), img.width);
    for (let x = start; x < WIDTH; x += img.width) {
        ctx.drawImage(img, x, y);
    }
}

export function drawSky(ctx, images, scroll) {
    ctx.drawImage(images.sky, 0, 0);

    for (const layer of PARALLAX) {
        drawStrip(ctx, images[layer.name], scroll * layer.factor, 0);
    }
}

export function drawGround(ctx, images, scroll) {
    drawStrip(ctx, images.ground, scroll, GROUND_Y);
}

export function drawFrame(ctx, sheet, frameWidth, index, x, y) {
    ctx.drawImage(
        sheet,
        index * frameWidth, 0, frameWidth, sheet.height,
        Math.round(x), Math.round(y), frameWidth, sheet.height,
    );
}

export function drawWhole(ctx, img, x, y) {
    ctx.drawImage(img, Math.round(x), Math.round(y));
}
