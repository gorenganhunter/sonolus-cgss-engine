import { SkinSprite } from "@sonolus/sonolus.js-compiler/play";
import { buckets } from "../../../buckets";
import { getZ, layer, skin } from "../../../skin";
import { scaledScreen } from "../../../scaledScreen";
import { leftRotated, rightRotated } from "../../../../../../../shared/src/engine/data/utils";
import { SlideEndNote } from "./SlideEndNote";
import { windows } from "../../../../../../../shared/src/engine/data/windows";

export class SlideEndFlickNote extends SlideEndNote {
    sprite: SkinSprite = skin.sprites.flickLeftNote

    windows: JudgmentWindows = windows.flickNote

    bucket: Bucket = buckets.slideEndFlickNote

    flickImport = this.defineImport({
        direction: { name: "direction", type: Number },
        nextRef: { name: "next", type: Number }
    })

    drawNote(): void {
        const w = 0.25 * this.s
        const h = w * scaledScreen.wToH

        if (this.flickImport.direction < 0) skin.sprites.flickLeftNote.draw(new Rect({ l: this.x - w * 1.4, r: this.x + w, t: this.y - h, b: this.y + h }), this.note.z, 1)
        else skin.sprites.flickRightNote.draw(new Rect({ l: this.x - w, r: this.x + w * 1.4, t: this.y - h, b: this.y + h }), this.note.z, 1)
    }
}

export class FakeSlideEndFlickNote extends SlideEndFlickNote {
    hasInput: boolean = false
}
