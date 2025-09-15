import { Bucket, JudgmentWindows } from "@sonolus/sonolus.js-compiler/play";
import { Note } from "../Note";
import { buckets } from "../../../buckets";
import { getZ, layer, skin } from "../../../skin";
import { windows } from "../../../../../../../shared/src/engine/data/windows";
import { scaledScreen } from "../../../scaledScreen";
import { leftRotated, rightRotated } from "../../../../../../../shared/src/engine/data/utils";
import { note } from "../../../note";
import { options } from "../../../../configuration/options";

export class FlickNote extends Note {
    bucket: Bucket = buckets.flickNote
    windows: JudgmentWindows = windows.flickNote

    sprite: SkinSprite = skin.sprites.flickLeftNote

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

    //     get tailImport() {
    //         return this.import.get(this.flickImport.nextRef)
    //     }
}

export class FakeFlickNote extends FlickNote {
    hasInput: boolean = false
}
