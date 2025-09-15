// import { approach, perspectiveLayout } from "../../../../../shared/src/engine/data/utils.js"
import { note } from "../note.js"
import { getZ, layer, skin } from "../skin.js"
import { archetypes } from "./index.js"
import { options } from '../../configuration/options.js'
import { getNoteSize, getNoteTransformedTime, getNoteXPosition, getNoteYPosition } from "../../../../../shared/src/engine/data/utils.js"
// import { scaledTimeToEarliestTime, timeToScaledTime } from "../utils.js"

export class SimLine extends Archetype {
    import = this.defineImport({
        aRef: { name: "a", type: Number },
        bRef: { name: "b", type: Number }
    })

    targetTime = this.entityMemory(Number)

    left = this.entityMemory({
        min: Number,
        max: Number,
        lane: Number,
        spawnLane: Number,
        visible: Number
    })

    right = this.entityMemory({
        min: Number,
        max: Number,
        lane: Number,
        spawnLane: Number,
        visible: Number
    })

    spriteLayout = this.entityMemory([Quad])
    z = this.entityMemory(Number)

    preprocess() {
        // if (!options.simLine) return

        this.targetTime = bpmChanges.at(this.aImport.beat).time

        if (this.aImport.lane < this.bImport.lane) {
            this.left.lane = this.aImport.lane
            this.left.spawnLane = this.aImport.spawnLane * 0.75
            this.left.visible = this.aImport.visible
            // this.left.timescaleGroup = this.aImport.timescaleGroup
            this.right.lane = this.bImport.lane
            this.right.spawnLane = this.bImport.spawnLane * 0.75
            this.right.visible = this.bImport.visible
            // this.right.timescaleGroup = this.bImport.timescaleGroup
        } else {
            this.left.lane = this.bImport.lane
            this.left.spawnLane = this.bImport.spawnLane * 0.75
            this.left.visible = this.bImport.visible
            // this.left.timescaleGroup = this.bImport.timescaleGroup
            this.right.lane = this.aImport.lane
            this.right.spawnLane = this.aImport.spawnLane * 0.75
            this.right.visible = this.aImport.visible
            // this.right.timescaleGroup = this.aImport.timescaleGroup
        }

        this.left.max = timeScaleChanges.at(this.targetTime).scaledTime
        this.right.max = timeScaleChanges.at(this.targetTime).scaledTime
        this.left.min = this.left.max - note.duration
        this.right.min = this.right.max - note.duration
    }

    spawnTime() {
        return Math.max(
            this.left.min + note.duration * (this.left.visible >= 0 ? this.left.visible / 100 : 0),
            this.right.min + note.duration * (this.right.visible >= 0 ? this.right.visible / 100 : 0)
        )
    }

    despawnTime(): number {
        return Math.min(
            this.left.max - note.duration * (this.left.visible < 0 ? 1 - this.left.visible / -100 : 0),
            this.right.max - note.duration * (this.right.visible < 0 ? 1 - this.right.visible / -100 : 0)
        )
    }

    get aImport() {
        return archetypes.TapNote.import.get(this.import.aRef)
    }

    get aInfo() {
        return entityInfos.get(this.import.aRef)
    }

    get bImport() {
        return archetypes.TapNote.import.get(this.import.bRef)
    }

    get bInfo() {
        return entityInfos.get(this.import.bRef)
    }

    updateParallel(): void {
        if (time.scaled < this.left.min + note.duration * (this.left.visible >= 0 ? this.left.visible / 100 : 0)) return
        if (time.scaled < this.right.min + note.duration * (this.right.visible >= 0 ? this.right.visible / 100 : 0)) return

        this.renderConnector()
    }

    renderConnector() {
        const t = getNoteTransformedTime(this.left.min, this.left.max, time.scaled)

        let l = getNoteXPosition(this.left.spawnLane, this.left.lane, t)
        let r = getNoteXPosition(this.right.spawnLane, this.right.lane, t)

        const s = getNoteSize(t)

        const y = getNoteYPosition(t)

        // l = l * 2.1
        // r = r * 2.1

        // const minY = approach(0, 1, 1 - options.laneLength)

        // if (y.l < minY) {
        //     l = Math.remap(y.l, y.r, l, r, minY)
        //     y.l = minY
        // } else if (y.r < minY) {
        //     r = Math.remap(y.l, y.r, l, r, minY)
        //     y.r = minY
        // }

        // debug.log(y.l)
        // debug.log(y.r)

        const layout = new Rect({ l, r, b: y + 0.02 * s, t: y - 0.02 * s })

        // const layout = new Quad({
        //     x1: l,
        //     x2: l,
        //     x3: r,
        //     x4: r,
        //     y1: y.l - 0.02 * s.l,
        //     y2: y.l + 0.02 * s.l,
        //     y3: y.r + 0.02 * s.r,
        //     y4: y.r - 0.02 * s.r
        // })

        skin.sprites.simLine.draw(layout, getZ(layer.simline, this.targetTime, this.left.lane), 1)
    }
}
