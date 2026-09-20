import {
    WIDTH, SPEED_START, SPEED_MAX, SPEED_ACCEL, FISH_POINTS, RESTART_DELAY,
} from './config.js';
import { createCat, updateCat, catBox } from './cat.js';
import { spawn, nextGap, rightEdge, advanceObstacles, advancePuffs, advancePopups } from './obstacles.js';
import { overlaps, boxOf } from './collide.js';

const IDLE_INPUT = { jumpPressed: false, jumpHeld: false, duck: false };

export function createState(best = 0) {
    return {
        phase: 'ready',
        time: 0,
        overTime: 0,
        distance: 0,
        bonus: 0,
        fish: 0,
        speed: SPEED_START,
        scroll: 0,
        cat: createCat(),
        obstacles: [],
        puffs: [],
        popups: [],
        gap: 0,
        best,
    };
}

export function scoreOf(state) {
    return Math.floor(state.distance / 10) + state.bonus;
}

function updateReady(state, dt, input) {
    const cat = updateCat(state.cat, dt, IDLE_INPUT);
    if (input.jumpPressed) {
        return { ...state, phase: 'playing', cat: createCat() };
    }
    return { ...state, cat };
}

function updateOver(state, dt, input) {
    const overTime = state.overTime + dt;
    if (overTime >= RESTART_DELAY && input.jumpPressed) {
        return createState(state.best);
    }
    return { ...state, overTime };
}

function updatePlaying(state, dt, input) {
    const time = state.time + dt;
    const speed = Math.min(SPEED_MAX, SPEED_START + SPEED_ACCEL * time);
    const distance = state.distance + speed * dt;
    const scroll = state.scroll + speed * dt;
    const cat = updateCat(state.cat, dt, input);

    const advanced = advanceObstacles(state.obstacles, dt, speed);
    const puffs = advancePuffs([...state.puffs, ...advanced.puffs], dt, speed);

    let obstacles = advanced.obstacles;
    let gap = state.gap;
    if (obstacles.length === 0 || rightEdge(obstacles) < WIDTH - gap) {
        obstacles = [...obstacles, spawn(distance)];
        gap = nextGap(speed);
    }

    const box = catBox(cat);
    const survivors = [];
    const caught = [];
    let bonus = state.bonus;
    let fish = state.fish;
    let hit = false;

    for (const o of obstacles) {
        if (overlaps(box, boxOf(o))) {
            if (o.bonus) {
                bonus += FISH_POINTS;
                fish += 1;
                caught.push({ x: o.x + o.w / 2, y: o.y - 2, value: FISH_POINTS, age: 0 });
                continue;
            }
            hit = true;
        }
        survivors.push(o);
    }

    const next = {
        ...state,
        time, speed, distance, scroll, cat, puffs, gap, bonus, fish,
        popups: advancePopups([...state.popups, ...caught], dt, speed),
        obstacles: survivors,
    };

    if (!hit) return next;

    return {
        ...next,
        phase: 'over',
        overTime: 0,
        best: Math.max(state.best, scoreOf(next)),
    };
}

export function update(state, dt, input) {
    if (state.phase === 'ready') return updateReady(state, dt, input);
    if (state.phase === 'over') return updateOver(state, dt, input);
    return updatePlaying(state, dt, input);
}
