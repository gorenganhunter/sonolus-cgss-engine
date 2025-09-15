import { archetypes } from "..";
import { getSpriteId } from "../../../../../../shared/src/engine/data/decorator";
import { getNoteSize, getNoteTransformedTime, getNoteXPosition, getNoteYPosition } from "../../../../../../shared/src/engine/data/utils";
import { options } from "../../../configuration/options";
import { note } from "../../note";
import { scaledScreen } from "../../scaledScreen";
import { getZ, layer, skin } from "../../skin";
import { BaseConnector } from "./BaseConnector";

export class DecoratorConnector extends BaseConnector {
    initialize(): void {
        super.initialize()
        this.sprite.slide = -1 as SkinSpriteId
        this.sprite.connector = getSpriteId(skin.sprites, this.headImport.color)
        this.sprite.connector2 = getSpriteId(skin.sprites, this.tailImport.color)
        this.sprite.head = getSpriteId(skin.sprites, this.headImport.color, true)
        this.sprite.tail = getSpriteId(skin.sprites, this.tailImport.color, true)
        this.connector.z = getZ(layer.decorator, this.head.time, this.headImport.lane)
    }

    updateParallel(): void {
        if (
            this.startInfo.state === EntityState.Despawned && this.endInfo.state === EntityState.Despawned
        ) {
            // debug.log(time.now)
            this.despawn = true
            return
        }

        // const time.now = options.backspinAssist ? time.now : timeToScaledTime(time.now, this.headImport.timescaleGroup)

        // if (time.now < this.visualTime.min + (1 - options.laneLength) * note.duration) return

        if (time.scaled < this.visualTime.min) return

        this.renderConnector()
    }

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
        const x1 = time.scaled > this.head.scaledTime ? Math.remapClamped(this.head.scaledTime, this.tail.scaledTime, this.headImport.lane, this.tailImport.lane, time.scaled) : getNoteXPosition(this.headImport.spawnLane * 0.75, this.headImport.lane, t1)
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

        const t3 = getNoteTransformedTime(this.head.spawnTime, this.head.scaledTime, /*this.headImport.visible < 0 ? Math.min(time.scaled, this.head.scaledTime - note.duration * (1 + this.headImport.visible / 100)) : */time.scaled, true, false)
        const t4 = getNoteTransformedTime(this.tail.spawnTime, this.tail.scaledTime, /*this.tailImport.visible >= 0 ? Math.max(time.scaled, this.tail.spawnTime + note.duration * this.tailImport.visible / 100) : */time.scaled, true, false)

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
                min: Math.remap(t3, t4, this.headImport.size / 100, this.tailImport.size / 100, t.min),
                max: Math.remap(t3, t4, this.headImport.size / 100, this.tailImport.size / 100, t.max),
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

            if (this.sprite.connector === this.sprite.connector2) {
                skin.sprites.draw(this.sprite.connector, layout, this.connector.z, 1 * a)
            } else {
                skin.sprites.draw(this.sprite.connector, layout, this.connector.z, (1 - (i + 0.5) / div) * a)
                skin.sprites.draw(this.sprite.connector2, layout, this.connector.z + 0.0000001, (i + 0.5) / div * a)
            }

            if (i === 0 &&/* t1 === t.min &&*/ !this.headImport.prevRef) {
                const w = 0.25 * s.min * size.min
                const dx = layout.x4 - layout.x1
                const dy = layout.y4 - layout.y1
                const a = Math.atan2(dy / scaledScreen.wToH, dx)

                skin.sprites.draw(this.sprite.head, new Quad({
                    x1: -w,
                    x2: -w,
                    x3: w,
                    x4: w,
                    y1: 0,
                    y2: -w,
                    y3: -w,
                    y4: 0
                }).rotate(a + Math.PI).scale(1, scaledScreen.wToH).translate(x.min, y.min), this.connector.z, 1)
            }

            if (i === div - 1/* && t2 === t.max */ && !this.tailImport.nextRef) {
                const w = 0.25 * s.max * size.max
                const dx = layout.x3 - layout.x2
                const dy = layout.y3 - layout.y2
                const a = Math.atan2(dy / scaledScreen.wToH, dx)

                skin.sprites.draw(this.sprite.tail, new Quad({
                    x1: -w,
                    x2: -w,
                    x3: w,
                    x4: w,
                    y1: 0,
                    y2: -w,
                    y3: -w,
                    y4: 0
                }).rotate(a).scale(1, scaledScreen.wToH).translate(x.max, y.max), this.connector.z, 1)
            }
        }
    }

    get headImport() {
        return archetypes.Decorator.import.get(this.import.headRef)
    }

    get tailImport() {
        return archetypes.Decorator.import.get(this.import.tailRef)
    }
}
