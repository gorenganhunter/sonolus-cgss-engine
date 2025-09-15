const fromMs = (perfect: number, great: number, good: number) => {
    const toWindow = (ms: number) => ({ min: -ms / 1000, max: ms / 1000 })

    return {
        perfect: toWindow(perfect),
        great: toWindow(great),
        good: toWindow(good),
    }
}

export const windows = {
    tapNote: fromMs(60, 80, 200),
    holdNote: fromMs(150, 180, 200),
    flickNote: fromMs(150, 180, 200),
    slideNote: fromMs(200, 200, 200),
}
