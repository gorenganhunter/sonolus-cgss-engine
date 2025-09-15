import { options } from '../../../configuration/options.js'
import { panel } from '../../panel.js'
import { getZ, layer, skin } from '../../skin.js'
import { archetypes } from '../index.js'

export class BaseConnector extends Archetype {
    thickness: number = 0.5

    import = this.defineImport({
        headRef: { name: 'prev', type: Number },
        tailRef: { name: 'next', type: Number },
    })

    render() {
        const t = {
            min: bpmChanges.at(this.headImport.beat).time,
            max: bpmChanges.at(this.tailImport.beat).time,
        }

        const index = {
            min: Math.floor(t.min / panel.h),
            max: Math.floor(t.max / panel.h),
        }

        const lane = {
            min: this.headImport.lane,
            max: this.tailImport.lane,
        }

        const z = getZ(layer.connector, t.min, this.headImport.lane)

        for (let i = index.min; i <= index.max; i++) {
            const x = i * panel.w

            const pt = {
                min: Math.max(t.min, i * panel.h),
                max: Math.min(t.max, (i + 1) * panel.h),
            }

            const pl = {
                min: Math.lerp(lane.min, lane.max, Math.unlerp(t.min, t.max, pt.min)),
                max: Math.lerp(lane.min, lane.max, Math.unlerp(t.min, t.max, pt.max)),
            }

            const ps = {
                min: Math.lerp(this.headImport.size, this.tailImport.size, Math.unlerp(t.min, t.max, pt.min)) / 100,
                max: Math.lerp(this.headImport.size, this.tailImport.size, Math.unlerp(t.min, t.max, pt.max)) / 100,
            }

            const pos = {
                min: new Vec(x, pt.min - i * panel.h),
                max: new Vec(x, pt.max - i * panel.h),
            }

            const layout = new Quad({
                p1: pos.min.translate(pl.min - this.thickness * ps.min /* 0.7 * options.noteSize*/, 0),
                p2: pos.max.translate(pl.max - this.thickness * ps.max /* 0.7 * options.noteSize*/, 0),
                p3: pos.max.translate(pl.max + this.thickness * ps.max /* 0.7 * options.noteSize*/, 0),
                p4: pos.min.translate(pl.min + this.thickness * ps.min /* 0.7 * options.noteSize*/, 0),
            })

            skin.sprites.connector.draw(layout, z, options.connectorAlpha)
        }
    }

    get headImport() {
        return archetypes.HoldStartNote.import.get(this.import.headRef)
    }

    get tailImport() {
        return archetypes.HoldEndNote.import.get(this.import.tailRef)
    }
}
