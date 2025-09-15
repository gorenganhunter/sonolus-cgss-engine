import { getNoteSize, getNoteTransformedTime, getNoteXPosition, getNoteYPosition } from "../../../../../../shared/src/engine/data/utils";
import { options } from "../../../configuration/options";
import { note } from "../../note";
import { scaledScreen } from "../../scaledScreen";
import { skin } from "../../skin";
import { BaseConnector } from "./BaseConnector";

export class FlickConnector extends BaseConnector {
    thickness: number = 0.25

    initialize(): void {
        super.initialize()
        this.sprite.slide = -1 as SkinSpriteId
    }

    renderConnector() {
        const visibleTime = {
            min: Math.max(time.scaled + note.duration * (this.headImport.visible < 0 ? 1 - this.headImport.visible / -100 : 0), this.head.scaledTime/* - note.duration * (this.headImport.visible >= 0 ? 0 : 1 + this.headImport.visible / 100)*/),
            max: Math.min(this.tail.scaledTime /*- note.duration * (this.tailImport.visible < 0 ? 0 : 1 - this.tailImport.visible / 100) */, time.scaled + note.duration),
        }

        const t1 = getNoteTransformedTime(this.head.spawnTime, this.head.scaledTime, time.scaled, true)
        const t2 = getNoteTransformedTime(this.tail.spawnTime, this.tail.scaledTime, time.scaled, true)
        const x1 = time.scaled > this.head.scaledTime ? Math.remap(this.head.scaledTime, this.tail.scaledTime, this.headImport.lane, this.tailImport.lane, time.scaled) : getNoteXPosition(this.headImport.spawnLane * 0.75, this.headImport.lane, t1)
        const x2 = getNoteXPosition(this.tailImport.spawnLane * 0.75, this.tailImport.lane, t2)
        const y1 = getNoteYPosition(t1)
        const y2 = getNoteYPosition(t2)
        const s1 = getNoteSize(t1)
        const s2 = getNoteSize(t2)

        const size = {
            min: Math.remap(this.head.scaledTime, this.tail.scaledTime, this.headImport.size, this.tailImport.size, visibleTime.min) / 100,
            max: Math.remap(this.head.scaledTime, this.tail.scaledTime, this.headImport.size, this.tailImport.size, visibleTime.max) / 100,
        }

        const thickness = this.thickness
        const width = x1 - x2
        const height = (y1 - y2) / scaledScreen.wToH
        const length = Math.sqrt(width * width + height * height)

        const xS = {
            min: (thickness * size.min * s1 * height / length) / 2,
            max: (thickness * size.max * s2 * height / length) / 2
        }

        const yS = {
            min: ((thickness * size.min * s1 * width / length) / 2) * scaledScreen.wToH,
            max: ((thickness * size.max * s2 * width / length) / 2) * scaledScreen.wToH
        }

        const layout = {
            x1: (x1 - xS.min)/*  * (y.min + yS) */,
            x2: (x2 - xS.max)/*  * (y.max + yS) */,
            x3: (x2 + xS.max)/*  * (y.max - yS) */,
            x4: (x1 + xS.min)/*  * (y.min - yS) */,
            y1: (y1 + yS.min),
            y2: (y2 + yS.max),
            y3: (y2 - yS.max),
            y4: (y1 - yS.min),
        }

        skin.sprites.draw(this.sprite.connector, layout, this.connector.z, options.connectorAlpha)
    }

    get shouldScheduleSFX() {
        return false
    }
}
