// import { perspectiveLayout } from "../../../../../../../shared/src/engine/data/utils.js";
import { buckets } from "../../../buckets.js";
import { note } from "../../../note.js";
import { particle } from "../../../particle.js";
import { skin } from "../../../skin.js";
import { SlideNote } from "./SlideNote.js";
import { options } from '../../../../configuration/options.js'
import { windows } from "../../../../../../../shared/src/engine/data/windows.js";

export class SlideStartNote extends SlideNote {
    bucket: Bucket = buckets.slideStartNote

    // playEffect() {
    //     this.effect.spawn(this.notePosition, 0.2, false)
    //     particle.effects.lane.spawn(perspectiveLayout({ l: (this.import.lane * 24) / 100 - 0.12, r: (this.import.lane * 24) / 100 + 0.12, b: 1 + note.radius, t: 1 - note.radius * 2 }), 0.2, false)
    // }

    // drawNote() {
    //     this.sprite.draw(this.notePosition.mul(this.y), this.z, 1)
    // }

}

export class FakeSlideStartNote extends SlideStartNote {
    hasInput: boolean = false
}
