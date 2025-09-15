import { note } from "../note.js";
import { isUsed } from "./InputManager.js";
import { archetypes } from "./index.js";

const flickDisallowEmptiesNow = levelMemory(Dictionary(16, Number, Number))
const flickDisallowEmptiesOld = levelMemory(Dictionary(16, Number, Number))
const lastdx = levelMemory(Dictionary(16, Number, Number))
const lastlane = levelMemory(Dictionary(16, Number, Number))
const lastdxOld = levelMemory(Dictionary(16, Number, Number))
const lastlaneOld = levelMemory(Dictionary(16, Number, Number))

export const flickTouches = levelMemory(Collection(16, Number))

const minFlickV = 0.2

export const calcV = (touch: Touch) => ((touch.dx * touch.dx + touch.dy * touch.dy) ** 0.5) / time.delta

export class FlickManager extends SpawnableArchetype({}) {
    // touch() {
    //     claimed.clear()
    // }

    updateSequentialOrder = -3
    updateSequential(): void {
        claimed.clear()
        //debug.log(7777)

        flickDisallowEmptiesOld.clear()
        flickDisallowEmptiesNow.copyTo(flickDisallowEmptiesOld)
        flickDisallowEmptiesNow.clear()

        lastdxOld.clear()
        lastlaneOld.clear()
        lastdx.copyTo(lastdxOld)
        lastlane.copyTo(lastlaneOld)
        lastdx.clear()
        lastlane.clear()

        for (const touch of touches) {
            const id = flickDisallowEmptiesOld.indexOf(touch.id)
            lastdx.set(touch.id, touch.dx)
            lastlane.set(touch.id, Math.round(touch.x / (screen.h * 0.275)))

            if (id === -1) continue

            const lastdxIndex = lastdxOld.indexOf(touch.id)
            const lastdxValue = lastdxIndex === -1 ? 0 : lastdxOld.getValue(lastdxIndex)
            const lastlaneValue = lastdxIndex === -1 ? 1000 : lastlaneOld.getValue(lastdxIndex)
            if (calcV(touch) < minFlickV || (((touch.dx > 0 && lastdxValue > 0) || (touch.dx < 0 && lastdxValue < 0)) && (Math.round(touch.x / (screen.h * 0.275)) === lastlaneValue))) {
                flickDisallowEmptiesNow.set(touch.id, 1)
            }
            //
            // flickDisallowEmptiesNow.set(touch.id, 1)
        }
    }
}
// class ClaimInfo {
//     public cx: number
//     public cy: number
//     public time: number
//     
//     function getDis(x: number, y: number) {
//         IF (rotate == PI / 2 || rotate == PI / 2 * 3) {
//             Return(Abs(x - cx));
//         } FI
//         let k = Tan(rotate), b = cy - k * cx;
//         let dis = Abs(-1 * k * x + y - b) / Power({k * k + 1, 0.5});
//         Return(dis);
//         return VAR;
//     }
//     function contain(x: number, y: number) {
//         FUNCBEGIN
//         Return(getDis(x, y) <= judgeDistanceLimit);
//         return VAR;
//     }
// };

function getInfo(index: number) {
    const noteImport = archetypes.FlickNote.import.get(index);
    const flickImport = archetypes.FlickNote.flickImport.get(index);
    const hitbox = archetypes.FlickNote.hitbox.get(index);
    return {
        hitbox,
        time: bpmChanges.at(noteImport.beat),
        direction: flickImport.direction
    };
}

function findBestTouchIndex(index: number) {
    const origin = getInfo(index);
    let res = -1
    for (const touch of touches) {
        // debug.log(touch.vr)
        // debug.log(touch.x / (screen.h * 0.275))
        if (calcV(touch) < minFlickV) continue
        const id = flickDisallowEmptiesNow.indexOf(touch.id);
        if (id != -1) continue
        if (!origin.hitbox.contains(touch.position)) continue
        if (!(origin.direction < 0 && touch.dx < 0) && !(origin.direction > 0 && touch.dx > 0)) continue

        // let dis = Math.min(
        //     origin.getDis(touch.x, touch.y),
        //     origin.getDis(touch.x - touch.dx, touch.y - touch.dy)
        // );
        // if (res != -1 && minDis <= dis) continue

        let claimIndex = claimed.indexOf(touch.id);
        if (claimIndex == -1) {
            res = touch.id
            continue
        }

        const claim = getInfo(claimed.getValue(claimIndex));
        if (origin.time > claim.time) continue
        if (origin.time < claim.time) {
            res = touch.id
            continue
        }

        // if (dis > Math.min(
        //     claim.getDis(touch.x, touch.y),
        //     claim.getDis(touch.x - touch.dx, touch.y - touch.dy)
        // )) continue
        if (index > claimed.getValue(claimIndex)) continue // nmd 如果 time 和 dis 完全相等的话会导致一直 claim，然后 Sonolus 死机
        // mlgb 老子在这里调了 6 个小时结果是 nm 这个问题
        res = touch.id;
    }
    return res;
}

function claim(index: number) {
    let currentId = index;
    // const info = getInfo(currentId);
    while (true) {
        let touchIndex = findBestTouchIndex(currentId);
        //        debug.log(touchIndex)
        if (touchIndex == -1) break
        flickDisallowEmptiesNow.set(touchIndex, 1);
        let claimIndex = claimed.indexOf(touchIndex);
        if (claimIndex == -1) {
            claimed.set(touchIndex, currentId);
            break
        }

        let tmp = currentId;
        currentId = claimed.getValue(claimIndex);
        claimed.set(touchIndex, tmp);
    }
}


function getClaimedTouchIndex(index: number) {
    for (let i = 0; i < claimed.count; i++) {
        if (claimed.getValue(i) == index) {
            const id = claimed.getKey(i)
            flickTouches.add(id)
            return id;
        }
    }
    return -1;
}

export const flickClaimStart = (index: number) => claim(index)
export const flickGetClaimedStart = (index: number) => getClaimedTouchIndex(index)

export const claimed = levelMemory(Dictionary(16, Number, Number))

// const claimed = levelMemory(Dictionary(16, TouchId, { pos: Vec, dx: Number, dy: Number , vr: Number , isUsed: Boolean, t: Number }))

// export const startClaim = (touch: Touch) => {
//     claimed.set(touch.id, { pos: touch.position, dx: touch.dx, dy: touch.dy, vr: touch.vr, isUsed: false, t: time.now })
// }

// export const claim = (touch: Touch) => {
//     claimed.set(touch.id, { pos: touch.position, dx: touch.dx, dy: touch.dy, vr: touch.vr, isUsed: true, t: time.now })
// }
// export const isClaimed = (touch: Touch) => {
//     debug.log(claimed.count)
//     debug.log(9999)
//     for (let i = 0; i < claimed.count; i++) {
//         debug.log(claimed.getKey(i))
//         debug.log(claimed.getValue(i))
//     }
//     debug.log(9999)
//     return claimed.has(touch.id)
// }
// export const isClaimed = (touch: Touch): boolean => {
// //    debug.log(touch.id)
//     
//     const id = claimed.indexOf(touch.id)
// // debug.log(id)
//     if (id === -1) return false
//     
//     const old = claimed.getValue(id)
//     // if (!old.isUsed) return false

//     const v = touch.position.sub(old.pos).length
// //    debug.log(v)
//     if (v < 0.2 * note.flick.movement) return true
//     // if ((v || 0) < minflickV) return true

//     if (touch.vr < minflickVr) return true
//     // 
//     if (old.isUsed && time.now - old.t < note.flick.distance) return true

//     // const { position: pos, dx, dy, vr } = touch
//     // claimed.set(touch.id, { pos, dx, dy, vr, isUsed: true })
// // debug.log(touch.vr)
//     return old.isUsed ? vectorAngle([touch.dx, touch.dy], [old.dx, old.dy]) / (Math.PI / 180) < note.flick.angle : false
// }

// export const isUsed = (touch: Touch) => usedTouchIds.has(touch.id)
// export const markAsUsed = (touch: Touch) => usedTouchIds.add(touch.id)
