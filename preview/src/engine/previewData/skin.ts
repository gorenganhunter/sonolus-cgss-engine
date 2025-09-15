import { SkinSpriteName } from "@sonolus/core";
import { decoratorSprites } from "../../../../shared/src/engine/data/decorator"
import { panel } from "./panel";

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

        lane: SkinSpriteName.Lane,
        laneAlternative: SkinSpriteName.LaneAlternative,
        stageLeftBorder: SkinSpriteName.StageLeftBorder,
        stageRightBorder: SkinSpriteName.StageRightBorder,

        timescaleLine: SkinSpriteName.GridYellow,
        bpmLine: SkinSpriteName.GridPurple,

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

    decorator: 85,

    simline: 70,

    connector: 80,

    stage: 0,
}

export const line = (sprite: SkinSprite, beat: number, a: number) => {
    const pos = panel.getPos(bpmChanges.at(beat).time)

    sprite.draw(
        new Rect({
            l: -2.5,
            r: 2.5,
            b: -panel.h * 0.0025,
            t: panel.h * 0.0025,
        }).add(pos),
        layer.simline,
        a,
    )
}

export const getZ = (layer: number, time: number, lane: number) =>
    layer - time / 1000 - lane / 100000
