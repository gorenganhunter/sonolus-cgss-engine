import { Bucket, JudgmentWindows, SkinSprite } from "@sonolus/sonolus.js-compiler/play";
import { Note } from "../Note";
import { skin } from "../../../skin";
import { buckets } from "../../../buckets";
import { note } from "../../../note";

export class AccidentNote extends Note {
    sprite: SkinSprite = skin.sprites.accidentNote

    windows: JudgmentWindows = {
        perfect: Range.zero,
        great: Range.zero,
        good: Range.one.mul(0.1),
    }

    bucket: Bucket = buckets.accidentNote

    damageExport = this.defineExport({
        hitTime: { name: 'hitTime', type: Number },
    })

    shouldQuit = this.entityMemory(Boolean)

    globalPreprocess() {
        this.life.miss = -40
    }

    touch() {
        if (!this.hasInput) return

        for (const touch of touches) {
            if (time.now < this.targetTime) continue
            if (!this.hitbox.contains(touch.position)) continue

            this.complete()
            return
        }
    }

    updateParallel(): void {
        super.updateParallel()
        if (this.shouldQuit) {
            this.result.judgment = Judgment.Perfect
            this.result.accuracy = 0

            this.result.bucket.index = this.bucket.index
            this.result.bucket.value = this.result.accuracy * 1000

            this.despawn = true
        }
        if (time.now > this.targetTime) {
            this.shouldQuit = true
        }
    }

    complete(): void {
        this.result.judgment = Judgment.Miss
        this.result.accuracy = 0

        this.result.bucket.index = this.bucket.index
        this.result.bucket.value = this.result.accuracy * 1000

        this.damageExport("hitTime", time.now)

        this.playHitEffects()

        this.despawn = true
    }
}

export class FakeAccidentNote extends AccidentNote {
    hasInput: boolean = false
}
