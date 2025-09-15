import { Bucket, JudgmentWindows } from "@sonolus/sonolus.js-compiler/play";
import { Note } from "../Note";
import { buckets } from "../../../buckets";
import { getZ, layer, skin } from "../../../skin";
import { windows } from "../../../../../../../shared/src/engine/data/windows";
import { scaledScreen } from "../../../scaledScreen";
import { leftRotated, rightRotated } from "../../../../../../../shared/src/engine/data/utils";
import { note } from "../../../note";
import { options } from "../../../../configuration/options";
import { flickClaimStart, flickGetClaimedStart } from "../../FlickManager";

export class FlickNote extends Note {
    bucket: Bucket = buckets.flickNote
    windows: JudgmentWindows = windows.flickNote

    sprite: SkinSprite = skin.sprites.flickLeftNote

    flickImport = this.defineImport({
        direction: { name: "direction", type: Number },
        nextRef: { name: "next", type: Number }
    })

    updateSequential() {
        super.updateSequential()

        if (!this.hasInput) return

        if (time.now < this.inputTime.min) return
        if (time.now > this.inputTime.max) this.incomplete(time.now)
        flickClaimStart(this.info.index)
        // debug.log(5555)
    }

    touch() {
        if (!this.hasInput) return

        if (time.now < this.inputTime.min) return
        let index = flickGetClaimedStart(this.info.index)
        if (index === -1) return
        this.complete(time.now)
        // debug.log(8888)
        // markAsUsedId(index)
        // debug.log(index)

        // const hitbox = this.getHitbox()

        // if(this.activatedTouchId) {
        //     for (const touch of touches) {
        //         if(touch.id !== this.activatedTouchId) continue

        //         // const d = touch.position.sub(touch.startPosition).length

        //         // if((d >= 0.04 * screen.w ) && (touch.vr > 2)) this.complete(touch)
        //         if (isClaimed(touch)) continue

        //         if(touch.ended) this.incomplete(time.now)
        //         else this.complete(touch)

        //         return
        //     }
        // } else {
        //     for (const touch of touches) {
        //         if(!hitbox.contains(touch.position)) continue
        //         if(!hitbox.contains(touch.startPosition)) continue
        //         if(isUsed(touch)) continue
        //         if(isClaimed(touch)) continue

        //         if (touch.started) {
        //             startClaim(touch)
        //             // markAsUsed(touch)
        //         }
        //         // debug.log(touch.id)

        //         this.activatedTouchId = touch.id
        //         return
        //     }
        // }
    }

    complete(hitTime: number) {
        const t = Math.max(Math.min(hitTime, this.targetTime + this.windows.perfect.max / 2), this.targetTime + this.windows.perfect.min / 2)
        this.result.judgment = input.judge(t, this.targetTime, this.windows)
        this.result.accuracy = t - this.targetTime

        // if (options.sfxEnabled) switch (this.result.judgment) {
        //     case Judgment.Perfect:
        //         this.sfx.perfect.play(0.02)
        //         break
        //     case Judgment.Great:
        //         this.sfx.great.play(0.02)
        //         break
        //     case Judgment.Good:
        //         this.sfx.good.play(0.02)
        //         break
        // }
        // debug.log(t)
        this.result.bucket.index = this.bucket.index
        this.result.bucket.value = this.result.accuracy * 1000

        this.playHitEffects()

        // this.playSFX()
        // this.playEffect()

        // claim(touch)

        this.despawn = true
    }

    drawNote(): void {
        const w = 0.25 * this.s
        const h = w * scaledScreen.wToH

        if (this.flickImport.direction < 0) skin.sprites.flickLeftNote.draw(new Rect({ l: this.x - w * 1.4, r: this.x + w, t: this.y - h, b: this.y + h }), this.note.z, 1)
        else skin.sprites.flickRightNote.draw(new Rect({ l: this.x - w, r: this.x + w * 1.4, t: this.y - h, b: this.y + h }), this.note.z, 1)
    }

    // get tailImport() {
    //     return this.import.get(this.flickImport.nextRef)
    // }
}

export class FakeFlickNote extends FlickNote {
    hasInput: boolean = false
}
