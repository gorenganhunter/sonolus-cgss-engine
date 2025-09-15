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
        visible: { name: "visible", type: Number },
        size: { name: "size", type: Number }
    })

    export = this.defineExport({
        accuracyDiff: { name: 'accuracyDiff', type: Number },
    })

    abstract windows: JudgmentWindows

    abstract bucket: Bucket

    abstract sprite: SkinSprite

    targetTime = this.entityMemory(Number)

    spawnTime = this.entityMemory(Number)

    scheduleSFXTime = this.entityMemory(Number)

    visualTime = this.entityMemory(Range)

    hitbox = this.defineSharedMemory(Rect)

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

        this.visualTime.copyFrom(Range.l.mul(note.duration).add(timeScaleChanges.at(this.targetTime).scaledTime))

        this.spawnTime = Math.min(this.visualTime.min, this.visualTime.max)

        this.import.size = this.import.size || 100

        if (options.mirror) {
            this.import.lane *= -1
            this.import.spawnLane *= -1
        }

        if (this.shouldScheduleSFX) this.scheduleSFX()

        new Rect({ l: this.import.lane - 0.5, r: this.import.lane + 0.5, t: 0, b: 2 }).transform(skin.transform).copyTo(this.hitbox)
    }

    spawnOrder() {
        return 1000 + this.spawnTime
    }

    shouldSpawn() {
        return time.scaled >= this.spawnTime
    }

    initialize() {
        this.inputTime.min = this.targetTime + this.windows.good.min + input.offset
        this.inputTime.max = this.targetTime + this.windows.good.max + input.offset

        // this.visualTime.hidden = this.visualTime.max - note.duration * (100 - this.import.visible) / 100

        this.note.z = getZ(layer.note.body, this.targetTime, this.import.lane)

        this.result.accuracy = this.windows.good.max
    }

    touchOrder = 1

    updateParallel() {
        const t = this.getNoteTransformedTime()

        if (this.hasInput) {
            if (time.now > this.inputTime.max) this.despawn = true
            if (this.despawn) return

            if (t > 1 - this.import.visible / 100) return
            // if (time.now > this.visualTime.hidden) return
        } else {
            if (t < 1 + this.import.visible / 100) this.despawn = true
            if (this.despawn) return
        }

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
        return options.sfxEnabled && options.autoSFX
    }

    get shouldPlaySFX() {
        return options.sfxEnabled && !options.autoSFX
    }

    scheduleSFX() {
        effect.clips.perfect.schedule(this.targetTime, sfxDistance)
    }

    drawNote() {
        const w = 0.25 * this.s
        const h = w * scaledScreen.wToH

        this.sprite.draw(new Rect({ l: this.x - w, r: this.x + w, t: this.y - h, b: this.y + h }), this.note.z, 1)
    }

    playSFX() {
        switch (this.result.judgment) {
            case Judgment.Perfect:
                effect.clips.perfect.play(sfxDistance)
                break
            case Judgment.Great:
                effect.clips.great.play(sfxDistance)
                break
            case Judgment.Good:
                effect.clips.good.play(sfxDistance)
                break
        }
    }

    incomplete(hitTime: number) {
        this.export('accuracyDiff', hitTime - this.result.accuracy - this.targetTime)
        this.despawn = true
    }

    playHitEffects() {
        if (this.shouldPlaySFX) this.playSFX()
        if (options.noteEffectEnabled) this.playNoteEffect()
    }

    playNoteEffect() {
        // const layout = hitEffectLayout(this.import.lane)

        // particle.effects.spawn(effects.hit, layout, 0.35, false)
    }
}
