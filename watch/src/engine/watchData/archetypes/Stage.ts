import { scaledScreen } from "../scaledScreen"
import { skin } from "../skin"

export class Stage extends Archetype {
    spawnTime() {
        return -999999
    }

    despawnTime() {
        return 999999
    }

    updateParallel() {
        const w = 4.95
        const h = w * scaledScreen.wToH * 117 / 863 / 2

        skin.sprites.judgeline.draw(new Rect({ l: -w / 2, r: w / 2, t: 1 - h, b: 1 + h }), 1, 1)

        //
        // for (let i = -2; i <= 2; i++) {
        //     skin.sprites.slot.draw(new Rect({ l: i - w, r: i + w, t: 1 - h, b: 1 + h }), 2, 1)
        // }
    }
}
