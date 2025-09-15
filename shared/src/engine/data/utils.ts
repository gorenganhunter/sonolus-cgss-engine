// import { lanes } from './lanes.mjs'
// import { note } from './note.mjs'

// export const layout = (lane: number, size: number) =>
//     new Rect({
//         l: -note.radius * size,
//         r: note.radius * size,
//         t: -note.radius * size,
//         b: note.radius * size,
//     }).add(new Vec(0, 1).rotate(-lane * lanes.angle))

export function getNoteTransformedTime(min: number, max: number, t: number, clampStart: boolean = false, clampEnd: boolean = clampStart) {
    let x = Math.unlerp(max, min, t)
    if (clampStart && x > 1) x = 1
    if (clampEnd && x < 0) x = 0
    return x / (2 - x)
}

export function getNoteXPosition(startPos: number, endPos: number, transformedTime: number) {
    // return Math.lerpClamped(startPos, endPos, transformedTime)
    if (transformedTime < 0) return endPos
    if (transformedTime > 1) return startPos
    return endPos - (endPos - startPos) * transformedTime
}

export function getNoteYPosition(transformedTime: number) {
    return 1 - transformedTime - 2.05128205 * (1 - transformedTime) * transformedTime
}

export function getNoteSize(transformedTime: number) {
    if (transformedTime < 0.75) {
        return 1 - transformedTime * 0.933333333
    } else {
        return (1 - transformedTime) * 1.2
    }
}

export function getNoteDuration(s: number): number {
    if (s <= 4) {
        return 2.7 - 0.3 * (s - 1)
    } else if (s > 9.5) {
        return 0.7 - 0.4 * (s - 9.5)
    } else {
        return 1.8 - 0.2 * (s - 4)
    }
}

export const leftRotated = ({ l, r, b, t }: RectLike) =>
    new Quad({
        x1: r,
        x2: l,
        x3: l,
        x4: r,
        y1: b,
        y2: b,
        y3: t,
        y4: t,
    })

export const rightRotated = ({ l, r, b, t }: RectLike) =>
    new Quad({
        x1: l,
        x2: r,
        x3: r,
        x4: l,
        y1: t,
        y2: t,
        y3: b,
        y4: b,
    })
