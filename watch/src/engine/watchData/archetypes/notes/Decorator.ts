import { EngineArchetypeDataName } from "@sonolus/core"
import { note } from "../../note"
import { options } from "../../../configuration/options"
import { getZ, layer, skin } from "../../skin"
import { scaledScreen } from "../../scaledScreen"
import { getSpriteId } from "../../../../../../shared/src/engine/data/decorator"

export class Decorator extends Archetype {
    hasInput: boolean = false

    import = this.defineImport({
        beat: { name: EngineArchetypeDataName.Beat, type: Number },
        lane: { name: 'lane', type: Number },
        spawnLane: { name: 'spawnLane', type: Number },
        visible: { name: "visible", type: Number },
        size: { name: "size", type: Number },
        color: { name: "color", type: Number },
        prevRef: { name: "prev", type: Number },
        nextRef: { name: "next", type: Number },
    })

    targetTime = this.entityMemory(Number)

    visualTime = this.entityMemory(Range)

    note = this.entityMemory({
        layout: Rect,
        z: Number,
    })

    x = this.entityMemory(Number)
    y = this.entityMemory(Number)
    s = this.entityMemory(Number)

    // sprite = this.defineSharedMemory(SkinSpriteId)

    preprocess() {
        // this.targetTime = bpmChanges.at(this.import.beat).time
        //
        // this.visualTime.copyFrom(Range.l.mul(note.duration).add(timeScaleChanges.at(this.targetTime).scaledTime))
        //
        this.import.size = this.import.size || 100

        if (options.mirror) {
            this.import.lane *= -1
            this.import.spawnLane *= -1
        }

        // this.sprite = getSpriteId(skin.sprites, this.import.color, true)
    }

    spawnTime() {
        return this.visualTime.min
    }

    despawnTime() {
        return this.visualTime.max + note.duration * (this.import.visible >= 0 ? 1 : -1 - this.import.visible / 100)
    }

    initialize() {
        this.note.z = getZ(layer.decorator, this.targetTime, this.import.lane)
    }

    // touchOrder = 1

    updateParallel() {
        // if (this.import.visible > 0) {
        //     if (time.scaled < this.visualTime.min + this.import.visible / 100 * note.duration) return
        // }

        // this.x = Math.remapClamped(this.visualTime.min, this.visualTime.max, this.import.spawnLane * 0.75, this.import.lane, time.scaled)
        // this.s = Math.unlerpClamped(this.visualTime.min, this.visualTime.max, time.scaled)
        // this.y = easeInBack(Math.unlerp(this.visualTime.min, this.visualTime.max, time.scaled))
        //
        // this.s *= this.import.size / 100

        // if (!this.import.prevRef) this.drawBottom()
        // if (!this.import.nextRef) this.drawTop()
    }

    // drawBottom() {
    //     const w = 0.25 * this.s
    //     const h = w * scaledScreen.wToH
    //
    //     skin.sprites.draw(this.sprite, new Quad({
    //         x1: this.x + w,
    //         x2: this.x + w,
    //         x3: this.x - w,
    //         x4: this.x - w,
    //         y1: this.y,
    //         y2: this.y + h,
    //         y3: this.y + h,
    //         y4: this.y,
    //     }), this.note.z, 1)
    // }
    //
    // drawTop() {
    //     const w = 0.25 * this.s
    //     const h = w * scaledScreen.wToH
    //
    //     const thickness = 0.5
    //     const width = -2 * w
    //     const height = w
    //     const length = Math.sqrt(width * width + height * height)
    //
    //     // xS.min = i > 0 ? xS.max : (thickness * this.s * height / length) / 2
    //     const xS = (thickness * this.s * height / length) / 2
    //
    //     // yS.min = i > 0 ? yS.max : ((thickness * this.s * width / length) / 2) * scaledScreen.wToH
    //     const yS = ((thickness * this.s * width / length) / 2) * scaledScreen.wToH
    //
    //     skin.sprites.draw(this.sprite, new Quad({
    //         x1: this.x - w - xS,
    //         x2: this.x - w - xS,
    //         x3: this.x + w + xS,
    //         x4: this.x + w + xS,
    //         y1: this.y + yS,
    //         y2: this.y - h + yS,
    //         y3: this.y - h - yS,
    //         y4: this.y - yS,
    //     }), this.note.z, 1)
    // }
}
