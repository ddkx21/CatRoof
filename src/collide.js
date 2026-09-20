export function overlaps(a, b) {
    return a.x < b.x + b.w
        && a.x + a.w > b.x
        && a.y < b.y + b.h
        && a.y + a.h > b.y;
}

export function boxOf(entity) {
    return {
        x: entity.x + entity.hit.x,
        y: entity.y + entity.hit.y,
        w: entity.hit.w,
        h: entity.hit.h,
    };
}
