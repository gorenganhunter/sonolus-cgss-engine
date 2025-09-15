import { windows } from '../../../../../../../shared/src/engine/data/windows.js'
import { buckets } from '../../../buckets.js'
import { note } from '../../../note.js'
import { skin } from '../../../skin.js'
import { isUsed, markAsUsed } from '../../InputManager.js'
import { Note } from '../Note.js'
// import { SingleNote } from './SingleNote.js'

export class TapNote extends Note {
    windows = windows.tapNote

    bucket = buckets.tapNote

    sprite = skin.sprites.tapNote

    touch() {
        if (!this.hasInput) return

        if (time.now < this.inputTime.min) return

        for (const touch of touches) {
            if (!touch.started) continue
            if (isUsed(touch)) continue

            if (!this.hitbox.contains(touch.position)) continue

            // const { lane, radius } = transform(touch.position)
            // if (Math.abs(radius - 1) > 0.32) continue
            // if (Math.abs(lane - this.import.lane) > 0.5) continue

            this.complete(touch)
            return
        }
    }

    complete(touch: Touch) {
        markAsUsed(touch)
        // this.singleSharedMemory.activatedTouchId = touch.id

        this.result.judgment = input.judge(touch.startTime, this.targetTime, this.windows)
        this.result.accuracy = touch.startTime - this.targetTime

        this.result.bucket.index = this.bucket.index
        this.result.bucket.value = this.result.accuracy * 1000

        this.playHitEffects()

        this.despawn = true
    }
}

export class FakeTapNote extends TapNote {
    hasInput: boolean = false
}
