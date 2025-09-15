// import { quadraticBezier } from '../../../../../shared/src/engine/data/utils.js'
import { getNoteSize, getNoteTransformedTime, getNoteXPosition, getNoteYPosition } from '../../../../../../shared/src/engine/data/utils.js'
import { options } from '../../../configuration/options.js'
import { effect } from '../../effect.js'
import { /* getBackspinTime, */ note } from '../../note.js'
import { particle } from '../../particle.js'
import { scaledScreen } from '../../scaledScreen.js'
import { getZ, layer, skin } from '../../skin.js'
import { moveHold } from '../HoldManager.js'
import { archetypes } from '../index.js'
// import { time.nowToEarliestTime, timeToScaledTime } from './utils.js'

export class BaseConnector extends Archetype {
    thickness: number = 0.5

    import = this.defineImport({
        headRef: { name: 'prev', type: Number },
        tailRef: { name: 'next', type: Number },
    })

    sprite = this.entityMemory({
        slide: SkinSpriteId,
        head: SkinSpriteId,
        tail: SkinSpriteId,
        connector: SkinSpriteId,
        connector2: SkinSpriteId
    })

    head = this.entityMemory({
        time: Number,
        scaledTime: Number,
        lane: Number,
        spawnTime: Number,

        l: Number,
        r: Number,
    })
    tail = this.entityMemory({
        time: Number,
        scaledTime: Number,
        lane: Number,
        spawnTime: Number,

        l: Number,
        r: Number,
    })

    visualTime = this.entityMemory({
        min: Number,
        hidden: Number,
    })

    spawnTime = this.entityMemory(Number)

    connector = this.entityMemory({
        z: Number,
    })

    sfxId = this.entityMemory(ScheduledLoopedEffectClipInstanceId)

    slide = this.entityMemory({
        t: Number,
        b: Number,
        z: Number,
    })

    bsTime = this.entityMemory(Number)

    preprocess() {
        this.head.time = bpmChanges.at(this.headImport.beat).time
        this.head.scaledTime = timeScaleChanges.at(this.head.time).scaledTime
        // this.head.time.now = timeToScaledTime(this.head.time, this.headImport.timescaleGroup)

        this.tail.time = bpmChanges.at(this.tailImport.beat).time
        this.tail.scaledTime = timeScaleChanges.at(this.tail.time).scaledTime
        // this.tail.time.now = timeToScaledTime(this.tail.time, this.tailImport.timescaleGroup)

        this.head.spawnTime = this.head.scaledTime - note.duration
        this.tail.spawnTime = this.tail.scaledTime - note.duration

        this.visualTime.min = Math.min(
            this.head.spawnTime/* + note.duration * (this.headImport.visible >= 0 ? this.headImport.visible / 100 : 1)*/,
            this.tail.spawnTime/* + note.duration * (this.tailImport.visible >= 0 ? this.tailImport.visible / 100 : 1)*/
        ) /* (options.backspinAssist ? this.head.time : this.head.time.now) */

        // this.bsTime = getBackspinTime(this.head.time, this.headImport.timescaleGroup)

        this.spawnTime = /* options.backspinAssist ?*/ this.visualTime.min /*: Math.min(*/
        //     time.nowToEarliestTime(spawnTime, this.headImport.timescaleGroup),
        //     time.nowToEarliestTime(spawnTime, this.tailImport.timescaleGroup)
        // )

        // if (this.shouldScheduleSFX) this.scheduleSFX()
    }

    spawnOrder(): number {
        return 1000 + this.spawnTime
    }

    shouldSpawn(): boolean {
        return time.scaled >= this.spawnTime
    }

    initialize() {
        const w = 0.25 // 0.7 * options.noteSize
        const h = w * scaledScreen.wToH

        this.head.lane = this.headImport.lane
        this.head.l = this.head.lane - w
        this.head.r = this.head.lane + w

        this.tail.lane = this.tailImport.lane
        this.tail.l = this.tail.lane - w
        this.tail.r = this.tail.lane + w

        // this.sprite.connector = (this.headImport.lane === -3 || this.headImport.lane === 3) ? skin.sprites.stopConnector.id : skin.sprites.holdConnector.id
        // this.sprite.slide = (this.headImport.lane === -3 || this.headIport.lane === 3) ? skin.sprites.stopHead.id : skin.sprites.holdHead.id

        this.sprite.connector = skin.sprites.connector.id

        this.connector.z = getZ(layer.connector, this.head.time, this.headImport.lane)

        this.slide.t = 1 - h
        this.slide.b = 1 + h
        this.slide.z = getZ(layer.slide.body, this.head.time, this.headImport.lane)
    }

    updateParallel() {
        if (
            (time.now > this.tail.time) ||
            (this.startInfo.state === EntityState.Despawned &&
                !this.startSharedMemory.activatedTouchId && this.headImport.visible >= 0) ||
            this.endInfo.state === EntityState.Despawned
        ) {
            // debug.log(time.now)
            this.despawn = true
            return
        }

        // const time.now = options.backspinAssist ? time.now : timeToScaledTime(time.now, this.headImport.timescaleGroup)

        // if (time.now < this.visualTime.min + (1 - options.laneLength) * note.duration) return

        if (time.scaled < this.visualTime.min) return

        this.renderConnector()

        if (this.headImport.visible < 0) return
        if (time.now < this.head.time) return

        this.renderSlide()
        // this.updateEffects()
    }

    get startInfo() {
        return entityInfos.get(this.import.headRef)
    }

    get startSharedMemory() {
        return archetypes.HoldStartNote.sharedMemory.get(this.import.headRef)
    }

    get endInfo() {
        return entityInfos.get(this.import.tailRef)
    }

    get headImport() {
        return archetypes.HoldStartNote.import.get(this.import.headRef)
    }

    get tailImport() {
        return archetypes.HoldEndNote.import.get(this.import.tailRef)
    }

    // get shouldScheduleSFX() {
    //     return options.sfxEnabled && effect.clips.longLoop.exists && options.autoSfx && this.headImport.lane != -3 && this.headImport.lane != 3
    // }

    // get shouldUpdateCircularEffect() {
    //     return options.noteEffectEnabled && particle.effects.holdCircular.exists
    // }

    // get shouldUpdateLinearEffect() {
    //     return options.noteEffectEnabled && particle.effects.holdLinear.exists
    // }

    // scheduleSFX() {
    //     this.sfxId = effect.clips.longLoop.scheduleLoop(this.head.time)
    //     effect.clips.scheduleStopLoop(this.sfxId, this.tail.time)
    // }

    renderConnector() {
        // if (options.hidden > 0 && time.now > this.visualTime.hidden) return
        // const time.now = options.backspinAssist ? time.now : timeToScaledTime(time.now, this.headImport.timescaleGroup)
        const hiddenDuration = /* options.hidden > 0 ? note.duration * options.hidden : */ 0

        // const visibleTime = {
        //     min: Math.max(time.scaled /*+ note.duration * (this.headImport.visible < 0 ? 1 - this.headImport.visible / -100 : 0)*/, this.head.scaledTime/* - note.duration * (this.headImport.visible >= 0 ? 0 : 1 + this.headImport.visible / 100)*/),
        //     max: Math.min(this.tail.spawnTime/* + note.duration * (this.tailImport.visible < 0 ? 0 : this.tailImport.visible / 100)*/, time.scaled + note.duration /* (this.tailImport.visible >= 0 ? 1 - this.tailImport.visible * 100 : 1)*/),
        // }

        const t1 = getNoteTransformedTime(this.head.spawnTime, this.head.scaledTime, /*this.headImport.visible < 0 ? Math.min(time.scaled, this.head.scaledTime - note.duration * (1 + this.headImport.visible / 100)) : */time.scaled, true)
        const t2 = getNoteTransformedTime(this.tail.spawnTime, this.tail.scaledTime, /*this.tailImport.visible >= 0 ? Math.max(time.scaled, this.tail.spawnTime + note.duration * this.tailImport.visible / 100) : */time.scaled, true)
        const tmid = (t1 + t2) / 2
        const x1 = time.scaled > this.head.scaledTime ? Math.remap(this.head.scaledTime, this.tail.scaledTime, this.headImport.lane, this.tailImport.lane, time.scaled) : getNoteXPosition(this.headImport.spawnLane * 0.75, this.headImport.lane, t1)
        const x2 = getNoteXPosition(this.tailImport.spawnLane * 0.75, this.tailImport.lane, t2)
        const xmid = getNoteXPosition(this.tailImport.spawnLane * 0.75, this.tailImport.lane, tmid)

        const div = Math.ceil((t2 - t1) / note.duration * options.connectorQuality)
        // const div = Math.ceil((visibleTime.max - visibleTime.min) / note.duration * options.connectorQuality)

        let xS: any = {
            min: 0,
            max: 0
        }
        let yS: any = {
            min: 0,
            max: 0
        }

        const thead = getNoteTransformedTime(this.head.spawnTime, this.head.scaledTime, /*this.headImport.visible < 0 ? Math.min(time.scaled, this.head.scaledTime - note.duration * (1 + this.headImport.visible / 100)) : */time.scaled)
        const ttail = getNoteTransformedTime(this.tail.spawnTime, this.tail.scaledTime, /*this.tailImport.visible >= 0 ? Math.max(time.scaled, this.tail.spawnTime + note.duration * this.tailImport.visible / 100) : */time.scaled)

        for (let i = 0; i < div; i++) {
            // const scaledTime = {
            //     min: Math.lerp(visibleTime.min, visibleTime.max, i / div),
            //     max: Math.lerp(visibleTime.min, visibleTime.max, (i + 1) / div),
            // }

            // const size = {
            //     min: Math.remapClamped(this.head.scaledTime, this.tail.scaledTime, this.headImport.size, this.tailImport.size, scaledTime.min) / 100,
            //     max: Math.remapClamped(this.head.scaledTime, this.tail.scaledTime, this.headImport.size, this.tailImport.size, scaledTime.max) / 100,
            // }

            const t = {
                min: Math.lerp(t1, t2, i / div),
                max: Math.lerp(t1, t2, (i + 1) / div)
            }

            const size = {
                min: Math.remap(thead, ttail, this.headImport.size / 100, this.tailImport.size / 100, t.min),
                max: Math.remap(thead, ttail, this.headImport.size / 100, this.tailImport.size / 100, t.max),
            }

            const s = {
                min: getNoteSize(t.min),
                max: getNoteSize(t.max),
            }

            const x = {
                min: (1 - (i / div)) ** 2 * x1 + 2 * (1 - (i / div)) * (i / div) * xmid + (i / div) ** 2 * x2,
                max: (1 - ((i + 1) / div)) ** 2 * x1 + 2 * (1 - ((i + 1) / div)) * ((i + 1) / div) * xmid + ((i + 1) / div) ** 2 * x2,
            }

            const y = {
                min: getNoteYPosition(t.min),
                max: getNoteYPosition(t.max),
            }

            const thickness = this.thickness
            const width = x.min - x.max
            const height = (y.min - y.max) / scaledScreen.wToH
            const length = Math.sqrt(width * width + height * height)

            xS.min = i > 0 ? xS.max : (thickness * size.min * s.min * height / length) / 2
            xS.max = (thickness * size.max * s.max * height / length) / 2

            yS.min = i > 0 ? yS.max : ((thickness * size.min * s.min * width / length) / 2) * scaledScreen.wToH
            yS.max = ((thickness * size.max * s.max * width / length) / 2) * scaledScreen.wToH


            const layout = {
                x1: (x.min - xS.min)/*  * (y.min + yS) */,
                x2: (x.max - xS.max)/*  * (y.max + yS) */,
                x3: (x.max + xS.max)/*  * (y.max - yS) */,
                x4: (x.min + xS.min)/*  * (y.min - yS) */,
                y1: (y.min + yS.min),
                y2: (y.max + yS.max),
                y3: (y.max - yS.max),
                y4: (y.min - yS.min),
            }

            const a =
                (this.headImport.visible < 0 && t.min < 1 - (-this.headImport.visible + 10) / 100)
                    ? Math.remapClamped(1 - (-this.headImport.visible + 10) / 100, 1 - (-this.headImport.visible - 10) / 100, 0, 1, t.min)
                    : (this.tailImport.visible > 0 && t.max > 1 - (this.headImport.visible - 10) / 100)
                        ? Math.remapClamped(1 - (this.tailImport.visible - 10) / 100, 1 - (this.tailImport.visible + 10) / 100, 0, 1, t.max)
                        : 1

            debug.log(a)

            skin.sprites.draw(this.sprite.connector, layout, this.connector.z, a * options.connectorAlpha/*, "lr", 16, { x: 0.5, y: 1 }, { x: 1, y: 1 }*/)
        }
    }

    renderSlide() {
        const thead = getNoteTransformedTime(this.head.spawnTime, this.head.scaledTime, /*this.headImport.visible < 0 ? Math.min(time.scaled, this.head.scaledTime - note.duration * (1 + this.headImport.visible / 100)) : */time.scaled)
        const ttail = getNoteTransformedTime(this.tail.spawnTime, this.tail.scaledTime, /*this.tailImport.visible >= 0 ? Math.max(time.scaled, this.tail.spawnTime + note.duration * this.tailImport.visible / 100) : */time.scaled)
        const size = Math.remap(thead, ttail, this.headImport.size, this.tailImport.size, 0) / 100
        // const time.now = options.backspinAssist ? time.now : timeToScaledTime(time.now, this.headImport.timescaleGroup)
        skin.sprites.draw(
            this.sprite.slide,
            new Rect({
                // perspectiveLayout({
                l: this.getLane(time.scaled) - 0.25 * size, // (1.05 * options.noteSize),
                r: this.getLane(time.scaled) + 0.25 * size, // (1.05 * options.noteSize),
                b: (this.slide.b - 1) * size + 1,
                t: (this.slide.t - 1) * size + 1,
            }),
            this.slide.z,
            1,
        )
    }

    // updateEffects() {
    //     const time.now = options.backspinAssist ? time.now : timeToScaledTime(time.now, this.headImport.timescaleGroup)
    //     moveHold(this.import.headRef, this.getLane(time.now))
    // }

    // getLaneA(time: number) {
    //     return Math.remap(this.head.time) // Math.min(Math.max(this.head.lane, this.tail.lane), Math.max(Math.min(this.head.lane, this.tail.lane), Math.remap(this.head.time, this.tail.time, this.head.lane, this.tail.lane, time)))
    // }
    // 
    getLane(time2: number) {
        return time.scaled > this.head.scaledTime ? Math.remap(this.head.scaledTime, this.tail.scaledTime, this.headImport.lane, this.tailImport.lane, time.scaled) : getNoteXPosition(this.headImport.spawnLane * 0.75, this.headImport.lane, getNoteTransformedTime(this.head.spawnTime, this.head.scaledTime, time.scaled))
    }
}
