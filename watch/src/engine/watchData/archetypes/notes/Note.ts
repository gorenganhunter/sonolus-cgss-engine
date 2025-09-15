import { EngineArchetypeDataName } from '@sonolus/core'
import { options } from '../../../configuration/options.js'
import { effect, getScheduleSFXTime, sfxDistance } from '../../effect.js'
import { note/* , noteLayout */ } from '../../note.js'
// import { effects, hitEffectLayout, particle } from '../../particle.js'
import { getZ, layer, skin } from '../../skin.js'
import { scaledScreen } from '../../scaledScreen.js'
import { getNoteSize, getNoteTransformedTime, getNoteXPosition, getNoteYPosition } from '../../../../../../shared/src/engine/data/utils.js'

export abstract class Note extends Archetype {
    hasInput = true

    import = this.defineImport({
        beat: { name: EngineArchetypeDataName.Beat, type: Number },
        lane: { name: 'lane', type: Number },
        spawnLane: { name: 'spawnLane', type: Number },
        visible: { name: 'visible', type: Number },
        size: { name: 'size', type: Number },
        judgment: { name: EngineArchetypeDataName.Judgment, type: DataType<Judgment> },
        accuracy: { name: EngineArchetypeDataName.Accuracy, type: Number },
    })

    abstract windows: JudgmentWindows

    abstract bucket: Bucket

    abstract sprite: SkinSprite

    targetTime = this.entityMemory(Number)

    sharedMemory = this.defineSharedMemory({
        despawnTime: Number
    })

    // spawnTime = this.entityMemory(Number)

    scheduleSFXTime = this.entityMemory(Number)

    visualTime = this.entityMemory({
        min: Number,
        max: Number,
        hidden: Number,
    })

    hitbox = this.entityMemory(Rect)

    hasSFXScheduled = this.entityMemory(Boolean)

    inputTime = this.entityMemory({
        min: Number,
        max: Number,
    })

    note = this.entityMemory({
        layout: Rect,
        z: Number,
    })

    x = this.entityMemory(Number)
    y = this.entityMemory(Number)
    s = this.entityMemory(Number)

    initialized = this.entityMemory(Boolean)

    get hitTime() {
        return this.targetTime + this.import.accuracy
    }

    spawnTime() {
        return this.visualTime.min
    }

    despawnTime(): number {
        return /*this.import.visible >= 0 ?*/ replay.isReplay ? timeScaleChanges.at(this.hitTime).scaledTime : this.sharedMemory.despawnTime/* : this.visualTime.min + note.duration * (this.import.visible / -100)*/
    }

    globalPreprocess() {
        const toMs = ({ min, max }: { min: number, max: number }) => ({
            min: Math.round(min * 1000),
            max: Math.round(max * 1000),
        })

        this.bucket.set({
            perfect: toMs(this.windows.perfect),
            great: toMs(this.windows.great),
            good: toMs(this.windows.good),
        })

        this.life.miss = -40
    }

    preprocess() {
        this.targetTime = bpmChanges.at(this.import.beat).time

        this.visualTime.max = timeScaleChanges.at(this.targetTime).scaledTime
        this.visualTime.min = this.visualTime.max - note.duration

        this.sharedMemory.despawnTime = this.visualTime.max

        if (this.hasInput) this.result.time = this.targetTime

        if (options.mirror) {
            this.import.lane *= -1
            this.import.spawnLane *= -1
        }

        this.import.size = this.import.size || 100

        if (!this.hasInput) return

        if (this.shouldScheduleSFX) this.scheduleSFX()

        if (!replay.isReplay) {
            this.result.bucket.index = this.bucket.index
        } else if (this.import.judgment) {
            this.result.bucket.index = this.bucket.index
            this.result.bucket.value = this.import.accuracy * 1000
        }
    }

    initialize() {
        if (this.initialized) return
        this.initialized = true
        //
        // if (options.hidden > 0)
        //     this.visualTime.hidden = this.visualTime.max - note.duration * options.hidden

        this.note.z = getZ(layer.note.body, this.targetTime, this.import.lane)
    }

    touchOrder = 1

    updateParallel() {
        const t = this.getNoteTransformedTime()

        if (this.import.visible > 0 && t > 1 - this.import.visible / 100) return
        if (this.import.visible < 0 && t < 1 + this.import.visible / 100) return
        // if (time.scaled < this.visualTime.min + this.import.visible / 100 * note.duration) return

        this.x = this.getNoteXPosition(t)
        this.s = getNoteSize(t) * this.import.size / 100
        this.y = getNoteYPosition(t)

        this.drawNote()
    }

    getNoteTransformedTime() {
        return getNoteTransformedTime(this.visualTime.min, this.visualTime.max, time.scaled)
    }

    getNoteXPosition(t: number) {
        return getNoteXPosition(this.import.spawnLane * 0.75, this.import.lane, t)
    }

    get shouldScheduleSFX() {
        return options.sfxEnabled && this.hasInput
    }

    scheduleSFX() {
        if (replay.isReplay) {
            switch (this.import.judgment) {
                case Judgment.Perfect:
                    effect.clips.perfect.exists ? effect.clips.perfect.schedule(this.hitTime, 0.02) : effect.clips.perfect.schedule(this.hitTime, 0.02)
                    break
                case Judgment.Great:
                    effect.clips.great.exists ? effect.clips.great.schedule(this.hitTime, 0.02) : effect.clips.great.schedule(this.hitTime, 0.02)
                    break
                case Judgment.Good:
                    effect.clips.good.exists ? effect.clips.good.schedule(this.hitTime, 0.02) : effect.clips.good.schedule(this.hitTime, 0.02)
                    break
            }
        } else {
            effect.clips.perfect.exists ? effect.clips.perfect.schedule(this.targetTime, 0.02) : effect.clips.perfect.schedule(this.targetTime, 0.02)
        }
    }

    drawNote() {
        const w = 0.25 * this.s
        const h = w * scaledScreen.wToH

        this.sprite.draw(new Rect({ l: this.x - w, r: this.x + w, t: this.y - h, b: this.y + h }), this.note.z, 1)
    }

    playHitEffects() {
        // if (this.shouldPlaySFX) this.playSFX()
        if (options.noteEffectEnabled) this.playNoteEffect()
    }

    playNoteEffect() {
        // const layout = hitEffectLayout(this.import.lane)

        // particle.effects.spawn(effects.hit, layout, 0.35, false)
    }

    terminate() {
        if (time.skip) return
        if (replay.isReplay && !this.import.judgment) return

        this.playHitEffects()
        // this.effect.spawn(this.notePosition, 0.3, false)
    }
}
