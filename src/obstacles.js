import {
    WIDTH, OBSTACLES, FISH, FISH_CHANCE,
    GAP_MIN_S, GAP_MAX_S, PUFF_PERIOD, PUFF_LIFE, PUFF_RISE, POPUP_LIFE, POPUP_RISE,
} from './config.js';

const SPAWN_X = WIDTH + 8;

function pickDefinition(distance) {
    const allowed = OBSTACLES.filter((def) => distance >= def.minDistance);
    const total = allowed.reduce((sum, def) => sum + def.weight, 0);

    let roll = Math.random() * total;
    for (const def of allowed) {
        roll -= def.weight;
        if (roll < 0) return def;
    }
    return allowed[allowed.length - 1];
}

export function spawn(distance) {
    const def = Math.random() < FISH_CHANCE ? FISH : pickDefinition(distance);
    return { ...def, x: SPAWN_X, animTime: 0, puffTime: 0 };
}

export function nextGap(speed) {
    return speed * (GAP_MIN_S + Math.random() * (GAP_MAX_S - GAP_MIN_S));
}

export function rightEdge(obstacles) {
    return obstacles.reduce((max, o) => Math.max(max, o.x + o.w), -Infinity);
}

export function advanceObstacles(obstacles, dt, speed) {
    const moved = [];
    const puffs = [];

    for (const o of obstacles) {
        const x = o.x - (speed + (o.extraSpeed ?? 0)) * dt;
        if (x + o.w < -8) continue;

        let puffTime = o.puffTime + dt;
        if (o.pots && o.pots.length > 0) {
            while (puffTime >= PUFF_PERIOD) {
                puffTime -= PUFF_PERIOD;
                const pot = o.pots[Math.floor(Math.random() * o.pots.length)];
                puffs.push({ x: x + pot - 8, y: o.y - 10, age: 0 });
            }
        }

        moved.push({ ...o, x, animTime: o.animTime + dt, puffTime });
    }

    return { obstacles: moved, puffs };
}

export function advancePuffs(puffs, dt, speed) {
    const alive = [];

    for (const p of puffs) {
        const age = p.age + dt;
        if (age >= PUFF_LIFE) continue;

        const x = p.x - speed * dt;
        if (x < -20) continue;

        alive.push({ x, y: p.y - PUFF_RISE * dt, age });
    }

    return alive;
}

export function advancePopups(popups, dt, speed) {
    const alive = [];

    for (const p of popups) {
        const age = p.age + dt;
        if (age >= POPUP_LIFE) continue;

        alive.push({ ...p, x: p.x - speed * dt, y: p.y - POPUP_RISE * dt, age });
    }

    return alive;
}

export function frameOf(entity) {
    if (!entity.frames) return 0;
    return Math.floor(entity.animTime / entity.frameTime) % entity.frames;
}
