import { SkinSprite } from "@sonolus/sonolus.js-compiler/play";
import { buckets } from "../../../buckets";
import { getZ, layer, skin } from "../../../skin";
import { scaledScreen } from "../../../scaledScreen";
import { leftRotated, rightRotated } from "../../../../../../../shared/src/engine/data/utils";
import { SlideEndNote } from "./SlideEndNote";
import { queueHold } from "../../HoldManager";
import { windows } from "../../../../../../../shared/src/engine/data/windows";
import { note } from "../../../note";
import { calcV } from "../../FlickManager";

export class SlideEndFlickNote extends SlideEndNote {
    sprite: SkinSprite = skin.sprites.flickLeftNote

    windows = windows.flickNote

    bucket = buckets.slideEndFlickNote

    flickImport = this.defineImport({
        direction: { name: "direction", type: Number },
        nextRef: { name: "next", type: Number }
    })

    activatedTouch = this.entityMemory(TouchId)

    drawNote(): void {
        const w = 0.25 * this.s
        const h = w * scaledScreen.wToH

        if (this.flickImport.direction < 0) skin.sprites.flickLeftNote.draw(new Rect({ l: this.x - w * 1.4, r: this.x + w, t: this.y - h, b: this.y + h }), this.note.z, 1)
        else skin.sprites.flickRightNote.draw(new Rect({ l: this.x - w, r: this.x + w * 1.4, t: this.y - h, b: this.y + h }), this.note.z, 1)
    }

    touch() {
        if (!this.hasInput) return

        const id = this.prevSharedMemory.activatedTouchId

        if (!this.activatedTouch) this.touchActivate(id)

        if (this.activatedTouch) this.touchComplete()
    }

    touchActivate(id: TouchId) {
        if (id) {
            for (const touch of touches) {
                if (touch.id !== id) continue

                if (!touch.ended) queueHold(this.slideImport.firstRef)

                if (time.now >= this.inputTime.min && this.hitbox.contains(touch.position)) {
                    this.activate(touch)
                } else if (touch.ended) {
                    this.incomplete(touch.t)
                }
                return
            }

            this.incomplete(time.now)
            return
        }

        if (this.prevInfo.state !== EntityState.Despawned) return
        this.incomplete(time.now)
    }

    activate(touch: Touch) {
        this.activatedTouch = touch.id
    }

    touchComplete() {
        for (const touch of touches) {
            if (touch.id !== this.activatedTouch) continue

            if (calcV(touch) > 0.2 && ((touch.dx > 0 && this.flickImport.direction > 0) || (touch.dx < 0 && this.flickImport.direction < 0))) {
                this.complete(touch.time)
            } else if (touch.ended) {
                this.incomplete(touch.t)
            }
            return
        }
    }

    complete(t: number) {
        this.result.judgment = input.judge(t, this.targetTime, this.windows)
        this.result.accuracy = t - this.targetTime
        this.export('accuracyDiff', time.now - t)

        this.result.bucket.index = this.bucket.index
        this.result.bucket.value = this.result.accuracy * 1000

        this.playHitEffects()

        this.despawn = true
    }
}

export class FakeSlideEndFlickNote extends SlideEndFlickNote {
    hasInput: boolean = false
}
