import { windows } from "../../../../../../../shared/src/engine/data/windows.js";
import { effect } from "../../../effect.js";
import { particle } from "../../../particle.js";
import { skin } from "../../../skin.js";
import { Note } from "../Note.js";

export abstract class SlideNote extends Note {
    // sfx: { perfect: EffectClip; great: EffectClip; good: EffectClip; fallback: { perfect: EffectClip; great: EffectClip; good: EffectClip } } = {
    //     perfect: effect.clips.perfect,
    //     great: effect.clips.great,
    //     good: effect.clips.good,
    //     fallback: {
    //         perfect: effect.clips.perfect,
    //         great: effect.clips.great,
    //         good: effect.clips.good
    //     }
    // }
    // effect = {
    //     linear: particle.effects.holdNoteLinear,
    //     circular: particle.effects.holdNoteCircular,
    // }

    windows = windows.slideNote

    sprite = skin.sprites.slideNote

    slideImport = this.defineImport({
        prevRef: { name: "prev", type: Number },
        firstRef: { name: "head", type: Number }
    })

    sharedMemory = this.defineSharedMemory({
        activatedTouchId: TouchId,
        // y: Number
    })

    // updateParallel() {
    //     super.updateParallel()

    //     // if (this.y) this.sharedMemory.y = this.y
    // }

    get prevInfo() {
        return entityInfos.get(this.slideImport.prevRef)
    }

    get prevImport() {
        return this.import.get(this.slideImport.prevRef)
    }

    get prevSharedMemory() {
        return this.sharedMemory.get(this.slideImport.prevRef)
    }
}
