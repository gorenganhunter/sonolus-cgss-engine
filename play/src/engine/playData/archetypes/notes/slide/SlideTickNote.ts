import { JudgmentWindows, SkinSprite } from "@sonolus/sonolus.js-compiler/play";
import { SlideNote } from "./SlideNote";
import { skin } from "../../../skin";
import { windows } from "../../../../../../../shared/src/engine/data/windows";
import { buckets } from "../../../buckets";
import { queueHold } from "../../HoldManager";
import { note } from "../../../note";

export class SlideTickNote extends SlideNote {
    sprite: SkinSprite = skin.sprites.slideTick
    windows: JudgmentWindows = windows.holdNote
    bucket: Bucket = buckets.slideTickNote

    hitTime = this.entityMemory(Number)

    preprocess() {
        super.preprocess()

        const minPrevInputTime =
            bpmChanges.at(this.prevImport.beat).time + this.windows.good.min + input.offset

        this.spawnTime = Math.min(this.spawnTime, minPrevInputTime)
    }

    touch() {
        if (!this.hasInput) return

        const id = this.prevSharedMemory.activatedTouchId
        if (id) {
            for (const touch of touches) {
                if (touch.id !== id) continue

                if (!touch.ended) queueHold(this.slideImport.firstRef)

                if (time.now >= this.inputTime.min && this.hitbox.contains(touch.position)) {
                    this.hitTime = touch.t
                } else if (touch.ended) {
                    this.incomplete(touch.t)
                }
                return
            }

            if (time.now >= this.inputTime.min) {
                this.hitTime = time.now
            } else {
                this.incomplete(time.now)
            }
            return
        }

        if (this.prevInfo.state !== EntityState.Despawned) return
        debug.log(time.now)
        this.incomplete(time.now)
        // if (time.now < this.inputTime.min) return
        //
        // for (const touch of touches) {
        //     if (!this.hitbox.contains(touch.position)) continue
        //
        //     this.complete(touch.id, touch.t)
        //     return
        // }
    }

    updateSequential() {
        super.updateSequential()

        if (this.hitTime && time.now >= this.targetTime) this.complete(this.prevSharedMemory.activatedTouchId, this.hitTime)
    }

    complete(id: TouchId, hitTime: number) {
        this.sharedMemory.activatedTouchId = id

        hitTime = Math.max(hitTime, this.targetTime)

        this.result.judgment = input.judge(hitTime, this.targetTime, this.windows)
        this.result.accuracy = hitTime - this.targetTime

        this.result.bucket.index = this.bucket.index
        this.result.bucket.value = this.result.accuracy * 1000

        this.playHitEffects()

        this.despawn = true
    }
    //
    // drawNote() {
    //     if (time.now >= this.targetTime) return
    //
    //     super.drawNote()
    // }
}

export class FakeSlideTickNote extends SlideTickNote {
    hasInput: boolean = false
}
