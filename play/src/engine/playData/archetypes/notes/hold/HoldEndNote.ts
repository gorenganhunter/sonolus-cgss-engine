import { windows } from "../../../../../../../shared/src/engine/data/windows";
import { buckets } from "../../../buckets";
import { note } from "../../../note";
import { skin } from "../../../skin";
import { queueHold } from "../../HoldManager";
import { SlideEndNote } from "../slide/SlideEndNote";

export class HoldEndNote extends SlideEndNote {
    bucket = buckets.holdEndNote

    windows = windows.holdNote

    sprite: SkinSprite = skin.sprites.holdNote

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

                if ((time.now >= this.inputTime.min)) {
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
        this.incomplete(time.now)
    }
}

export class FakeHoldEndNote extends HoldEndNote {
    hasInput: boolean = false
}
