import { buckets } from "../../../buckets.js";
import { effect } from "../../../effect.js";
import { particle } from "../../../particle.js";
import { skin } from "../../../skin.js";
// import { queueHold } from "../../HoldManager.js";
import { SlideNote } from "./SlideNote.js";
import { options } from '../../../../configuration/options.js'
import { note } from "../../../note.js";
import { windows } from "../../../../../../../shared/src/engine/data/windows.js";

export class SlideEndNote extends SlideNote {
    bucket: Bucket = buckets.slideEndNote

    // playEffect() {
    //     this.effect.spawn(this.notePosition, 0.2, false)
    // }

    // drawNote() {
    //     this.sprite.draw(this.notePosition.mul(this.y), this.z, 1)
    // }
}

export class FakeSlideEndNote extends SlideEndNote {
    hasInput: boolean = false
}
