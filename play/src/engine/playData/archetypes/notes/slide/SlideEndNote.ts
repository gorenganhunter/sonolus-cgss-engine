import { buckets } from "../../../buckets.js";
import { effect } from "../../../effect.js";
import { particle } from "../../../particle.js";
import { skin } from "../../../skin.js";
// import { queueHold } from "../../HoldManager.js";
import { SlideNote } from "./SlideNote.js";
import { options } from '../../../../configuration/options.js'
import { note } from "../../../note.js";
import { windows } from "../../../../../../../shared/src/engine/data/windows.js";
import { queueHold } from "../../HoldManager.js";

export class SlideEndNote extends SlideNote {
    bucket: Bucket = buckets.slideEndNote
    windows = windows.holdNote

    preprocess() {
        super.preprocess()

        const minPrevInputTime =
            bpmChanges.at(this.prevImport.beat).time + this.windows.good.min + input.offset

        this.spawnTime = Math.min(this.spawnTime, minPrevInputTime)
    }

    updateParallel() {
        if (
            this.prevInfo.state === EntityState.Despawned &&
            !this.prevSharedMemory.activatedTouchId && this.hasInput
        )
            this.despawn = true

        super.updateParallel()
    }

    touch() {
        if (!this.hasInput) return

        const id = this.prevSharedMemory.activatedTouchId

        if (id) {
            for (const touch of touches) {
                if (touch.id !== id) continue

                if (!touch.ended) {
                    queueHold(this.slideImport.firstRef)
                    return
                }

                if ((time.now >= this.inputTime.min && this.hitbox.contains(touch.position))) {
                    this.complete(touch.t)
                } else {
                    this.incomplete(touch.t)
                }
                return
            }

            if (time.now >= this.inputTime.min) {
                this.complete(time.now)
            } else {
                this.incomplete(time.now)
            }
            return
        }

        if (this.prevInfo.state !== EntityState.Despawned) return
        debug.log(time.now)
        this.incomplete(time.now)
    }

    complete(hitTime: number) {
        this.result.judgment = input.judge(hitTime, this.targetTime, this.windows)
        this.result.accuracy = hitTime - this.targetTime

        this.result.bucket.index = this.bucket.index
        this.result.bucket.value = this.result.accuracy * 1000

        this.playSFX()
        // this.playEffect()

        this.despawn = true
    }

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
