import { SkinSpriteName } from "@sonolus/core";
import { decoratorSprites } from "../../../../shared/src/engine/data/decorator"

export const skin = defineSkin({
    sprites: {
        judgeline: SkinSpriteName.JudgmentLine,
        // slot: SkinSpriteName.NoteSlot,
        tapNote: SkinSpriteName.NoteHeadRed,
        flickRightNote: "Deresute Flick Right Note",
        flickLeftNote: "Deresute Flick Left Note",
        // flickArrow: SkinSpriteName.DirectionalMarkerBlue,
        holdNote: SkinSpriteName.NoteHeadYellow,
        slideNote: SkinSpriteName.NoteHeadPurple,
        slideTick: SkinSpriteName.NoteTickPurple,
        connector: SkinSpriteName.NoteConnectionNeutralSeamless,
        accidentNote: `Deresute Witch Accident Note`,
        simLine: SkinSpriteName.SimultaneousConnectionNeutral,

        ...decoratorSprites
    },
})

export const layer = {
    note: {
        sim: 102,
        arrow: 101,
        body: 100,
    },

    slide: {
        sim: 92,
        arrow: 91,
        body: 90,
    },

    decorator: 50,

    simline: 70,

    connector: 80,

    stage: 0,
}

export const getZ = (layer: number, time: number, lane: number) =>
    layer - time / 1000 - lane / 100000
